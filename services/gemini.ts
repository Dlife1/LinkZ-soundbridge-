import { GoogleGenAI } from "@google/genai";
import { ReleaseMetadata } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const consultIntelligence = async (query: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: query,
      config: {
        systemInstruction: `You are LinkZ Neural Core, a highly advanced AI integrated into the LinkZ SoundBridge Enterprise Artist Hub. 
        Your purpose is to assist artists and label managers with music distribution strategies.`,
        temperature: 0.7,
      }
    });

    return response.text || "Neural Core connection interrupted.";
  } catch (error) {
    console.error("LinkZ Neural Core Error:", error);
    return "Error: Unable to establish uplink.";
  }
};

export const generateCoverArt = async (prompt: string): Promise<string | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality album artwork, 4k, artistic, abstract, music cover art style: ${prompt}` }],
      },
      // Note: responseMimeType is not set as it is not supported for this model
    });

    // Extract image from response parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Cover Art Gen Error:", error);
    throw error;
  }
};

export const analyzeReleaseMetadata = async (metadata: Partial<ReleaseMetadata>): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this music release metadata for DDEX 4.3 compliance and commercial optimization. 
      Metadata: ${JSON.stringify(metadata)}
      
      Provide a "Forward Thinking Improvement" report. 
      Check for:
      1. Title capitalization consistency (Title Case).
      2. Missing critical fields (C-Line, P-Line).
      3. Genre suitability based on Artist name (inference).
      4. SEO improvements for the description or title.
      
      Format as a concise list of actionable bullet points. Start with a "Compliance Score: X/100".`,
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    console.error("Analysis Error:", error);
    return "System Error: Neural analysis module offline.";
  }
};