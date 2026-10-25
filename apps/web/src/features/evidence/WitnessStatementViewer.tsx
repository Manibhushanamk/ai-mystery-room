import type { WitnessStatementContent } from '@ai-mystery-room/shared';
import { Mic, UserCheck, Quote } from 'lucide-react';

interface WitnessStatementViewerProps {
  content: WitnessStatementContent;
  title: string;
}

export function WitnessStatementViewer({ content }: WitnessStatementViewerProps) {
  const keyClaims = content?.keyClaims || [];

  return (
    <div className="space-y-4">
      {/* Deposition Header */}
      <div className="p-3 rounded-lg bg-[#161e2e] border border-slate-700/60 flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-400 font-bold">
          <Mic className="w-4 h-4 text-amber-400" />
          <span>INTERVIEW: {content?.witnessName || 'Witness'}</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Recorded: {content?.interviewTime || 'Evening'} by {content?.interviewer || 'Investigator'}
        </div>
      </div>

      {/* Transcript Block */}
      <div className="p-5 rounded-xl bg-[#090d15] border border-slate-800 space-y-3">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-400">
          <Quote className="w-4 h-4 text-amber-400" />
          <span>Recorded Verbal Testimony</span>
        </div>
        <blockquote className="text-xs text-slate-200 leading-relaxed italic border-l-2 border-amber-500/60 pl-3">
          "{content?.statementTranscript || 'No transcript record available.'}"
        </blockquote>
      </div>

      {/* Key Claims Checklist */}
      {keyClaims.length > 0 && (
        <div className="p-4 rounded-xl bg-[#0f1422] border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-emerald-400 mb-1">
            <UserCheck className="w-4 h-4" />
            <span>Noted Witness Assertions</span>
          </div>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {keyClaims.map((claim, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-emerald-500 font-mono">•</span>
                <span className="leading-relaxed">{claim}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
