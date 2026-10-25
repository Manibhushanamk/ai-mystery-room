import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GENRES,
  DIFFICULTIES,
  EVIDENCE_TYPES,
  type Genre,
  type Difficulty,
  type EvidenceType,
} from '@ai-mystery-room/shared';
import { api } from '../../lib/api.js';
import { Sparkles, Shield, AlertCircle, Compass } from 'lucide-react';

const PRESETS = [
  {
    title: 'The Quantum Core Breach',
    genre: 'campus' as Genre,
    difficulty: 'medium' as Difficulty,
    setting: 'Apex Advanced Research Laboratory, Campus North',
    scenario:
      'A prototype quantum computing core is stolen from the high-security basement vault of Apex Laboratory the night before its first public demonstration.',
  },
  {
    title: 'Locked Room at Blackwood Manor',
    genre: 'locked_room' as Genre,
    difficulty: 'hard' as Difficulty,
    setting: 'Blackwood Estate, Scottish Highlands',
    scenario:
      'Lord Sterling was found poisoned inside his private study. All heavy oak doors were bolted from the inside, and snow outside the windows showed zero footprints.',
  },
  {
    title: 'The Midnight Gallery Heist',
    genre: 'heist' as Genre,
    difficulty: 'easy' as Difficulty,
    setting: 'Metropolitan Museum of Contemporary Art',
    scenario:
      'A priceless renaissance painting was replaced with a forged replica during a scheduled 4-minute security camera server backup at midnight.',
  },
];

export function ScenarioForm() {
  const navigate = useNavigate();

  const [scenario, setScenario] = useState('');
  const [genre, setGenre] = useState<Genre>('classic_mystery');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [setting, setSetting] = useState('');
  const [evidencePreferences, setEvidencePreferences] = useState<EvidenceType[]>([
    ...EVIDENCE_TYPES,
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyPreset = (p: (typeof PRESETS)[0]) => {
    setScenario(p.scenario);
    setGenre(p.genre);
    setDifficulty(p.difficulty);
    setSetting(p.setting);
    setError(null);
  };

  const handleToggleEvidenceType = (t: EvidenceType) => {
    setEvidencePreferences((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (scenario.trim().length < 20) {
      setError('Please provide at least 20 characters for the mystery scenario seed.');
      return;
    }
    if (scenario.length > 2000) {
      setError('Scenario seed cannot exceed 2000 characters.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.createCase({
        scenario: scenario.trim(),
        genre,
        difficulty,
        setting: setting.trim(),
        evidencePreferences,
      });

      navigate(`/cases/${res.caseId}/generating`);
    } catch (err: any) {
      setError(err?.message || 'Failed to initialize case. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 flex items-center gap-2.5">
          <Compass className="w-6 h-6 text-amber-400" />
          <span>Commission a New Investigation</span>
        </h2>
        <p className="text-slate-400 text-xs md:text-sm mt-1.5 leading-relaxed">
          Provide a story seed or select an investigation preset. The AI will synthesize a fair-play case with private truth, suspects, and an evidence docket.
        </p>
      </div>

      {/* Preset Starters */}
      <div className="space-y-2">
        <label className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5 font-bold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Investigation Presets</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
          {PRESETS.map((p) => (
            <button
              key={p.title}
              type="button"
              onClick={() => handleApplyPreset(p)}
              className="p-3 text-left rounded-xl bg-[#0e1320] hover:bg-[#151c2e] border border-slate-800 hover:border-amber-500/50 transition-all text-xs group"
            >
              <div className="font-bold text-slate-200 group-hover:text-amber-300 mb-1 truncate">
                {p.title}
              </div>
              <div className="text-[10px] font-mono text-slate-500 mb-1.5">
                {p.genre} • {p.difficulty}
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {p.scenario}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-6 shadow-xl">
        {error && (
          <div className="p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Scenario Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="scenario" className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Mystery Scenario Seed <span className="text-amber-400">*</span>
            </label>
            <span
              className={`text-[11px] font-mono ${
                scenario.length > 2000 ? 'text-red-400' : 'text-slate-500'
              }`}
            >
              {scenario.length} / 2000
            </span>
          </div>
          <textarea
            id="scenario"
            rows={4}
            value={scenario}
            onChange={(e) => setScenario(e.target.value)}
            placeholder="Describe the incident (e.g. A rare diamond disappears during a gala blackout...)"
            className="w-full bg-[#090d16] border border-slate-700/80 rounded-xl p-3.5 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500/70 transition-colors"
          />
          <p className="text-[11px] text-slate-500 font-mono">
            Recommended: 50–1,000 characters. All persons and entities will be strictly generated as fictional.
          </p>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-800/80">
          {/* Genre select */}
          <div className="space-y-1.5">
            <label htmlFor="genre" className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Investigation Genre
            </label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value as Genre)}
              className="w-full bg-[#090d16] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            >
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g.replace('_', ' ').toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Difficulty radio pills */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
              Deduction Difficulty
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  type="button"
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`py-2 px-3 rounded-lg text-xs font-mono uppercase tracking-wider transition-colors border ${
                    difficulty === d
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-bold'
                      : 'bg-[#090d16] text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Setting input */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <label htmlFor="setting" className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
            Setting / Location (Optional)
          </label>
          <input
            id="setting"
            type="text"
            value={setting}
            onChange={(e) => setSetting(e.target.value)}
            maxLength={120}
            placeholder="e.g. High-tech research lab or Scottish countryside manor"
            className="w-full bg-[#090d16] border border-slate-700/80 rounded-lg p-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Evidence Preferences */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold">
            Preferred Evidence Types
          </label>
          <div className="flex flex-wrap gap-2 text-xs">
            {EVIDENCE_TYPES.map((t) => {
              const isChecked = evidencePreferences.includes(t);
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => handleToggleEvidenceType(t)}
                  className={`px-3 py-1.5 rounded-lg border font-mono text-[11px] transition-colors ${
                    isChecked
                      ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/40'
                      : 'bg-slate-900 text-slate-500 border-slate-800'
                  }`}
                >
                  {t.replace('_', ' ').toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
            <Shield className="w-3.5 h-3.5 text-amber-500/80" />
            <span>Fair-Play Certified Generation</span>
          </span>

          <button
            type="submit"
            disabled={isSubmitting || !scenario.trim()}
            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold px-6 py-2.5 rounded-lg text-xs md:text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
          >
            <Compass className="w-4 h-4" />
            <span>{isSubmitting ? 'Initializing Room...' : 'Generate Case'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
