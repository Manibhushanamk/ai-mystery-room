import { GoogleGenAI } from '@google/genai';
import { env } from '../../config/env.js';
import {
  AICaseOutlineSchema,
  AICaseEvidencePacketSchema,
  type AICaseOutline,
  type AICaseEvidencePacket,
} from './aiSchemas.js';
import { PromptTemplates } from './promptTemplates.js';

export class GeminiService {
  private static client: GoogleGenAI | null = null;

  public static isAvailable(): boolean {
    const key = env.GEMINI_API_KEY?.trim();
    return Boolean(key && key.length > 5 && !key.startsWith('your_') && !key.includes('placeholder'));
  }

  private static getClient(): GoogleGenAI {
    if (!this.client) {
      if (!this.isAvailable()) {
        throw new Error('Gemini API key is not configured.');
      }
      this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    }
    return this.client;
  }

  /**
   * Helper that calls Gemini with JSON schema enforcement and retries with backoff.
   */
  public static async generateJSON<T>(
    prompt: string,
    schemaValidator: (data: unknown) => T,
    maxRetries = 2,
  ): Promise<T> {
    const client = this.getClient();
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await client.models.generateContent({
          model: env.GEMINI_MODEL || 'gemini-2.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            temperature: 0.7,
          },
        });

        const text = response.text;
        if (!text) {
          throw new Error('Empty response received from Gemini.');
        }

        const rawJson = JSON.parse(text);
        return schemaValidator(rawJson);
      } catch (err: any) {
        lastError = err;
        console.warn(`[GeminiService] Attempt ${attempt} failed: ${err?.message}`);
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        }
      }
    }

    throw new Error(`Gemini structured generation failed after ${maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Generates canonical outline using Gemini.
   */
  public static async generateOutline(params: {
    scenario: string;
    genre: string;
    difficulty: string;
    setting?: string;
  }): Promise<AICaseOutline> {
    const prompt = PromptTemplates.buildOutlinePrompt(params);
    return this.generateJSON(prompt, (raw) => AICaseOutlineSchema.parse(raw));
  }

  /**
   * Generates public evidence packet and cited reveal explanation using Gemini.
   */
  public static async generateEvidence(outline: AICaseOutline): Promise<AICaseEvidencePacket> {
    const prompt = PromptTemplates.buildEvidencePrompt(JSON.stringify(outline, null, 2));
    return this.generateJSON(prompt, (raw) => AICaseEvidencePacketSchema.parse(raw));
  }
}
