import { GoogleGenAI, Type } from "@google/genai";
import { Comment, Thread, Vendor } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const summarizeThread = async (title: string, content: string, comments: Comment[]): Promise<string> => {
  if (!apiKey) {
    return "API Key is missing. Please configure the environment variable.";
  }

  try {
    const commentsText = comments.map(c => `${c.author} (Unit ${c.unit}): ${c.content}`).join('\n');
    const prompt = `
      You are an AI assistant for a community management app.
      Summarize the following discussion thread into a concise, bulleted list.
      Focus on the main issue, key viewpoints, and any consensus or resolution reached.
      
      Thread Title: ${title}
      Original Post: ${content}
      
      Comments:
      ${commentsText}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    console.error("Error summarizing thread:", error);
    return "An error occurred while generating the summary.";
  }
};

export interface SearchResult {
  answer: string;
  relevantThreadIds: string[];
  relevantVendorIds: string[];
}

export const searchCommunity = async (query: string, threads: Thread[], vendors: Vendor[]): Promise<SearchResult> => {
   if (!apiKey) return { answer: "API Key missing. Cannot perform AI search.", relevantThreadIds: [], relevantVendorIds: [] };

   try {
     const dataContext = `
       Threads: ${JSON.stringify(threads.map(t => ({id: t.id, title: t.title, content: t.content, type: t.type})))}
       Vendors: ${JSON.stringify(vendors.map(v => ({id: v.id, name: v.name, category: v.category, rating: v.rating})))}
     `;
     
     const prompt = `
       User Query: "${query}"
       
       You are an intelligent assistant for a community app called CommunityConnect.
       1. Answer the user's query directly based on the provided Threads and Vendors data. If they ask about a service, recommend the best vendor. If they ask about an issue, summarize the situation from the threads.
       2. Identify the IDs of the Threads and Vendors that are most relevant to the query so we can show them to the user.
       
       Data:
       ${dataContext}
     `;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              answer: { type: Type.STRING },
              relevantThreadIds: { type: Type.ARRAY, items: { type: Type.STRING } },
              relevantVendorIds: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ["answer", "relevantThreadIds", "relevantVendorIds"],
          },
        },
      });
      
      const resultText = response.text;
      if (!resultText) throw new Error("No response from AI");
      return JSON.parse(resultText) as SearchResult;

   } catch (error) {
     console.error("Search error:", error);
     return { answer: "Sorry, I couldn't process your search at this time.", relevantThreadIds: [], relevantVendorIds: [] };
   }
};

export const findSimilarThreads = async (newTitle: string, newContent: string, existingThreads: Thread[]): Promise<string[]> => {
    if (!apiKey) return [];

    try {
        const threadData = existingThreads.map(t => ({ id: t.id, title: t.title, content: t.content }));
        
        const prompt = `
            I am a user trying to post a new discussion in a community app.
            
            My Draft Post:
            Title: "${newTitle}"
            Content: "${newContent}"
            
            Existing Threads:
            ${JSON.stringify(threadData)}
            
            Task:
            Analyze the Existing Threads. If any of them are about the same topic or very similar to My Draft Post, return their IDs.
            If no similar threads are found, return an empty array.
            
            Only return the list of IDs.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        similarThreadIds: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ["similarThreadIds"]
                }
            }
        });

        const result = JSON.parse(response.text || "{}");
        return result.similarThreadIds || [];
    } catch (e) {
        console.error("Error finding similar threads", e);
        return [];
    }
}