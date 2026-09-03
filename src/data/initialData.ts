import { VolleyballMatch, SetData, Player, Team } from '../types';

export const initialRosterA: Player[] = [
  { id: 'a1', number: 1, name: 'Rendy Tamamilang', isCaptain: false, isLibero: false },
  { id: 'a2', number: 3, name: 'Nizar Zulfikar', isCaptain: true, isLibero: false }, // Setter & Captain
  { id: 'a3', number: 7, name: 'Agil Angga', isCaptain: false, isLibero: false },
  { id: 'a4', number: 9, name: 'Yuda Mardiansyah', isCaptain: false, isLibero: false }, // Middle Blocker
  { id: 'a5', number: 10, name: 'Fahri Septian', isCaptain: false, isLibero: false }, // Outside Hitter
  { id: 'a6', number: 14, name: 'Henry Ade Novian', isCaptain: false, isLibero: true }, // Libero 1
  { id: 'a7', number: 17, name: 'Rivan Nurmulki', isCaptain: false, isLibero: false }, // Opposite
  { id: 'a8', number: 4, name: 'Mahfud Nurcahyadi', isCaptain: false, isLibero: false },
  { id: 'a9', number: 5, name: 'Hernanda Zulfi', isCaptain: false, isLibero: false },
  { id: 'a10', number: 8, name: 'Dio Zulfikri', isCaptain: false, isLibero: false },
  { id: 'a11', number: 11, name: 'Farhan Halim', isCaptain: false, isLibero: false },
  { id: 'a12', number: 19, name: 'Fahreza Rakha', isCaptain: false, isLibero: true }, // Libero 2
];

export const initialRosterB: Player[] = [
  { id: 'b1', number: 2, name: 'Doni Haryono', isCaptain: false, isLibero: false },
  { id: 'b2', number: 5, name: 'Sigit Ardian', isCaptain: true, isLibero: false }, // Captain
  { id: 'b3', number: 6, name: 'Boy Arnez Arabi', isCaptain: false, isLibero: false },
  { id: 'b4', number: 8, name: 'Jasen Natanael', isCaptain: false, isLibero: false }, // Setter
  { id: 'b5', number: 12, name: 'Cep Indra Agustin', isCaptain: false, isLibero: false }, // Middle Blocker
  { id: 'b6', number: 13, name: 'Muhammad Malizi', isCaptain: false, isLibero: false },
  { id: 'b7', number: 15, name: 'Dimas Saputra', isCaptain: false, isLibero: false }, // Opposite
  { id: 'b8', number: 18, name: 'Irpan', isCaptain: false, isLibero: true }, // Libero 1
  { id: 'b9', number: 4, name: 'Alfin Daniel', isCaptain: false, isLibero: false },
  { id: 'b10', number: 7, name: 'Kaula Nur Hidayat', isCaptain: false, isLibero: false },
  { id: 'b11', number: 11, name: 'Amin Kurnia', isCaptain: false, isLibero: false },
  { id: 'b12', number: 19, name: 'Prasojo', isCaptain: false, isLibero: true }, // Libero 2
];

export const teamADefault: Team = {
  id: 'A',
  name: 'JAKARTA BHAYANGKARA',
  shortCode: 'JBK',
  color: '#2563eb', // Blue
  coach: 'Reidel Toiran',
  assistantCoach: 'Dedi Mulyadi',
  trainer: 'dr. Anton Wijaya',
  roster: initialRosterA,
};

export const teamBDefault: Team = {
  id: 'B',
  name: 'SURABAYA SAMATOR',
  shortCode: 'SBS',
  color: '#dc2626', // Red
  coach: 'Ibarsjah Djanu Tjahjono',
  assistantCoach: 'Sigit Hermanto',
  trainer: 'dr. Bambang Sulistyo',
  roster: initialRosterB,
};

export function createEmptySet(setNumber: number, teamLeft: 'A' | 'B' = 'A', servingTeam: 'A' | 'B' = 'A'): SetData {
  const teamRight = teamLeft === 'A' ? 'B' : 'A';
  // Standard starting lineup numbers: Pos I to VI
  const lineupA = [3, 10, 9, 17, 7, 5]; // Setter at pos I, OH at pos II, MB at pos III, OP at pos IV, OH at pos V, MB at pos VI
  const lineupB = [8, 2, 12, 15, 6, 13];

  return {
    setNumber,
    teamLeft,
    teamRight,
    servingTeam,
    firstServeTeam: servingTeam,
    scoreA: 0,
    scoreB: 0,
    startTime: '14:00',
    isFinished: false,
    lineupA: [...lineupA],
    lineupB: [...lineupB],
    currentPositionsA: [...lineupA],
    currentPositionsB: [...lineupB],
    substitutionsA: [],
    substitutionsB: [],
    timeOutsA: [],
    timeOutsB: [],
    serviceOrderRecordsA: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
    serviceOrderRecordsB: { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] },
  };
}

export const initialMatchData: VolleyballMatch = {
  matchInfo: {
    id: 'match-2026-001',
    competitionName: 'KEJUARAAN NASIONAL BOLA VOLI SENIOR PBVSI 2026',
    matchNumber: 'M-14',
    division: 'Putra',
    category: 'Senior',
    city: 'Surabaya',
    hallVenue: 'GOR Pancasila Surabaya',
    date: '2026-09-03',
    scheduledTime: '14:00 WIB',
    pool: 'Pool A - Babak Penyisihan',
    remarks: 'Pertandingan berjalan lancar sesuai regulasi FIVB / PBVSI.',
  },
  officials: {
    firstReferee: 'Drs. H. Sugeng Riyadi, M.Pd (Wasit Nasional A)',
    secondReferee: 'Agus Priyono, S.Or (Wasit Nasional B)',
    scorer: 'Sukarjono, S.Pd (Petugas Meja Utama)',
    assistantScorer: 'Dewi Anggraini (Libero Tracker)',
    lineJudge1: 'Rahmat Hidayat',
    lineJudge2: 'Tri Wahyudi',
    lineJudge3: 'Budi Santoso',
    lineJudge4: 'Eko Prasetyo',
  },
  teamA: teamADefault,
  teamB: teamBDefault,
  currentSetNumber: 1,
  sets: [
    {
      setNumber: 1,
      teamLeft: 'A',
      teamRight: 'B',
      servingTeam: 'A',
      firstServeTeam: 'A',
      scoreA: 18,
      scoreB: 16,
      startTime: '14:05',
      isFinished: false,
      lineupA: [3, 10, 9, 17, 7, 5],
      lineupB: [8, 2, 12, 15, 6, 13],
      currentPositionsA: [5, 3, 10, 9, 17, 7], // rotated 1 step
      currentPositionsB: [13, 8, 2, 12, 15, 6],
      substitutionsA: [
        {
          id: 'sub-1',
          teamId: 'A',
          setNumber: 1,
          positionNumber: 4,
          playerOut: 17,
          playerIn: 1,
          scoreAtSub: '12:10',
          timestamp: '14:18',
        }
      ],
      substitutionsB: [
        {
          id: 'sub-2',
          teamId: 'B',
          setNumber: 1,
          positionNumber: 1,
          playerOut: 8,
          playerIn: 4,
          scoreAtSub: '14:15',
          timestamp: '14:22',
        }
      ],
      timeOutsA: [
        {
          id: 'to-a-1',
          teamId: 'A',
          setNumber: 1,
          toIndex: 1,
          scoreAtTO: '10:11',
          timestamp: '14:15',
        }
      ],
      timeOutsB: [
        {
          id: 'to-b-1',
          teamId: 'B',
          setNumber: 1,
          toIndex: 1,
          scoreAtTO: '16:13',
          timestamp: '14:24',
        }
      ],
      serviceOrderRecordsA: {
        1: [3],
        2: [7],
        3: [11],
        4: [15],
        5: [18],
        6: []
      },
      serviceOrderRecordsB: {
        1: [2],
        2: [5],
        3: [8],
        4: [12],
        5: [16],
        6: []
      }
    }
  ],
  pointsHistory: [
    { id: 'p1', setNumber: 1, scoringTeamId: 'A', scoreA: 1, scoreB: 0, serverNumber: 3, type: 'ace', timestamp: '14:06' },
    { id: 'p2', setNumber: 1, scoringTeamId: 'A', scoreA: 2, scoreB: 0, serverNumber: 3, type: 'point', timestamp: '14:07' },
    { id: 'p3', setNumber: 1, scoringTeamId: 'B', scoreA: 2, scoreB: 1, serverNumber: 3, type: 'point', timestamp: '14:08' },
    { id: 'p4', setNumber: 1, scoringTeamId: 'B', scoreA: 2, scoreB: 2, serverNumber: 8, type: 'point', timestamp: '14:09' },
  ],
  sanctions: [
    {
      id: 'sanc-1',
      setNumber: 1,
      teamId: 'B',
      personNumber: '5',
      isOfficial: false,
      sanctionType: 'warning',
      scoreAtSanction: '11:12',
      remarks: 'Protes berlebihan kepada Wasit 1',
      timestamp: '14:17',
    }
  ],
  isMatchFinished: false,
};
