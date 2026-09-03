import React, { useState, useEffect } from 'react';
import { VolleyballMatch } from './types';
import { initialMatchData } from './data/initialData';
import { Navbar, NavTab } from './components/Navbar';
import { LiveScorer } from './components/LiveScorer';
import { OfficialScoresheet } from './components/OfficialScoresheet';
import { PetugasMejaGuide } from './components/PetugasMejaGuide';
import { MatchSetup } from './components/MatchSetup';

const STORAGE_KEY = 'volleyscore_official_match_v1';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('live');

  // Initialize match from LocalStorage if present, else use default official demo match
  const [match, setMatch] = useState<VolleyballMatch>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load match from storage', e);
    }
    return initialMatchData;
  });

  // Save to LocalStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(match));
    } catch (e) {
      console.error('Failed to persist match to storage', e);
    }
  }, [match]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col selection:bg-amber-300 selection:text-slate-900">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onChangeTab={setCurrentTab}
        match={match}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6">
        {currentTab === 'live' && (
          <LiveScorer
            match={match}
            onUpdateMatch={setMatch}
            onNavigateToSheet={() => setCurrentTab('sheet')}
          />
        )}

        {currentTab === 'sheet' && <OfficialScoresheet match={match} />}

        {currentTab === 'guide' && <PetugasMejaGuide />}

        {currentTab === 'setup' && (
          <MatchSetup match={match} onUpdateMatch={setMatch} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 text-center text-xs text-slate-500 print:hidden mt-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-700">
            VolleyScore • Sistem Lembar Skoring Digital Petugas Meja PBVSI / FIVB
          </p>
          <p className="text-[11px] text-slate-400">
            Sesuai Regulasi Resmi Bola Voli PBVSI (FIVB Rules of the Game)
          </p>
        </div>
      </footer>
    </div>
  );
}
