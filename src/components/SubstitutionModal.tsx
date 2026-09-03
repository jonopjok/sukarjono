import React, { useState } from 'react';
import { Team, Substitution } from '../types';
import { UserCheck, X, AlertCircle, RefreshCw } from 'lucide-react';
import { playTableBuzzer } from '../utils/audio';

interface SubstitutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  currentPositions: number[]; // numbers of 6 players currently on court [Pos I to VI]
  currentSetNumber: number;
  currentScoreA: number;
  currentScoreB: number;
  substitutionsUsed: Substitution[];
  onConfirmSubstitution: (sub: Substitution) => void;
}

export const SubstitutionModal: React.FC<SubstitutionModalProps> = ({
  isOpen,
  onClose,
  team,
  currentPositions,
  currentSetNumber,
  currentScoreA,
  currentScoreB,
  substitutionsUsed,
  onConfirmSubstitution,
}) => {
  const [selectedPosIndex, setSelectedPosIndex] = useState<number>(0); // 0 to 5 for Pos I to VI
  const [selectedPlayerInNumber, setSelectedPlayerInNumber] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const subsCount = substitutionsUsed.length;
  const isMaxReached = subsCount >= 6;

  // Player currently on court at selected position
  const playerOutNumber = currentPositions[selectedPosIndex];
  const playerOut = team.roster.find((p) => p.number === playerOutNumber);

  // Available bench players (in roster, not libero, not currently on court)
  const benchPlayers = team.roster.filter(
    (p) => !p.isLibero && !currentPositions.includes(p.number)
  );

  const romanPositions = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isMaxReached) {
      setErrorMessage('Kuota 6 pergantian pemain sudah habis untuk set ini!');
      return;
    }
    if (!selectedPlayerInNumber) {
      setErrorMessage('Silakan pilih pemain pengganti yang akan masuk!');
      return;
    }

    // Official buzzer sound when recording substitution
    playTableBuzzer();

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newSub: Substitution = {
      id: `sub-${team.id}-${currentSetNumber}-${subsCount + 1}-${Date.now()}`,
      teamId: team.id,
      setNumber: currentSetNumber,
      positionNumber: selectedPosIndex + 1,
      playerOut: playerOutNumber,
      playerIn: selectedPlayerInNumber,
      scoreAtSub: `${currentScoreA}:${currentScoreB}`,
      timestamp: timeStr,
    };

    onConfirmSubstitution(newSub);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div
          className="p-4 text-white flex items-center justify-between"
          style={{ backgroundColor: team.color }}
        >
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-6 h-6" />
            <div>
              <h3 className="font-extrabold text-lg leading-tight">
                PERGANTIAN PEMAIN (SUBSTITUSI)
              </h3>
              <p className="text-xs text-white/85">
                {team.name} • Set {currentSetNumber} • Jatah ke-{subsCount + 1} / 6
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Quota Tracker */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-250 text-xs">
            <span className="font-semibold text-slate-700">Status Kuota Substitusi Set Ini:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <span
                  key={num}
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                    num <= subsCount
                      ? 'bg-rose-500 text-white shadow-xs'
                      : num === subsCount + 1
                      ? 'bg-amber-400 text-slate-900 ring-2 ring-amber-500 font-black'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {num}
                </span>
              ))}
            </div>
          </div>

          {isMaxReached ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-3">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">Batas Substitusi Tercapai!</p>
                <p className="text-xs mt-0.5">
                  Tim {team.name} telah menghabiskan 6 kali kuota pergantian pemain di set ke-{currentSetNumber}.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Select Position on Court / Player OUT */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  1. Pilih Posisi Lapangan & Pemain KELUAR (OUT):
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {currentPositions.map((pNum, idx) => {
                    const p = team.roster.find((r) => r.number === pNum);
                    const isSelected = selectedPosIndex === idx;
                    return (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setSelectedPosIndex(idx);
                          setErrorMessage('');
                        }}
                        className={`p-2 rounded-xl text-center border transition flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-rose-50 border-rose-500 ring-2 ring-rose-400 text-rose-900 shadow-sm'
                            : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span className="text-[10px] font-extrabold uppercase text-slate-500">
                          Pos {romanPositions[idx]}
                        </span>
                        <span className="text-lg font-black">{pNum}</span>
                        <span className="text-[10px] truncate max-w-full font-medium">
                          {p?.name.split(' ')[0] || `#${pNum}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Select Bench Player IN */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  2. Pilih Pemain Pengganti yang MASUK (IN):
                </label>
                {benchPlayers.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg">
                    Tidak ada pemain cadangan reguler yang tersedia di bangku cadangan.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                    {benchPlayers.map((p) => {
                      const isSelected = selectedPlayerInNumber === p.number;
                      return (
                        <button
                          type="button"
                          key={p.id}
                          onClick={() => {
                            setSelectedPlayerInNumber(p.number);
                            setErrorMessage('');
                          }}
                          className={`p-2.5 rounded-xl text-left border transition flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400 text-emerald-950 shadow-sm'
                              : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-800 text-white font-black text-sm flex items-center justify-center shrink-0">
                            {p.number}
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-500">Cadangan</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Summary of Action */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="text-amber-800 font-semibold">Keluar: </span>
                  <span className="font-bold text-rose-700">
                    No. {playerOutNumber} ({playerOut?.name || 'Pemain'})
                  </span>
                </div>
                <span className="font-black text-slate-400">➔</span>
                <div>
                  <span className="text-amber-800 font-semibold">Masuk: </span>
                  <span className="font-bold text-emerald-700">
                    {selectedPlayerInNumber
                      ? `No. ${selectedPlayerInNumber}`
                      : '(Pilih pemain)'}
                  </span>
                </div>
                <div className="border-l border-amber-300 pl-3">
                  <span className="text-[11px] text-slate-500 block">Skor Saat Ini</span>
                  <span className="font-mono font-bold text-slate-900">
                    {currentScoreA} - {currentScoreB}
                  </span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedPlayerInNumber}
                className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                <span>Konfirmasi & Bunyikan Bel Petugas Meja</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
};
