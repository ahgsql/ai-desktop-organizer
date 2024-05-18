import fs from "fs";
import path from "path";
import { exec } from "child_process";

function getFilesInFolder(folderPath) {
    return fs
        .readdirSync(folderPath)
        .filter((file) => fs.lstatSync(path.join(folderPath, file)).isFile())
        .map((file) => path.join(folderPath, file));
}
async function moveFiles(fileCategories, targetFolder) {
    for (const category in fileCategories) {
        const categoryPath = path.join(targetFolder, category);
        if (!fs.existsSync(categoryPath) && fileCategories[category].length > 0) {
            fs.mkdirSync(categoryPath);
        }

        for (const file of fileCategories[category]) {
            const newPath = path.join(categoryPath, path.basename(file));
            fs.renameSync(file, newPath);
        }
    }
}
function getCommandLine() {
    switch (process.platform) {
        case 'darwin': return 'open';
        case 'win32': return 'start';
        case 'win64': return 'start';
        default: return 'xdg-open';
    }
}

function openFile(filePath) {
    const rootName = path.parse(filePath).root; // "C:/"

    const filePathTo = `${rootName}"${filePath.replace(rootName, '')}"`;
    exec(`${getCommandLine()} ${filePathTo}`);

}

export default { getFilesInFolder, moveFiles, openFile };