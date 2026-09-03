import React from 'react';
import { Team, TeamSide } from '../types';
import { Volleyball, RotateCw } from 'lucide-react';

interface VolleyballCourtProps {
  teamLeft: Team;
  teamRight: Team;
  positionsLeft: number[]; // 6 numbers for positions [I, II, III, IV, V, VI]
  positionsRight: number[];
  servingTeam: TeamSide;
  onRotate?: (teamId: TeamSide) => void;
  readOnly?: boolean;
}

export const VolleyballCourt: React.FC<VolleyballCourtProps> = ({
  teamLeft,
  teamRight,
  positionsLeft,
  positionsRight,
  servingTeam,
  onRotate,
  readOnly = false,
}) => {
  // Helper to find player details by number
  const getPlayerDetails = (team: Team, num: number) => {
    return team.roster.find((p) => p.number === num) || {
      number: num,
      name: `#${num}`,
      isCaptain: false,
      isLibero: false,
    };
  };

  // Posisi I is server (index 0). Index mapping: 0=I, 1=II, 2=III, 3=IV, 4=V, 5=VI
  const isLeftServing = servingTeam === teamLeft.id;
  const isRightServing = servingTeam === teamRight.id;

  const renderPlayerBadge = (
    team: Team,
    posIndex: number,
    romanLabel: string,
    isServer: boolean
  ) => {
    const playerNum =
      team.id === teamLeft.id ? positionsLeft[posIndex] : positionsRight[posIndex];
    const player = getPlayerDetails(team, playerNum);

    return (
      <div
        className={`relative flex flex-col items-center justify-center p-2 rounded-xl transition-all border ${
          isServer
            ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-400'
            : 'bg-white/95 border-slate-200 shadow-xs hover:border-slate-400'
        }`}
      >
        {/* Posisi Romawi label */}
        <div className="absolute top-1 left-1.5 text-[9px] font-extrabold uppercase px-1 py-0.2 rounded bg-slate-100 text-slate-600">
          Pos {romanLabel}
        </div>

        {/* Server Indicator */}
        {isServer && (
          <div className="absolute top-1 right-1.5 flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-amber-500 text-white text-[9px] font-bold animate-pulse">
            <Volleyball className="w-2.5 h-2.5" />
            <span>SERVIS</span>
          </div>
        )}

        {/* Nomor Punggung */}
        <div className="mt-2.5 flex items-center justify-center">
          <span
            className="text-xl sm:text-2xl font-black tracking-tight"
            style={{ color: team.color }}
          >
            {player.number}
          </span>
          {player.isCaptain && (
            <span className="ml-1 px-1 py-0.5 text-[9px] font-black rounded bg-emerald-600 text-white">
              (C)
            </span>
          )}
          {player.isLibero && (
            <span className="ml-1 px-1 py-0.5 text-[9px] font-black rounded bg-purple-600 text-white">
              (L)
            </span>
          )}
        </div>

        {/* Nama Pemain */}
        <p className="text-[11px] font-semibold text-slate-700 truncate max-w-[85px] sm:max-w-[110px] text-center">
          {player.name}
        </p>
      </div>
    );
  };

  return (
    <div className="w-full bg-slate-900 rounded-2xl p-3 sm:p-4 text-white shadow-lg overflow-hidden">
      {/* Header Court Bar */}
      <div className="flex items-center justify-between mb-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamLeft.color }}></span>
          <span className="font-bold tracking-wide">{teamLeft.name} (KIRI)</span>
        </div>

        <div className="text-center text-slate-400 hidden sm:block font-medium">
          Tampak Meja Petugas (Table Official View) • Garis Serang 3 Meter & Net Tengah
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wide">{teamRight.name} (KANAN)</span>
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: teamRight.color }}></span>
        </div>
      </div>

      {/* Main Volleyball Court Layout (Orange/Wood Floor with Blue Free Zone) */}
      <div className="relative w-full rounded-xl bg-amber-600 p-2 sm:p-3 border-4 border-slate-700 shadow-inner overflow-hidden">
        {/* Outer Boundary line */}
        <div className="grid grid-cols-2 gap-0 relative bg-amber-500/95 border-2 border-white rounded-lg">
          
          {/* NET in the center */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-1.5 bg-slate-100 z-20 shadow-md flex flex-col justify-between items-center py-1">
            <div className="w-4 h-1 bg-slate-800 rounded-full"></div>
            <div className="text-[9px] text-slate-700 font-extrabold uppercase bg-white px-0.5 py-1 rounded shadow-xs rotate-90 whitespace-nowrap">
              NET
            </div>
            <div className="w-4 h-1 bg-slate-800 rounded-full"></div>
          </div>

          {/* LEFT COURT HALF (TEAM LEFT) */}
          <div className="relative p-2 sm:p-3 border-r border-dashed border-white/50">
            {/* 3m Attack Line */}
            <div className="absolute right-1/3 top-0 bottom-0 w-0.5 bg-white/70 border-r border-dashed border-white"></div>
            
            {/* Grid for Left Team: 
                Front Row (near net): Pos IV (top), Pos III (center), Pos II (bottom)
                Back Row: Pos V (top), Pos VI (center), Pos I (bottom - Server)
            */}
            <div className="grid grid-cols-2 gap-2 relative z-10">
              {/* Back Row (Left Col) */}
              <div className="flex flex-col gap-2">
                {renderPlayerBadge(teamLeft, 4, 'V', false)}
                {renderPlayerBadge(teamLeft, 5, 'VI', false)}
                {renderPlayerBadge(teamLeft, 0, 'I', isLeftServing)}
              </div>
              
              {/* Front Row (Right Col near net) */}
              <div className="flex flex-col gap-2">
                {renderPlayerBadge(teamLeft, 3, 'IV', false)}
                {renderPlayerBadge(teamLeft, 2, 'III', false)}
                {renderPlayerBadge(teamLeft, 1, 'II', false)}
              </div>
            </div>

            {/* Quick manual rotate button for testing/adjusting */}
            {!readOnly && onRotate && (
              <button
                type="button"
                onClick={() => onRotate(teamLeft.id)}
                className="mt-2 text-[10px] flex items-center justify-center gap-1 w-full py-1 bg-black/40 hover:bg-black/60 rounded text-amber-200 transition font-medium"
                title="Rotasi manual pemain jika diperlukan perbaikan posisi"
              >
                <RotateCw className="w-3 h-3" />
                Rotasi Tim {teamLeft.shortCode}
              </button>
            )}
          </div>

          {/* RIGHT COURT HALF (TEAM RIGHT) */}
          <div className="relative p-2 sm:p-3 border-l border-dashed border-white/50">
            {/* 3m Attack Line */}
            <div className="absolute left-1/3 top-0 bottom-0 w-0.5 bg-white/70 border-l border-dashed border-white"></div>

            {/* Grid for Right Team:
                Front Row (near net): Pos II (bottom), Pos III (center), Pos IV (top)
                Back Row: Pos I (bottom - Server), Pos VI (center), Pos V (top)
            */}
            <div className="grid grid-cols-2 gap-2 relative z-10">
              {/* Front Row (Left Col near net) */}
              <div className="flex flex-col gap-2">
                {renderPlayerBadge(teamRight, 3, 'IV', false)}
                {renderPlayerBadge(teamRight, 2, 'III', false)}
                {renderPlayerBadge(teamRight, 1, 'II', false)}
              </div>

              {/* Back Row (Right Col) */}
              <div className="flex flex-col gap-2">
                {renderPlayerBadge(teamRight, 4, 'V', false)}
                {renderPlayerBadge(teamRight, 5, 'VI', false)}
                {renderPlayerBadge(teamRight, 0, 'I', isRightServing)}
              </div>
            </div>

            {/* Quick manual rotate button */}
            {!readOnly && onRotate && (
              <button
                type="button"
                onClick={() => onRotate(teamRight.id)}
                className="mt-2 text-[10px] flex items-center justify-center gap-1 w-full py-1 bg-black/40 hover:bg-black/60 rounded text-amber-200 transition font-medium"
                title="Rotasi manual pemain jika diperlukan perbaikan posisi"
              >
                <RotateCw className="w-3 h-3" />
                Rotasi Tim {teamRight.shortCode}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Footer Court Info: Petugas Meja Position */}
      <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
          <span>Posisi I = Pemain Pemegang Servis</span>
        </div>
        <div className="font-semibold text-slate-300">
          ▼ LOKASI MEJA PENCATAT SKOR (TABLE OFFICIAL) ▼
        </div>
        <div className="flex items-center gap-1">
          <span>Arah Rotasi:</span>
          <span className="font-semibold text-amber-300">Searah Jarum Jam (I ➔ VI ➔ V ➔ IV ➔ III ➔ II)</span>
        </div>
      </div>
    </div>
  );
};
