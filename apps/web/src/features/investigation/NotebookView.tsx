import React, { useState } from 'react';
import type { PlayerNote, PublicEvidence } from '@ai-mystery-room/shared';
import { BookOpen, Plus, Trash2, Tag, Check } from 'lucide-react';

interface NotebookViewProps {
  notes: PlayerNote[];
  evidenceList: PublicEvidence[];
  activeEvidenceId?: string;
  onSaveNotes: (notes: PlayerNote[]) => void;
  isSaving?: boolean;
}

export function NotebookView({
  notes,
  evidenceList,
  activeEvidenceId,
  onSaveNotes,
  isSaving = false,
}: NotebookViewProps) {
  const [newText, setNewText] = useState('');
  const [selectedClueId, setSelectedClueId] = useState(activeEvidenceId || '');

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const newNote: PlayerNote = {
      id: `note_${Date.now()}`,
      evidenceId: selectedClueId || undefined,
      text: newText.trim(),
      updatedAt: new Date().toISOString(),
    };

    onSaveNotes([newNote, ...notes]);
    setNewText('');
  };

  const handleDeleteNote = (noteId: string) => {
    onSaveNotes(notes.filter((n) => n.id !== noteId));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-1">
        <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Case Notebook</span>
        </h3>
        <span className="text-[11px] font-mono text-slate-500 flex items-center gap-1">
          {isSaving ? (
            <span className="text-amber-400 animate-pulse">Syncing...</span>
          ) : (
            <>
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Saved</span>
            </>
          )}
        </span>
      </div>

      {/* Add note input card */}
      <form onSubmit={handleAddNote} className="p-3 rounded-xl bg-[#0b0f19] border border-slate-800 space-y-2.5">
        <textarea
          rows={2}
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Record deduction, timestamp conflict, or theory..."
          className="w-full bg-[#111726] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/60"
        />

        <div className="flex items-center justify-between gap-2">
          <select
            value={selectedClueId}
            onChange={(e) => setSelectedClueId(e.target.value)}
            className="bg-[#111726] border border-slate-700/80 rounded-md px-2 py-1 text-[11px] font-mono text-slate-400 focus:outline-none focus:border-amber-500 max-w-[180px] truncate"
          >
            <option value="">(Optional) Link to Clue</option>
            {evidenceList.map((e) => (
              <option key={e.id} value={e.id}>
                {e.id}: {e.title.slice(0, 20)}...
              </option>
            ))}
          </select>

          <button
            type="submit"
            disabled={!newText.trim()}
            className="flex items-center gap-1 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 font-bold px-3 py-1 rounded-md text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Note</span>
          </button>
        </div>
      </form>

      {/* Notes stream */}
      <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
        {notes.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono">
            No notes added yet. Jot down deductions as you examine clues.
          </div>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="p-3 rounded-xl bg-[#0d121e] border border-slate-800 hover:border-slate-700/80 transition-colors space-y-1.5"
            >
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>{new Date(note.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                <div className="flex items-center gap-2">
                  {note.evidenceId && (
                    <span className="flex items-center gap-1 text-amber-400/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                      <Tag className="w-3 h-3" />
                      <span>{note.evidenceId}</span>
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-slate-500 hover:text-red-400 transition-colors"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-200 leading-relaxed font-sans">{note.text}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
