import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../src/app.js';
import { connectDatabase, disconnectDatabase } from '../src/config/database.js';

describe('Cases API Integration Suite', () => {
  let app: any;
  const ownerSessionId = 'test-session-investigator-01';
  const otherSessionId = 'test-session-unauthorized-02';

  beforeAll(async () => {
    await connectDatabase();
    app = createApp();
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  it('rejects case creation with short scenario (under 20 chars)', async () => {
    const res = await request(app)
      .post('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId)
      .send({
        scenario: 'Too short',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('creates a case and returns 202 Accepted with statusUrl', async () => {
    const res = await request(app)
      .post('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId)
      .send({
        scenario: 'A prototype quantum core is stolen from the locked university basement lab before demo day.',
        genre: 'campus',
        difficulty: 'medium',
      });

    expect(res.status).toBe(202);
    expect(res.body.caseId).toBeDefined();
    expect(res.body.statusUrl).toContain(`/api/v1/cases/${res.body.caseId}/status`);
  });

  it('polls case status and transitions to ready', async () => {
    const createRes = await request(app)
      .post('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId)
      .send({
        scenario: 'A prototype quantum core is stolen from the locked university basement lab before demo day.',
        genre: 'campus',
        difficulty: 'medium',
      });

    const caseId = createRes.body.caseId;

    // Small delay to allow synchronous/async pipeline step to settle
    await new Promise((resolve) => setTimeout(resolve, 300));

    const statusRes = await request(app)
      .get(`/api/v1/cases/${caseId}/status`)
      .set('X-Session-ID', ownerSessionId);

    expect(statusRes.status).toBe(200);
    expect(statusRes.body.caseId).toBe(caseId);
    expect(statusRes.body.status).toBe('ready');
    expect(statusRes.body.progress).toBe(100);
  });

  it('public case endpoint excludes privateSolution and culprit fields', async () => {
    const createRes = await request(app)
      .post('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId)
      .send({
        scenario: 'A prototype quantum core is stolen from the locked university basement lab before demo day.',
        genre: 'campus',
        difficulty: 'medium',
      });

    const caseId = createRes.body.caseId;
    await new Promise((resolve) => setTimeout(resolve, 300));

    const caseRes = await request(app)
      .get(`/api/v1/cases/${caseId}`)
      .set('X-Session-ID', ownerSessionId);

    expect(caseRes.status).toBe(200);
    expect(caseRes.body.id).toBe(caseId);

    // SECURITY CHECK: Private solution MUST NEVER leak
    expect(caseRes.body.privateSolution).toBeUndefined();
    expect(caseRes.body.culpritSuspectId).toBeUndefined();
    expect(caseRes.body.motive).toBeUndefined();

    // Verify public structure
    expect(caseRes.body.publicCase.suspects.length).toBeGreaterThanOrEqual(3);
    expect(caseRes.body.publicCase.evidence.length).toBeGreaterThanOrEqual(4);
    expect(caseRes.body.publicCase.timeline.length).toBeGreaterThanOrEqual(2);

    for (const evidence of caseRes.body.publicCase.evidence) {
      expect(evidence.fictionalLabel).toBe('FICTIONAL_SIMULATION');
    }
  });

  it('forbids unauthorized session from accessing another users case', async () => {
    const createRes = await request(app)
      .post('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId)
      .send({
        scenario: 'A prototype quantum core is stolen from the locked university basement lab before demo day.',
      });

    const caseId = createRes.body.caseId;

    const res = await request(app)
      .get(`/api/v1/cases/${caseId}`)
      .set('X-Session-ID', otherSessionId);

    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  it('updates player notes and marked evidence', async () => {
    const createRes = await request(app)
      .post('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId)
      .send({
        scenario: 'A prototype quantum core is stolen from the locked university basement lab before demo day.',
      });

    const caseId = createRes.body.caseId;
    await new Promise((resolve) => setTimeout(resolve, 300));

    const patchRes = await request(app)
      .patch(`/api/v1/cases/${caseId}/player-state`)
      .set('X-Session-ID', ownerSessionId)
      .send({
        markedEvidenceIds: ['evidence_02', 'evidence_06'],
        notes: [{ evidenceId: 'evidence_02', text: 'Badge 408 opened vault door during bypass window.' }],
      });

    expect(patchRes.status).toBe(200);
    expect(patchRes.body.playerState.markedEvidenceIds).toContain('evidence_02');
    expect(patchRes.body.playerState.notes.length).toBe(1);
    expect(patchRes.body.playerState.notes[0].text).toContain('Badge 408');
  });

  it('submits accusation, validates answer, reveals cited solution, and blocks duplicate', async () => {
    const createRes = await request(app)
      .post('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId)
      .send({
        scenario: 'A prototype quantum core is stolen from the locked university basement lab before demo day.',
      });

    const caseId = createRes.body.caseId;
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Submit accusation against suspect_02 (Marcus Wright - the culprit in mock case)
    const accuseRes = await request(app)
      .post(`/api/v1/cases/${caseId}/accusation`)
      .set('X-Session-ID', ownerSessionId)
      .send({
        suspectId: 'suspect_02',
      });

    expect(accuseRes.status).toBe(200);
    expect(accuseRes.body.result).toBe('correct');
    expect(accuseRes.body.culprit.suspectId).toBe('suspect_02');
    expect(accuseRes.body.motive).toBeDefined();
    expect(accuseRes.body.solutionExplanation).toBeDefined();
    expect(accuseRes.body.evidenceReasoning.length).toBeGreaterThanOrEqual(2);

    // Duplicate submission must be blocked
    const dupRes = await request(app)
      .post(`/api/v1/cases/${caseId}/accusation`)
      .set('X-Session-ID', ownerSessionId)
      .send({
        suspectId: 'suspect_02',
      });

    expect(dupRes.status).toBe(400);
    expect(dupRes.body.error.code).toBe('ALREADY_SUBMITTED');
  });

  it('lists user cases and allows case deletion', async () => {
    const listRes = await request(app)
      .get('/api/v1/cases')
      .set('X-Session-ID', ownerSessionId);

    expect(listRes.status).toBe(200);
    expect(listRes.body.cases).toBeDefined();
    expect(listRes.body.cases.length).toBeGreaterThan(0);

    const firstCaseId = listRes.body.cases[0].id;

    // Delete case
    const deleteRes = await request(app)
      .delete(`/api/v1/cases/${firstCaseId}`)
      .set('X-Session-ID', ownerSessionId);

    expect(deleteRes.status).toBe(204);
  });
});
