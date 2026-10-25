import type { PublicEvidence } from '@ai-mystery-room/shared';
import { Modal } from '../../components/Modal.js';
import { FictionalBadge, ReliabilityBadge } from '../../components/Badge.js';
import { ChatViewer } from './ChatViewer.js';
import { CameraLogViewer } from './CameraLogViewer.js';
import { DocumentViewer } from './DocumentViewer.js';
import { WitnessStatementViewer } from './WitnessStatementViewer.js';
import { Star, Clock, Tag } from 'lucide-react';

interface EvidenceModalProps {
  evidence: PublicEvidence | null;
  isOpen: boolean;
  onClose: () => void;
  isMarked: boolean;
  onToggleMarked: (evidenceId: string) => void;
  onAddNote: (evidenceId: string) => void;
}

export function EvidenceModal({
  evidence,
  isOpen,
  onClose,
  isMarked,
  onToggleMarked,
  onAddNote,
}: EvidenceModalProps) {
  if (!evidence) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-3xl"
      title={
        <div className="flex items-center gap-3">
          <span className="font-mono text-xs uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
            {evidence.id}
          </span>
          <span className="truncate">{evidence.title}</span>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Top Badges & Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg bg-[#0a0d15] border border-slate-800 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <FictionalBadge />
            <ReliabilityBadge level={evidence.reliability} />
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date(evidence.createdAtInStory).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || evidence.createdAtInStory}</span>
            </span>
            <span className="flex items-center gap-1 font-mono text-slate-400">
              <Tag className="w-3.5 h-3.5 text-slate-500" />
              <span>{evidence.sourceLabel}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleMarked(evidence.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs transition-colors border ${
                isMarked
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${isMarked ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>{isMarked ? 'Marked Clue' : 'Mark as Key Clue'}</span>
            </button>
            <button
              onClick={() => {
                onAddNote(evidence.id);
                onClose();
              }}
              className="px-3 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono text-xs transition-colors"
            >
              Add Note
            </button>
          </div>
        </div>

        {/* Clue Description */}
        <div className="text-xs text-slate-300 leading-relaxed bg-[#111624] p-3.5 rounded-lg border border-slate-800">
          <span className="text-amber-400/90 font-mono font-bold block mb-1 uppercase text-[11px]">
            Investigator Observation:
          </span>
          {evidence.description}
        </div>

        {/* Specialized Content Viewers */}
        <div className="pt-2">
          {evidence.type === 'chat' && (
            <ChatViewer content={evidence.content as any} title={evidence.title} />
          )}
          {evidence.type === 'camera_log' && (
            <CameraLogViewer
              content={evidence.content as any}
              asset={evidence.asset}
              title={evidence.title}
            />
          )}
          {evidence.type === 'document' && (
            <DocumentViewer content={evidence.content as any} title={evidence.title} />
          )}
          {evidence.type === 'witness_statement' && (
            <WitnessStatementViewer content={evidence.content as any} title={evidence.title} />
          )}
          {evidence.type === 'image' && (
            <div className="space-y-3">
              {evidence.asset?.url && (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-black">
                  <img
                    src={evidence.asset.url}
                    alt={evidence.asset.altText || evidence.title}
                    className="w-full max-h-[360px] object-contain"
                  />
                </div>
              )}
              <div className="p-3 bg-slate-900 rounded-lg text-xs text-slate-300 font-mono">
                Visual Artifact Tag: {evidence.title}
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
