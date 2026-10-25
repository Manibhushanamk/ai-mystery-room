import type { DocumentContent } from '@ai-mystery-room/shared';
import { FileText, Stamp, AlertCircle } from 'lucide-react';

interface DocumentViewerProps {
  content: DocumentContent;
  title: string;
}

export function DocumentViewer({ content, title }: DocumentViewerProps) {
  const sections = content?.bodySections || [];

  return (
    <div className="space-y-4 font-sans">
      {/* Formal Document Dossier Header */}
      <div className="p-4 rounded-xl bg-[#111726] border border-slate-700/80 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
          <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{content?.documentTitle || title}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-[10px] font-mono text-red-400 uppercase font-bold">
            <Stamp className="w-3.5 h-3.5" />
            <span>EXHIBIT FILE</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
          <div>
            <span className="text-slate-500">ISSUING ENTITY:</span> {content?.issuer || 'Internal Audit'}
          </div>
          <div>
            <span className="text-slate-500">DATE ISSUED:</span> {content?.dateIssued || 'Recent'}
          </div>
        </div>
      </div>

      {/* Structured Sections */}
      <div className="p-5 rounded-xl bg-[#090d15] border border-slate-800 space-y-4">
        {sections.map((sec, i) => (
          <div key={i} className="border-b border-slate-800/80 pb-3 last:border-b-0 last:pb-0">
            <h4 className="text-xs font-mono font-bold text-amber-400/90 uppercase tracking-wider mb-1.5">
              {sec.header}
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed font-sans">{sec.content}</p>
          </div>
        ))}

        {content?.redactedNotes && (
          <div className="p-3 rounded-lg bg-red-950/20 border border-red-900/40 text-xs text-red-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <div>
              <span className="font-mono font-bold uppercase block mb-0.5">Classification Notice:</span>
              {content.redactedNotes}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
