import type { PublicSuspect } from '@ai-mystery-room/shared';
import { User, ShieldAlert } from 'lucide-react';

interface SuspectListProps {
  suspects: PublicSuspect[];
  selectedSuspectId: string | null;
  onSelectSuspect: (suspectId: string) => void;
  onInitiateAccusation: (suspect: PublicSuspect) => void;
  isSolved?: boolean;
}

export function SuspectList({
  suspects,
  selectedSuspectId,
  onSelectSuspect,
  onInitiateAccusation,
  isSolved = false,
}: SuspectListProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <User className="w-4 h-4 text-amber-400" />
          <span>Suspect Roster</span>
        </h3>
        <span className="text-xs font-mono text-slate-500">{suspects.length} Persons of Interest</span>
      </div>

      <div className="space-y-2.5">
        {suspects.map((suspect) => {
          const isSelected = selectedSuspectId === suspect.id;

          return (
            <div
              key={suspect.id}
              onClick={() => onSelectSuspect(suspect.id)}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#181f30] border-amber-500/70 shadow-lg shadow-amber-950/20'
                  : 'bg-[#0e1320] hover:bg-[#131a29] border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 font-mono text-xs font-bold">
                    {suspect.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-slate-100">{suspect.name}</h4>
                    <p className="text-[11px] font-mono text-amber-400/90">{suspect.role}</p>
                  </div>
                </div>

                <span className="font-mono text-[10px] text-slate-500 uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800">
                  {suspect.id}
                </span>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed mb-2.5 line-clamp-2">
                {suspect.bio}
              </p>

              <div className="space-y-1 text-[11px] border-t border-slate-800/80 pt-2 mb-3">
                <div className="text-slate-300 flex items-start gap-1">
                  <span className="font-mono text-slate-500 shrink-0">Alibi:</span>
                  <span className="italic line-clamp-1">{suspect.statedAlibi}</span>
                </div>
                <div className="text-slate-300 flex items-start gap-1">
                  <span className="font-mono text-amber-400/80 shrink-0">Motive:</span>
                  <span className="line-clamp-1 text-slate-400">{suspect.publicMotive}</span>
                </div>
              </div>

              {!isSolved && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onInitiateAccusation(suspect);
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition-all bg-red-950/40 hover:bg-red-900/60 text-red-200 border border-red-800/50 hover:border-red-600"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>Accuse {suspect.name.split(' ')[0]}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
