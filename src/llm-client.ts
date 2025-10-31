import OpenAI from 'openai';

export interface LLMOptions {
  // OpenAI-compatible endpoint configuration
  openai?: {
    baseURL: string;
    apiKey: string;
    model: string;
  };
  // Legacy ollamaUrl for backward compatibility
  ollamaUrl?: string | null;
}

export interface LLMRequest {
  prompt: string;
  images?: string[]; // base64 encoded images
}

export interface LLMResponse {
  content: string;
}

export class LLMClient {
  private client: OpenAI;
  private model: string;
  private isOllama: boolean;

  constructor(options: LLMOptions) {
    if (options.openai) {
      this.client = new OpenAI({
        baseURL: options.openai.baseURL,
        apiKey: options.openai.apiKey,
      });
      this.model = options.openai.model;
      this.isOllama = options.openai.baseURL.includes('11434') ||
        options.openai.baseURL.includes('ollama');
    } else if (options.ollamaUrl) {
      // Handle legacy ollamaUrl option
      this.client = new OpenAI({
        baseURL: `${options.ollamaUrl}/v1`,
        apiKey: 'ollama', // required but unused for Ollama
      });
      this.model = 'gemma3:27b'; // default model for legacy compatibility
      this.isOllama = true;
    } else {
      throw new Error(
        'Either OpenAI configuration or legacy ollamaUrl must be provided',
      );
    }
  }

  async generate(request: LLMRequest): Promise<LLMResponse> {
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [];

    if (request.images && request.images.length > 0) {
      // For vision requests, create a user message with text and images
      const content: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [
        { type: 'text', text: request.prompt },
      ];

      // Add images to the content
      for (const image of request.images) {
        content.push({
          type: 'image_url',
          image_url: {
            url: `data:image/png;base64,${image}`,
          },
        });
      }

      messages.push({
        role: 'user',
        content: content,
      });
    } else {
      // Text-only request
      messages.push({
        role: 'user',
        content: request.prompt,
      });
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages,
        stream: false,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) {
        throw new Error('Empty response from LLM');
      }

      return { content };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`LLM request failed: ${error.message}`);
      }
      throw new Error('LLM request failed with unknown error');
    }
  }

  static create(options: LLMOptions): LLMClient | null {
    // Return null if no LLM configuration is provided
    if (!options.openai && !options.ollamaUrl) {
      return null;
    }
    return new LLMClient(options);
  }
}

// Helper function to determine if LLM is available
export function hasLLMConfig(options: LLMOptions): boolean {
  return !!(options.openai || options.ollamaUrl);
}
