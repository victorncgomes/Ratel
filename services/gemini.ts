
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Initializing GoogleGenAI with process.env.API_KEY directly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Classifies a list of emails using Gemini
 */
export async function classifyEmails(emails: any[]) {
  const emailContext = emails.map(e => ({
    id: e.id,
    from: e.from,
    subject: e.subject,
    snippet: e.snippet
  }));

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Classify these emails into categories: newsletter, transactional, personal, work, financial, logistics, social, legal, spam, other. 
                 Return a JSON array. Emails: ${JSON.stringify(emailContext)}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              category: { type: Type.STRING },
              confidence: { type: Type.NUMBER },
              rationale: { type: Type.STRING }
            },
            required: ["id", "category", "confidence"]
          }
        }
      }
    });
    
    // Fix: Accessing response.text as a property (not a method) as per guidelines
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini classification failed:", error);
    return [];
  }
}

/**
 * Chat interaction with the inbox assistant
 */
export async function askAssistant(query: string, stats: any) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `As Ratel's AI assistant, answer this user query about their inbox. 
                 Context: ${JSON.stringify(stats)}. Query: ${query}`,
      config: {
        systemInstruction: "You are Ratel, an intelligent inbox manager. Be concise, professional, and helpful."
      }
    });
    
    // Fix: Accessing response.text as a property (not a method) as per guidelines
    return response.text;
  } catch (error) {
    console.error("Gemini chat failed:", error);
    return "Desculpe, tive um problema ao processar sua pergunta.";
  }
}
