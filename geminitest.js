import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

/**
 * A function to generate a chat response using Google's Gemini AI.
 *
 * @param {Array} msgArr - An array of messages, where each message is an object with 'role' and 'content' properties.
 * @param {string} [model="flash"] - The model to use for generating the response. Default is "flash".
 * @returns {Promise<Object>} - A promise that resolves to an object containing the generated content, usage statistics, and cost.
 * @throws Will throw an error if the API request fails.
 */
export default async function geminiChat(msgArr, model = "flash") {
    // Initialize the Google Generative AI client with the API key
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

    // Define the latest available models
    const latestModels = [
        "gemini-1.5-flash-latest",
        "gemini-1.5-pro-preview-0514",
        "gemini-1.0-pro-001",
        "gemini-1.0-pro-vision-001",
        "gemini-1.0-pro",
        "gemini-1.0-pro-002",
    ];

    // Define the pricing for each model
    const modelPricing = [
        {
            model: "gemini-1.5-flash-latest",
            mTokInput: 10,
            mTokOutput: 50,
        },
        {
            model: "gemini-1.5-pro-preview-0514",
            mTokInput: 20,
            mTokOutput: 100,
        },
        //... more model pricing
    ];

    // Select the model based on the provided parameter or default to "gemini-1.5-flash-latest"
    const selectedModel =
        latestModels.find((m) => m.includes(model)) || "gemini-1.5-flash-latest";

    // Extract the system message and user messages from the input array
    const systemMessage =
        msgArr.find((msg) => msg.role === "system")?.content || "";
    const userMessages = msgArr.filter((msg) => msg.role !== "system");

    // Find the pricing for the selected model
    let selectedPricing = modelPricing.find((m) => m.model === selectedModel);

    try {
        // Get the generative model instance
        const modelInstance = genAI.getGenerativeModel({ model: selectedModel });

        // Construct the prompt by combining the system message and user messages
        const prompt = systemMessage + "\n" + userMessages.map(msg => msg.content).join("\n");

        // Generate the response using the model and prompt
        const result = await modelInstance.generateContent(prompt);
        const response = await result.response;

        // Extract the generated text from the response
        const text = await response.text();

        // Extract the usage metadata from the result
        const usageMetadata = response.usageMetadata;
        const inputTokens = usageMetadata.promptTokenCount;
        const outputTokens = usageMetadata.candidatesTokenCount;

        // Calculate the cost in cents for input and output tokens
        const costInCents = {
            input: inputTokens * selectedPricing.mTokInput / 1000000,
            output: outputTokens * selectedPricing.mTokOutput / 1000000,
            total: parseFloat(
                ((inputTokens * selectedPricing.mTokInput / 1000000) +
                    (outputTokens * selectedPricing.mTokOutput / 1000000)).toFixed(6)
            ),
        };

        // Return the generated content, usage statistics, and cost
        return {
            content: text,
            usage: {
                input_tokens: inputTokens,
                output_tokens: outputTokens,
                total_tokens: inputTokens + outputTokens,
            },
            usageInCents: costInCents,
        };
    } catch (error) {
        // Log the error and return an empty content and null usage
        console.error(error.message);
        return {
            content: "",
            usage: null,
        };
    }
}