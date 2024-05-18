import fs from "fs";
import path from "path";
import inquirer from "inquirer";
import fileUtils from "./utils/fileUtils.js";
import categoryUtils from "./utils/categoryUtils.js";
import chalk from "chalk";
import Table from "cli-table3";

/**
 * This function retrieves the parser for a given file extension.
 *
 * @param {string} extension - The target file extension for which the parser is needed.
 *
 * @returns {Promise<Object>} - A Promise that resolves to the parser for the given file extension.
 */
async function getParser(extension) {
    let parser = await import(`./parsers/${extension}.js`);
    return parser.default;
}

/**
 * This function parses the files in the targetFolder and returns an array of parsed files.
 *
 * @param {string} [targetFolder=''] - The target folder where the files to be parsed are located. Defaults to an empty string.
 * @returns {Promise<Array<{file: string, content: any}>>>} - An array of parsed files, where each element is an object containing the parsed file's path and content.
 */
async function parseFiles(targetFolder = "", includeFolders = false) {
    const files = fileUtils.getFilesInFolder(targetFolder);
    const folderNames = fs.readdirSync(targetFolder).filter(item => fs.lstatSync(path.join(targetFolder, item)).isDirectory());

    const parsedFiles = await Promise.allSettled(
        files.map(async (file, index) => {
            const extension = path.extname(file).slice(1);
            const parse = await getParser(extension);
            await new Promise((resolve) => setTimeout(resolve, index * 100)); // 1 second delay per file

            const content = await parse(file);
            return { file, content };
        })
    ).then(results =>
        results
            .filter(result => result.status === 'fulfilled') // Sadece başarılı olanları dahil et
            .map(result => result.value) // Sadece değerlerini al
    );

    if (includeFolders) {
        return { parsedFiles, folderNames };
    }
    return { parsedFiles, folderNames: [] };
}

/**
 * This function categorizes the parsed files into their respective categories based on the folder names in the targetFolder.
 *
 * @param {string} targetFolder - The target folder where the categorized files will be moved.
 * @param {object} files - An object containing the parsed files.
 *
 * @returns {object} - An object containing the categorized files.
 */
async function categorizeFiles(targetFolder, files, bridge) {
    const folderNames = fs.readdirSync(targetFolder).filter(item => fs.lstatSync(path.join(targetFolder, item)).isDirectory);

    const fileCategories = await categoryUtils.categorizeFiles(files, "generalUsage", folderNames, bridge);
    return fileCategories;
}
/**
 * This function moves the parsed and categorized files to their respective categories in the targetFolder.
 *
 * @param {string} targetFolder - The target folder where the categorized files will be moved.
 * @param {object} fileCategories - An object containing the categorized files.
 *
 * @returns {void} - This function does not return any value. It only prints the categories and files to be moved.
 */
async function moveFiles(targetFolder, fileCategories) {
    const table = new Table({
        head: ['Kategori', 'Dosyalar']
    });

    for (const category in fileCategories) {
        const files = fileCategories[category].map(file => path.basename(file));
        table.push([chalk.bold(category), files.join('\n')]);
    }

    console.log(table.toString());
    await fileUtils.moveFiles(fileCategories, targetFolder);
}

export { parseFiles, categorizeFiles, moveFiles };
