import { Router } from 'express';
import { CaseController } from '../controllers/caseController.js';

export const casesRouter = Router();

// Case collection endpoints
casesRouter.post('/', CaseController.createCase);
casesRouter.get('/', CaseController.listCases);

// Individual case lifecycle endpoints
casesRouter.get('/:caseId/status', CaseController.getCaseStatus);
casesRouter.get('/:caseId/reveal', CaseController.getCaseReveal);
casesRouter.get('/:caseId', CaseController.getPublicCase);
casesRouter.patch('/:caseId/player-state', CaseController.updatePlayerState);
casesRouter.post('/:caseId/accusation', CaseController.submitAccusation);
casesRouter.delete('/:caseId', CaseController.deleteCase);
