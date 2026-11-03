import React from 'react';
import { Absensi, LandingCMS, Pelanggaran, Santri } from '../types';

interface PrintableReportProps {
  cms: LandingCMS;
  reportType: 'santri' | 'absen' | 'pelanggaran';
  genderFilter: string;
  classFilter: string;
  santriList: Santri[];
  absensiList: Absensi[];
  pelanggaranList: Pelanggaran[];
  aiNarrative: string;
}

export const PrintableReport: React.FC<PrintableReportProps> = ({
  cms,
  reportType,
  santriList,
  absensiList,
  pelanggaranList,
  aiNarrative,
}) => {
  const todayStr = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(new Date());

  const getReportTitle = () => {
    switch (reportType) {
      case 'santri':
        return 'LAPORAN INDUK REKAPITULASI DATA SANTRI';
      case 'absen':
        return 'LAPORAN REKAPITULASI PRESENSI & KEHADIRAN SANTRI';
      case 'pelanggaran':
        return 'LAPORAN REKAPITULASI CATATAN KEDISIPLINAN & SANKSI SANTRI';
    }
  };

  return (
    <div id="printableArea" className="hidden print:block p-8 bg-white text-black font-sans">
      {/* Official KOP SURAT */}
      <div className="text-center border-b-4 border-double border-slate-900 pb-4 mb-6 relative">
        <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">
          {cms.namaPesantren.toUpperCase()}
        </h1>
        <p className="text-xs text-slate-800 font-medium mt-1">
          {cms.alamat}
        </p>
        <p className="text-[11px] text-slate-600 mt-0.5">
          Telp/WA: {cms.telpWA} &bull; Email: {cms.email}
        </p>
        <div className="mt-4 border-t border-slate-400 pt-3">
          <h2 className="text-base font-bold underline uppercase tracking-wide text-slate-900">
            {getReportTitle()}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Tahun Ajaran 2026/2027 &bull; Dicetak pada: {todayStr}
          </p>
        </div>
      </div>

      {/* Report Table Content */}
      <div className="my-6">
        {reportType === 'santri' && (
          <table className="w-full text-left text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <th className="p-2 border border-slate-400 text-center w-12">No</th>
                <th className="p-2 border border-slate-400">NIS</th>
                <th className="p-2 border border-slate-400">Nama Lengkap</th>
                <th className="p-2 border border-slate-400">Gender</th>
                <th className="p-2 border border-slate-400">Tingkat Kelas</th>
                <th className="p-2 border border-slate-400">Orang Tua / Wali</th>
                <th className="p-2 border border-slate-400">Kontak WA/HP</th>
              </tr>
            </thead>
            <tbody>
              {santriList.map((s, idx) => (
                <tr key={s.id} className="border-b border-slate-300">
                  <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                  <td className="p-2 border border-slate-300 font-mono font-semibold">{s.nis}</td>
                  <td className="p-2 border border-slate-300 font-bold">{s.nama}</td>
                  <td className="p-2 border border-slate-300">{s.jk}</td>
                  <td className="p-2 border border-slate-300">{s.kelas}</td>
                  <td className="p-2 border border-slate-300">{s.wali}</td>
                  <td className="p-2 border border-slate-300">{s.hp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reportType === 'absen' && (
          <table className="w-full text-left text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <th className="p-2 border border-slate-400 text-center w-12">No</th>
                <th className="p-2 border border-slate-400">NIS</th>
                <th className="p-2 border border-slate-400">Nama Santri</th>
                <th className="p-2 border border-slate-400">Kelas</th>
                <th className="p-2 border border-slate-400 text-center text-emerald-800">Hadir (H)</th>
                <th className="p-2 border border-slate-400 text-center text-amber-800">Sakit (S)</th>
                <th className="p-2 border border-slate-400 text-center text-blue-800">Izin (I)</th>
                <th className="p-2 border border-slate-400 text-center text-rose-800">Alpha (A)</th>
              </tr>
            </thead>
            <tbody>
              {santriList.map((s, idx) => {
                const h = absensiList.filter(a => a.santriId === s.id && a.status === 'H').length;
                const sc = absensiList.filter(a => a.santriId === s.id && a.status === 'S').length;
                const i = absensiList.filter(a => a.santriId === s.id && a.status === 'I').length;
                const a = absensiList.filter(a => a.santriId === s.id && a.status === 'A').length;
                return (
                  <tr key={s.id} className="border-b border-slate-300">
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300 font-mono">{s.nis}</td>
                    <td className="p-2 border border-slate-300 font-bold">{s.nama}</td>
                    <td className="p-2 border border-slate-300">{s.kelas}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800">{h}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-amber-800">{sc}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-blue-800">{i}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-rose-800">{a}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {reportType === 'pelanggaran' && (
          <table className="w-full text-left text-xs border-collapse border border-slate-400">
            <thead>
              <tr className="bg-slate-200 text-slate-900 font-bold border-b border-slate-400">
                <th className="p-2 border border-slate-400 text-center w-12">No</th>
                <th className="p-2 border border-slate-400">Tanggal</th>
                <th className="p-2 border border-slate-400">Nama Santri</th>
                <th className="p-2 border border-slate-400">Kelas</th>
                <th className="p-2 border border-slate-400">Bentuk Pelanggaran</th>
                <th className="p-2 border border-slate-400">Tingkat</th>
                <th className="p-2 border border-slate-400">Sanksi Mendidik</th>
              </tr>
            </thead>
            <tbody>
              {pelanggaranList.map((p, idx) => {
                const s = santriList.find(st => st.id === p.santriId);
                return (
                  <tr key={p.id} className="border-b border-slate-300">
                    <td className="p-2 border border-slate-300 text-center">{idx + 1}</td>
                    <td className="p-2 border border-slate-300">{p.tanggal}</td>
                    <td className="p-2 border border-slate-300 font-bold">{s?.nama || 'Santri'}</td>
                    <td className="p-2 border border-slate-300">{s?.kelas || '-'}</td>
                    <td className="p-2 border border-slate-300">{p.pelanggaran}</td>
                    <td className="p-2 border border-slate-300 font-semibold">{p.kategori}</td>
                    <td className="p-2 border border-slate-300">{p.sanksi}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Gemini AI Narrative Section */}
      {aiNarrative && (
        <div className="my-6 bg-slate-50 border border-slate-400 p-4 rounded-xl">
          <h4 className="font-bold text-slate-900 border-b border-slate-300 pb-1 mb-2 text-xs uppercase flex items-center gap-1.5">
            <span>Catatan Evaluasi & Rekomendasi Pengasuhan (Gemini AI):</span>
          </h4>
          <p className="text-xs leading-relaxed text-slate-800 whitespace-pre-line">
            {aiNarrative}
          </p>
        </div>
      )}

      {/* Official Signatures & Stamped Seal */}
      <div className="mt-12 flex justify-between items-end text-xs pt-4">
        <div className="text-center space-y-14">
          <p>
            Mengetahui,<br />
            <span className="font-bold">Ketua Pengurus Pesantren</span>
          </p>
          <div>
            <p className="font-bold underline">( Ust. H. Ahmad Busro, S.Pd.I )</p>
            <p className="text-[10px] text-slate-600">NIP. 19820415 200501 1 002</p>
          </div>
        </div>

        {/* Slanted Official Stamp Seal */}
        <div className="text-center border-2 border-dashed border-emerald-800 text-emerald-900 rounded-full w-24 h-24 flex items-center justify-center text-[10px] font-bold rotate-[-12deg] opacity-80 select-none">
          [ STEMPEL RESMI<br />PESANTREN ]
        </div>

        <div className="text-center space-y-14">
          <p>
            Kalisat, Jember, {todayStr}<br />
            <span className="font-bold">Pimpinan / Pengasuh Pondok</span>
          </p>
          <div>
            <p className="font-bold underline">( KH. Mohammad Hasan Basri, M.Pd )</p>
            <p className="text-[10px] text-slate-600">Pengasuh Pondok Pesantren</p>
          </div>
        </div>
      </div>

      <div className="mt-8 border-t border-slate-300 pt-3 text-center text-[10px] text-slate-500">
        &copy; 2026 {cms.namaPesantren}. Dokumen Resmi Internal Pesantren Terpadu.
      </div>
    </div>
  );
};
