import React, { useState } from 'react';
import { callGeminiService } from '../../services/gemini';

interface AdminLaporanTabProps {
  reportType: 'santri' | 'absen' | 'pelanggaran';
  setReportType: (t: 'santri' | 'absen' | 'pelanggaran') => void;
  genderFilter: string;
  setGenderFilter: (g: string) => void;
  classFilter: string;
  setClassFilter: (c: string) => void;
  aiNarrative: string;
  setAiNarrative: (n: string) => void;
  onPrintReport: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminLaporanTab: React.FC<AdminLaporanTabProps> = ({
  reportType,
  setReportType,
  genderFilter,
  setGenderFilter,
  classFilter,
  setClassFilter,
  aiNarrative,
  setAiNarrative,
  onPrintReport,
  onToast,
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAi = async () => {
    setIsGenerating(true);
    try {
      const narrative = await callGeminiService({
        userQuery: `Anda adalah Sekretaris Pengurus Pondok Pesantren Miftahul Ulum Kalisat Jember.
Buatkan 1 paragraf ringkasan evaluasi perkembangan santri dan rekomendasi pengasuhan yang santun, profesional, dan Islami untuk dilampirkan dalam Laporan Cetak PDF Resmi Pesantren.
Parameter Laporan: Jenis: ${reportType}, Gender: ${genderFilter}, Kelas: ${classFilter}.
Sebutkan apresiasi atas keaktifan santri dan motivasi bagi wali santri.`,
        systemPrompt: 'Sajikan narasi resmi, singkat, padat (3-4 kalimat) dan santun.'
      });
      setAiNarrative(narrative);
      onToast('Narasi evaluasi AI berhasil disusun!', 'success');
    } catch {
      onToast('Gagal menyusun narasi AI.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-5">
      <div className="border-b border-slate-100 pb-3">
        <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
          <i className="fa-solid fa-file-pdf text-rose-600"></i>
          <span>Generator Laporan PDF + Ringkasan Gemini AI</span>
        </h3>
        <p className="text-xs text-slate-500 mt-0.5">
          Pilih jenis laporan dan gunakan Gemini AI untuk menuliskan narasi evaluasi perkembangan santri secara otomatis pada KOP Surat resmi.
        </p>
      </div>

      <div className="space-y-4 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 mb-1" htmlFor="report-type-select">
            Jenis Laporan Resmi:
          </label>
          <select
            id="report-type-select"
            value={reportType}
            onChange={(e) => setReportType(e.target.value as 'santri' | 'absen' | 'pelanggaran')}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none font-semibold text-slate-800"
          >
            <option value="santri">Laporan Induk Data Santri Keseluruhan</option>
            <option value="absen">Laporan Rekapitulasi Presensi Santri</option>
            <option value="pelanggaran">Laporan Catatan Pelanggaran & Sanksi Santri</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="gender-filter-select">
              Filter Gender Santri:
            </label>
            <select
              id="gender-filter-select"
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none font-medium"
            >
              <option value="ALL">Semua Gender</option>
              <option value="Santriwan">Santriwan (Putra)</option>
              <option value="Santriwati">Santriwati (Putri)</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="class-filter-select">
              Filter Tingkat Kelas:
            </label>
            <select
              id="class-filter-select"
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 focus:outline-none font-medium"
            >
              <option value="ALL">Semua Tingkat Kelas (12 Kelas)</option>
              <optgroup label="Santriwan (Putra)">
                <option value="1 Awaliyah (Santriwan)">1 Awaliyah (Santriwan)</option>
                <option value="2 Awaliyah (Santriwan)">2 Awaliyah (Santriwan)</option>
                <option value="3 Awaliyah (Santriwan)">3 Awaliyah (Santriwan)</option>
                <option value="1 Wustho (Santriwan)">1 Wustho (Santriwan)</option>
                <option value="2 Wustho (Santriwan)">2 Wustho (Santriwan)</option>
                <option value="3 Wustho (Santriwan)">3 Wustho (Santriwan)</option>
              </optgroup>
              <optgroup label="Santriwati (Putri)">
                <option value="1 Awaliyah (Santriwati)">1 Awaliyah (Santriwati)</option>
                <option value="2 Awaliyah (Santriwati)">2 Awaliyah (Santriwati)</option>
                <option value="3 Awaliyah (Santriwati)">3 Awaliyah (Santriwati)</option>
                <option value="1 Wustho (Santriwati)">1 Wustho (Santriwati)</option>
                <option value="2 Wustho (Santriwati)">2 Wustho (Santriwati)</option>
                <option value="3 Wustho (Santriwati)">3 Wustho (Santriwati)</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Gemini AI Executive Summary Box */}
        <div className="bg-emerald-50/90 border border-emerald-200 p-4 rounded-2xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5 text-xs">
              <i className="fa-solid fa-wand-magic-sparkles text-emerald-600"></i>
              Catatan / Narasi Evaluasi Gemini AI
            </span>
            <button
              type="button"
              onClick={handleGenerateAi}
              disabled={isGenerating}
              className="bg-emerald-800 hover:bg-emerald-900 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl transition flex items-center space-x-1.5 shadow-sm disabled:opacity-50"
            >
              <i className={`fa-solid ${isGenerating ? 'fa-spinner animate-spin' : 'fa-robot'}`}></i>
              <span>{isGenerating ? 'Menyusun AI...' : 'Buat Narasi AI'}</span>
            </button>
          </div>
          <textarea
            rows={3}
            value={aiNarrative}
            onChange={(e) => setAiNarrative(e.target.value)}
            placeholder="Klik 'Buat Narasi AI' untuk menyusun ringkasan evaluasi perkembangan & rekomendasi secara otomatis via Gemini AI..."
            className="w-full bg-white border border-emerald-300 rounded-xl p-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs leading-relaxed"
          ></textarea>
        </div>

        <button
          type="button"
          onClick={onPrintReport}
          className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
        >
          <i className="fa-solid fa-print"></i>
          <span>Pratinjau & Cetak Laporan PDF Resmi (Ber-KOP & Stempel)</span>
        </button>
      </div>
    </div>
  );
};
