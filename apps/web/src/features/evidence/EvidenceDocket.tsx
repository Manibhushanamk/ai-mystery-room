import React, { useState } from 'react';
import type { PublicEvidence, EvidenceType } from '@ai-mystery-room/shared';
import { ReliabilityBadge } from '../../components/Badge.js';
import {
  MessageSquare,
  Video,
  FileText,
  Mic,
  Image as ImageIcon,
  Star,
  Search,
  Filter,
} from 'lucide-react';

interface EvidenceDocketProps {
  evidence: PublicEvidence[];
  markedEvidenceIds: string[];
  onToggleMarked: (evidenceId: string) => void;
  onSelectEvidence: (evidence: PublicEvidence) => void;
}

export function EvidenceDocket({
  evidence,
  markedEvidenceIds,
  onToggleMarked,
  onSelectEvidence,
}: EvidenceDocketProps) {
  const [filterType, setFilterType] = useState<EvidenceType | 'all' | 'marked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const typeIcons: Record<string, React.ReactNode> = {
    chat: <MessageSquare className="w-4 h-4 text-cyan-400" />,
    camera_log: <Video className="w-4 h-4 text-cyan-400" />,
    document: <FileText className="w-4 h-4 text-amber-400" />,
    witness_statement: <Mic className="w-4 h-4 text-amber-400" />,
    image: <ImageIcon className="w-4 h-4 text-emerald-400" />,
    timeline: <FileText className="w-4 h-4 text-slate-400" />,
  };

  const filteredEvidence = evidence.filter((item) => {
    if (filterType === 'marked' && !markedEvidenceIds.includes(item.id)) return false;
    if (filterType !== 'all' && filterType !== 'marked' && item.type !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.sourceLabel.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & Search */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-base text-slate-100 flex items-center gap-2">
              <Filter className="w-4 h-4 text-amber-400" />
              <span>Evidence Docket</span>
            </h3>
            <span className="text-xs font-mono text-slate-500">({evidence.length} Items)</span>
          </div>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search clues, logs, transcripts..."
            className="w-full bg-[#0a0e17] border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60 transition-colors"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 text-[11px] font-mono">
          {(
            [
              { id: 'all', label: 'All' },
              { id: 'marked', label: `Marked (${markedEvidenceIds.length})` },
              { id: 'chat', label: 'Chats' },
              { id: 'camera_log', label: 'CCTV' },
              { id: 'document', label: 'Documents' },
              { id: 'witness_statement', label: 'Witnesses' },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id as any)}
              className={`px-2.5 py-1 rounded-md transition-colors border ${
                filterType === tab.id
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 font-semibold'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-400 border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Scrollable List */}
      <div className="flex-1 space-y-2.5 overflow-y-auto pr-1">
        {filteredEvidence.length === 0 ? (
          <div className="text-center py-12 text-slate-500 text-xs font-mono">
            No clues match current filters.
          </div>
        ) : (
          filteredEvidence.map((item) => {
            const isMarked = markedEvidenceIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => onSelectEvidence(item)}
                className={`group p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isMarked
                    ? 'bg-[#151c2c] border-amber-500/40 hover:border-amber-400/80'
                    : 'bg-[#0e1320] hover:bg-[#121929] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded bg-slate-800/80 border border-slate-700/60">
                      {typeIcons[item.type] || <FileText className="w-4 h-4 text-slate-400" />}
                    </span>
                    <span className="font-mono text-[11px] text-amber-400/90 font-semibold">
                      {item.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <ReliabilityBadge level={item.reliability} />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleMarked(item.id);
                      }}
                      className="p-1 text-slate-400 hover:text-amber-400 transition-colors"
                      aria-label={isMarked ? 'Unmark clue' : 'Mark clue'}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isMarked ? 'fill-amber-400 text-amber-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <h4 className="font-bold text-xs text-slate-100 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                  {item.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed mb-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-slate-800/60 pt-2">
                  <span>{item.sourceLabel}</span>
                  <span className="text-amber-400 group-hover:translate-x-0.5 transition-transform">
                    Inspect Clue →
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
