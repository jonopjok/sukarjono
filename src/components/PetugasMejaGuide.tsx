import React, { useState } from 'react';
import {
  ClipboardList,
  CheckCircle,
  AlertCircle,
  Clock,
  RotateCw,
  Users,
  Timer,
  ShieldAlert,
  Volume2,
  FileSpreadsheet,
  Award,
  HelpCircle,
} from 'lucide-react';

export const PetugasMejaGuide: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});

  const toggleCheck = (id: string) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-6">
      {/* Hero Advice Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 rounded-2xl p-6 text-white shadow-md border border-slate-700">
        <div className="flex items-start gap-3">
          <div className="p-3 bg-amber-500 text-slate-950 rounded-xl shrink-0 mt-1">
            <ClipboardList className="w-7 h-7" />
          </div>
          <div>
            <span className="text-xs font-black tracking-widest text-amber-400 uppercase">
              PANDUAN & SARAN RESMI PBVSI / FIVB
            </span>
            <h2 className="text-xl sm:text-2xl font-black mt-1">
              Struktur & Tugas Petugas Meja (Scorer & Table Official) Bola Voli
            </h2>
            <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
              Petugas Meja (Pencatat Skor / <em>Scorer</em>) memegang peran vital dalam legalitas pertandingan bola voli resmi. Segala keputusan teknis, kuota pergantian, rotasi servis, sanksi, dan skor akhir disahkan di meja ini. Berikut saran perancangan sistem dan rincian bagian yang wajib diisi.
            </p>
          </div>
        </div>
      </div>

      {/* 3 FASE UTAMA PENGISIAN OLEH PETUGAS MEJA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Fase 1: Pra Pertandingan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                1
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                Pra-Pertandingan (Sebelum Main)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Diselesaikan minimal 20-30 menit sebelum peluit pertama:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Header Informasi:</strong> Nama turnamen, kota, hall, nomor laga, pool, tanggal & jam jadwal.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Roster Tim (Daftar Nama & No):</strong> Verifikasi nomor punggung, tandai Kapten (C), dan Libero (L1, L2).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Nama Ofisial Tim:</strong> Pelatih Kepala (C), Asisten Pelatih (AC), Trainer/Medis (T).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Hasil Undian Koin (Toss):</strong> Catat tim mana yang Servis Pertama (S), Penerima (R), serta posisi lapangan (Kiri / Kanan).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-blue-600 font-bold">•</span>
                <span><strong>Line-Up Awal (Starting Six):</strong> Salin nomor 6 pemain inti posisi I s/d VI dari formulir susunan pemain yang diserahkan pelatih ke Wasit 2.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fase 2: Saat Pertandingan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-black text-xs">
                2
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                Saat Pertandingan (In-Match)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Fokus penuh mengawasi setiap reli dan rotasi:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Poin Berjalan (Running Score):</strong> Coret angka 1 s/d 25+ di kolom tim pencetak angka secara berurutan.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Giliran & Kotak Servis:</strong> Beri tanda centang (✔) pada giliran servis pemain, dan catat skor tim saat kehilangan servis di kotak akhir.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Pergantian Pemain (Substitusi):</strong> Bunyikan bel meja, catat nomor pemain keluar dan masuk serta skor saat itu. Maksimal 6 pergantian per set per tim.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Time-Out (TO):</strong> Hitung 30 detik, catat skor saat TO diminta (Maksimal 2x per set per tim).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span><strong>Pencatatan Sanksi:</strong> Catat kartu kuning (Warning), merah (Penalti - beri +1 poin ke lawan), dan kartu ganda (Ekspulsi / Diskualifikasi).</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Fase 3: Pasca Pertandingan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xs">
                3
              </span>
              <h3 className="font-extrabold text-base text-slate-900">
                Pasca-Pertandingan (Selesai)
              </h3>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Legalisasi dan penutupan lembar skor:
            </p>
            <ul className="text-xs space-y-2 text-slate-700">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Tutup Kolom Poin:</strong> Lingkari skor akhir dan garis miring sisa nomor yang tidak terpakai pada kolom poin berjalan.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Tabel Ringkasan Hasil:</strong> Tuliskan durasi menit tiap set, skor set, pemenang tiap set, dan skor agregat set (misal: 3-1).</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Tanda Tangan Pengesahan:</strong> Berturut-turut ditandatangani oleh: Pencatat Skor ➔ Asisten Pencatat ➔ Kapten Tim A & B ➔ Wasit 2 ➔ Wasit 1.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span><strong>Kolom Catatan (Remarks):</strong> Tulis jika ada protes resmi kapten, insiden cedera, atau keputusan luar biasa.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* SARAN TEKNIS DESAIN APLIKASI UNTUK PENGEMBANG */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <h3 className="font-extrabold text-lg text-slate-900 mb-3 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-blue-600" />
          <span>Saran Desain UI / Fitur Aplikasi Skor Sheet untuk Petugas Meja</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-700">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <RotateCw className="w-4 h-4 text-amber-600" />
              1. Otomasi Rotasi Lapangan (Side-out Logic)
            </h4>
            <p className="leading-relaxed text-slate-600">
              Dalam bola voli, saat tim penerima memenangkan reli (Side-out), pemain mereka harus berputar 1 posisi searah jarum jam (Pos II pindah ke Pos I dan menjadi server baru). Aplikasi harus otomatis melakukan rotasi ini untuk mencegah kesalahan catat petugas meja.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Timer className="w-4 h-4 text-emerald-600" />
              2. Tombol Cepat Time-Out dengan Countdown 30 Detik
            </h4>
            <p className="leading-relaxed text-slate-600">
              Petugas meja sering kerepotan melihat stopwatch manual. Fitur timer modal dengan hitung mundur 30 detik dan bunyi buzzer meja di detik ke-25 dan ke-30 sangat membantu komunikasi dengan Wasit 2.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Users className="w-4 h-4 text-blue-600" />
              3. Validasi Ketat Kuota Substitusi (Maksimal 6x)
            </h4>
            <p className="leading-relaxed text-slate-600">
              Sistem wajib menampilkan indikator jatah pergantian (1 s/d 6). Jika pelatih meminta pergantian ke-7, aplikasi harus langsung memblokir dan memberi peringatan agar petugas meja dapat memberi tahu Wasit 2 bahwa pergantian tersebut ilegal.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
              <Volume2 className="w-4 h-4 text-purple-600" />
              4. Audio Buzzer Meja Terintegrasi
            </h4>
            <p className="leading-relaxed text-slate-600">
              Petugas meja menggunakan bel meja untuk menghentikan pertandingan saat ada permintaan substitusi, time-out, atau kesalahan rotasi servis. Tombol audio buzzer memudahkan simulasi maupun penggunaan riil di lapangan jika dihubungkan ke speaker.
            </p>
          </div>
        </div>
      </div>

      {/* CHECKLIST PRA-PERTANDINGAN INTERAKTIF */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
              <span>Daftar Cek Kesiapan Petugas Meja (Interactive Checklist)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Centang setiap poin sebelum memencet peluit tanda mulai pertandingan
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {[
            { id: 'c1', label: 'Lembar Skor Resmi PBVSI / FIVB telah siap (Digital / Cetak)' },
            { id: 'c2', label: 'Buzzer meja & klakson telah diuji coba suaranya' },
            { id: 'c3', label: 'Nama dan nomor punggung seluruh pemain telah dicek silang dengan ID Card' },
            { id: 'c4', label: 'Kapten tim (C) dan Libero (L1, L2) telah ditandai dengan jelas' },
            { id: 'c5', label: 'Nama pelatih dan ofisial tim telah diisi lengkap' },
            { id: 'c6', label: 'Nama Wasit 1, Wasit 2, dan Hakim Garis telah dicatat' },
            { id: 'c7', label: 'Hasil undian koin (Toss) dicatat: siapa yang Servis Pertama & sisi lapangan' },
            { id: 'c8', label: 'Form Line-up 6 pemain mula-mula telah diserahkan pelatih ke Wasit 2' },
          ].map((item) => (
            <label
              key={item.id}
              onClick={() => toggleCheck(item.id)}
              className={`p-3 rounded-xl border flex items-center gap-3 cursor-pointer transition select-none ${
                checkedItems[item.id]
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                  : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
                  checkedItems[item.id]
                    ? 'bg-emerald-600 border-emerald-600 text-white'
                    : 'bg-white border-slate-300'
                }`}
              >
                {checkedItems[item.id] && <CheckCircle className="w-4 h-4" />}
              </div>
              <span>{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
