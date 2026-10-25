import type { ReliabilityLevel, Difficulty, Genre } from '@ai-mystery-room/shared';

interface FictionalBadgeProps {
  className?: string;
}

export function FictionalBadge({ className = '' }: FictionalBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider uppercase font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/30 ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      FICTIONAL SIMULATION
    </span>
  );
}

export function ReliabilityBadge({ level }: { level: ReliabilityLevel }) {
  const styles = {
    high: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    medium: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    low: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    unknown: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
  }[level] || 'bg-slate-500/10 text-slate-400 border-slate-500/30';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider border ${styles}`}>
      Reliability: {level}
    </span>
  );
}

export function DifficultyBadge({ difficulty }: { difficulty: Difficulty }) {
  const styles = {
    easy: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
    medium: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
    hard: 'text-red-400 border-red-500/30 bg-red-500/10',
  }[difficulty] || 'text-slate-400 border-slate-500/30 bg-slate-500/10';

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider border ${styles}`}>
      {difficulty}
    </span>
  );
}

export function GenreBadge({ genre }: { genre: Genre }) {
  const labels: Record<Genre, string> = {
    classic_mystery: 'Classic Mystery',
    locked_room: 'Locked Room',
    campus: 'Campus',
    workplace: 'Workplace',
    heist: 'Heist',
    sci_fi: 'Sci-Fi',
    thriller: 'Thriller',
  };

  return (
    <span className="px-2 py-0.5 rounded text-xs font-mono uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700/60">
      {labels[genre] || genre}
    </span>
  );
}
