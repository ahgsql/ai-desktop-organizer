import ollamaChat from "./utils/ollama.js";
const message = { role: 'user', content: 'Why is the sky blue?' }
const response = await ollamaChat([message], 'dolphin-mistral')
console.log(response.content);
