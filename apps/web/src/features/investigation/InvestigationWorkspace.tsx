import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import type {
  PublicCaseResponse,
  PublicEvidence,
  PublicSuspect,
  PlayerNote,
  SolutionReveal,
} from '@ai-mystery-room/shared';
import { FictionalBadge, DifficultyBadge, GenreBadge } from '../../components/Badge.js';
import { EvidenceDocket } from '../evidence/EvidenceDocket.js';
import { EvidenceModal } from '../evidence/EvidenceModal.js';
import { SuspectList } from './SuspectList.js';
import { TimelineView } from './TimelineView.js';
import { NotebookView } from './NotebookView.js';
import { AccusationDialog } from '../accusation/AccusationDialog.js';
import { RevealScreen } from '../accusation/RevealScreen.js';
import {
  FileText,
  Clock,
  BookOpen,
  ShieldAlert,
  Compass,
  AlertCircle,
} from 'lucide-react';

export function InvestigationWorkspace() {
  const { caseId } = useParams<{ caseId: string }>();

  const [caseData, setCaseData] = useState<PublicCaseResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active interaction states
  const [selectedSuspectId, setSelectedSuspectId] = useState<string | null>(null);
  const [inspectingEvidence, setInspectingEvidence] = useState<PublicEvidence | null>(null);
  const [accusingSuspect, setAccusingSuspect] = useState<PublicSuspect | null>(null);
  const [isSubmittingAccusation, setIsSubmittingAccusation] = useState(false);
  const [reveal, setReveal] = useState<SolutionReveal | null>(null);

  // Active tab for right column on smaller screens
  const [rightTab, setRightTab] = useState<'timeline' | 'notes'>('timeline');

  // Notebook auto-save state
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  const fetchCase = useCallback(async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await api.getPublicCase(caseId);
      setCaseData(res);

      // If already solved, auto-fetch solution reveal
      if (res.status === 'completed') {
        api
          .getCaseReveal(caseId)
          .then((rev) => setReveal(rev))
          .catch((err) => console.warn('Could not load completed reveal:', err));
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load investigation room.');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCase();
  }, [fetchCase]);

  // Handle Mark / Unmark Evidence
  const handleToggleMarked = async (evidenceId: string) => {
    if (!caseData || !caseId) return;

    const currentMarked = caseData.playerState?.markedEvidenceIds || [];
    const updatedMarked = currentMarked.includes(evidenceId)
      ? currentMarked.filter((id) => id !== evidenceId)
      : [...currentMarked, evidenceId];

    // Optimistic update
    setCaseData({
      ...caseData,
      playerState: {
        ...caseData.playerState,
        markedEvidenceIds: updatedMarked,
      },
    });

    try {
      await api.updatePlayerState(caseId, { markedEvidenceIds: updatedMarked });
    } catch (err) {
      console.error('Failed to sync marked evidence:', err);
    }
  };

  // Handle Notes Update
  const handleSaveNotes = async (notes: PlayerNote[]) => {
    if (!caseData || !caseId) return;

    setCaseData({
      ...caseData,
      playerState: {
        ...caseData.playerState,
        notes,
      },
    });

    setIsSavingNotes(true);
    try {
      await api.updatePlayerState(caseId, { notes });
    } catch (err) {
      console.error('Failed to sync notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Handle Accusation Submission
  const handleConfirmAccusation = async () => {
    if (!caseId || !accusingSuspect) return;

    setIsSubmittingAccusation(true);
    try {
      const solution = await api.submitAccusation(caseId, accusingSuspect.id);
      setReveal(solution);
      setAccusingSuspect(null);
      await fetchCase();
    } catch (err: any) {
      alert(`Accusation failed: ${err?.message || 'Server error'}`);
    } finally {
      setIsSubmittingAccusation(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-24">
        <div className="text-center space-y-4">
          <Compass className="w-10 h-10 text-amber-400 animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-400">Assembling Case Room...</p>
        </div>
      </div>
    );
  }

  if (error || !caseData) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-red-950/20 border border-red-800/60 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
        <h3 className="text-lg font-bold text-slate-100">Access Restricted</h3>
        <p className="text-xs text-red-300">{error || 'Investigation could not be located.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold hover:bg-slate-700"
        >
          Return to Terminal
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#080b11]">
      {/* Top Investigation Banner */}
      <div className="border-b border-slate-800/80 bg-[#0b0f19] px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <FictionalBadge />
              <GenreBadge genre={caseData.genre} />
              <DifficultyBadge difficulty={caseData.difficulty} />
              <span className="text-[11px] font-mono text-slate-500">
                Incident Time: {new Date(caseData.publicCase.incidentTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-slate-100">
              {caseData.title}
            </h1>
          </div>

          {/* Quick Accuse Banner action if not solved */}
          {!reveal && caseData.status === 'ready' && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">
                Deduce who did it:
              </span>
              <button
                onClick={() => {
                  if (caseData.publicCase.suspects[0]) {
                    setAccusingSuspect(caseData.publicCase.suspects[0]);
                  }
                }}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-md shadow-red-950/40 hover:scale-[1.02]"
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Submit Final Accusation</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 min-h-0">
        {reveal ? (
          <RevealScreen
            reveal={reveal}
            onExamineEvidenceId={(id) => {
              const clue = caseData.publicCase.evidence.find((e) => e.id === id);
              if (clue) setInspectingEvidence(clue);
            }}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
            {/* Left Column: Briefing & Suspects (4 cols) */}
            <div className="lg:col-span-4 space-y-4 overflow-y-auto pr-1">
              {/* Senior Briefing Card */}
              <div className="p-4 rounded-xl bg-[#0d121e] border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase text-amber-400">
                  <FileText className="w-4 h-4" />
                  <span>Case Briefing Memo</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {caseData.publicCase.briefing || caseData.publicCase.premise}
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
                  <span className="text-slate-500">Known Incident: </span>
                  {caseData.publicCase.incidentSummary}
                </div>
              </div>

              {/* Suspect Roster */}
              <SuspectList
                suspects={caseData.publicCase.suspects}
                selectedSuspectId={selectedSuspectId}
                onSelectSuspect={(id) => setSelectedSuspectId(id)}
                onInitiateAccusation={(suspect) => setAccusingSuspect(suspect)}
                isSolved={caseData.status === 'completed'}
              />
            </div>

            {/* Center Column: Evidence Docket (5 cols) */}
            <div className="lg:col-span-5 h-[650px] lg:h-full bg-[#0a0e17] p-4 rounded-2xl border border-slate-800">
              <EvidenceDocket
                evidence={caseData.publicCase.evidence}
                markedEvidenceIds={caseData.playerState.markedEvidenceIds || []}
                onToggleMarked={handleToggleMarked}
                onSelectEvidence={(evidence) => setInspectingEvidence(evidence)}
              />
            </div>

            {/* Right Column: Timeline & Notebook (3 cols) */}
            <div className="lg:col-span-3 space-y-4 overflow-y-auto pr-1">
              {/* Tab Selector */}
              <div className="flex p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono">
                <button
                  onClick={() => setRightTab('timeline')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-colors ${
                    rightTab === 'timeline'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Timeline</span>
                </button>
                <button
                  onClick={() => setRightTab('notes')}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg transition-colors ${
                    rightTab === 'notes'
                      ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Notes ({caseData.playerState.notes.length})</span>
                </button>
              </div>

              {/* Tab Content */}
              {rightTab === 'timeline' ? (
                <TimelineView
                  timeline={caseData.publicCase.timeline}
                  onSelectEvidenceId={(id) => {
                    const clue = caseData.publicCase.evidence.find((e) => e.id === id);
                    if (clue) setInspectingEvidence(clue);
                  }}
                />
              ) : (
                <NotebookView
                  notes={caseData.playerState.notes}
                  evidenceList={caseData.publicCase.evidence}
                  onSaveNotes={handleSaveNotes}
                  isSaving={isSavingNotes}
                />
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clue Detail Modal */}
      <EvidenceModal
        evidence={inspectingEvidence}
        isOpen={Boolean(inspectingEvidence)}
        onClose={() => setInspectingEvidence(null)}
        isMarked={Boolean(
          inspectingEvidence && caseData.playerState.markedEvidenceIds?.includes(inspectingEvidence.id),
        )}
        onToggleMarked={handleToggleMarked}
        onAddNote={() => setRightTab('notes')}
      />

      {/* Accusation Confirmation Dialog */}
      <AccusationDialog
        suspect={accusingSuspect}
        isOpen={Boolean(accusingSuspect)}
        onClose={() => setAccusingSuspect(null)}
        onConfirm={handleConfirmAccusation}
        isSubmitting={isSubmittingAccusation}
      />
    </div>
  );
}
