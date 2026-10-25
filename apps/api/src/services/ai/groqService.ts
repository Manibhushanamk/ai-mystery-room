import Groq from 'groq-sdk';
import { env } from '../../config/env.js';
import {
  AICaseOutlineSchema,
  AICaseEvidencePacketSchema,
  type AICaseOutline,
  type AICaseEvidencePacket,
} from './aiSchemas.js';
import { PromptTemplates } from './promptTemplates.js';

const CANDIDATE_MODELS = [
  'openai/gpt-oss-120b',
  'openai/gpt-oss-20b',
  'llama-3.3-70b-versatile',
  'llama-3.1-8b-instant',
  'qwen/qwen3.8-27b',
];

export class GroqService {
  private static defaultClient: Groq | null = null;

  public static isAvailable(customKey?: string): boolean {
    const key = (customKey || env.GROQ_API_KEY)?.trim();
    return Boolean(key && key.length > 5 && !key.startsWith('your_') && !key.includes('placeholder'));
  }

  private static getClient(customKey?: string): Groq {
    if (customKey && customKey.trim()) {
      return new Groq({ apiKey: customKey.trim() });
    }
    if (!this.defaultClient) {
      if (!this.isAvailable()) {
        throw new Error('Groq API key is not configured.');
      }
      this.defaultClient = new Groq({ apiKey: env.GROQ_API_KEY });
    }
    return this.defaultClient;
  }

  /**
   * Helper that calls Groq with json_object response format, model fallback, retries, and Zod schema validation.
   */
  public static async generateJSON<T>(
    prompt: string,
    schemaValidator: (data: unknown) => T,
    systemInstruction = 'You are a master detective mystery architect and fair-play mystery writer. You must return a valid JSON object matching the requested schema. Output strictly JSON without any markdown code fences.',
    maxRetries = 2,
    customApiKey?: string,
  ): Promise<T> {
    const client = this.getClient(customApiKey);
    let lastError: any = null;

    const modelsToTry = Array.from(new Set([env.GROQ_MODEL, ...CANDIDATE_MODELS].filter(Boolean))) as string[];

    for (const model of modelsToTry) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const completion = await client.chat.completions.create({
            model,
            messages: [
              {
                role: 'system',
                content: systemInstruction,
              },
              {
                role: 'user',
                content: `${prompt}\n\nPlease respond strictly in valid JSON format.`,
              },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.5,
            max_tokens: 4096,
          });

          const rawText = completion.choices[0]?.message?.content;
          if (!rawText) {
            throw new Error('Empty response received from Groq.');
          }

          const rawJson = JSON.parse(rawText);
          return schemaValidator(rawJson);
        } catch (err: any) {
          lastError = err;
          console.warn(`[GroqService] Model ${model} Attempt ${attempt} failed: ${err?.message}`);
          if (attempt < maxRetries) {
            await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
          }
        }
      }
    }

    throw new Error(`Groq structured generation failed across available models: ${lastError?.message}`);
  }

  /**
   * Generates canonical outline using Groq.
   */
  public static async generateOutline(
    params: {
      scenario: string;
      genre: string;
      difficulty: string;
      setting?: string;
    },
    customApiKey?: string,
  ): Promise<AICaseOutline> {
    const prompt = PromptTemplates.buildOutlinePrompt(params);
    return this.generateJSON(
      prompt,
      (raw) => AICaseOutlineSchema.parse(raw),
      undefined,
      2,
      customApiKey,
    );
  }

  /**
   * Generates public evidence packet and cited reveal explanation using Groq.
   */
  public static async generateEvidence(
    outline: AICaseOutline,
    customApiKey?: string,
  ): Promise<AICaseEvidencePacket> {
    const prompt = PromptTemplates.buildEvidencePrompt(JSON.stringify(outline, null, 2));
    return this.generateJSON(
      prompt,
      (raw) => AICaseEvidencePacketSchema.parse(raw),
      undefined,
      2,
      customApiKey,
    );
  }
}
