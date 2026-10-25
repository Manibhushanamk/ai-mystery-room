import Groq from 'groq-sdk';
import { env } from '../../config/env.js';
import {
  AICaseOutlineSchema,
  AICaseEvidencePacketSchema,
  type AICaseOutline,
  type AICaseEvidencePacket,
} from './aiSchemas.js';
import { PromptTemplates } from './promptTemplates.js';

export class GroqService {
  private static client: Groq | null = null;

  public static isAvailable(): boolean {
    const key = env.GROQ_API_KEY?.trim();
    return Boolean(key && key.length > 5 && !key.startsWith('your_') && !key.includes('placeholder'));
  }

  private static getClient(): Groq {
    if (!this.client) {
      if (!this.isAvailable()) {
        throw new Error('Groq API key is not configured.');
      }
      this.client = new Groq({ apiKey: env.GROQ_API_KEY });
    }
    return this.client;
  }

  /**
   * Helper that calls Groq with json_object response format, retries with backoff, and validates against Zod schema.
   */
  public static async generateJSON<T>(
    prompt: string,
    schemaValidator: (data: unknown) => T,
    systemInstruction = 'You are a master detective mystery architect and fair-play mystery writer. Return ONLY a valid JSON object matching the requested schema. No markdown formatting, no conversational text.',
    maxRetries = 2,
  ): Promise<T> {
    const client = this.getClient();
    let lastError: any = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const completion = await client.chat.completions.create({
          model: env.GROQ_MODEL || 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: systemInstruction,
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          response_format: { type: 'json_object' },
          temperature: 0.6,
        });

        const rawText = completion.choices[0]?.message?.content;
        if (!rawText) {
          throw new Error('Empty response received from Groq.');
        }

        const rawJson = JSON.parse(rawText);
        return schemaValidator(rawJson);
      } catch (err: any) {
        lastError = err;
        console.warn(`[GroqService] Attempt ${attempt} failed: ${err?.message}`);
        if (attempt < maxRetries) {
          await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
        }
      }
    }

    throw new Error(`Groq structured generation failed after ${maxRetries} attempts: ${lastError?.message}`);
  }

  /**
   * Generates canonical outline using Groq.
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
   * Generates public evidence packet and cited reveal explanation using Groq.
   */
  public static async generateEvidence(outline: AICaseOutline): Promise<AICaseEvidencePacket> {
    const prompt = PromptTemplates.buildEvidencePrompt(JSON.stringify(outline, null, 2));
    return this.generateJSON(prompt, (raw) => AICaseEvidencePacketSchema.parse(raw));
  }
}
