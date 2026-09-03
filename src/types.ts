export type TeamSide = 'A' | 'B';

export type SanctionType = 'warning' | 'penalty' | 'expulsion' | 'disqualification';

export interface Player {
  id: string;
  number: number;
  name: string;
  isCaptain: boolean;
  isLibero: boolean;
}

export interface Team {
  id: TeamSide;
  name: string;
  shortCode: string;
  color: string; // hex or tailwind class
  coach: string;
  assistantCoach: string;
  trainer: string;
  roster: Player[];
}

export interface Substitution {
  id: string;
  teamId: TeamSide;
  setNumber: number;
  positionNumber: number; // 1 to 6 (Court position I to VI)
  playerOut: number; // shirt number
  playerIn: number; // shirt number
  scoreAtSub: string; // e.g. "14:12" (Team A score : Team B score)
  timestamp: string;
}

export interface TimeOut {
  id: string;
  teamId: TeamSide;
  setNumber: number;
  toIndex: 1 | 2; // 1st or 2nd time out
  scoreAtTO: string; // e.g. "18:20"
  timestamp: string;
}

export interface SanctionEvent {
  id: string;
  setNumber: number;
  teamId: TeamSide;
  personNumber: string; // Player number or 'C' (Coach), 'AC' (Asst Coach), 'T' (Trainer)
  isOfficial: boolean;
  sanctionType: SanctionType;
  scoreAtSanction: string;
  remarks?: string;
  timestamp: string;
}

export interface PointEvent {
  id: string;
  setNumber: number;
  scoringTeamId: TeamSide;
  scoreA: number;
  scoreB: number;
  serverNumber: number;
  type: 'point' | 'ace' | 'block' | 'opponent_error' | 'penalty';
  timestamp: string;
}

// Service order rotation tracking for a team in a set
export interface ServiceBoxRecord {
  serverNumber: number;
  startingScore?: number;
  exitScore?: number; // score when team lost the service
}

export interface SetData {
  setNumber: number;
  teamLeft: TeamSide; // which team is on the left side of court
  teamRight: TeamSide;
  servingTeam: TeamSide; // currently serving team
  firstServeTeam: TeamSide; // team that had the first serve of this set
  scoreA: number;
  scoreB: number;
  startTime: string;
  endTime?: string;
  durationMinutes?: number;
  isFinished: boolean;
  winner?: TeamSide;
  
  // Starting lineup: 6 player numbers in positions [I, II, III, IV, V, VI]
  lineupA: number[];
  lineupB: number[];
  
  // Current rotated positions on court [I, II, III, IV, V, VI]
  currentPositionsA: number[];
  currentPositionsB: number[];
  
  // Substitutions made in this set (max 6 per team)
  substitutionsA: Substitution[];
  substitutionsB: Substitution[];
  
  // Time-outs taken in this set (max 2 per team)
  timeOutsA: TimeOut[];
  timeOutsB: TimeOut[];
  
  // Service rounds record (I to VI)
  serviceOrderRecordsA: {
    [position: number]: number[]; // exit scores for each service turn at this position
  };
  serviceOrderRecordsB: {
    [position: number]: number[];
  };
}

export interface MatchOfficials {
  firstReferee: string;
  secondReferee: string;
  scorer: string; // Petugas Meja (Pencatat Skor)
  assistantScorer: string; // Asisten Pencatat Skor / Libero Tracker
  lineJudge1: string;
  lineJudge2: string;
  lineJudge3: string;
  lineJudge4: string;
}

export interface MatchInfo {
  id: string;
  competitionName: string;
  matchNumber: string;
  division: 'Putra' | 'Putri';
  category: 'Senior' | 'Junior' | 'U-21' | 'Pelajar' | 'Umum';
  city: string;
  hallVenue: string;
  date: string;
  scheduledTime: string;
  pool: string;
  remarks: string;
}

export interface VolleyballMatch {
  matchInfo: MatchInfo;
  officials: MatchOfficials;
  teamA: Team;
  teamB: Team;
  currentSetNumber: number;
  sets: SetData[];
  pointsHistory: PointEvent[];
  sanctions: SanctionEvent[];
  matchWinner?: TeamSide;
  isMatchFinished: boolean;
}
