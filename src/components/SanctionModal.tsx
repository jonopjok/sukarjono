import React, { useState } from 'react';
import { Team, TeamSide, SanctionEvent, SanctionType } from '../types';
import { ShieldAlert, X, AlertTriangle } from 'lucide-react';
import { playTableBuzzer } from '../utils/audio';

interface SanctionModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamA: Team;
  teamB: Team;
  currentSetNumber: number;
  currentScoreA: number;
  currentScoreB: number;
  onConfirmSanction: (sanction: SanctionEvent) => void;
}

export const SanctionModal: React.FC<SanctionModalProps> = ({
  isOpen,
  onClose,
  teamA,
  teamB,
  currentSetNumber,
  currentScoreA,
  currentScoreB,
  onConfirmSanction,
}) => {
  const [selectedTeamSide, setSelectedTeamSide] = useState<TeamSide>('A');
  const [targetType, setTargetType] = useState<'player' | 'official'>('player');
  const [playerNumber, setPlayerNumber] = useState<string>('');
  const [officialRole, setOfficialRole] = useState<'C' | 'AC' | 'T'>('C');
  const [sanctionType, setSanctionType] = useState<SanctionType>('warning');
  const [remarks, setRemarks] = useState<string>('');

  if (!isOpen) return null;

  const targetTeam = selectedTeamSide === 'A' ? teamA : teamB;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    playTableBuzzer();

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSanction: SanctionEvent = {
      id: `sanc-${Date.now()}`,
      setNumber: currentSetNumber,
      teamId: selectedTeamSide,
      personNumber: targetType === 'player' ? (playerNumber || '1') : officialRole,
      isOfficial: targetType === 'official',
      sanctionType,
      scoreAtSanction: `${currentScoreA}:${currentScoreB}`,
      remarks: remarks.trim() || undefined,
      timestamp: timeStr,
    };

    onConfirmSanction(newSanction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-lg leading-tight">
                PENCATATAN SANKSI (SANCTIONS)
              </h3>
              <p className="text-xs text-slate-300">
                Kolom Sanksi Petugas Meja PBVSI / FIVB • Set {currentSetNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {/* Pilih Tim */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              1. Tim yang Dikenai Sanksi:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedTeamSide('A')}
                className={`p-3 rounded-xl border text-center font-bold text-sm transition ${
                  selectedTeamSide === 'A'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                (A) {teamA.name}
              </button>
              <button
                type="button"
                onClick={() => setSelectedTeamSide('B')}
                className={`p-3 rounded-xl border text-center font-bold text-sm transition ${
                  selectedTeamSide === 'B'
                    ? 'border-rose-600 bg-rose-50 text-rose-900 ring-2 ring-rose-500'
                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                (B) {teamB.name}
              </button>
            </div>
          </div>

          {/* Pemain atau Ofisial */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                2. Subjek Sanksi:
              </label>
              <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setTargetType('player')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    targetType === 'player'
                      ? 'bg-white shadow-xs text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Pemain
                </button>
                <button
                  type="button"
                  onClick={() => setTargetType('official')}
                  className={`flex-1 py-1.5 rounded-lg transition ${
                    targetType === 'official'
                      ? 'bg-white shadow-xs text-slate-900'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ofisial
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                {targetType === 'player' ? 'Pilih Nomor Pemain:' : 'Pilih Posisi Ofisial:'}
              </label>
              {targetType === 'player' ? (
                <select
                  value={playerNumber}
                  onChange={(e) => setPlayerNumber(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                  required
                >
                  <option value="">-- Pilih Pemain --</option>
                  {targetTeam.roster.map((p) => (
                    <option key={p.id} value={p.number}>
                      #{p.number} - {p.name} {p.isCaptain ? '(C)' : ''}
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={officialRole}
                  onChange={(e) => setOfficialRole(e.target.value as 'C' | 'AC' | 'T')}
                  className="w-full p-2 rounded-xl border border-slate-300 text-sm font-semibold bg-white focus:ring-2 focus:ring-amber-500 outline-hidden"
                >
                  <option value="C">Pelatih Kepala (C - Coach)</option>
                  <option value="AC">Asisten Pelatih (AC)</option>
                  <option value="T">Trainer / Medis (T)</option>
                </select>
              )}
            </div>
          </div>

          {/* Jenis Sanksi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              3. Jenis Sanksi Resmi:
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSanctionType('warning')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  sanctionType === 'warning'
                    ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-5 bg-amber-400 border border-amber-600 rounded-xs inline-block shrink-0 shadow-xs"></span>
                  <div>
                    <p className="font-black text-xs text-amber-950">PERINGATAN (W)</p>
                    <p className="text-[10px] text-slate-500">Kartu Kuning • Tanpa penalti</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSanctionType('penalty')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  sanctionType === 'penalty'
                    ? 'border-rose-500 bg-rose-50 ring-2 ring-rose-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-5 bg-rose-600 border border-rose-800 rounded-xs inline-block shrink-0 shadow-xs"></span>
                  <div>
                    <p className="font-black text-xs text-rose-950">PENALTI (P)</p>
                    <p className="text-[10px] text-rose-600 font-semibold">+1 Poin lawan & servis</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSanctionType('expulsion')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  sanctionType === 'expulsion'
                    ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-400'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1 shrink-0">
                    <span className="w-3.5 h-5 bg-amber-400 border border-amber-600 rounded-xs inline-block"></span>
                    <span className="w-3.5 h-5 bg-rose-600 border border-rose-800 rounded-xs inline-block"></span>
                  </div>
                  <div>
                    <p className="font-black text-xs text-purple-950">EKSPULSI (E)</p>
                    <p className="text-[10px] text-slate-500">Keluar sisa set berjalan</p>
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSanctionType('disqualification')}
                className={`p-2.5 rounded-xl border text-left transition ${
                  sanctionType === 'disqualification'
                    ? 'border-slate-800 bg-slate-100 ring-2 ring-slate-700'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <div className="flex gap-1 shrink-0">
                    <span className="w-3 h-5 bg-amber-400 border border-amber-600 rounded-xs inline-block"></span>
                    <span className="w-3 h-5 bg-rose-600 border border-rose-800 rounded-xs inline-block"></span>
                  </div>
                  <div>
                    <p className="font-black text-xs text-slate-900">DISKUALIFIKASI (D)</p>
                    <p className="text-[10px] text-slate-500">Keluar sisa pertandingan</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Catatan / Keterangan */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              4. Keterangan / Penyebab (Opsional):
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Contoh: Protes berlebihan, perkataan tidak sopan, mengulur waktu..."
              className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500 outline-hidden"
            />
          </div>

          {/* Rule note */}
          {sanctionType === 'penalty' && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Konsekuensi Penalti (Kartu Merah):</p>
                <p>
                  Sesuai Peraturan Resmi FIVB / PBVSI 21.3.1, tim lawan otomatis mendapatkan 1 poin tambahan dan hak servis!
                </p>
              </div>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span>Simpan ke Catatan Meja</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
