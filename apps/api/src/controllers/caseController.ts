import type { Request, Response, NextFunction } from 'express';
import { CreateCaseSchema, AccusationRequestSchema, UpdatePlayerStateSchema } from '@ai-mystery-room/shared';
import { CaseService } from '../services/case-generation/caseService.js';

export class CaseController {
  public static async createCase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const input = CreateCaseSchema.parse(req.body);
      const result = await CaseService.createCase(ownerId, input);
      res.status(202).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async getCaseStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const { caseId } = req.params;
      const result = await CaseService.getCaseStatus(caseId, ownerId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async getPublicCase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const { caseId } = req.params;
      const result = await CaseService.getPublicCase(caseId, ownerId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async updatePlayerState(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const { caseId } = req.params;
      const input = UpdatePlayerStateSchema.parse(req.body);
      const result = await CaseService.updatePlayerState(caseId, ownerId, input);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async submitAccusation(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const { caseId } = req.params;
      const { suspectId } = AccusationRequestSchema.parse(req.body);
      const result = await CaseService.submitAccusation(caseId, ownerId, suspectId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async getCaseReveal(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const { caseId } = req.params;
      const result = await CaseService.getCaseReveal(caseId, ownerId);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async listCases(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;
      const result = await CaseService.listUserCases(ownerId, limit);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public static async deleteCase(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const ownerId = req.mysterySession!.id;
      const { caseId } = req.params;
      await CaseService.deleteCase(caseId, ownerId);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}
