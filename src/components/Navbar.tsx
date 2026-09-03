import React from 'react';
import { VolleyballMatch } from '../types';
import { Volleyball, FileText, BookOpen, Settings, Volume2, ShieldCheck } from 'lucide-react';
import { playTableBuzzer } from '../utils/audio';

export type NavTab = 'live' | 'sheet' | 'guide' | 'setup';

interface NavbarProps {
  currentTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  match: VolleyballMatch;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onChangeTab, match }) => {
  const currentSet = match.sets[match.currentSetNumber - 1];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 text-white shadow-md border-b border-slate-800 print:hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
              <Volleyball className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-black text-base sm:text-lg tracking-tight leading-none text-white">
                  VolleyScore
                </h1>
                <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-400 text-slate-950">
                  PBVSI / FIVB
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium truncate max-w-[200px] sm:max-w-xs mt-0.5">
                Aplikasi Lembar Skoring Petugas Meja
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80 text-xs font-bold">
            <button
              type="button"
              onClick={() => onChangeTab('live')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                currentTab === 'live'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Meja Pencatat (Live Desk)</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab('sheet')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                currentTab === 'sheet'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Lembar Skor Resmi</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab('guide')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                currentTab === 'guide'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Panduan Petugas Meja</span>
            </button>

            <button
              type="button"
              onClick={() => onChangeTab('setup')}
              className={`px-3.5 py-2 rounded-lg transition flex items-center gap-1.5 ${
                currentTab === 'setup'
                  ? 'bg-amber-500 text-slate-950 font-black shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Pengaturan & Roster</span>
            </button>
          </nav>

          {/* Right Action: Table Buzzer & Match Info */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playTableBuzzer}
              className="p-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition flex items-center gap-1.5 text-xs font-bold"
              title="Uji coba Suara Bel / Buzzer Meja Petugas"
            >
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Bel Meja</span>
            </button>

            <div className="hidden lg:flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-semibold">{match.officials.scorer.split(',')[0]}</span>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-slate-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => onChangeTab('live')}
            className={`py-1 px-2 rounded-lg ${
              currentTab === 'live' ? 'text-amber-400 font-black' : 'text-slate-400'
            }`}
          >
            Live Meja
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('sheet')}
            className={`py-1 px-2 rounded-lg ${
              currentTab === 'sheet' ? 'text-amber-400 font-black' : 'text-slate-400'
            }`}
          >
            Lembar Resmi
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('guide')}
            className={`py-1 px-2 rounded-lg ${
              currentTab === 'guide' ? 'text-amber-400 font-black' : 'text-slate-400'
            }`}
          >
            Saran & Panduan
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('setup')}
            className={`py-1 px-2 rounded-lg ${
              currentTab === 'setup' ? 'text-amber-400 font-black' : 'text-slate-400'
            }`}
          >
            Roster Tim
          </button>
        </div>
      </div>
    </header>
  );
};
