import { Compass, CheckCircle2 } from 'lucide-react';

interface LoadingRadarProps {
  stage: string;
  progress: number;
}

export function LoadingRadar({ stage, progress }: LoadingRadarProps) {
  const stages = [
    { label: 'Analyzing Scenario & Establishing Canonical Truth', threshold: 25 },
    { label: 'Creating Suspect Dossiers & Alibis', threshold: 50 },
    { label: 'Synthesizing Forensic Evidence & CCTV Logs', threshold: 75 },
    { label: 'Running Deterministic Consistency Validation', threshold: 90 },
  ];

  return (
    <div className="flex flex-col items-center max-w-md mx-auto text-center space-y-8 p-8 bg-[#0f141f] border border-slate-800 rounded-2xl shadow-2xl">
      {/* Animated Radar Pulse */}
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border border-amber-500/20 animate-ping" />
        <div className="absolute inset-2 rounded-full border border-amber-500/40 animate-pulse" />
        <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/50 flex items-center justify-center text-amber-400">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      <div className="space-y-2 w-full">
        <h3 className="text-xl font-bold tracking-tight text-slate-100">
          Generating Investigation
        </h3>
        <p className="text-xs font-mono text-amber-400/90">{stage}</p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-2 overflow-hidden mt-4 border border-slate-700/40">
          <div
            className="bg-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(progress, 5)}%` }}
          />
        </div>
        <div className="text-right text-[11px] font-mono text-slate-500">{progress}%</div>
      </div>

      {/* Honest Stage Checklist */}
      <div className="w-full space-y-2.5 text-left border-t border-slate-800/80 pt-4">
        {stages.map((st, i) => {
          const isDone = progress >= st.threshold;
          const isCurrent = progress < st.threshold && (i === 0 || progress >= stages[i - 1].threshold);

          return (
            <div key={st.label} className="flex items-center gap-2.5 text-xs">
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? 'border-amber-400 bg-amber-500/20'
                      : 'border-slate-700 bg-slate-800/40'
                  }`}
                >
                  {isCurrent && <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />}
                </div>
              )}
              <span
                className={
                  isDone
                    ? 'text-slate-300 font-medium'
                    : isCurrent
                    ? 'text-amber-300 font-semibold'
                    : 'text-slate-500'
                }
              >
                {st.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
