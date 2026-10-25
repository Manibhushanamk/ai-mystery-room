import type { PublicTimelineEvent } from '@ai-mystery-room/shared';
import { Clock, CheckCircle2, HelpCircle } from 'lucide-react';

interface TimelineViewProps {
  timeline: PublicTimelineEvent[];
  onSelectEvidenceId?: (id: string) => void;
}

export function TimelineView({ timeline, onSelectEvidenceId }: TimelineViewProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          <span>Master Timeline</span>
        </h3>
        <span className="text-xs font-mono text-slate-500">{timeline.length} Recorded Milestones</span>
      </div>

      <div className="relative pl-4 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
        {timeline.map((event) => (
          <div key={event.id} className="relative group">
            {/* Timeline node */}
            <div
              className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full border-2 ${
                event.verified
                  ? 'border-emerald-500 bg-emerald-950'
                  : 'border-slate-600 bg-slate-900'
              }`}
            />

            <div className="p-3 rounded-xl bg-[#0c111c] border border-slate-800 group-hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-cyan-400">
                  {event.time}
                </span>
                <span
                  className={`inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    event.verified
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {event.verified ? (
                    <>
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </>
                  ) : (
                    <>
                      <HelpCircle className="w-3 h-3" />
                      <span>Unverified Claim</span>
                    </>
                  )}
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-2">{event.description}</p>

              {event.relatedEvidenceIds && event.relatedEvidenceIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500">Related Clues:</span>
                  {event.relatedEvidenceIds.map((eId) => (
                    <button
                      key={eId}
                      type="button"
                      onClick={() => onSelectEvidenceId?.(eId)}
                      className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 text-[10px] font-mono transition-colors"
                    >
                      {eId}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
