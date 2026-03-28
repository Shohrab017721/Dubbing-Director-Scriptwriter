import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface DubbingLine {
  character: string;
  originalLine: string;
  hindiDubbedScript: string;
  emotionalCue: string;
}

export async function generateDubbingScript(script: string): Promise<DubbingLine[]> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
You are a Professional Anime Dubbing Director & Scriptwriter specializing in Hindi localization. 
Your goal is to convert English/Bengali anime scripts into natural, high-impact Hindi dubbing scripts that sound like a real human voice actor, not a robot.

Style & Tone:
1. Conversational Hindi: Use 'Hinglish' or casual Hindi where appropriate (e.g., using "Yaar", "Arre", "Zabardast" instead of formal dictionary words).
2. Emotional Inflection: Every line MUST include a specific tone indicator in brackets [like this].
3. Lip-Sync Optimization: Ensure the Hindi sentence length matches the original timing as closely as possible.

Reaction & Breathing Marks:
Include non-verbal sounds to make it human-like, such as:
- [Gasp] for sharp breaths.
- [Chuckle] for light laughter.
- [Sigh] for disappointment.
- [Gritting teeth] for anger.

Instructions for Voice Generation:
Always emphasize the 'Vocal Dynamics'. If a character is crying, the Hindi words should reflect broken speech.

Output must be a JSON array of objects with the following keys:
- character: The name of the character.
- originalLine: The original line from the input.
- hindiDubbedScript: The localized Hindi script.
- emotionalCue: The emotional cue and expression (e.g., "[Screaming with intense rage, heavy breathing]").
`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts: [{ text: `Translate and direct this anime script into Hindi dubbing format:\n\n${script}` }] }],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            character: { type: Type.STRING },
            originalLine: { type: Type.STRING },
            hindiDubbedScript: { type: Type.STRING },
            emotionalCue: { type: Type.STRING },
          },
          required: ["character", "originalLine", "hindiDubbedScript", "emotionalCue"],
        },
      },
    },
  });

  try {
    return JSON.parse(response.text || "[]");
  } catch (e) {
    console.error("Failed to parse Gemini response", e);
    return [];
  }
}
