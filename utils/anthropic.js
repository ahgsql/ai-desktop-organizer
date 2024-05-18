import Anthropic from "@anthropic-ai/sdk";
import dotenv from "dotenv";
dotenv.config();


/**
 * This function uses the Anthropic API to interact with the Claude-3 model and generate a response based on the input messages.
 *
 * @param {Array<Object>} msgArr - An array containing the system and user messages.
 * @param {string} [model="haiku"] - The model to use for generating the response. Defaults to "haiku".
 * @returns {Object} - An object containing the generated response content, usage information, and pricing details.
 * @throws {Error} - If an error occurs during the API request.
 */
export default async function anthropicChat(msgArr, model = "haiku") {
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const latestModels = [
        "claude-3-opus-20240229",
        "claude-3-sonnet-20240229",
        "claude-3-haiku-20240307",
    ];

    const modelPricing = [
        {
            model: "claude-3-opus-20240229",
            mTokInput: 15,
            mTokOutput: 75,
        },
        {
            model: "claude-3-sonnet-20240229",
            mTokInput: 3,
            mTokOutput: 15,
        },
        {
            model: "claude-3-haiku-20240307",
            mTokInput: 0.25,
            mTokOutput: 1.25,
        },
    ];

    const selectedModel =
        latestModels.find((m) => m.includes(model)) || "claude-3-haiku-20240307";

    const systemMessage =
        msgArr.find((msg) => msg.role === "system")?.content || "";
    const userMessages = msgArr.filter((msg) => msg.role !== "system");

    let selectedPricing = modelPricing.find((m) => m.model === selectedModel);

    try {
        const response = await anthropic.messages.create({
            system: systemMessage,
            max_tokens: 4096,
            messages: [...userMessages],
            model: selectedModel,
            stop_sequences: ["end_turn"],
        });

        return {
            content: response.content[0].text,
            usage: response.usage,
            usageInCents: {
                input: response.usage.input_tokens * selectedPricing.mTokInput / 1000000,
                output: response.usage.output_tokens * selectedPricing.mTokOutput / 1000000,
                total: parseFloat(
                    ((response.usage.input_tokens * selectedPricing.mTokInput / 1000000) +
                        (response.usage.output_tokens * selectedPricing.mTokOutput / 1000000)).toFixed(6)
                ),
            },
        };
    } catch (error) {
        console.error(error.message);
        return {
            content: "",
            usage: null,
        };
    }
}
/**
 * Categorizes the given content based on the provided currentFolders and type.
 *
 * @param {string} content - The content to be categorized.
 * @param {Array<string>} currentFolders - The current folders in the target directory.
 * @param {string} type - The type of categorization criteria.
 * @returns {Array<Object>} - An array containing the system and user messages.
 */
export function categorizePrompt(fileName, content, currentFolders, type) {
    const sistemMesaji = {
        role: "system",
        content: "Sen dosyaları organize etmek için içeriğe bakarak en ilgili kategoriyi (Klasör Adını) dönebilecek bir dosya ve klasör organizatörüsün.",
    };

    const kullaniciMesaji = {
        role: "user",
        content: `Masaüstündeki veya klasördeki dosyaları organize etmek için yeni klasör isimleri oluşturmamız gerekiyor.

        Aşağıda sana detaylı olarak amaç kısmını belirteceğim. Bu amaca göre, ve aldığın contente göre, bana 2-3 kelimeyi geçmeyen klasör adları dön.
Açıklama yada girizgah, bitiriş cümleleri koyma. Cevabın sadece kategoriyi (Klasör Adını) döndürmesi gerekiyor.

Örnek Cevaplar: "Ali Haydar GÜLEÇ", "Ortaklığın Giderilmesi" , "Resimler" , "Plan ve Projeler", "Kod Örnekleri" . 
Bunlar sadece örnek ve virgülle ayırdıklarım gibi tek cevap olacak. cevapların bunlar gibi, 2-3 kelimeyi geçmesin.
Hali hazırda, hedef klasörde bulunan diğer klasörler şunlar: ${JSON.stringify(currentFolders)} İçerik bunlarla ilgiliyse bunlardan birini dönebilirsin.
Analiz etmen gereken İçerik: ${content}
Bu analizi yaparken kriterler: ${type}.
Bu dosyanın gerçek adı:  ${fileName}. Buna ekstra özen göster.
Asla detay ve açıklama verme. sadece 1 tane muhtemel klasör ismi dön.`,
    };
    console.log([sistemMesaji, kullaniciMesaji]);
    return [sistemMesaji, kullaniciMesaji];
}
export function categorizePromptEn(fileName, content, currentFolders, type) {
    const sistemMesaji = {
        role: "system",
        content: "You are a file and folder organizer that can return the most relevant category (Folder Name) by looking at the content.",
    };

    const kullaniciMesaji = {
        role: "user",
        content: `We need to create new folder names to organize files on the desktop or in the folder.

        I will provide you with the purpose in detail below. According to this purpose and the content you receive, return folder names that do not exceed 2-3 words.
Do not include any explanation, introduction or ending sentences. Your answer should only return the category (Folder Name).

Example Answers: "Ali Haydar GÜLEÇ", "Partnership Dissolution" , "Images" , "Plans and Projects", "Code Examples" . 
These are just examples and there will be only one answer like I separated them with a comma. Your answers should be like these, not exceeding 2-3 words.
Currently, other folders in the target folder are: ${JSON.stringify(currentFolders)} If the content is related to these, you can return one of them.
Content to be analyzed: ${content}
Criteria for this analysis: ${type}.
The actual name of file is ${fileName}. Pay attention to the actual name of file.
Never give details or explanations. Just return one possible folder name. Just return 1 or 2 words. nothing else.`,
    };

    return [sistemMesaji, kullaniciMesaji];
}

