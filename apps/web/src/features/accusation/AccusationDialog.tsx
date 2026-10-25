import type { PublicSuspect } from '@ai-mystery-room/shared';
import { Modal } from '../../components/Modal.js';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface AccusationDialogProps {
  suspect: PublicSuspect | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSubmitting: boolean;
}

export function AccusationDialog({
  suspect,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting,
}: AccusationDialogProps) {
  if (!suspect) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-lg"
      title={
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert className="w-5 h-5 text-red-500 animate-pulse" />
          <span>Final Accusation Warning</span>
        </div>
      }
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-900/60 space-y-2">
          <div className="flex items-center gap-2 text-red-400 text-xs font-mono font-bold uppercase">
            <AlertTriangle className="w-4 h-4" />
            <span>High Stakes: Irreversible Action</span>
          </div>
          <p className="text-xs text-red-200/90 leading-relaxed">
            You are about to submit your official accusation against{' '}
            <strong className="text-white font-bold">{suspect.name}</strong> ({suspect.role}).
            In accordance with fair-play investigation rules, accusations are{' '}
            <strong>one-shot</strong> and cannot be altered once submitted.
          </p>
        </div>

        {/* Suspect Recap */}
        <div className="p-4 rounded-xl bg-[#0a0d15] border border-slate-800 space-y-2 text-xs">
          <div className="flex items-center justify-between text-slate-400 font-mono">
            <span className="text-slate-200 font-bold">{suspect.name}</span>
            <span className="text-amber-400">{suspect.id}</span>
          </div>
          <div className="text-slate-400 text-[11px] leading-relaxed">
            <span className="text-slate-500 font-mono">Stated Alibi: </span>
            {suspect.statedAlibi}
          </div>
          <div className="text-slate-400 text-[11px] leading-relaxed">
            <span className="text-slate-500 font-mono">Public Motive: </span>
            {suspect.publicMotive}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            Review Evidence More
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-950/50 transition-all hover:scale-[1.02] disabled:opacity-50"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>{isSubmitting ? 'Verifying Accusation...' : 'Confirm Accusation'}</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
