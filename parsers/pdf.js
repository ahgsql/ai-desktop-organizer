import fs from "fs";
import { PDFExtract } from "pdf.js-extract";

export default async function parse(filePath) {
    return new Promise((resolve, reject) => {
        const pdfExtract = new PDFExtract();
        const options = {}; /* see below */
        pdfExtract.extract(filePath, options, (err, data) => {
            if (err) return console.log(err);
            try {
                var allText = "";
                for (var i = 0; i < data.pages.length; i++) {
                    var lines = PDFExtract.utils.pageToLines(data.pages[i], i + 1);
                    var rows = PDFExtract.utils.extractTextRows(lines);
                    var text = rows
                        .map(function (row) {
                            return row.join("");
                        })
                        .join("\n");
                    allText += text;
                }
                resolve(allText)
            } catch (error) {

            }


        });
    });
}

