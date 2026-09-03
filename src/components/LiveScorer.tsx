import React, { useState } from 'react';
import {
  VolleyballMatch,
  TeamSide,
  SetData,
  Substitution,
  TimeOut,
  SanctionEvent,
  PointEvent,
} from '../types';
import { VolleyballCourt } from './VolleyballCourt';
import { TimeOutModal } from './TimeOutModal';
import { SubstitutionModal } from './SubstitutionModal';
import { SanctionModal } from './SanctionModal';
import { LineupModal } from './LineupModal';
import {
  Plus,
  RotateCcw,
  Timer,
  UserCheck,
  ShieldAlert,
  Volleyball,
  ArrowRightLeft,
  CheckCircle2,
  Users,
  Trophy,
  History,
  Volume2,
} from 'lucide-react';
import { playRefereeWhistle, playTableBuzzer } from '../utils/audio';

interface LiveScorerProps {
  match: VolleyballMatch;
  onUpdateMatch: (updated: VolleyballMatch) => void;
  onNavigateToSheet: () => void;
}

export const LiveScorer: React.FC<LiveScorerProps> = ({
  match,
  onUpdateMatch,
  onNavigateToSheet,
}) => {
  const currentSet = match.sets[match.currentSetNumber - 1];

  // Modals state
  const [isTimeOutModalOpen, setIsTimeOutModalOpen] = useState<boolean>(false);
  const [selectedTOTeam, setSelectedTOTeam] = useState<TeamSide>('A');

  const [isSubModalOpen, setIsSubModalOpen] = useState<boolean>(false);
  const [selectedSubTeam, setSelectedSubTeam] = useState<TeamSide>('A');

  const [isSanctionModalOpen, setIsSanctionModalOpen] = useState<boolean>(false);
  const [isLineupModalOpen, setIsLineupModalOpen] = useState<boolean>(false);

  // Teams mapping
  const teamLeft = currentSet.teamLeft === 'A' ? match.teamA : match.teamB;
  const teamRight = currentSet.teamRight === 'A' ? match.teamA : match.teamB;

  const scoreLeft = currentSet.teamLeft === 'A' ? currentSet.scoreA : currentSet.scoreB;
  const scoreRight = currentSet.teamRight === 'A' ? currentSet.scoreA : currentSet.scoreB;

  const positionsLeft =
    currentSet.teamLeft === 'A'
      ? currentSet.currentPositionsA
      : currentSet.currentPositionsB;
  const positionsRight =
    currentSet.teamRight === 'A'
      ? currentSet.currentPositionsA
      : currentSet.currentPositionsB;

  // Target points: 25 for sets 1-4, 15 for set 5 (tie-break). Must lead by 2.
  const targetPoints = currentSet.setNumber === 5 ? 15 : 25;
  const maxScore = Math.max(currentSet.scoreA, currentSet.scoreB);
  const scoreDiff = Math.abs(currentSet.scoreA - currentSet.scoreB);
  const isSetPoint =
    (currentSet.scoreA >= targetPoints - 1 || currentSet.scoreB >= targetPoints - 1) &&
    scoreDiff >= 1;
  const canFinishSet = maxScore >= targetPoints && scoreDiff >= 2;

  // Clockwise rotation: Pos I -> VI -> V -> IV -> III -> II -> I
  // Array indices: [0=Pos I, 1=Pos II, 2=Pos III, 3=Pos IV, 4=Pos V, 5=Pos VI]
  // In clockwise rotation:
  // Player at pos II moves to pos I (new server)
  // Player at pos III moves to pos II
  // Player at pos IV moves to pos III
  // Player at pos V moves to pos IV
  // Player at pos VI moves to pos V
  // Player at pos I moves to pos VI
  const rotatePositionsClockwise = (pos: number[]): number[] => {
    return [pos[1], pos[2], pos[3], pos[4], pos[5], pos[0]];
  };

  // Add Point with automatic side-out rotation logic
  const handleAddPoint = (
    scoringTeam: TeamSide,
    type: PointEvent['type'] = 'point'
  ) => {
    if (currentSet.isFinished) return;

    playRefereeWhistle();

    const isSideOut = currentSet.servingTeam !== scoringTeam;
    const nextScoreA = scoringTeam === 'A' ? currentSet.scoreA + 1 : currentSet.scoreA;
    const nextScoreB = scoringTeam === 'B' ? currentSet.scoreB + 1 : currentSet.scoreB;

    let nextPositionsA = [...currentSet.currentPositionsA];
    let nextPositionsB = [...currentSet.currentPositionsB];

    // Side-out: if the non-serving team scores, they gain the serve AND rotate clockwise
    if (isSideOut) {
      if (scoringTeam === 'A') {
        nextPositionsA = rotatePositionsClockwise(currentSet.currentPositionsA);
      } else {
        nextPositionsB = rotatePositionsClockwise(currentSet.currentPositionsB);
      }
    }

    const currentServerNumber =
      scoringTeam === 'A' ? nextPositionsA[0] : nextPositionsB[0];

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const newPointEvent: PointEvent = {
      id: `pt-${Date.now()}`,
      setNumber: currentSet.setNumber,
      scoringTeamId: scoringTeam,
      scoreA: nextScoreA,
      scoreB: nextScoreB,
      serverNumber: currentServerNumber,
      type,
      timestamp: timeStr,
    };

    // Update service order records
    const updatedServiceRecordsA = { ...currentSet.serviceOrderRecordsA };
    const updatedServiceRecordsB = { ...currentSet.serviceOrderRecordsB };

    const updatedSet: SetData = {
      ...currentSet,
      scoreA: nextScoreA,
      scoreB: nextScoreB,
      servingTeam: scoringTeam,
      currentPositionsA: nextPositionsA,
      currentPositionsB: nextPositionsB,
      serviceOrderRecordsA: updatedServiceRecordsA,
      serviceOrderRecordsB: updatedServiceRecordsB,
    };

    const updatedSets = match.sets.map((s) =>
      s.setNumber === currentSet.setNumber ? updatedSet : s
    );

    onUpdateMatch({
      ...match,
      sets: updatedSets,
      pointsHistory: [newPointEvent, ...match.pointsHistory],
    });
  };

  // Undo Last Point
  const handleUndoPoint = () => {
    if (match.pointsHistory.length === 0) return;
    const lastPoint = match.pointsHistory[0];
    if (lastPoint.setNumber !== currentSet.setNumber) return;

    // Previous scores
    const prevScoreA =
      lastPoint.scoringTeamId === 'A' ? currentSet.scoreA - 1 : currentSet.scoreA;
    const prevScoreB =
      lastPoint.scoringTeamId === 'B' ? currentSet.scoreB - 1 : currentSet.scoreB;

    const remainingHistory = match.pointsHistory.slice(1);
    const prevPoint = remainingHistory.find(
      (p) => p.setNumber === currentSet.setNumber
    );

    const updatedSet: SetData = {
      ...currentSet,
      scoreA: Math.max(0, prevScoreA),
      scoreB: Math.max(0, prevScoreB),
      servingTeam: prevPoint ? prevPoint.scoringTeamId : currentSet.firstServeTeam,
    };

    const updatedSets = match.sets.map((s) =>
      s.setNumber === currentSet.setNumber ? updatedSet : s
    );

    onUpdateMatch({
      ...match,
      sets: updatedSets,
      pointsHistory: remainingHistory,
    });
  };

  // Manual court rotation override if requested
  const handleManualRotate = (teamId: TeamSide) => {
    let nextPositionsA = [...currentSet.currentPositionsA];
    let nextPositionsB = [...currentSet.currentPositionsB];

    if (teamId === 'A') {
      nextPositionsA = rotatePositionsClockwise(currentSet.currentPositionsA);
    } else {
      nextPositionsB = rotatePositionsClockwise(currentSet.currentPositionsB);
    }

    const updatedSet: SetData = {
      ...currentSet,
      currentPositionsA: nextPositionsA,
      currentPositionsB: nextPositionsB,
    };

    onUpdateMatch({
      ...match,
      sets: match.sets.map((s) =>
        s.setNumber === currentSet.setNumber ? updatedSet : s
      ),
    });
  };

  // Switch court sides (Tukar Lapangan)
  const handleSwitchSides = () => {
    const updatedSet: SetData = {
      ...currentSet,
      teamLeft: currentSet.teamRight,
      teamRight: currentSet.teamLeft,
    };
    onUpdateMatch({
      ...match,
      sets: match.sets.map((s) =>
        s.setNumber === currentSet.setNumber ? updatedSet : s
      ),
    });
  };

  // Confirm Time Out
  const handleConfirmTimeOut = (to: TimeOut) => {
    const isTeamA = to.teamId === 'A';
    const updatedSet: SetData = {
      ...currentSet,
      timeOutsA: isTeamA ? [...currentSet.timeOutsA, to] : currentSet.timeOutsA,
      timeOutsB: !isTeamA ? [...currentSet.timeOutsB, to] : currentSet.timeOutsB,
    };
    onUpdateMatch({
      ...match,
      sets: match.sets.map((s) =>
        s.setNumber === currentSet.setNumber ? updatedSet : s
      ),
    });
  };

  // Confirm Substitution
  const handleConfirmSubstitution = (sub: Substitution) => {
    const isTeamA = sub.teamId === 'A';
    const posIdx = sub.positionNumber - 1;

    let updatedPosA = [...currentSet.currentPositionsA];
    let updatedPosB = [...currentSet.currentPositionsB];

    if (isTeamA) {
      updatedPosA[posIdx] = sub.playerIn;
    } else {
      updatedPosB[posIdx] = sub.playerIn;
    }

    const updatedSet: SetData = {
      ...currentSet,
      currentPositionsA: updatedPosA,
      currentPositionsB: updatedPosB,
      substitutionsA: isTeamA
        ? [...currentSet.substitutionsA, sub]
        : currentSet.substitutionsA,
      substitutionsB: !isTeamA
        ? [...currentSet.substitutionsB, sub]
        : currentSet.substitutionsB,
    };

    onUpdateMatch({
      ...match,
      sets: match.sets.map((s) =>
        s.setNumber === currentSet.setNumber ? updatedSet : s
      ),
    });
  };

  // Confirm Sanction
  const handleConfirmSanction = (sanc: SanctionEvent) => {
    // If penalty (red card), opposing team receives 1 point
    let updatedSet = { ...currentSet };
    if (sanc.sanctionType === 'penalty') {
      const opposingTeam: TeamSide = sanc.teamId === 'A' ? 'B' : 'A';
      handleAddPoint(opposingTeam, 'penalty');
    }

    onUpdateMatch({
      ...match,
      sanctions: [sanc, ...match.sanctions],
    });
  };

  // Confirm Lineup
  const handleConfirmLineup = (lineupA: number[], lineupB: number[]) => {
    const updatedSet: SetData = {
      ...currentSet,
      lineupA,
      lineupB,
      currentPositionsA: [...lineupA],
      currentPositionsB: [...lineupB],
    };
    onUpdateMatch({
      ...match,
      sets: match.sets.map((s) =>
        s.setNumber === currentSet.setNumber ? updatedSet : s
      ),
    });
  };

  // Finish Set
  const handleFinishSet = () => {
    playTableBuzzer();
    const winner: TeamSide = currentSet.scoreA > currentSet.scoreB ? 'A' : 'B';
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const finishedSet: SetData = {
      ...currentSet,
      isFinished: true,
      winner,
      endTime: timeStr,
      durationMinutes: 22,
    };

    // Calculate sets won by each team
    const updatedSets = match.sets.map((s) =>
      s.setNumber === currentSet.setNumber ? finishedSet : s
    );

    const setsWonA = updatedSets.filter((s) => s.isFinished && s.winner === 'A').length;
    const setsWonB = updatedSets.filter((s) => s.isFinished && s.winner === 'B').length;

    let isMatchFinished = false;
    let matchWinner: TeamSide | undefined = undefined;

    if (setsWonA === 3) {
      isMatchFinished = true;
      matchWinner = 'A';
    } else if (setsWonB === 3) {
      isMatchFinished = true;
      matchWinner = 'B';
    } else {
      // Prepare next set if not finished
      const nextSetNum = currentSet.setNumber + 1;
      const nextSetExists = updatedSets.some((s) => s.setNumber === nextSetNum);
      if (!nextSetExists && nextSetNum <= 5) {
        // In volleyball, teams switch sides every set!
        const nextTeamLeft: TeamSide = currentSet.teamRight;
        const nextServing: TeamSide = currentSet.firstServeTeam === 'A' ? 'B' : 'A';
        const newSet: SetData = {
          setNumber: nextSetNum,
          teamLeft: nextTeamLeft,
          teamRight: nextTeamLeft === 'A' ? 'B' : 'A',
          servingTeam: nextServing,
          firstServeTeam: nextServing,
          scoreA: 0,
          scoreB: 0,
          startTime: timeStr,
          isFinished: false,
          lineupA: [...currentSet.lineupA],
          lineupB: [...currentSet.lineupB],
          currentPositionsA: [...currentSet.lineupA],
          currentPositionsB: [...currentSet.lineupB],
          substitutionsA: [],
          substitutionsB: [],
          timeOutsA: [],
          timeOutsB: [],
          serviceOrderRecordsA: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
          serviceOrderRecordsB: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
        };
        updatedSets.push(newSet);
      }
    }

    onUpdateMatch({
      ...match,
      currentSetNumber:
        !isMatchFinished && currentSet.setNumber < 5
          ? currentSet.setNumber + 1
          : currentSet.setNumber,
      sets: updatedSets,
      isMatchFinished,
      matchWinner,
    });
  };

  // Calculate sets won
  const setsWonA = match.sets.filter((s) => s.isFinished && s.winner === 'A').length;
  const setsWonB = match.sets.filter((s) => s.isFinished && s.winner === 'B').length;

  return (
    <div className="space-y-4">
      {/* Top Banner: Set Selector & Match Score Bar */}
      <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Active Set Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-black text-slate-500 uppercase mr-1">SET:</span>
            {[1, 2, 3, 4, 5].map((sNum) => {
              const setData = match.sets.find((s) => s.setNumber === sNum);
              const isActive = match.currentSetNumber === sNum;
              const isDone = setData?.isFinished;
              return (
                <button
                  key={sNum}
                  type="button"
                  onClick={() => {
                    if (setData) {
                      onUpdateMatch({ ...match, currentSetNumber: sNum });
                    }
                  }}
                  disabled={!setData}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs transition flex items-center gap-1 ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-sm ring-2 ring-slate-700'
                      : isDone
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                      : setData
                      ? 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      : 'bg-slate-50 text-slate-400 opacity-40 cursor-not-allowed'
                  }`}
                >
                  <span>Set {sNum}</span>
                  {sNum === 5 && <span className="text-[9px] font-black text-amber-300">(15)</span>}
                  {isDone && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Aggregate Set Wins */}
          <div className="flex items-center gap-4 bg-slate-900 text-white px-4 py-1.5 rounded-xl text-xs font-bold shadow-xs">
            <span style={{ color: match.teamA.color }}>{match.teamA.shortCode}</span>
            <span className="font-mono text-base font-black text-amber-400">
              {setsWonA} - {setsWonB}
            </span>
            <span style={{ color: match.teamB.color }}>{match.teamB.shortCode}</span>
          </div>

          {/* Quick Sound Buttons for Petugas Meja */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={playTableBuzzer}
              className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition flex items-center gap-1"
              title="Bunyikan Buzzer Meja (Table Buzzer) untuk memberi sinyal ke Wasit 2"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-600" />
              <span>Buzzer Meja</span>
            </button>
            <button
              type="button"
              onClick={onNavigateToSheet}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs"
            >
              <span>Format Lembar Resmi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Scoreboard & Quick Action Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* TEAM LEFT SCORE CARD */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: teamLeft.color }}
          ></div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block"
                  style={{ backgroundColor: teamLeft.color }}
                ></span>
                <h3 className="font-black text-base sm:text-lg text-slate-800 tracking-tight">
                  {teamLeft.name}
                </h3>
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                TIM {teamLeft.id} (KIRI)
              </span>
            </div>

            {/* Serving indicator */}
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-3">
              {currentSet.servingTeam === teamLeft.id ? (
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Volleyball className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span>Giliran Servis Aktif</span>
                </span>
              ) : (
                <span className="text-slate-400">Penerima Servis</span>
              )}
            </div>

            {/* Big Score Display */}
            <div className="text-center py-2 sm:py-4">
              <div
                className="text-7xl sm:text-8xl font-black font-mono tracking-tighter leading-none"
                style={{ color: teamLeft.color }}
              >
                {scoreLeft}
              </div>
              {isSetPoint && scoreLeft > scoreRight && (
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-rose-500 text-white text-[11px] font-black uppercase rounded-full animate-bounce">
                  SET POINT
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons for Left Team */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {/* Big +1 Point Button */}
            <button
              type="button"
              onClick={() => handleAddPoint(teamLeft.id, 'point')}
              disabled={currentSet.isFinished}
              className="w-full py-3 sm:py-4 rounded-xl text-white font-black text-base sm:text-lg shadow-md hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
              style={{ backgroundColor: teamLeft.color }}
            >
              <Plus className="w-6 h-6 stroke-[3]" />
              <span>+1 POIN {teamLeft.shortCode}</span>
            </button>

            {/* Quick Special Points */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleAddPoint(teamLeft.id, 'ace')}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition"
              >
                +1 Ace Servis
              </button>
              <button
                type="button"
                onClick={() => handleAddPoint(teamLeft.id, 'block')}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition"
              >
                +1 Monster Block
              </button>
            </div>

            {/* Table Official Match Duties for Left Team: TO & Subs */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedTOTeam(teamLeft.id);
                  setIsTimeOutModalOpen(true);
                }}
                className="py-2 px-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 font-bold text-amber-900 transition flex items-center justify-center gap-1.5"
              >
                <Timer className="w-4 h-4 text-amber-600" />
                <span>Time Out ({currentSet[teamLeft.id === 'A' ? 'timeOutsA' : 'timeOutsB'].length}/2)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSubTeam(teamLeft.id);
                  setIsSubModalOpen(true);
                }}
                className="py-2 px-2.5 rounded-xl border border-blue-300 bg-blue-50/80 hover:bg-blue-100 font-bold text-blue-900 transition flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Substitusi ({currentSet[teamLeft.id === 'A' ? 'substitutionsA' : 'substitutionsB'].length}/6)</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER MATCH CONTROLS & DESK TOOLS */}
        <div className="lg:col-span-2 bg-slate-900 rounded-2xl p-4 text-white shadow-sm flex flex-col justify-between space-y-3">
          <div className="text-center pb-2 border-b border-slate-800">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
              MEJA PETUGAS
            </span>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              SET {currentSet.setNumber}
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Target: {targetPoints} Poin (Selisih 2)
            </p>
          </div>

          {/* Global Operations */}
          <div className="space-y-2">
            {/* Undo Last Point */}
            <button
              type="button"
              onClick={handleUndoPoint}
              disabled={match.pointsHistory.length === 0}
              className="w-full py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5"
              title="Batalkan poin terakhir jika terjadi kesalahan pencatatan atau keputusan wasit"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Koreksi / Undo Poin</span>
            </button>

            {/* Sanctions Modal */}
            <button
              type="button"
              onClick={() => setIsSanctionModalOpen(true)}
              className="w-full py-2 px-2 rounded-xl bg-rose-950/70 border border-rose-800 hover:bg-rose-900 text-xs font-bold text-rose-200 transition flex items-center justify-center gap-1.5"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Catat Sanksi (Kartu)</span>
            </button>

            {/* Lineup modal */}
            <button
              type="button"
              onClick={() => setIsLineupModalOpen(true)}
              className="w-full py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition flex items-center justify-center gap-1.5"
            >
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Form Line-up Awal</span>
            </button>

            {/* Switch sides */}
            <button
              type="button"
              onClick={handleSwitchSides}
              className="w-full py-2 px-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition flex items-center justify-center gap-1.5"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-slate-400" />
              <span>Tukar Lapangan</span>
            </button>
          </div>

          {/* End Set Button */}
          <div className="pt-2 border-t border-slate-800">
            {canFinishSet ? (
              <button
                type="button"
                onClick={handleFinishSet}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black text-xs shadow-lg transition animate-pulse flex items-center justify-center gap-1.5"
              >
                <Trophy className="w-4 h-4" />
                <span>Tutup & Sahkan Set {currentSet.setNumber}</span>
              </button>
            ) : (
              <div className="text-center p-2 rounded-lg bg-slate-800/60 text-[10px] text-slate-400">
                Menunggu tercapainya target {targetPoints} poin dengan selisih minimal 2 poin
              </div>
            )}
          </div>
        </div>

        {/* TEAM RIGHT SCORE CARD */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 flex flex-col justify-between relative overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-1.5"
            style={{ backgroundColor: teamRight.color }}
          ></div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span
                  className="w-3.5 h-3.5 rounded-full inline-block"
                  style={{ backgroundColor: teamRight.color }}
                ></span>
                <h3 className="font-black text-base sm:text-lg text-slate-800 tracking-tight">
                  {teamRight.name}
                </h3>
              </div>
              <span className="text-xs font-extrabold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                TIM {teamRight.id} (KANAN)
              </span>
            </div>

            {/* Serving indicator */}
            <div className="flex items-center gap-1.5 text-xs font-semibold mb-3">
              {currentSet.servingTeam === teamRight.id ? (
                <span className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                  <Volleyball className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span>Giliran Servis Aktif</span>
                </span>
              ) : (
                <span className="text-slate-400">Penerima Servis</span>
              )}
            </div>

            {/* Big Score Display */}
            <div className="text-center py-2 sm:py-4">
              <div
                className="text-7xl sm:text-8xl font-black font-mono tracking-tighter leading-none"
                style={{ color: teamRight.color }}
              >
                {scoreRight}
              </div>
              {isSetPoint && scoreRight > scoreLeft && (
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-rose-500 text-white text-[11px] font-black uppercase rounded-full animate-bounce">
                  SET POINT
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons for Right Team */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            {/* Big +1 Point Button */}
            <button
              type="button"
              onClick={() => handleAddPoint(teamRight.id, 'point')}
              disabled={currentSet.isFinished}
              className="w-full py-3 sm:py-4 rounded-xl text-white font-black text-base sm:text-lg shadow-md hover:brightness-110 active:scale-[0.99] transition flex items-center justify-center gap-2"
              style={{ backgroundColor: teamRight.color }}
            >
              <Plus className="w-6 h-6 stroke-[3]" />
              <span>+1 POIN {teamRight.shortCode}</span>
            </button>

            {/* Quick Special Points */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleAddPoint(teamRight.id, 'ace')}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition"
              >
                +1 Ace Servis
              </button>
              <button
                type="button"
                onClick={() => handleAddPoint(teamRight.id, 'block')}
                className="py-1.5 px-2 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 transition"
              >
                +1 Monster Block
              </button>
            </div>

            {/* Table Official Match Duties for Right Team: TO & Subs */}
            <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
              <button
                type="button"
                onClick={() => {
                  setSelectedTOTeam(teamRight.id);
                  setIsTimeOutModalOpen(true);
                }}
                className="py-2 px-2.5 rounded-xl border border-amber-300 bg-amber-50/80 hover:bg-amber-100 font-bold text-amber-900 transition flex items-center justify-center gap-1.5"
              >
                <Timer className="w-4 h-4 text-amber-600" />
                <span>Time Out ({currentSet[teamRight.id === 'A' ? 'timeOutsA' : 'timeOutsB'].length}/2)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setSelectedSubTeam(teamRight.id);
                  setIsSubModalOpen(true);
                }}
                className="py-2 px-2.5 rounded-xl border border-blue-300 bg-blue-50/80 hover:bg-blue-100 font-bold text-blue-900 transition flex items-center justify-center gap-1.5"
              >
                <UserCheck className="w-4 h-4 text-blue-600" />
                <span>Substitusi ({currentSet[teamRight.id === 'A' ? 'substitutionsA' : 'substitutionsB'].length}/6)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Volleyball Court: 6 Positions & Rotation Tracker */}
      <VolleyballCourt
        teamLeft={teamLeft}
        teamRight={teamRight}
        positionsLeft={positionsLeft}
        positionsRight={positionsRight}
        servingTeam={currentSet.servingTeam}
        onRotate={handleManualRotate}
      />

      {/* Official Running Score Strip (Kolom Poin Berjalan 1 s/d 35) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-sm text-slate-800">
              KOLOM POIN BERJALAN RESMI (RUNNING SCORE - SET {currentSet.setNumber})
            </h4>
            <span className="text-[11px] text-slate-500">
              Pencoretan angka poin real-time standar FIVB
            </span>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            Kiri: {teamLeft.shortCode} | Kanan: {teamRight.shortCode}
          </span>
        </div>

        {/* Running score horizontal strips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Left Team Running Score */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
              <span style={{ color: teamLeft.color }}>{teamLeft.name}</span>
              <span className="text-slate-500">Total: {scoreLeft}</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {Array.from({ length: Math.max(30, scoreLeft + 2) }, (_, i) => i + 1).map((pt) => {
                const isCrossed = pt <= scoreLeft;
                const isCurrent = pt === scoreLeft;
                return (
                  <div
                    key={pt}
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] font-bold border transition ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 font-black border-amber-600 scale-105 shadow-xs'
                        : isCrossed
                        ? 'bg-slate-300 text-slate-500 line-through border-slate-400 opacity-80'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {pt}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Team Running Score */}
          <div className="p-2 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between text-xs font-bold mb-1.5 px-1">
              <span style={{ color: teamRight.color }}>{teamRight.name}</span>
              <span className="text-slate-500">Total: {scoreRight}</span>
            </div>
            <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
              {Array.from({ length: Math.max(30, scoreRight + 2) }, (_, i) => i + 1).map((pt) => {
                const isCrossed = pt <= scoreRight;
                const isCurrent = pt === scoreRight;
                return (
                  <div
                    key={pt}
                    className={`w-6 h-6 rounded flex items-center justify-center font-mono text-[11px] font-bold border transition ${
                      isCurrent
                        ? 'bg-amber-400 text-slate-950 font-black border-amber-600 scale-105 shadow-xs'
                        : isCrossed
                        ? 'bg-slate-300 text-slate-500 line-through border-slate-400 opacity-80'
                        : 'bg-white text-slate-700 border-slate-200'
                    }`}
                  >
                    {pt}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Match Events Log (Timeline Meja Petugas) */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200">
        <div className="flex items-center gap-2 mb-3">
          <History className="w-4 h-4 text-slate-600" />
          <h4 className="font-extrabold text-sm text-slate-800">
            LOG AKTIVITAS MEJA PENCATAT SKOR (AUDIT TRAIL)
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Substitutions in this set */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <h5 className="font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>Pergantian Pemain</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                {currentSet.substitutionsA.length + currentSet.substitutionsB.length} Kali
              </span>
            </h5>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {[...currentSet.substitutionsA, ...currentSet.substitutionsB].length === 0 ? (
                <p className="text-slate-400 italic">Belum ada pergantian di set ini.</p>
              ) : (
                [...currentSet.substitutionsA, ...currentSet.substitutionsB].map((sub) => (
                  <div
                    key={sub.id}
                    className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-bold text-blue-700">Tim {sub.teamId}</span>
                    <span>
                      Keluar: #{sub.playerOut} ➔ Masuk: #{sub.playerIn}
                    </span>
                    <span className="font-mono text-slate-500">({sub.scoreAtSub})</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Time Outs in this set */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <h5 className="font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>Time-Out (TO)</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                {currentSet.timeOutsA.length + currentSet.timeOutsB.length} Kali
              </span>
            </h5>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {[...currentSet.timeOutsA, ...currentSet.timeOutsB].length === 0 ? (
                <p className="text-slate-400 italic">Belum ada time-out di set ini.</p>
              ) : (
                [...currentSet.timeOutsA, ...currentSet.timeOutsB].map((to) => (
                  <div
                    key={to.id}
                    className="p-1.5 rounded bg-white border border-slate-200 flex items-center justify-between text-[11px]"
                  >
                    <span className="font-bold text-amber-700">
                      Tim {to.teamId} (TO #{to.toIndex})
                    </span>
                    <span className="font-mono text-slate-600">Skor: {to.scoreAtTO}</span>
                    <span className="text-slate-400">{to.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Sanctions */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <h5 className="font-bold text-slate-700 mb-2 flex items-center justify-between">
              <span>Sanksi & Kartu Wasit</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-800">
                {match.sanctions.length} Sanksi
              </span>
            </h5>
            <div className="space-y-1.5 max-h-36 overflow-y-auto">
              {match.sanctions.length === 0 ? (
                <p className="text-slate-400 italic">Pertandingan bersih tanpa sanksi.</p>
              ) : (
                match.sanctions.map((sanc) => (
                  <div
                    key={sanc.id}
                    className="p-1.5 rounded bg-white border border-slate-200 text-[11px]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-rose-700 uppercase">
                        {sanc.sanctionType}
                      </span>
                      <span className="text-slate-500">
                        Set {sanc.setNumber} ({sanc.scoreAtSanction})
                      </span>
                    </div>
                    <div className="text-slate-600 mt-0.5">
                      Tim {sanc.teamId} - {sanc.isOfficial ? `Ofisial (${sanc.personNumber})` : `Pemain #${sanc.personNumber}`}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TimeOutModal
        isOpen={isTimeOutModalOpen}
        onClose={() => setIsTimeOutModalOpen(false)}
        team={selectedTOTeam === 'A' ? match.teamA : match.teamB}
        currentSetNumber={currentSet.setNumber}
        currentScoreA={currentSet.scoreA}
        currentScoreB={currentSet.scoreB}
        timeOutsUsed={selectedTOTeam === 'A' ? currentSet.timeOutsA : currentSet.timeOutsB}
        onConfirmTimeOut={handleConfirmTimeOut}
      />

      <SubstitutionModal
        isOpen={isSubModalOpen}
        onClose={() => setIsSubModalOpen(false)}
        team={selectedSubTeam === 'A' ? match.teamA : match.teamB}
        currentPositions={
          selectedSubTeam === 'A'
            ? currentSet.currentPositionsA
            : currentSet.currentPositionsB
        }
        currentSetNumber={currentSet.setNumber}
        currentScoreA={currentSet.scoreA}
        currentScoreB={currentSet.scoreB}
        substitutionsUsed={
          selectedSubTeam === 'A'
            ? currentSet.substitutionsA
            : currentSet.substitutionsB
        }
        onConfirmSubstitution={handleConfirmSubstitution}
      />

      <SanctionModal
        isOpen={isSanctionModalOpen}
        onClose={() => setIsSanctionModalOpen(false)}
        teamA={match.teamA}
        teamB={match.teamB}
        currentSetNumber={currentSet.setNumber}
        currentScoreA={currentSet.scoreA}
        currentScoreB={currentSet.scoreB}
        onConfirmSanction={handleConfirmSanction}
      />

      <LineupModal
        isOpen={isLineupModalOpen}
        onClose={() => setIsLineupModalOpen(false)}
        teamA={match.teamA}
        teamB={match.teamB}
        currentLineupA={currentSet.lineupA}
        currentLineupB={currentSet.lineupB}
        onConfirmLineup={handleConfirmLineup}
      />
    </div>
  );
};
