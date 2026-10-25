import { Link } from 'react-router-dom';
import type { SolutionReveal } from '@ai-mystery-room/shared';
import { CheckCircle2, XCircle, ShieldCheck, Tag, PlusCircle, ArrowLeft } from 'lucide-react';

interface RevealScreenProps {
  reveal: SolutionReveal;
  onExamineEvidenceId?: (id: string) => void;
}

export function RevealScreen({ reveal, onExamineEvidenceId }: RevealScreenProps) {
  const isCorrect = reveal.result === 'correct';

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-6">
      {/* Verdict Banner */}
      <div
        className={`p-6 rounded-2xl border text-center space-y-3 shadow-2xl ${
          isCorrect
            ? 'bg-emerald-950/20 border-emerald-500/40 shadow-emerald-950/20'
            : 'bg-red-950/20 border-red-500/40 shadow-red-950/20'
        }`}
      >
        <div className="inline-flex p-3 rounded-full bg-slate-900 border border-slate-800">
          {isCorrect ? (
            <CheckCircle2 className="w-10 h-10 text-emerald-400" />
          ) : (
            <XCircle className="w-10 h-10 text-red-400" />
          )}
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100">
          {isCorrect ? 'Case Solved: Accusation Confirmed' : 'Incorrect Accusation'}
        </h2>

        <p className="text-sm max-w-xl mx-auto text-slate-300 leading-relaxed">
          {isCorrect
            ? `Your deduction was precise. You correctly identified ${reveal.culprit.name} as the perpetrator.`
            : `You accused a suspect who was innocent. The actual culprit was ${reveal.culprit.name}. Examine the breakdown below to see the hidden chain of evidence.`}
        </p>
      </div>

      {/* Culprit Profile & Method */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Motive card */}
        <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold uppercase text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>True Motive</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{reveal.motive}</p>
        </div>

        {/* Method card */}
        <div className="p-5 rounded-xl bg-[#0e1320] border border-slate-800 space-y-2">
          <div className="text-xs font-mono font-bold uppercase text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Method of the Incident</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-sans">{reveal.method}</p>
        </div>
      </div>

      {/* Full Narrative Explanation */}
      <div className="p-6 rounded-xl bg-[#0c101a] border border-slate-800 space-y-3">
        <h3 className="font-bold text-sm text-slate-100 uppercase font-mono tracking-wider text-amber-400">
          Official Case Resolution
        </h3>
        <p className="text-xs md:text-sm text-slate-200 leading-relaxed whitespace-pre-line font-sans">
          {reveal.solutionExplanation}
        </p>
      </div>

      {/* Evidence Reasoning Citations */}
      <div className="space-y-3">
        <h3 className="font-bold text-sm text-slate-100 font-mono uppercase tracking-wider flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-400" />
          <span>Evidence Chain & Reasoning</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {reveal.evidenceReasoning.map((item, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0d121e] border border-slate-800 space-y-2 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-amber-400">
                  {item.evidenceId}
                </span>
                {onExamineEvidenceId && (
                  <button
                    onClick={() => onExamineEvidenceId(item.evidenceId)}
                    className="text-[10px] font-mono text-cyan-400 hover:underline"
                  >
                    View Clue →
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Debunked Red Herrings */}
      {reveal.debunkedRedHerrings && reveal.debunkedRedHerrings.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm text-slate-100 font-mono uppercase tracking-wider text-slate-400">
            Debunked Red Herrings & Exculpations
          </h3>
          <div className="space-y-2">
            {reveal.debunkedRedHerrings.map((rh, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[#090d16] border border-slate-800/80 text-xs text-slate-400 leading-relaxed"
              >
                <span className="font-mono text-amber-400 font-semibold block mb-0.5">
                  {rh.suspectId ? `Suspect ${rh.suspectId}: ` : 'Fair Red Herring: '}
                </span>
                {rh.explanation}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
        <Link
          to="/my-cases"
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors border border-slate-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Case Archives</span>
        </Link>

        <Link
          to="/create"
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md shadow-amber-500/20 hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Start New Investigation</span>
        </Link>
      </div>
    </div>
  );
}
