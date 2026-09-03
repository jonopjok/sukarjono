import React from 'react';
import { VolleyballMatch, Team, SetData } from '../types';
import { Printer, Download, CheckCircle2, Shield } from 'lucide-react';

interface OfficialScoresheetProps {
  match: VolleyballMatch;
}

export const OfficialScoresheet: React.FC<OfficialScoresheetProps> = ({ match }) => {
  const handlePrint = () => {
    window.print();
  };

  const exportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify(match, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `scoresheet-${match.matchInfo.matchNumber}-${match.matchInfo.date}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Helper for running score strip up to 30
  const renderRunningScoreBox = (set: SetData, teamId: 'A' | 'B') => {
    const score = teamId === 'A' ? set.scoreA : set.scoreB;
    const items = [];
    for (let i = 1; i <= 30; i++) {
      const isCrossed = i <= score;
      items.push(
        <span
          key={i}
          className={`inline-flex items-center justify-center w-5 h-5 text-[9px] font-mono border border-slate-300 font-bold ${
            isCrossed ? 'bg-slate-300 text-slate-800 line-through' : 'text-slate-600 bg-white'
          }`}
        >
          {i}
        </span>
      );
    }
    return <div className="flex flex-wrap gap-0.5 max-w-[170px]">{items}</div>;
  };

  // Calculate results summary
  const setsWonA = match.sets.filter((s) => s.isFinished && s.winner === 'A').length;
  const setsWonB = match.sets.filter((s) => s.isFinished && s.winner === 'B').length;

  return (
    <div className="space-y-4">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
        <div>
          <h3 className="font-extrabold text-base text-slate-900">
            LEMBAR SKOR PERTANDINGAN RESMI (OFFICIAL SCORESHEET)
          </h3>
          <p className="text-xs text-slate-500">
            Format standar pengisian Petugas Meja (Scorer) sesuai regulasi FIVB / PBVSI
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={exportJSON}
            className="px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor JSON Arsip</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Cetak Lembar Skor (Print / PDF)</span>
          </button>
        </div>
      </div>

      {/* THE OFFICIAL SCORESHEET PAPER (PRINTABLE DOCUMENT) */}
      <div
        id="official-scoresheet-printable"
        className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-300 shadow-md font-sans text-slate-900 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full"
      >
        {/* SECTION 1: HEADER & MATCH IDENTIFICATION */}
        <div className="border-2 border-slate-800 p-3 mb-3">
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-slate-800 pb-2 mb-2 gap-2 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0">
                PBVSI
              </div>
              <div>
                <h2 className="font-black text-base sm:text-lg tracking-wider text-slate-900 uppercase">
                  LEMBAR SKOR RESMI BOLA VOLI
                </h2>
                <p className="text-xs font-bold text-slate-700">
                  {match.matchInfo.competitionName}
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold uppercase text-slate-500 block">
                Nomor Pertandingan:
              </span>
              <span className="font-mono font-black text-lg text-slate-900 px-3 py-0.5 bg-slate-100 border border-slate-300 rounded inline-block">
                {match.matchInfo.matchNumber}
              </span>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="font-bold text-slate-500 block text-[10px] uppercase">
                Kota / Tempat:
              </span>
              <span className="font-semibold text-slate-800">
                {match.matchInfo.city} • {match.matchInfo.hallVenue}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block text-[10px] uppercase">
                Tanggal & Jam:
              </span>
              <span className="font-semibold text-slate-800">
                {match.matchInfo.date} • {match.matchInfo.scheduledTime}
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block text-[10px] uppercase">
                Kategori / Divisi:
              </span>
              <span className="font-semibold text-slate-800">
                {match.matchInfo.division} ({match.matchInfo.category})
              </span>
            </div>
            <div>
              <span className="font-bold text-slate-500 block text-[10px] uppercase">
                Babak / Pool:
              </span>
              <span className="font-semibold text-slate-800">
                {match.matchInfo.pool}
              </span>
            </div>
          </div>
        </div>

        {/* SECTION 2: ROSTERS OF TEAM A AND TEAM B */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
          
          {/* ROSTER TIM A */}
          <div className="border border-slate-800 rounded p-2.5">
            <div className="flex items-center justify-between bg-blue-900 text-white p-1.5 rounded-xs font-bold uppercase text-xs mb-2">
              <span>(A) {match.teamA.name}</span>
              <span className="text-[10px] font-mono">Kode: {match.teamA.shortCode}</span>
            </div>

            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-slate-700">
                  <th className="py-1 px-1.5 w-10 text-center">No.</th>
                  <th className="py-1 px-1.5">Nama Pemain Lengkap</th>
                  <th className="py-1 px-1.5 w-16 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {match.teamA.roster.map((p) => (
                  <tr key={p.id} className="border-b border-slate-200">
                    <td className="py-0.5 px-1.5 text-center font-bold font-mono">
                      {p.number}
                    </td>
                    <td className="py-0.5 px-1.5">{p.name}</td>
                    <td className="py-0.5 px-1.5 text-center">
                      {p.isCaptain && (
                        <span className="px-1 bg-slate-900 text-white font-bold rounded text-[9px]">
                          (C)
                        </span>
                      )}
                      {p.isLibero && (
                        <span className="px-1 bg-purple-700 text-white font-bold rounded text-[9px]">
                          (L)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Officials Tim A */}
            <div className="mt-2 pt-1 border-t border-slate-300 text-[10px] text-slate-600 space-y-0.5">
              <div>
                <strong>Pelatih (C):</strong> {match.teamA.coach}
              </div>
              <div>
                <strong>Asisten Pelatih (AC):</strong> {match.teamA.assistantCoach}
              </div>
            </div>
          </div>

          {/* ROSTER TIM B */}
          <div className="border border-slate-800 rounded p-2.5">
            <div className="flex items-center justify-between bg-rose-900 text-white p-1.5 rounded-xs font-bold uppercase text-xs mb-2">
              <span>(B) {match.teamB.name}</span>
              <span className="text-[10px] font-mono">Kode: {match.teamB.shortCode}</span>
            </div>

            <table className="w-full text-left border-collapse text-[11px]">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-100 text-slate-700">
                  <th className="py-1 px-1.5 w-10 text-center">No.</th>
                  <th className="py-1 px-1.5">Nama Pemain Lengkap</th>
                  <th className="py-1 px-1.5 w-16 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {match.teamB.roster.map((p) => (
                  <tr key={p.id} className="border-b border-slate-200">
                    <td className="py-0.5 px-1.5 text-center font-bold font-mono">
                      {p.number}
                    </td>
                    <td className="py-0.5 px-1.5">{p.name}</td>
                    <td className="py-0.5 px-1.5 text-center">
                      {p.isCaptain && (
                        <span className="px-1 bg-slate-900 text-white font-bold rounded text-[9px]">
                          (C)
                        </span>
                      )}
                      {p.isLibero && (
                        <span className="px-1 bg-purple-700 text-white font-bold rounded text-[9px]">
                          (L)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Officials Tim B */}
            <div className="mt-2 pt-1 border-t border-slate-300 text-[10px] text-slate-600 space-y-0.5">
              <div>
                <strong>Pelatih (C):</strong> {match.teamB.coach}
              </div>
              <div>
                <strong>Asisten Pelatih (AC):</strong> {match.teamB.assistantCoach}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: DETAILED SET RECORDS (SET 1 S/D 5) */}
        <div className="space-y-3 mb-4">
          {match.sets.map((set) => {
            const teamLeftObj = set.teamLeft === 'A' ? match.teamA : match.teamB;
            const teamRightObj = set.teamRight === 'A' ? match.teamA : match.teamB;
            const scoreLeft = set.teamLeft === 'A' ? set.scoreA : set.scoreB;
            const scoreRight = set.teamRight === 'A' ? set.scoreA : set.scoreB;
            const lineupLeft = set.teamLeft === 'A' ? set.lineupA : set.lineupB;
            const lineupRight = set.teamRight === 'A' ? set.lineupA : set.lineupB;
            const subsLeft = set.teamLeft === 'A' ? set.substitutionsA : set.substitutionsB;
            const subsRight = set.teamRight === 'A' ? set.substitutionsA : set.substitutionsB;
            const toLeft = set.teamLeft === 'A' ? set.timeOutsA : set.timeOutsB;
            const toRight = set.teamRight === 'A' ? set.timeOutsA : set.timeOutsB;

            return (
              <div key={set.setNumber} className="border-2 border-slate-800 rounded p-2.5">
                {/* Header Set */}
                <div className="flex items-center justify-between bg-slate-100 p-1.5 border-b border-slate-300 text-xs font-bold mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white rounded font-black">
                      SET {set.setNumber}
                    </span>
                    <span>
                      Mulai: {set.startTime} {set.endTime ? `• Selesai: ${set.endTime}` : '(Berjalan)'}
                    </span>
                  </div>

                  <div className="font-mono text-sm font-black">
                    <span style={{ color: teamLeftObj.color }}>{teamLeftObj.shortCode}</span>{' '}
                    <span className="px-2 py-0.5 bg-white border border-slate-400 rounded">
                      {scoreLeft} - {scoreRight}
                    </span>{' '}
                    <span style={{ color: teamRightObj.color }}>{teamRightObj.shortCode}</span>
                  </div>
                </div>

                {/* Grid 2 Tim dalam Set: Line-up, Rotasi, Substitusi, TO, Running Score */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  
                  {/* SISI KIRI */}
                  <div className="border border-slate-300 p-2 rounded">
                    <div className="font-bold text-[11px] mb-1 flex items-center justify-between">
                      <span style={{ color: teamLeftObj.color }}>
                        ({set.teamLeft}) {teamLeftObj.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {set.firstServeTeam === set.teamLeft ? 'Servis Pertama (S)' : 'Penerima (R)'}
                      </span>
                    </div>

                    {/* Starting Line-up Pos I to VI */}
                    <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px] mb-2 bg-slate-50 p-1 rounded border border-slate-200">
                      {['I', 'II', 'III', 'IV', 'V', 'VI'].map((r, i) => (
                        <div key={i}>
                          <span className="text-[9px] text-slate-400 block font-sans">Pos {r}</span>
                          <span className="font-bold text-xs">{lineupLeft[i]}</span>
                        </div>
                      ))}
                    </div>

                    {/* Substitusi & TO info */}
                    <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1.5 border-t border-slate-200 pt-1">
                      <div>
                        <strong>Substitusi ({subsLeft.length}/6): </strong>
                        {subsLeft.length === 0 ? (
                          'Nihil'
                        ) : (
                          subsLeft.map((s) => `#${s.playerOut}➔#${s.playerIn} (${s.scoreAtSub}) `)
                        )}
                      </div>
                      <div>
                        <strong>TO ({toLeft.length}/2): </strong>
                        {toLeft.length === 0
                          ? 'Nihil'
                          : toLeft.map((t) => `${t.scoreAtTO} `)}
                      </div>
                    </div>

                    {/* Running Score Column */}
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">
                        Poin Berjalan (1-30):
                      </span>
                      {renderRunningScoreBox(set, set.teamLeft)}
                    </div>
                  </div>

                  {/* SISI KANAN */}
                  <div className="border border-slate-300 p-2 rounded">
                    <div className="font-bold text-[11px] mb-1 flex items-center justify-between">
                      <span style={{ color: teamRightObj.color }}>
                        ({set.teamRight}) {teamRightObj.name}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {set.firstServeTeam === set.teamRight ? 'Servis Pertama (S)' : 'Penerima (R)'}
                      </span>
                    </div>

                    {/* Starting Line-up Pos I to VI */}
                    <div className="grid grid-cols-6 gap-1 text-center font-mono text-[10px] mb-2 bg-slate-50 p-1 rounded border border-slate-200">
                      {['I', 'II', 'III', 'IV', 'V', 'VI'].map((r, i) => (
                        <div key={i}>
                          <span className="text-[9px] text-slate-400 block font-sans">Pos {r}</span>
                          <span className="font-bold text-xs">{lineupRight[i]}</span>
                        </div>
                      ))}
                    </div>

                    {/* Substitusi & TO info */}
                    <div className="flex items-center justify-between text-[10px] text-slate-600 mb-1.5 border-t border-slate-200 pt-1">
                      <div>
                        <strong>Substitusi ({subsRight.length}/6): </strong>
                        {subsRight.length === 0 ? (
                          'Nihil'
                        ) : (
                          subsRight.map((s) => `#${s.playerOut}➔#${s.playerIn} (${s.scoreAtSub}) `)
                        )}
                      </div>
                      <div>
                        <strong>TO ({toRight.length}/2): </strong>
                        {toRight.length === 0
                          ? 'Nihil'
                          : toRight.map((t) => `${t.scoreAtTO} `)}
                      </div>
                    </div>

                    {/* Running Score Column */}
                    <div>
                      <span className="text-[9px] font-bold text-slate-500 uppercase block mb-0.5">
                        Poin Berjalan (1-30):
                      </span>
                      {renderRunningScoreBox(set, set.teamRight)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SECTION 4: SANCTIONS TABLE & RESULTS SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-xs">
          
          {/* Sanksi Table */}
          <div className="border border-slate-800 rounded p-2.5">
            <h4 className="font-black text-xs uppercase bg-slate-100 p-1 rounded-xs mb-1.5 border-b border-slate-300">
              KOLOM SANKSI (SANCTIONS)
            </h4>
            <table className="w-full text-left border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-700">
                  <th className="py-1 px-1">Sanksi</th>
                  <th className="py-1 px-1">Tim</th>
                  <th className="py-1 px-1">No./Role</th>
                  <th className="py-1 px-1">Set</th>
                  <th className="py-1 px-1">Skor</th>
                  <th className="py-1 px-1">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {match.sanctions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-2 text-center text-slate-400 italic">
                      Tidak ada sanksi kartu dalam pertandingan ini.
                    </td>
                  </tr>
                ) : (
                  match.sanctions.map((s) => (
                    <tr key={s.id} className="border-b border-slate-200">
                      <td className="py-0.5 px-1 font-bold uppercase">
                        {s.sanctionType === 'warning' ? 'Kuning (W)' : s.sanctionType === 'penalty' ? 'Merah (P)' : s.sanctionType}
                      </td>
                      <td className="py-0.5 px-1 font-bold">Tim {s.teamId}</td>
                      <td className="py-0.5 px-1">{s.isOfficial ? s.personNumber : `#${s.personNumber}`}</td>
                      <td className="py-0.5 px-1">{s.setNumber}</td>
                      <td className="py-0.5 px-1 font-mono">{s.scoreAtSanction}</td>
                      <td className="py-0.5 px-1 truncate max-w-[100px]">{s.remarks || '-'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Results Summary Table */}
          <div className="border border-slate-800 rounded p-2.5">
            <h4 className="font-black text-xs uppercase bg-slate-100 p-1 rounded-xs mb-1.5 border-b border-slate-300">
              HASIL AKHIR PERTANDINGAN (RESULTS SUMMARY)
            </h4>

            <table className="w-full text-center border-collapse text-[10px]">
              <thead>
                <tr className="border-b border-slate-300 bg-slate-50 text-slate-700">
                  <th className="py-1 px-1">Set</th>
                  <th className="py-1 px-1">{match.teamA.shortCode}</th>
                  <th className="py-1 px-1">{match.teamB.shortCode}</th>
                  <th className="py-1 px-1">Durasi</th>
                  <th className="py-1 px-1">Pemenang Set</th>
                </tr>
              </thead>
              <tbody>
                {match.sets.map((s) => (
                  <tr key={s.setNumber} className="border-b border-slate-200 font-mono">
                    <td className="py-1 px-1 font-bold">Set {s.setNumber}</td>
                    <td className="py-1 px-1 font-black">{s.scoreA}</td>
                    <td className="py-1 px-1 font-black">{s.scoreB}</td>
                    <td className="py-1 px-1 text-slate-500">{s.durationMinutes ? `${s.durationMinutes}m` : '-'}</td>
                    <td className="py-1 px-1 font-bold">
                      {s.winner ? `Tim ${s.winner}` : '(Berjalan)'}
                    </td>
                  </tr>
                ))}
                <tr className="bg-slate-100 font-bold border-t-2 border-slate-400">
                  <td className="py-1 px-1">TOTAL</td>
                  <td className="py-1 px-1 font-black text-xs">{setsWonA} Set</td>
                  <td className="py-1 px-1 font-black text-xs">{setsWonB} Set</td>
                  <td className="py-1 px-1">~75m</td>
                  <td className="py-1 px-1 text-emerald-800 font-black">
                    {match.matchWinner ? `TIM ${match.matchWinner} MENANG` : 'BELUM SELESAI'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 5: SIGNATURES & OFFICIAL APPROVAL */}
        <div className="border-2 border-slate-800 p-3 rounded">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3 text-center border-b border-slate-300 pb-1">
            PENGESAHAN PERANGKAT PERTANDINGAN & PETUGAS MEJA (APPROVAL & SIGNATURES)
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-xs">
            {/* Pencatat Skor (Petugas Meja) */}
            <div className="flex flex-col justify-between h-24 border-r border-slate-300 pr-2">
              <span className="font-bold text-[10px] text-slate-500 uppercase">
                Pencatat Skor (Petugas Meja):
              </span>
              <div className="font-semibold text-slate-800 border-b border-slate-400 pb-1">
                {match.officials.scorer}
              </div>
              <span className="text-[9px] text-slate-400">(Tanda Tangan)</span>
            </div>

            {/* Asisten Pencatat Skor */}
            <div className="flex flex-col justify-between h-24 border-r border-slate-300 pr-2">
              <span className="font-bold text-[10px] text-slate-500 uppercase">
                Asisten Pencatat (Libero Tracker):
              </span>
              <div className="font-semibold text-slate-800 border-b border-slate-400 pb-1">
                {match.officials.assistantScorer}
              </div>
              <span className="text-[9px] text-slate-400">(Tanda Tangan)</span>
            </div>

            {/* Wasit 2 */}
            <div className="flex flex-col justify-between h-24 border-r border-slate-300 pr-2">
              <span className="font-bold text-[10px] text-slate-500 uppercase">
                Wasit 2 (Second Referee):
              </span>
              <div className="font-semibold text-slate-800 border-b border-slate-400 pb-1">
                {match.officials.secondReferee}
              </div>
              <span className="text-[9px] text-slate-400">(Tanda Tangan)</span>
            </div>

            {/* Wasit 1 */}
            <div className="flex flex-col justify-between h-24">
              <span className="font-bold text-[10px] text-slate-500 uppercase">
                Wasit 1 (First Referee):
              </span>
              <div className="font-semibold text-slate-800 border-b border-slate-400 pb-1">
                {match.officials.firstReferee}
              </div>
              <span className="text-[9px] text-slate-400">(Tanda Tangan)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
