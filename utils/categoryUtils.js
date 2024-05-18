import fs from "fs";
import path from "path";
import anthropicChat, { categorizePrompt, categorizePromptEn } from "./anthropic.js";
import ollamaChat from "./ollama.js";
import geminiChat from "../geminitest.js";
/**
 * Reads and parses the JSON file containing categories.
 *
 * @param {string} filePath - The path to the JSON file containing categories.
 * @returns {Object} - The parsed JSON object containing categories.
 */
function getCategories(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Asynchronously categorizes the given files based on the specified category type and content.
 *
 * @param {Array} files - An array of objects, where each object has 'file' and 'content' properties.
 * @param {string} categoryType - The name of the category type to use for categorization.
 * @param {Array} currentFolders - An array of current folders for context.
 * @returns {Object} - An object containing the categorized files, where the keys are categories and the values are arrays of file names.
 */
async function categorizeFiles(files, categoryType, currentFolders, bridge) {
    const categories = getCategories('data/categories.json');
    let selectedCategorizer = categories.filter(category => category.name === categoryType)[0];

    const categorizedFiles = {};
    let totalFiles = files.length;
    let current = 0;
    for (const { file, content } of files) {
        current++;
        bridge.broadcast("ai-progress", {
            current,
            total: totalFiles,

        });
        let fileName = file.replace(/^.*[\\\/]/, '')
        const category = await getCategory(fileName, content, selectedCategorizer.promptForAI, currentFolders);
        if (category == "Skip")
            continue;
        if (!categorizedFiles[category]) {
            categorizedFiles[category] = [];
        }
        categorizedFiles[category].push(file);
    }
    bridge.broadcast("ai-progress-done");
    return categorizedFiles;
}

/**
 * Asynchronously categorizes the given files based on the specified category type and content.
 *
 * @param {string} content - The content of the file to categorize.
 * @param {string} prompt - The prompt to use for categorization.
 * @param {Array} currentFolders - An array of current folders for context.
 * @returns {Promise<string>} - A Promise that resolves to the categorized file.
 */
async function getCategory(fileName, content, prompt, currentFolders) {
    content = content.substring(0, 1000);
    let categorizeMsg = categorizePrompt(
        fileName,
        content,
        currentFolders,
        prompt
    );
    let category = await geminiChat(categorizeMsg);
    let folderName = category.content;

    if (folderName.trim() === "") {
        return "Skip";
    }

    return folderName.replace(/\r?\n|\r/g, "").trim();
    // Additional code for other categorization types can be added here
}

export default { getCategories, categorizeFiles };