import React, { useState } from 'react';
import { VolleyballMatch, Team, Player, MatchInfo, MatchOfficials } from '../types';
import { Settings, Users, Plus, Trash2, RotateCcw, Save, Check } from 'lucide-react';
import { initialMatchData, createEmptySet } from '../data/initialData';

interface MatchSetupProps {
  match: VolleyballMatch;
  onUpdateMatch: (updated: VolleyballMatch) => void;
}

export const MatchSetup: React.FC<MatchSetupProps> = ({ match, onUpdateMatch }) => {
  const [matchInfo, setMatchInfo] = useState<MatchInfo>({ ...match.matchInfo });
  const [officials, setOfficials] = useState<MatchOfficials>({ ...match.officials });
  const [teamA, setTeamA] = useState<Team>({ ...match.teamA });
  const [teamB, setTeamB] = useState<Team>({ ...match.teamB });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Helper for adding a new player to roster
  const handleAddPlayer = (teamSide: 'A' | 'B') => {
    const targetTeam = teamSide === 'A' ? teamA : teamB;
    const nextNumber = targetTeam.roster.length + 1;
    const newPlayer: Player = {
      id: `p-${teamSide}-${Date.now()}`,
      number: nextNumber,
      name: `Pemain Baru ${nextNumber}`,
      isCaptain: false,
      isLibero: false,
    };
    if (teamSide === 'A') {
      setTeamA({ ...teamA, roster: [...teamA.roster, newPlayer] });
    } else {
      setTeamB({ ...teamB, roster: [...teamB.roster, newPlayer] });
    }
  };

  const handleRemovePlayer = (teamSide: 'A' | 'B', playerId: string) => {
    if (teamSide === 'A') {
      setTeamA({ ...teamA, roster: teamA.roster.filter((p) => p.id !== playerId) });
    } else {
      setTeamB({ ...teamB, roster: teamB.roster.filter((p) => p.id !== playerId) });
    }
  };

  const handleToggleCaptain = (teamSide: 'A' | 'B', playerId: string) => {
    if (teamSide === 'A') {
      const updated = teamA.roster.map((p) => ({
        ...p,
        isCaptain: p.id === playerId ? !p.isCaptain : false,
      }));
      setTeamA({ ...teamA, roster: updated });
    } else {
      const updated = teamB.roster.map((p) => ({
        ...p,
        isCaptain: p.id === playerId ? !p.isCaptain : false,
      }));
      setTeamB({ ...teamB, roster: updated });
    }
  };

  const handleToggleLibero = (teamSide: 'A' | 'B', playerId: string) => {
    if (teamSide === 'A') {
      const updated = teamA.roster.map((p) => ({
        ...p,
        isLibero: p.id === playerId ? !p.isLibero : p.isLibero,
      }));
      setTeamA({ ...teamA, roster: updated });
    } else {
      const updated = teamB.roster.map((p) => ({
        ...p,
        isLibero: p.id === playerId ? !p.isLibero : p.isLibero,
      }));
      setTeamB({ ...teamB, roster: updated });
    }
  };

  const handleSaveAll = () => {
    onUpdateMatch({
      ...match,
      matchInfo,
      officials,
      teamA,
      teamB,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetToDemo = () => {
    if (window.confirm('Muat ulang data pertandingan contoh resmi PBVSI?')) {
      onUpdateMatch(initialMatchData);
      setMatchInfo({ ...initialMatchData.matchInfo });
      setOfficials({ ...initialMatchData.officials });
      setTeamA({ ...initialMatchData.teamA });
      setTeamB({ ...initialMatchData.teamB });
    }
  };

  const handleStartFreshMatch = () => {
    if (window.confirm('Mulai pertandingan baru yang bersih (Skor 0-0)?')) {
      const emptySet1 = createEmptySet(1, 'A', 'A');
      const freshMatch: VolleyballMatch = {
        ...match,
        currentSetNumber: 1,
        sets: [emptySet1],
        pointsHistory: [],
        sanctions: [],
        isMatchFinished: false,
        matchWinner: undefined,
      };
      onUpdateMatch(freshMatch);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Settings className="w-5 h-5 text-slate-700" />
            <span>PENGATURAN PERTANDINGAN & ROSTER TIM</span>
          </h3>
          <p className="text-xs text-slate-500">
            Konfigurasi informasi kejuaraan, perangkat pertandingan, dan daftar pemain
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleResetToDemo}
            className="px-3 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Muat Contoh Data</span>
          </button>

          <button
            type="button"
            onClick={handleStartFreshMatch}
            className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition"
          >
            Mulai Laga Baru (Reset Skor)
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            {saveSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{saveSuccess ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
          </button>
        </div>
      </div>

      {/* SECTION: INFORMASI PERTANDINGAN */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          1. Identitas Kejuaraan & Pertandingan
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Nama Kejuaraan / Turnamen:</label>
            <input
              type="text"
              value={matchInfo.competitionName}
              onChange={(e) => setMatchInfo({ ...matchInfo, competitionName: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Nomor Pertandingan:</label>
            <input
              type="text"
              value={matchInfo.matchNumber}
              onChange={(e) => setMatchInfo({ ...matchInfo, matchNumber: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-300 font-mono font-bold focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kategori & Divisi:</label>
            <div className="flex gap-2">
              <select
                value={matchInfo.division}
                onChange={(e) => setMatchInfo({ ...matchInfo, division: e.target.value as 'Putra' | 'Putri' })}
                className="w-1/2 p-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                <option value="Putra">Putra (Men)</option>
                <option value="Putri">Putri (Women)</option>
              </select>
              <select
                value={matchInfo.category}
                onChange={(e) => setMatchInfo({ ...matchInfo, category: e.target.value as 'Senior' | 'Junior' | 'U-21' | 'Pelajar' | 'Umum' })}
                className="w-1/2 p-2 rounded-xl border border-slate-300 font-semibold focus:ring-2 focus:ring-amber-500 outline-hidden"
              >
                <option value="Senior">Senior</option>
                <option value="Junior">Junior</option>
                <option value="U-21">U-21</option>
                <option value="Pelajar">Pelajar</option>
                <option value="Umum">Umum</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Kota / Venue Hall:</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={matchInfo.city}
                placeholder="Kota"
                onChange={(e) => setMatchInfo({ ...matchInfo, city: e.target.value })}
                className="w-1/2 p-2 rounded-xl border border-slate-300 font-semibold"
              />
              <input
                type="text"
                value={matchInfo.hallVenue}
                placeholder="Nama GOR/Hall"
                onChange={(e) => setMatchInfo({ ...matchInfo, hallVenue: e.target.value })}
                className="w-1/2 p-2 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Tanggal & Waktu:</label>
            <div className="flex gap-2">
              <input
                type="date"
                value={matchInfo.date}
                onChange={(e) => setMatchInfo({ ...matchInfo, date: e.target.value })}
                className="w-1/2 p-2 rounded-xl border border-slate-300 font-semibold"
              />
              <input
                type="text"
                value={matchInfo.scheduledTime}
                placeholder="14:00 WIB"
                onChange={(e) => setMatchInfo({ ...matchInfo, scheduledTime: e.target.value })}
                className="w-1/2 p-2 rounded-xl border border-slate-300 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Babak / Pool:</label>
            <input
              type="text"
              value={matchInfo.pool}
              onChange={(e) => setMatchInfo({ ...matchInfo, pool: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-300 font-semibold"
            />
          </div>
        </div>
      </div>

      {/* SECTION: PERANGKAT PERTANDINGAN & PETUGAS MEJA */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
        <h4 className="font-extrabold text-sm text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
          2. Perangkat Pertandingan & Petugas Meja (Referees & Officials)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">Wasit 1 (First Referee):</label>
            <input
              type="text"
              value={officials.firstReferee}
              onChange={(e) => setOfficials({ ...officials, firstReferee: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Wasit 2 (Second Referee):</label>
            <input
              type="text"
              value={officials.secondReferee}
              onChange={(e) => setOfficials({ ...officials, secondReferee: e.target.value })}
              className="w-full p-2 rounded-xl border border-slate-300 font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-blue-800 mb-1">Pencatat Skor (Petugas Meja Utama):</label>
            <input
              type="text"
              value={officials.scorer}
              onChange={(e) => setOfficials({ ...officials, scorer: e.target.value })}
              className="w-full p-2 rounded-xl border border-blue-400 bg-blue-50/50 font-bold text-blue-950"
            />
          </div>

          <div>
            <label className="block font-bold text-purple-800 mb-1">Asisten Pencatat (Libero Tracker):</label>
            <input
              type="text"
              value={officials.assistantScorer}
              onChange={(e) => setOfficials({ ...officials, assistantScorer: e.target.value })}
              className="w-full p-2 rounded-xl border border-purple-400 bg-purple-50/50 font-bold text-purple-950"
            />
          </div>
        </div>
      </div>

      {/* SECTION: ROSTER DUA TIM */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* TIM A SETUP */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: teamA.color }}></span>
              <h4 className="font-extrabold text-base text-slate-900">TIM A: {teamA.name}</h4>
            </div>
            <button
              type="button"
              onClick={() => handleAddPlayer('A')}
              className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pemain</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Tim</label>
              <input
                type="text"
                value={teamA.name}
                onChange={(e) => setTeamA({ ...teamA, name: e.target.value })}
                className="w-full p-1.5 rounded-lg border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Kode Singkat</label>
              <input
                type="text"
                value={teamA.shortCode}
                onChange={(e) => setTeamA({ ...teamA, shortCode: e.target.value })}
                className="w-full p-1.5 rounded-lg border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Pelatih Kepala</label>
              <input
                type="text"
                value={teamA.coach}
                onChange={(e) => setTeamA({ ...teamA, coach: e.target.value })}
                className="w-full p-1.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
          </div>

          {/* Roster Table */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {teamA.roster.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <input
                  type="number"
                  value={p.number}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setTeamA({
                      ...teamA,
                      roster: teamA.roster.map((r) => (r.id === p.id ? { ...r, number: val } : r)),
                    });
                  }}
                  className="w-12 p-1 font-mono font-black text-center rounded border border-slate-300 bg-white"
                />

                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTeamA({
                      ...teamA,
                      roster: teamA.roster.map((r) => (r.id === p.id ? { ...r, name: val } : r)),
                    });
                  }}
                  className="flex-1 p-1 font-semibold rounded border border-slate-300 bg-white"
                />

                {/* Badges */}
                <button
                  type="button"
                  onClick={() => handleToggleCaptain('A', p.id)}
                  className={`px-1.5 py-1 rounded text-[10px] font-black transition ${
                    p.isCaptain
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title="Tandai sebagai Kapten Tim"
                >
                  (C)
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleLibero('A', p.id)}
                  className={`px-1.5 py-1 rounded text-[10px] font-black transition ${
                    p.isLibero
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title="Tandai sebagai Pemain Libero"
                >
                  (L)
                </button>

                <button
                  type="button"
                  onClick={() => handleRemovePlayer('A', p.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Hapus pemain"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* TIM B SETUP */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: teamB.color }}></span>
              <h4 className="font-extrabold text-base text-slate-900">TIM B: {teamB.name}</h4>
            </div>
            <button
              type="button"
              onClick={() => handleAddPlayer('B')}
              className="px-2.5 py-1 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Pemain</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Nama Tim</label>
              <input
                type="text"
                value={teamB.name}
                onChange={(e) => setTeamB({ ...teamB, name: e.target.value })}
                className="w-full p-1.5 rounded-lg border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Kode Singkat</label>
              <input
                type="text"
                value={teamB.shortCode}
                onChange={(e) => setTeamB({ ...teamB, shortCode: e.target.value })}
                className="w-full p-1.5 rounded-lg border border-slate-300 font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase">Pelatih Kepala</label>
              <input
                type="text"
                value={teamB.coach}
                onChange={(e) => setTeamB({ ...teamB, coach: e.target.value })}
                className="w-full p-1.5 rounded-lg border border-slate-300 font-semibold"
              />
            </div>
          </div>

          {/* Roster Table */}
          <div className="max-h-64 overflow-y-auto space-y-1.5 pr-1">
            {teamB.roster.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <input
                  type="number"
                  value={p.number}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10) || 0;
                    setTeamB({
                      ...teamB,
                      roster: teamB.roster.map((r) => (r.id === p.id ? { ...r, number: val } : r)),
                    });
                  }}
                  className="w-12 p-1 font-mono font-black text-center rounded border border-slate-300 bg-white"
                />

                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setTeamB({
                      ...teamB,
                      roster: teamB.roster.map((r) => (r.id === p.id ? { ...r, name: val } : r)),
                    });
                  }}
                  className="flex-1 p-1 font-semibold rounded border border-slate-300 bg-white"
                />

                {/* Badges */}
                <button
                  type="button"
                  onClick={() => handleToggleCaptain('B', p.id)}
                  className={`px-1.5 py-1 rounded text-[10px] font-black transition ${
                    p.isCaptain
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title="Tandai sebagai Kapten Tim"
                >
                  (C)
                </button>

                <button
                  type="button"
                  onClick={() => handleToggleLibero('B', p.id)}
                  className={`px-1.5 py-1 rounded text-[10px] font-black transition ${
                    p.isLibero
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                  }`}
                  title="Tandai sebagai Pemain Libero"
                >
                  (L)
                </button>

                <button
                  type="button"
                  onClick={() => handleRemovePlayer('B', p.id)}
                  className="p-1 text-slate-400 hover:text-rose-600 transition"
                  title="Hapus pemain"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
