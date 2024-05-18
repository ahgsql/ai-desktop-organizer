# File Organizer Application

This project is a desktop file organizer application that helps users manage and organize their files and folders using AI. The project is built with a backend server using Node.js and a frontend application using React.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Open Folder Dialog:** Allows users to select a folder from their file system.
- **Display Files and Folders:** Lists the files and folders within the selected directory.
- **AI Categorization:** Uses AI to categorize files into different folders.
- **Drag and Drop:** Allows users to manually organize files using a drag-and-drop interface.
- **File Operations:** Supports opening and moving files to organized folders.
- **State Management:** Maintains the state of the file organization process.

## Installation

To run this project locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/ahgsql/ai-desktop-organizer.git
   cd file-organizer
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Start the Server:**

   ```bash
   npm start
   ```

4. **Start the Frontend:**
   ```bash
   cd client
   npm run dev
   ```

## Usage

1. **Open the Application:**
   Navigate to `http://localhost:3000` in your web browser.

2. **Select a Folder:**
   Click the folder icon to open the folder dialog and select a directory to organize.

3. **View Files and Folders:**
   The application will display the files and folders in the selected directory.

4. **Organize with AI:**
   Click the "AI ile Organize Et" button to let the AI categorize your files.

5. **Drag and Drop:**
   Manually organize files by dragging and dropping them into different folders.

6. **Apply Changes:**
   Click the "Taşımayı Uygula" button to move the files to their new locations.

## File Structure

```plaintext
.
├── server.js               # Main server file
├── worker.mjs              # Worker file for background tasks
├── utils                   # Utility functions
│   ├── folderSelect.js     # Folder selection utility
│   ├── fileUtils.js        # File utility functions
├── client                  # Frontend application
│   ├── src
│   │   ├── App.js          # Main React component
│   │   ├── AiOrganize.js   # AI organize component
│   │   ├── ReactBridge.js  # Bridge for communicating with the server
│   │   ├── components      # React components
│   │   │   ├── FileView.js # Component for displaying files
│   │   └── index.js        # React entry point
└── package.json            # Project metadata and dependencies
```

## API Endpoints

### Server Handlers

- **get-state:** Retrieves the current state of the application.
- **reset-state:** Resets the application state to the default.
- **open-folder-dialog:** Opens the folder selection dialog.
- **open-file:** Opens a specified file.
- **get-files-and-folders:** Gets the files and folders from the specified directory.
- **categorize-files:** Categorizes files using AI.
- **drag-drop-files:** Updates the state after drag-and-drop operations.
- **move-files:** Moves files to their new locations based on the organization structure.

### Client Functions

- **openDialog:** Opens the folder selection dialog.
- **getState:** Fetches the current state from the server.
- **handleGetFilesAndFolder:** Retrieves files and folders from the selected directory.
- **handleCategorize:** Starts the AI categorization process.
- **handleMoveFiles:** Moves files to their new locations.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. **Fork the repository.**
2. **Create a new branch:**
   ```bash
   git checkout -b feature-branch
   ```
3. **Make your changes and commit them:**
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch:**
   ```bash
   git push origin feature-branch
   ```
5. **Submit a pull request.**

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

This project aims to simplify the process of organizing files using a combination of user interaction and AI. We hope you find it useful!
