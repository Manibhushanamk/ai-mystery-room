import { v4 as uuidv4 } from 'uuid';
import { MysteryCase, type IMysteryCase } from '../models/MysteryCase.js';
import { isNeonConfigured, getNeonPool } from '../config/neonDatabase.js';
import type { CaseStatus } from '@ai-mystery-room/shared';

export interface ICaseRecord {
  id: string;
  ownerId: string;
  title: string;
  scenarioSeed: string;
  genre: string;
  difficulty: string;
  setting?: string;
  status: CaseStatus;
  generation: {
    stage: string;
    progress: number;
    lastErrorCode?: string;
  };
  publicCase: {
    premise?: string;
    incidentSummary?: string;
    incidentTime?: string;
    briefing?: string;
    title?: string;
    summary?: string;
    suspects: any[];
    evidence: any[];
    timeline: any[];
  };
  privateSolution: {
    culpritSuspectId: string;
    motive: string;
    method: string;
    canonicalTimeline: any[];
    solutionExplanation: string;
    evidenceReasoning: any[];
    debunkedRedHerrings?: any[];
  };
  playerState: {
    markedEvidenceIds: string[];
    notes: any[];
    accusation?: {
      suspectId: string;
      submittedAt: Date;
      isCorrect: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
  save(): Promise<ICaseRecord>;
}

class NeonCaseRecord implements ICaseRecord {
  id: string;
  ownerId: string;
  title: string;
  scenarioSeed: string;
  genre: string;
  difficulty: string;
  setting?: string;
  status: CaseStatus;
  generation: {
    stage: string;
    progress: number;
    lastErrorCode?: string;
  };
  publicCase: {
    premise?: string;
    incidentSummary?: string;
    incidentTime?: string;
    briefing?: string;
    title?: string;
    summary?: string;
    suspects: any[];
    evidence: any[];
    timeline: any[];
  };
  privateSolution: {
    culpritSuspectId: string;
    motive: string;
    method: string;
    canonicalTimeline: any[];
    solutionExplanation: string;
    evidenceReasoning: any[];
    debunkedRedHerrings?: any[];
  };
  playerState: {
    markedEvidenceIds: string[];
    notes: any[];
    accusation?: {
      suspectId: string;
      submittedAt: Date;
      isCorrect: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;

  constructor(data: any) {
    this.id = data.id;
    this.ownerId = data.owner_id || data.ownerId;
    this.title = data.title || 'Generating Investigation...';
    this.scenarioSeed = data.scenario_seed || data.scenarioSeed;
    this.genre = data.genre;
    this.difficulty = data.difficulty;
    this.setting = data.setting;
    this.status = data.status;
    this.generation = typeof data.generation === 'string' ? JSON.parse(data.generation) : (data.generation || {});
    this.publicCase = typeof data.public_case === 'string' ? JSON.parse(data.public_case) : (data.public_case || data.publicCase || { suspects: [], evidence: [], timeline: [] });
    this.privateSolution = typeof data.private_solution === 'string' ? JSON.parse(data.private_solution) : (data.private_solution || data.privateSolution || {});
    this.playerState = typeof data.player_state === 'string' ? JSON.parse(data.player_state) : (data.player_state || data.playerState || { markedEvidenceIds: [], notes: [] });
    this.createdAt = data.created_at ? new Date(data.created_at) : new Date();
    this.updatedAt = data.updated_at ? new Date(data.updated_at) : new Date();
  }

  async save(): Promise<ICaseRecord> {
    const pool = getNeonPool();
    this.updatedAt = new Date();

    await pool.query(
      `UPDATE mystery_cases 
       SET title = $2,
           status = $3,
           generation = $4,
           public_case = $5,
           private_solution = $6,
           player_state = $7,
           updated_at = $8
       WHERE id = $1`,
      [
        this.id,
        this.title,
        this.status,
        JSON.stringify(this.generation),
        JSON.stringify(this.publicCase),
        JSON.stringify(this.privateSolution),
        JSON.stringify(this.playerState),
        this.updatedAt,
      ],
    );
    return this;
  }
}

export class CaseRepository {
  /**
   * Creates a new case in the active database.
   */
  public static async create(data: {
    ownerId: string;
    scenarioSeed: string;
    genre: string;
    difficulty: string;
    setting?: string;
  }): Promise<ICaseRecord> {
    if (isNeonConfigured()) {
      const pool = getNeonPool();
      const id = uuidv4();
      const now = new Date();

      const initialGeneration = {
        stage: 'Queued for generation',
        progress: 0,
      };
      const initialPlayerState = {
        markedEvidenceIds: [],
        notes: [],
      };
      const defaultTitle = 'Generating Investigation...';

      await pool.query(
        `INSERT INTO mystery_cases (
          id, owner_id, title, scenario_seed, genre, difficulty, setting,
          status, generation, public_case, private_solution, player_state,
          created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          id,
          data.ownerId,
          defaultTitle,
          data.scenarioSeed,
          data.genre,
          data.difficulty,
          data.setting || null,
          'generating_outline',
          JSON.stringify(initialGeneration),
          JSON.stringify({ suspects: [], evidence: [], timeline: [] }),
          JSON.stringify({}),
          JSON.stringify(initialPlayerState),
          now,
          now,
        ],
      );

      return new NeonCaseRecord({
        id,
        ownerId: data.ownerId,
        title: defaultTitle,
        scenarioSeed: data.scenarioSeed,
        genre: data.genre,
        difficulty: data.difficulty,
        setting: data.setting,
        status: 'generating_outline',
        generation: initialGeneration,
        publicCase: { suspects: [], evidence: [], timeline: [] },
        privateSolution: {},
        playerState: initialPlayerState,
        createdAt: now,
        updatedAt: now,
      });
    }

    // Default to Mongoose / MongoDB
    const caseDoc = new MysteryCase({
      ownerId: data.ownerId,
      title: 'Generating Investigation...',
      scenarioSeed: data.scenarioSeed,
      genre: data.genre,
      difficulty: data.difficulty,
      setting: data.setting,
      status: 'generating_outline',
      generation: {
        stage: 'Queued for generation',
        progress: 0,
      },
      playerState: {
        markedEvidenceIds: [],
        notes: [],
      },
    });

    await caseDoc.save();
    return caseDoc as unknown as ICaseRecord;
  }

  /**
   * Finds a case by ID.
   */
  public static async findById(id: string): Promise<ICaseRecord | null> {
    if (isNeonConfigured()) {
      const pool = getNeonPool();
      const result = await pool.query('SELECT * FROM mystery_cases WHERE id = $1', [id]);
      if (result.rows.length === 0) return null;
      return new NeonCaseRecord(result.rows[0]);
    }

    const doc = await MysteryCase.findById(id);
    return doc ? (doc as unknown as ICaseRecord) : null;
  }

  /**
   * Finds user cases with pagination.
   */
  public static async findUserCases(
    ownerId: string,
    limit = 20,
    offset = 0,
  ): Promise<{ cases: ICaseRecord[]; total: number }> {
    if (isNeonConfigured()) {
      const pool = getNeonPool();
      const countRes = await pool.query(
        'SELECT COUNT(*) FROM mystery_cases WHERE owner_id = $1',
        [ownerId],
      );
      const total = parseInt(countRes.rows[0].count, 10);

      const listRes = await pool.query(
        `SELECT * FROM mystery_cases 
         WHERE owner_id = $1 
         ORDER BY created_at DESC 
         LIMIT $2 OFFSET $3`,
        [ownerId, limit, offset],
      );

      return {
        cases: listRes.rows.map((row) => new NeonCaseRecord(row)),
        total,
      };
    }

    const [cases, total] = await Promise.all([
      MysteryCase.find({ ownerId })
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit),
      MysteryCase.countDocuments({ ownerId }),
    ]);

    return {
      cases: cases as unknown as ICaseRecord[],
      total,
    };
  }

  /**
   * Deletes a case by ID.
   */
  public static async deleteById(id: string): Promise<boolean> {
    if (isNeonConfigured()) {
      const pool = getNeonPool();
      const res = await pool.query('DELETE FROM mystery_cases WHERE id = $1', [id]);
      return (res.rowCount ?? 0) > 0;
    }

    const res = await MysteryCase.findByIdAndDelete(id);
    return Boolean(res);
  }
}
