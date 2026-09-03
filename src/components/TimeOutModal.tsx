import React, { useState, useEffect } from 'react';
import { Team, TeamSide, TimeOut } from '../types';
import { Timer, X, AlertTriangle, Play, Pause, RotateCcw } from 'lucide-react';
import { playCountdownBeep, playTableBuzzer } from '../utils/audio';

interface TimeOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  team: Team;
  currentSetNumber: number;
  currentScoreA: number;
  currentScoreB: number;
  timeOutsUsed: TimeOut[];
  onConfirmTimeOut: (to: TimeOut) => void;
}

export const TimeOutModal: React.FC<TimeOutModalProps> = ({
  isOpen,
  onClose,
  team,
  currentSetNumber,
  currentScoreA,
  currentScoreB,
  timeOutsUsed,
  onConfirmTimeOut,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(30);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [hasRecorded, setHasRecorded] = useState<boolean>(false);

  const toIndex = (timeOutsUsed.length + 1) as 1 | 2;
  const isLimitReached = timeOutsUsed.length >= 2;

  useEffect(() => {
    if (isOpen) {
      setSecondsRemaining(30);
      setIsRunning(true);
      setHasRecorded(false);
      playTableBuzzer(); // Table buzzer to alert second referee
    }
  }, [isOpen]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning && secondsRemaining > 0) {
      timer = setTimeout(() => {
        setSecondsRemaining((prev) => {
          const next = prev - 1;
          if (next <= 5 && next > 0) {
            playCountdownBeep(false);
          } else if (next === 0) {
            playTableBuzzer();
          }
          return next;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isRunning, secondsRemaining]);

  if (!isOpen) return null;

  const handleRecord = () => {
    if (isLimitReached) return;
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newTO: TimeOut = {
      id: `to-${team.id}-${currentSetNumber}-${toIndex}-${Date.now()}`,
      teamId: team.id,
      setNumber: currentSetNumber,
      toIndex,
      scoreAtTO: `${currentScoreA}:${currentScoreB}`,
      timestamp: timeStr,
    };
    onConfirmTimeOut(newTO);
    setHasRecorded(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div
          className="p-4 text-white flex items-center justify-between"
          style={{ backgroundColor: team.color }}
        >
          <div className="flex items-center gap-2.5">
            <Timer className="w-6 h-6 animate-pulse" />
            <div>
              <h3 className="font-extrabold text-lg leading-tight">
                TIME-OUT {team.name}
              </h3>
              <p className="text-xs text-white/80">
                Set {currentSetNumber} • Jatah TO ke-{toIndex} dari 2
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
        <div className="p-5 text-center">
          {isLimitReached ? (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl mb-4 text-rose-700 flex items-center gap-3 text-left">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <div>
                <p className="font-bold text-sm">Batas Time-Out Tercapai!</p>
                <p className="text-xs mt-0.5">
                  Tim {team.name} telah menggunakan 2 kali Time-Out resmi pada Set ke-{currentSetNumber}.
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* Big Timer */}
              <div className="my-2">
                <div
                  className={`text-6xl sm:text-7xl font-black font-mono tracking-tighter ${
                    secondsRemaining <= 5
                      ? 'text-rose-600 animate-pulse'
                      : 'text-slate-800'
                  }`}
                >
                  00:{secondsRemaining.toString().padStart(2, '0')}
                </div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
                  Durasi Resmi FIVB / PBVSI (30 Detik)
                </p>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 my-4">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{isRunning ? 'Jeda' : 'Lanjut'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSecondsRemaining(30)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset 30s</span>
                </button>
              </div>

              {/* Match Score Record Info */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 mb-4 flex items-center justify-between">
                <span>Skor saat Time Out dicatat:</span>
                <span className="font-mono font-bold text-sm text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-300">
                  {currentScoreA} - {currentScoreB}
                </span>
              </div>

              {!hasRecorded && (
                <button
                  type="button"
                  onClick={handleRecord}
                  className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-sm shadow-md transition flex items-center justify-center gap-2 mb-2"
                >
                  <Timer className="w-4 h-4" />
                  <span>Catat ke Lembar Skor (TO #{toIndex})</span>
                </button>
              )}

              {hasRecorded && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold mb-2">
                  ✓ Time-Out #{toIndex} berhasil tercatat di Lembar Skor Petugas Meja
                </div>
              )}
            </>
          )}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition"
          >
            Tutup Dialog Time-Out
          </button>
        </div>
      </div>
    </div>
  );
};
