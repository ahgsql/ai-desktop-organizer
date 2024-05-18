import ollama from 'ollama';
import dotenv from 'dotenv';
dotenv.config();

/**
 * This function uses the Ollama API to interact with the Llama2 model and generate a response based on the input messages.
 *
 * @param {Array<Object>} msgArr - An array containing the system and user messages.
 * @param {string} [model="flash"] - The model to use for generating the response. Defaults to "llama2".
 * @returns {Object} - An object containing the generated response content, usage information, and pricing details.
 * @throws {Error} - If an error occurs during the API request.
 */
export default async function ollamaChat(msgArr, model = "llama2") {
    const systemMessage = msgArr.find((msg) => msg.role === "system")?.content || "";
    const userMessages = msgArr.filter((msg) => msg.role !== "system");

    try {
        const response = await ollama.chat({
            model: model,
            messages: [{ role: "system", content: systemMessage }, ...userMessages,],
        });
        // The Ollama API does not provide usage information directly, so we'll just return the response content
        return {
            content: response.message.content,
        };
    } catch (error) {
        console.error(error.message);
        return {
            content: "",
            usage: null,
        };
    }
}
