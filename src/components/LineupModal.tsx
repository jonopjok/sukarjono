import React, { useState } from 'react';
import { Team, TeamSide } from '../types';
import { Users, X, Check, AlertCircle } from 'lucide-react';

interface LineupModalProps {
  isOpen: boolean;
  onClose: () => void;
  teamA: Team;
  teamB: Team;
  currentLineupA: number[];
  currentLineupB: number[];
  onConfirmLineup: (lineupA: number[], lineupB: number[]) => void;
}

export const LineupModal: React.FC<LineupModalProps> = ({
  isOpen,
  onClose,
  teamA,
  teamB,
  currentLineupA,
  currentLineupB,
  onConfirmLineup,
}) => {
  const [lineupA, setLineupA] = useState<number[]>([...currentLineupA]);
  const [lineupB, setLineupB] = useState<number[]>([...currentLineupB]);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const romanPos = ['I (Servis)', 'II', 'III', 'IV', 'V', 'VI'];

  const handleSelectPlayer = (teamId: TeamSide, posIdx: number, num: number) => {
    setErrorMsg('');
    if (teamId === 'A') {
      const updated = [...lineupA];
      updated[posIdx] = num;
      setLineupA(updated);
    } else {
      const updated = [...lineupB];
      updated[posIdx] = num;
      setLineupB(updated);
    }
  };

  const validateAndSubmit = () => {
    // Check duplicates in Team A
    const setA = new Set(lineupA);
    if (setA.size < 6) {
      setErrorMsg(`Formasi ${teamA.name} memiliki pemain duplikat! Pastikan 6 pemain berbeda.`);
      return;
    }
    // Check duplicates in Team B
    const setB = new Set(lineupB);
    if (setB.size < 6) {
      setErrorMsg(`Formasi ${teamB.name} memiliki pemain duplikat! Pastikan 6 pemain berbeda.`);
      return;
    }

    onConfirmLineup(lineupA, lineupB);
    onClose();
  };

  const renderTeamSelector = (team: Team, currentLineup: number[]) => {
    // Eligible regular players (non-libero)
    const regularPlayers = team.roster.filter((p) => !p.isLibero);

    return (
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-200">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: team.color }}></span>
          <h4 className="font-bold text-sm text-slate-800">{team.name}</h4>
          <span className="text-[11px] text-slate-500 ml-auto">Line-up Sheet Resmi</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {romanPos.map((posName, idx) => (
            <div key={idx} className="bg-white p-2 rounded-lg border border-slate-200">
              <label className="block text-[10px] font-extrabold uppercase text-slate-500 mb-1">
                Pos {posName}
              </label>
              <select
                value={currentLineup[idx] || ''}
                onChange={(e) =>
                  handleSelectPlayer(team.id, idx, parseInt(e.target.value, 10))
                }
                className="w-full text-xs font-bold p-1.5 rounded border border-slate-300 bg-slate-50 focus:bg-white outline-hidden"
              >
                {regularPlayers.map((p) => (
                  <option key={p.id} value={p.number}>
                    #{p.number} - {p.name.split(' ')[0]} {p.isCaptain ? '(C)' : ''}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Users className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-base sm:text-lg leading-tight">
                FORMULIR SUSUNAN POSISI AWAL (LINE-UP SHEET)
              </h3>
              <p className="text-xs text-slate-300">
                Diisi sesuai lembar susunan pemain mula-mula yang diserahkan pelatih ke Wasit 2
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

        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {renderTeamSelector(teamA, lineupA)}
          {renderTeamSelector(teamB, lineupB)}

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
            <strong>Catatan Petugas Meja:</strong> Posisi I adalah pemain yang melakukan servis mula-mula. Pemain libero tidak boleh masuk dalam formasi starting six, hanya boleh menggantikan pemain baris belakang setelah disahkan wasit.
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={validateAndSubmit}
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Simpan Line-up & Verifikasi Meja</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
