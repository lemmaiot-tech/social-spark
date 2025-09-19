import { GoogleGenAI, Type } from "@google/genai";
import { Platform, PostSuggestion, BrandContext } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      caption: {
        type: Type.STRING,
        description: "The generated social media caption, perfectly tailored for the specified platform."
      },
      imageSuggestion: {
        type: Type.STRING,
        description: "A concise, descriptive suggestion for an accompanying image or video. For example: 'A minimalist flat lay of a laptop, notebook, and coffee cup.'"
      },
      hashtags: {
        type: Type.ARRAY,
        items: {
            type: Type.STRING,
        },
        description: "An array of 5-7 relevant and trending hashtags for the post. Do not include the '#' symbol in the strings."
      }
    },
    required: ["caption", "imageSuggestion", "hashtags"]
  }
};

const nextStepsSchema = {
    type: Type.OBJECT,
    properties: {
        nextSteps: {
            type: Type.ARRAY,
            description: "An array of 3-5 distinct, actionable, and creative ideas for future social media posts that logically follow the current topic.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["nextSteps"]
};


export async function generateSocialMediaContent(
  platform: Platform,
  handle: string,
  topic: string,
  brandContext: BrandContext | null,
): Promise<PostSuggestion[]> {
  
  let brandContextSection = `
    **Brand Context:**
    *   **Tone & Style Analysis (Simulated):** Based on the handle '${handle}', generate content that feels authentic to a user with this identity.
  `;

  if (brandContext && (brandContext.bio || brandContext.postExamples.length > 0 || brandContext.brandVoice)) {
      brandContextSection = `
    **Brand Context (Provided by User):**
    *   **Brand Bio:** "${brandContext.bio || 'Not provided'}"
    *   **Recent Post Examples:**
        ${brandContext.postExamples.map((ex, i) => `*   Example ${i + 1}: "${ex}"`).join('\n        ') || '*   None provided'}
    *   **Desired Tone:** "${brandContext.brandVoice || 'Not provided'}"
    `;
  }
  
  const prompt = `
    Act as a world-class social media strategist and content creator. Your primary goal is to generate 3 engaging post ideas that perfectly match a user's brand voice for the social media platform: ${platform}.

    **User & Topic:**
    *   **Platform:** ${platform}
    *   **Handle:** ${handle}
    *   **Post Topic:** "${topic}"

    ${brandContextSection}

    **Instructions:**
    1.  **Analyze and Emulate:** Deeply analyze the provided Brand Context. Your generated content MUST match the tone, style, and vocabulary found in the user's bio, post examples, and desired tone. If no context is provided, simulate a style appropriate for the handle and platform.
    2.  **Tailor to Platform:** Optimize each caption for ${platform}. Respect character limits, tone, and conventions (e.g., hashtags for Instagram, professionalism for LinkedIn, engaging questions for Facebook, short and snappy for TikTok).
    3.  **Generate 3 Distinct Ideas:** For each idea, provide:
        *   A creative and high-quality **caption**.
        *   A compelling **image or video suggestion** that complements the caption.
        *   An array of 5-7 relevant and trending **hashtags** (without the '#' symbol).
    4.  **Format:** Return the output STRICTLY as a JSON array of objects, with each object containing a "caption", an "imageSuggestion", and a "hashtags" array, according to the provided schema.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const jsonText = response.text.trim();
    const suggestions: PostSuggestion[] = JSON.parse(jsonText);
    return suggestions;
  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Failed to generate social media content.");
  }
}


export async function generateNextPostIdeas(
    platform: Platform,
    handle: string,
    topic: string,
    brandContext: BrandContext | null,
): Promise<string[]> {

    let brandContextSection = `
    **Brand Context:**
    *   **Tone & Style Analysis (Simulated):** Assume a style appropriate for the handle '${handle}' on ${platform}.
    `;

    if (brandContext && (brandContext.bio || brandContext.postExamples.length > 0 || brandContext.brandVoice)) {
        brandContextSection = `
    **Brand Context (Provided by User):**
    *   **Brand Bio:** "${brandContext.bio || 'Not provided'}"
    *   **Recent Post Examples:**
        ${brandContext.postExamples.map((ex, i) => `*   Example ${i + 1}: "${ex}"`).join('\n        ') || '*   None provided'}
    *   **Desired Tone:** "${brandContext.brandVoice || 'Not provided'}"
    `;
    }

    const prompt = `
        Act as a senior social media content strategist. Your task is to suggest a series of 3-5 follow-up post ideas based on a user's recent post and their brand profile.

        **Current Post Details:**
        *   **Platform:** ${platform}
        *   **Handle:** ${handle}
        *   **Original Post Topic:** "${topic}"

        ${brandContextSection}

        **Instructions:**
        1.  **Analyze Context:** Consider the core message of "${topic}" and how it aligns with the provided Brand Context.
        2.  **Brainstorm Follow-ups:** Generate 3 to 5 distinct, creative ideas for the *next* posts. These should build upon the original topic while staying true to the established brand voice.
        3.  **Actionable & Platform-Specific:** Each idea must be a concise, clear concept suitable for ${platform}. For example: "A 'before and after' Reel showing the impact of a feature" or "A LinkedIn article detailing the research behind the topic."
        4.  **Format:** Return the output STRICTLY as a JSON object containing a "nextSteps" array of strings.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: nextStepsSchema,
                temperature: 0.7,
            },
        });
        
        const jsonText = response.text.trim();
        const result = JSON.parse(jsonText);

        if (result && Array.isArray(result.nextSteps)) {
            return result.nextSteps;
        } else {
            console.error("Invalid format for next steps response:", result);
            return [];
        }

    } catch (error) {
        console.error("Error generating next post ideas with Gemini API:", error);
        throw new Error("Failed to generate next post ideas.");
    }
}


export async function generateImage(prompt: string): Promise<string> {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `A high-quality, visually appealing, professional social media image representing the following concept: "${prompt}". Style: vibrant, clean, photographic.`,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/jpeg',
              aspectRatio: '1:1', // Good default for social media posts
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("No image was generated by the API.");
        }
    } catch (error) {
        console.error("Error generating image with Gemini API:", error);
        throw new Error("Failed to generate image.");
    }
}