import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import type { CaseSummaryItem } from '@ai-mystery-room/shared';
import { GenreBadge, DifficultyBadge } from '../../components/Badge.js';
import { FolderKanban, Trash2, ArrowRight, PlusCircle, CheckCircle2, Clock } from 'lucide-react';

export function MyCasesView() {
  const [cases, setCases] = useState<CaseSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCases = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.listCases();
      setCases(res.cases || []);
    } catch (err: any) {
      setError(err?.message || 'Could not load saved cases.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCases();
  }, []);

  const handleDelete = async (caseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this investigation?')) return;

    try {
      await api.deleteCase(caseId);
      setCases((prev) => prev.filter((c) => c.id !== caseId));
    } catch (err: any) {
      alert(`Deletion failed: ${err?.message || 'Server error'}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center font-mono text-xs text-slate-500">
        Loading case dossiers...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2.5">
            <FolderKanban className="w-6 h-6 text-amber-400" />
            <span>Case Archives</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Ongoing investigations and solved mysteries linked to your session.
          </p>
        </div>

        <Link
          to="/create"
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Mystery</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/30 border border-red-800 text-xs text-red-200">
          {error}
        </div>
      )}

      {cases.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1422] border border-slate-800 space-y-4">
          <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 mx-auto">
            <FolderKanban className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-200">No Open Investigations</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't commissioned any mystery rooms yet. Provide a scenario seed to get started.
            </p>
          </div>
          <Link
            to="/create"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create First Case</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {cases.map((c) => {
            const isCompleted = c.status === 'completed';
            const destination =
              c.status === 'ready' || c.status === 'completed'
                ? `/investigate/${c.id}`
                : `/cases/${c.id}/generating`;

            return (
              <Link
                key={c.id}
                to={destination}
                className="group p-4 rounded-xl bg-[#0e1320] hover:bg-[#141b2c] border border-slate-800 hover:border-slate-700 transition-all block space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <GenreBadge genre={c.genre} />
                    <DifficultyBadge difficulty={c.difficulty} />
                  </div>

                  <div className="flex items-center gap-2">
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Solved</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                        <Clock className="w-3 h-3" />
                        <span>Active</span>
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => handleDelete(c.id, e)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                      aria-label="Delete case"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                    {c.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono truncate">
                    {c.setting || 'Fictional Setting'}
                  </p>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-2 border-t border-slate-800/80">
                  <span>Created {new Date(c.createdAt).toLocaleDateString()}</span>
                  <span className="text-amber-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect Desk</span>
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
