import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../lib/api.js';
import { LoadingRadar } from '../../components/LoadingRadar.js';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';
import type { CaseStatusResponse } from '@ai-mystery-room/shared';

export function GenerationScreen() {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();

  const [status, setStatus] = useState<CaseStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!caseId) return;

    let isMounted = true;
    let timer: any = null;

    async function poll() {
      try {
        const res = await api.getCaseStatus(caseId!);
        if (!isMounted) return;

        setStatus(res);

        if (res.status === 'ready' || res.status === 'completed') {
          // Finished! Route to investigation room
          setTimeout(() => {
            if (isMounted) navigate(`/investigate/${caseId}`);
          }, 800);
          return;
        }

        if (res.status === 'failed') {
          setError(res.error || 'Case generation failed consistency checks.');
          return;
        }

        // Poll again
        timer = setTimeout(poll, 1500);
      } catch (err: any) {
        if (!isMounted) return;
        setError(err?.message || 'Error checking case generation progress.');
      }
    }

    poll();

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, [caseId, navigate]);

  if (error) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 rounded-2xl bg-red-950/20 border border-red-800/60 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-900/30 border border-red-700/60 flex items-center justify-center text-red-400 mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-100">Generation Interrupted</h3>
        <p className="text-xs text-red-300 leading-relaxed font-sans">{error}</p>

        <div className="flex items-center justify-center gap-3 pt-4 border-t border-red-900/40">
          <Link
            to="/create"
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Creator</span>
          </Link>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <LoadingRadar
        stage={status?.stage || 'Initializing mystery generator...'}
        progress={status?.progress || 10}
      />
    </div>
  );
}
