import fs from "fs";
import mammoth from "mammoth";

export default async function parse(filePath) {
    return new Promise((resolve, reject) => {
        mammoth
            .extractRawText({ path: filePath })
            .then((result) => resolve(result.value))
            .catch((err) => reject(err));
    });
}

