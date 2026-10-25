import type { CameraLogContent, EvidenceAsset } from '@ai-mystery-room/shared';
import { Video, Clock, MapPin, Eye } from 'lucide-react';

interface CameraLogViewerProps {
  content: CameraLogContent;
  asset?: EvidenceAsset;
  title: string;
}

export function CameraLogViewer({ content, asset, title }: CameraLogViewerProps) {
  const observations = content?.observations || [];

  return (
    <div className="space-y-4">
      {/* CCTV HUD Header */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-[#0d131f] border border-cyan-900/60 text-xs font-mono">
        <div className="flex items-center gap-2 text-cyan-400 font-bold">
          <Video className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>{content?.cameraCode || 'CAM-REC'}</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400 text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>{content?.eventTime || '00:00'}</span>
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{content?.location || 'Secured Corridor'}</span>
          </span>
        </div>
      </div>

      {/* Simulated Surveillance Graphic */}
      {asset?.url && (
        <div className="relative rounded-xl overflow-hidden border border-slate-700/80 bg-black">
          <img
            src={asset.url}
            alt={asset.altText || title}
            className="w-full h-auto object-cover max-h-[240px]"
          />
          <div className="absolute bottom-2 left-3 text-[10px] font-mono text-cyan-400/80 bg-black/60 px-2 py-0.5 rounded">
            SIMULATED STILL CAPTURE
          </div>
        </div>
      )}

      {/* Frame observation notes */}
      {content?.stillSnapshotSummary && (
        <div className="p-3 rounded-lg bg-[#141b2b] border border-slate-700/60 text-xs text-slate-300">
          <span className="font-mono text-amber-400 font-semibold block mb-1">
            Optical Analysis:
          </span>
          {content.stillSnapshotSummary}
        </div>
      )}

      {/* Observations list */}
      <div className="p-4 rounded-xl bg-[#090d15] border border-slate-800 space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-300 mb-2">
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>Telemetry & Motion Log</span>
        </div>
        <ul className="space-y-1.5 text-xs text-slate-300">
          {observations.map((obs, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-cyan-500 font-mono">[{i + 1}]</span>
              <span className="leading-relaxed">{obs}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
