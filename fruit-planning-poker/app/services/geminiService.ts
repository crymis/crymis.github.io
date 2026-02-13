
import { GoogleGenAI, Type } from "@google/genai";
import { FRUITS } from "../constants";

export async function getFruitCoachInsight(title: string, description: string): Promise<{ suggestedFruit: string; reasoning: string }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const fruitSystem = FRUITS.map(f => `${f.emoji} ${f.name} (Value: ${f.value}): ${f.description}`).join('\n');
  
  const prompt = `As a Scrum Master expert in the "Fruit Salad Estimation" technique, analyze this user story and suggest the most appropriate fruit.
  
  Story Title: ${title}
  Story Description: ${description}
  
  Fruit Scale Definitions:
  ${fruitSystem}
  
  Note: Use 'Tomato' if information is missing or it needs a breakdown. Use 'Avocado' if it's unpredictable or a fixed chore.
  
  Provide your recommendation in JSON format.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestedFruit: { type: Type.STRING, description: "Name of the suggested fruit" },
            reasoning: { type: Type.STRING, description: "Short explanation for the choice" }
          },
          required: ["suggestedFruit", "reasoning"]
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    return {
      suggestedFruit: result.suggestedFruit || "Apple",
      reasoning: result.reasoning || "Based on the complexity, this fruit fits the profile."
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      suggestedFruit: "Apple",
      reasoning: "I'm having trouble connecting to the fruit vine, but standard stories are often Apples (2)!"
    };
  }
}

export async function simulateAIVotes(title: string, description: string): Promise<Record<string, string>> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `You are a team of software developers estimating a story. Give two different fruit estimates based on the Fruit Scale.
  
  Story: ${title} - ${description}
  
  Fruit Options: ${FRUITS.map(f => f.name).join(', ')}
  
  Provide JSON with votes for 'Berry Bot' and 'Citrus Smarty'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            berryBot: { type: Type.STRING },
            citrusSmarty: { type: Type.STRING }
          }
        }
      }
    });

    const result = JSON.parse(response.text || "{}");
    const getFruitId = (name: string) => FRUITS.find(f => f.name.toLowerCase().includes(name?.toLowerCase() || ''))?.id || 'apple';
    
    return {
      'ai-1': getFruitId(result.berryBot),
      'ai-2': getFruitId(result.citrusSmarty)
    };
  } catch {
    return { 'ai-1': 'apple', 'ai-2': 'cherry' };
  }
}
