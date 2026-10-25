import type { EvidenceAsset } from '@ai-mystery-room/shared';

export class EvidenceAssetService {
  /**
   * Generates a descriptive simulated asset placeholder for an evidence card.
   */
  public static createPlaceholder(params: {
    type: string;
    title: string;
    description: string;
  }): EvidenceAsset {
    return {
      kind: 'placeholder',
      altText: `Simulated forensic ${params.type} record: ${params.title}. ${params.description}`,
      status: 'ready',
    };
  }

  /**
   * Returns an SVG data URL for a simulated CCTV surveillance snapshot.
   */
  public static createCCTVSnapshotSVG(cameraCode: string, timestamp: string, location: string): string {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="640" height="360" viewBox="0 0 640 360">
        <rect width="640" height="360" fill="#0b0f19"/>
        <line x1="0" y1="90" x2="640" y2="90" stroke="#1e293b" stroke-width="1" stroke-dasharray="4"/>
        <line x1="0" y1="180" x2="640" y2="180" stroke="#1e293b" stroke-width="1" stroke-dasharray="4"/>
        <line x1="0" y1="270" x2="640" y2="270" stroke="#1e293b" stroke-width="1" stroke-dasharray="4"/>
        <text x="24" y="40" font-family="monospace" font-size="14" fill="#06b6d4" font-weight="bold">REC ● ${cameraCode}</text>
        <text x="616" y="40" font-family="monospace" font-size="14" fill="#06b6d4" text-anchor="end">${timestamp}</text>
        <text x="24" y="330" font-family="monospace" font-size="12" fill="#94a3b8">${location.toUpperCase()}</text>
        <text x="616" y="330" font-family="monospace" font-size="11" fill="#f59e0b" text-anchor="end">[ FICTIONAL SIMULATION ]</text>
        <rect x="220" y="100" width="200" height="160" fill="none" stroke="#06b6d4" stroke-width="1" stroke-opacity="0.3"/>
        <text x="320" y="185" font-family="monospace" font-size="12" fill="#64748b" text-anchor="middle">OPTICAL MOTION SENSOR LOCK</text>
      </svg>
    `.trim();

    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }
}
