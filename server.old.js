import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import ExpressBridge from './ExpressBridge.js';
import { log } from 'node:console';
import { parseFiles } from './worker.mjs';
import http from 'http';
import { Server } from 'socket.io';
import selectFolderDialog from './utils/folderSelect.js';
const app = express();
const PORT = process.env.PORT || 3000;


const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    maxHttpBufferSize: 1e8,
});

const state = {
    files: [],
    folders: [],
    targetPath: "",
}
const bridge = new ExpressBridge(io);

bridge.registerHandler('get-files-and-folders', async (args) => {
    const { folder, includeFolders } = args;
    console.log(args);
    try {
        const files = await readFilesAndFolders(folder, includeFolders);
        return { parsedFiles: files };
    } catch (error) {
        throw new Error(`Failed to read files and folders: ${error.toString()}`);
    }
});

const readFilesAndFolders = (folderPath, includeFolders) => {
    return new Promise((resolve, reject) => {
        console.log(folderPath);
        resolve(["ege"])
    });
};
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

