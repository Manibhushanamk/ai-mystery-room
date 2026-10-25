import { Routes, Route, Link } from 'react-router-dom';
import {
  Compass,
  FolderKanban,
  PlusCircle,
  ShieldCheck,
  Search,
  FileCheck2,
  Lock,
} from 'lucide-react';
import { ScenarioForm } from '../features/case-creation/ScenarioForm.js';
import { GenerationScreen } from '../features/generation/GenerationScreen.js';
import { InvestigationWorkspace } from '../features/investigation/InvestigationWorkspace.js';
import { MyCasesView } from '../features/case-history/MyCasesView.js';

export default function App() {
  return (
    <div className="min-h-screen bg-[#080b11] text-[#f8fafc] flex flex-col font-sans">
      {/* Top Header / App Shell */}
      <header className="border-b border-slate-800/80 bg-[#0c101a]/90 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight text-base md:text-lg text-slate-100 hover:text-amber-400 transition-colors"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </span>
            <span>AI Mystery Room</span>
          </Link>
          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-slate-800 text-amber-400/90 border border-slate-700/60 hidden sm:inline-block">
            FICTIONAL SIMULATION
          </span>
        </div>

        <nav className="flex items-center gap-3 text-xs md:text-sm font-medium">
          <Link
            to="/my-cases"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800/50"
          >
            <FolderKanban className="w-4 h-4" />
            <span>My Cases</span>
          </Link>
          <Link
            to="/create"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3.5 py-1.5 rounded-md transition-all shadow-sm shadow-amber-500/20 hover:scale-[1.02]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Investigation</span>
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-0">
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-5xl mx-auto px-6 py-12 space-y-16">
                {/* Hero section */}
                <div className="text-center space-y-6 pt-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Deterministic Fair-Play Deduction Engine</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-100 max-w-3xl mx-auto leading-tight">
                    Every Clue Matters. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500">
                      The Truth is Fixed.
                    </span>
                  </h1>

                  <p className="text-slate-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
                    Transform any story prompt into a structured, fair-play criminal investigation. Inspect simulated WhatsApp chats, CCTV transcripts, forensics, and witness statements to unmask the single true culprit.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center justify-center gap-4">
                    <Link
                      to="/create"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                    >
                      <PlusCircle className="w-4 h-4" />
                      <span>Create an Investigation</span>
                    </Link>
                    <Link
                      to="/my-cases"
                      className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-5 py-3 rounded-xl text-sm border border-slate-700 transition-colors"
                    >
                      <FolderKanban className="w-4 h-4" />
                      <span>Review Past Cases</span>
                    </Link>
                  </div>
                </div>

                {/* Fair Play Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  <div className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Lock className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-100">Canonical Truth First</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      The AI establishes the culprit, motive, method, and master timeline *before* evidence is generated. The facts never shift to accommodate your guesses.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-100">Multi-Format Evidence</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Inspect encrypted chat exports, surveillance transcripts, forensic audit manifests, and witness statements. Filter, star, and annotate clues.
                    </p>
                  </div>

                  <div className="p-6 rounded-2xl bg-[#0f1422] border border-slate-800 space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <FileCheck2 className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-base text-slate-100">Evidence-Cited Reveals</h3>
                    <p className="text-xs text-slate-400 leading-relaxed font-sans">
                      Accuse your suspect in a one-shot verdict. The reveal meticulously cites each clue ID that proved their guilt and debunks all red herrings.
                    </p>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/create" element={<div className="p-6"><ScenarioForm /></div>} />
          <Route path="/cases/:caseId/generating" element={<GenerationScreen />} />
          <Route path="/investigate/:caseId" element={<InvestigationWorkspace />} />
          <Route path="/my-cases" element={<MyCasesView />} />
        </Routes>
      </main>

      {/* Footer Notice */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-[11px] text-slate-500 font-mono">
        ALL CHARACTERS, CASES, MESSAGES, AND EVIDENCE ARE FICTIONAL SIMULATIONS. NOT INTENDED TO ACCUSE OR DEPICT REAL PERSONS.
      </footer>
    </div>
  );
}
