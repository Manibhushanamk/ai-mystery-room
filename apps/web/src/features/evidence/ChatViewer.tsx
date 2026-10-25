import type { ChatContent } from '@ai-mystery-room/shared';
import { MessageSquare, Shield } from 'lucide-react';

interface ChatViewerProps {
  content: ChatContent;
  title: string;
}

export function ChatViewer({ content, title }: ChatViewerProps) {
  const messages = content?.messages || [];
  const participants = content?.participants || [];

  return (
    <div className="space-y-4">
      {/* Header bar simulating decrypted messaging thread */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-[#161e2e] border border-slate-700/60 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400">
          <MessageSquare className="w-4 h-4" />
          <span className="font-bold">{title}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
          <Shield className="w-3.5 h-3.5 text-amber-400" />
          <span>Fictional Export ({participants.length} Participants)</span>
        </div>
      </div>

      {/* Message Bubble Thread */}
      <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800 space-y-3 max-h-[380px] overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-slate-500 text-xs text-center py-6">No chat messages recovered.</p>
        ) : (
          messages.map((msg, i) => {
            const isFirstParticipant = participants[0]?.name === msg.senderName;
            return (
              <div
                key={i}
                className={`flex flex-col ${isFirstParticipant ? 'items-start' : 'items-end'}`}
              >
                <div className="flex items-center gap-2 mb-1 text-[11px] font-mono text-slate-400">
                  <span className="font-semibold text-slate-300">{msg.senderName}</span>
                  <span>•</span>
                  <span>{msg.timestamp}</span>
                </div>
                <div
                  className={`p-3 rounded-xl max-w-[85%] text-xs leading-relaxed ${
                    isFirstParticipant
                      ? 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700/60'
                      : 'bg-amber-950/40 text-amber-100 rounded-tr-none border border-amber-700/50'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
