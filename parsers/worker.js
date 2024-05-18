import fs from 'fs';
import path from 'path';

async function getParser(extension) {
    let parser = await import(`./${extension}.js`);
    return parser.default;
}
const parsers = {
    // Add your parsers here, e.g.:
    'txt': getParser("txt"),
    'pdf': getParser("pdf"),
    'docx': getParser("docx"),
    'js': getParser("js"),
    'udf': getParser("udf"),
    // ...
};

export default async function parseFile(workerData) {
    const { file, extension } = workerData;

    if (!parsers[extension]) {
        return { error: `No parser available for extension: ${extension}` };
    }

    try {
        const content = await parsers[extension](file);
        return { content };
    } catch (error) {
        return { error: `Error parsing file: ${error.message}` };
    }
}