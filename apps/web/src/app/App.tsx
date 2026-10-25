import { Routes, Route, Link } from 'react-router-dom';
import { ShieldAlert, Compass, FolderKanban, PlusCircle } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-[#080b11] text-[#f8fafc] flex flex-col">
      {/* Top Header / App Shell */}
      <header className="border-b border-slate-800/80 bg-[#0c101a]/90 backdrop-blur sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2.5 font-bold tracking-tight text-lg text-slate-100 hover:text-amber-400 transition-colors">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Compass className="w-5 h-5" />
            </span>
            <span>AI Mystery Room</span>
          </Link>
          <span className="text-[10px] uppercase font-mono tracking-widest px-2 py-0.5 rounded bg-slate-800 text-amber-400/90 border border-slate-700/60">
            FICTIONAL SIMULATION
          </span>
        </div>

        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link
            to="/my-cases"
            className="flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-colors px-3 py-1.5 rounded-md hover:bg-slate-800/50"
          >
            <FolderKanban className="w-4 h-4" />
            <span>My Cases</span>
          </Link>
          <Link
            to="/create"
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-3.5 py-1.5 rounded-md transition-colors shadow-sm shadow-amber-500/20"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Investigation</span>
          </Link>
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route
            path="/"
            element={
              <div className="max-w-4xl mx-auto px-6 py-16 text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  <span>Fair-Play Fictional Investigation Engine</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100">
                  Step Into The Detective Desk
                </h1>
                <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
                  Turn any mystery prompt into an interactive investigation room. Inspect fictional chat logs, CCTV records, witness interviews, and forensic documents to deduce the single true culprit.
                </p>
                <div className="pt-4">
                  <Link
                    to="/create"
                    className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-lg text-base shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02]"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Create a Case</span>
                  </Link>
                </div>
              </div>
            }
          />
          <Route
            path="/create"
            element={
              <div className="max-w-2xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold">New Investigation</h2>
                <p className="text-slate-400 text-sm mt-1">Configure your scenario and parameters.</p>
              </div>
            }
          />
          <Route
            path="/my-cases"
            element={
              <div className="max-w-4xl mx-auto px-6 py-12">
                <h2 className="text-2xl font-bold">Case Archives</h2>
                <p className="text-slate-400 text-sm mt-1">View active and resolved investigations.</p>
              </div>
            }
          />
        </Routes>
      </main>

      {/* Footer Notice */}
      <footer className="border-t border-slate-800/80 px-6 py-4 text-center text-xs text-slate-500 font-mono">
        ALL CHARACTERS, CASES, MESSAGES, AND EVIDENCE ARE FICTIONAL SIMULATIONS. NOT INTENDED TO ACCUSE OR DEPICT REAL PERSONS.
      </footer>
    </div>
  );
}
