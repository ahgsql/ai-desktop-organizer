import * as fs from "fs";

import JSZip from "jszip";

function get_substring(
    full_string,
    substring_1,
    substring_2,
    inclusive = false,
    trim = true
) {
    if (full_string === null) {
        return null;
    }
    let substring_1_start = full_string.indexOf(substring_1);
    if (substring_1_start === -1) {
        return null;
    }
    let substring_2_start = full_string.indexOf(substring_2, substring_1_start);
    if (substring_2_start === -1) {
        return null;
    }
    let substring_1_end = substring_1_start + substring_1.length;
    let substring_2_end = substring_2_start + substring_2.length;
    let return_string = inclusive
        ? full_string.substring(substring_1_start, substring_2_end)
        : full_string.substring(substring_1_end, substring_2_start);
    return trim ? return_string.trim() : return_string;
}
export default async function parse(filePath) {
    return new Promise(async (resolve, reject) => {
        const data = await fs.promises.readFile(filePath);
        const zip = await JSZip.loadAsync(data);
        const xmlData = await zip.file("content.xml").async("string");
        let fileContents = get_substring(xmlData, "<![CDATA[", "]]>");
        fileContents = fileContents.replaceAll(/\n\n/g, "\n");
        fileContents = fileContents.replaceAll(/\t/g, " ");
        fileContents = fileContents.replaceAll(/ /g, " ");
        fileContents = fileContents.replaceAll(/ /g, " ");
        fileContents = fileContents.replaceAll(/'/g, "'");
        resolve(fileContents);

    });
};

