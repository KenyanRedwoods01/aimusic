//  Integration with Mistral API through proxy
const PROXY_URL = "https://hooks.jdoodle.net/proxy";
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";
const MISTRAL_API_KEY = "rL0GoYxxFENf8C0ujeGz8Tl2Cq2M5NBl"; // This will be added by the proxy

interface MistralMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

interface MistralCompletionRequest {
  model: string;
  messages: MistralMessage[];
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  stream?: boolean;
}

export async function generateLyrics(
  theme: string,
  keywords: string[] = [],
  genre: string,
  mood: string
): Promise<string> {
  try {
    const prompt = buildLyricsPrompt(theme, keywords, genre, mood);
    
    const messages: MistralMessage[] = [
      {
        role: "system",
        content: "You are a professional songwriter and lyricist with expertise in various musical genres and styles. Your task is to generate creative, original song lyrics based on the given parameters."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const requestData: MistralCompletionRequest = {
      model: "mistral-medium",
      messages: messages,
      temperature: 0.8,
      top_p: 0.9,
      max_tokens: 800
    };

    const response = await fetch(`${PROXY_URL}?url=${encodeURIComponent(MISTRAL_API_URL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to generate lyrics: ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating lyrics:', error);
    throw error;
  }
}

export async function generateMusicDescription(
  genre: string,
  mood: string,
  features: string[] = []
): Promise<string> {
  try {
    const prompt = buildMusicDescriptionPrompt(genre, mood, features);
    
    const messages: MistralMessage[] = [
      {
        role: "system",
        content: "You are a music producer with expertise in composing music across various genres. Your task is to describe the musical elements for a composition based on the given parameters."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    const requestData: MistralCompletionRequest = {
      model: "mistral-medium",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500
    };

    const response = await fetch(`${PROXY_URL}?url=${encodeURIComponent(MISTRAL_API_URL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to generate music description: ${errorData}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating music description:', error);
    throw error;
  }
}

export async function generateTrackTitle(
  genre: string,
  mood: string,
  theme?: string
): Promise<string> {
  try {
    const messages: MistralMessage[] = [
      {
        role: "system",
        content: "You are a creative music track title generator. Create a catchy, original title for a track based on the parameters."
      },
      {
        role: "user",
        content: `Generate a unique and catchy title for a ${genre} track with a ${mood} mood${theme ? ` that revolves around the theme of ${theme}` : ''}.
        The title should be short (1-5 words) and memorable. Return only the title with no additional text or explanation.`
      }
    ];

    const requestData: MistralCompletionRequest = {
      model: "mistral-medium",
      messages: messages,
      temperature: 0.9,
      max_tokens: 20
    };

    const response = await fetch(`${PROXY_URL}?url=${encodeURIComponent(MISTRAL_API_URL)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Failed to generate track title: ${errorData}`);
    }

    const data = await response.json();
    // Clean up the response to ensure we get just the title
    const title = data.choices[0].message.content.trim()
      .replace(/^["']|["']$/g, '') // Remove any quotes that might be around the title
      .replace(/[\n\r]/g, ''); // Remove any newlines
      
    return title;
  } catch (error) {
    console.error('Error generating track title:', error);
    throw error;
  }
}

function buildLyricsPrompt(
  theme: string,
  keywords: string[],
  genre: string,
  mood: string
): string {
  let prompt = `Generate original song lyrics with the following specifications:
- Theme: ${theme}
- Genre: ${genre}
- Mood: ${mood}
`;

  if (keywords.length > 0) {
    prompt += `- Keywords to include: ${keywords.join(', ')}\n`;
  }

  prompt += `
Include a chorus that repeats and at least two verses. Structure the lyrics in a clear format with verse and chorus sections labeled.
Make the lyrics emotionally resonant and fitting for the specified genre and mood.
Don't include music notes or chord progressions, just the lyrics.
`;

  return prompt;
}

function buildMusicDescriptionPrompt(
  genre: string, 
  mood: string,
  features: string[]
): string {
  let prompt = `Describe the musical elements for a ${genre} track with a ${mood} mood.
Include details about:
- Tempo and rhythm
- Key signature and chord progressions
- Instrumentation and arrangement
- Production techniques
- Overall structure (intro, verse, chorus, bridge, etc.)
`;

  if (features.length > 0) {
    prompt += `\nSpecial features to include: ${features.join(', ')}`;
  }

  prompt += `\nKeep the description technical but accessible. This will be used to guide AI music generation.`;

  return prompt;
}
 