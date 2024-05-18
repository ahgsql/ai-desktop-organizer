import Juncture from 'juncture-server';

import selectFolderDialog from './utils/folderSelect.js';
import { categorizeFiles, moveFiles, parseFiles } from './worker.mjs';
import fs from 'fs';
import path from 'path';
import perf from "execution-time";
import fileUtils from "./utils/fileUtils.js";
let performancer = perf()
let defaultState = {
    files: [],
    folders: [],
    targetPath: "",
    currentStructure: {}
}
const app = new Juncture(3000, defaultState);
const bridge = app.bridge;


bridge.registerHandler("get-state", async (args) => {
    return app.state
})
bridge.registerHandler("reset-state", async (args) => {
    app.setState(defaultState);
    return true;
});
// app.use(express.static(path.join(__dirname, 'client/dist')));
bridge.registerHandler("open-folder-dialog", async (data) => {
    let folder = await selectFolderDialog()
    app.setState({ targetPath: folder })
    return folder;
})
bridge.registerHandler("open-file", async (data) => {
    //TODO: dosya adında boşluk varsa açılmıyor.
    fileUtils.openFile(data.filename)
    return true;
})
bridge.registerHandler("get-files-and-folders", async (data) => {
    performancer.start();
    app.setState({ targetPath: data.folder })
    let parsedFiles = await parseFiles(data.folder, data.includeFolders);
    const results = performancer.stop();
    console.log(results.time);
    app.setState({ files: parsedFiles.parsedFiles, folders: parsedFiles.folderNames });
    return parsedFiles
})

bridge.registerHandler("categorize-files", async (data) => {
    let categorizedFiles = await categorizeFiles(app.state.targetPath, app.state.files, bridge);
    app.setState({ currentStructure: categorizedFiles });
    return categorizedFiles
})
bridge.registerHandler("drag-drop-files", async (data) => {
    app.setState({ currentStructure: data });
    return true
})
bridge.registerHandler("move-files", async (data) => {
    let { folders } = data;
    await moveFiles(app.state.targetPath, folders);
    return true;
})
// Örnek Handler
bridge.registerHandler('get-message', async (args) => {
    // İşlem mantığınızı buraya yazın
    return "HELLO";
});


app.start();


