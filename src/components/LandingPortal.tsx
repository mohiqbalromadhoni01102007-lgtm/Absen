import React from 'react';
import { LandingCMS, Role } from '../types';

interface LandingPortalProps {
  cms: LandingCMS;
  onOpenLogin: (role: Exclude<Role, null>) => void;
}

export const LandingPortal: React.FC<LandingPortalProps> = ({ cms, onOpenLogin }) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner Intro (Dynamic via CMS) */}
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden border border-emerald-800/50">
        <div className="relative z-10 max-w-3xl space-y-4">
          <span className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border border-emerald-400/30">
            <i className="fa-solid fa-building-columns"></i>
            <span>{cms.namaPesantren}</span>
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight text-white">
            {cms.heroTitle}
          </h2>
          <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
            {cms.heroDesc}
          </p>

          <div className="pt-2 flex flex-wrap gap-2.5 text-xs font-semibold">
            <span className="bg-emerald-800/70 border border-emerald-600/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <i className="fa-solid fa-check-circle text-emerald-400"></i>
              12 Kelas Awaliyah & Wustho
            </span>
            <span className="bg-emerald-800/70 border border-emerald-600/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <i className="fa-solid fa-wand-magic-sparkles text-emerald-300"></i>
              Gemini AI Evaluasi & Sanksi
            </span>
            <span className="bg-emerald-800/70 border border-emerald-600/40 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
              <i className="fa-solid fa-comments text-emerald-300"></i>
              Chat Langsung Wali & Ustadz
            </span>
          </div>
        </div>

        {/* Decorative Giant Icon */}
        <div className="absolute -right-8 -bottom-10 opacity-10 text-white pointer-events-none select-none">
          <i className={`${cms.heroIconClass || 'fa-solid fa-mosque'} text-[220px] sm:text-[260px]`}></i>
        </div>
      </div>

      {/* Dynamic Running Alert / Pengumuman Banner */}
      <div className="bg-amber-500 text-slate-900 px-4 py-2.5 rounded-2xl shadow-sm border border-amber-400 flex items-center space-x-3 text-xs font-bold overflow-hidden">
        <span className="bg-slate-900 text-amber-300 px-2.5 py-1 rounded-lg text-[10px] uppercase font-black tracking-wider shrink-0 shadow-sm flex items-center gap-1">
          <i className="fa-solid fa-bullhorn animate-bounce"></i>
          <span>Pengumuman</span>
        </span>
        <div className="marquee-container flex-grow">
          <div className="marquee-content font-semibold tracking-wide">
            {cms.runningBanner}
          </div>
        </div>
      </div>

      {/* Dynamic Visi & Misi Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-2">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center text-xs font-bold">
              <i className="fa-solid fa-eye"></i>
            </span>
            <span>Visi Pesantren</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed italic bg-emerald-50/70 p-4 rounded-xl border border-emerald-200/80">
            &ldquo;{cms.visi}&rdquo;
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2.5 hover:shadow-md transition">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
              <i className="fa-solid fa-bullseye"></i>
            </span>
            <span>Misi Pesantren</span>
          </h3>
          <div className="text-xs text-slate-700 leading-relaxed bg-blue-50/70 p-4 rounded-xl border border-blue-200/80 whitespace-pre-line font-medium">
            {cms.misi}
          </div>
        </div>
      </div>

      {/* Role Selection Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Card 1: Admin Pondok */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <i className="fa-solid fa-user-shield"></i>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">1. Admin Pondok</h3>
            <p className="text-slate-500 text-xs mt-1 mb-4 font-medium">
              Pengelola Utama, CMS Tampilan & PDF AI
            </p>
            <ul className="text-xs text-slate-600 space-y-2.5 mb-6">
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-emerald-600 mr-2 mt-0.5"></i>
                <span>Edit Tampilan Depan / CMS Landing Page</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-emerald-600 mr-2 mt-0.5"></i>
                <span>Kelola Santri (12 Kelas Awaliyah & Wustho)</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-emerald-600 mr-2 mt-0.5"></i>
                <span>Kelola Akun Guru & Reset Password Wali</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-emerald-600 mr-2 mt-0.5 font-bold"></i>
                <span>Pusat Pesan & Chat Seluruh Wali Santri</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-emerald-600 mr-2 mt-0.5"></i>
                <span>Cetak PDF Resmi + Narasi Evaluasi Gemini AI</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onOpenLogin('admin')}
            className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition shadow-md flex items-center justify-center space-x-2 focus:ring-2 focus:ring-emerald-500"
          >
            <span>Login Admin</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>

        {/* Card 2: Portal Guru / Ustadz */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <i className="fa-solid fa-chalkboard-user"></i>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">2. Portal Guru</h3>
            <p className="text-slate-500 text-xs mt-1 mb-4 font-medium">
              Pengajar & Pembina Kedisiplinan
            </p>
            <ul className="text-xs text-slate-600 space-y-2.5 mb-6">
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5"></i>
                <span>Presensi Harian 12 Kelas (H, S, I, A)</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5"></i>
                <span>Input Pelanggaran & Rekomendasi Sanksi AI</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5 font-bold"></i>
                <span>Fitur Chat Direct dengan Wali Santri</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5 font-bold"></i>
                <span>Draf Balasan Chat Otomatis via AI</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-blue-600 mr-2 mt-0.5"></i>
                <span>Kelola Profil & Sandi Mandiri</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onOpenLogin('guru')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition shadow-md flex items-center justify-center space-x-2 focus:ring-2 focus:ring-blue-500"
          >
            <span>Login Guru</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>

        {/* Card 3: Wali Santri */}
        <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-200/80 hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform shadow-inner">
              <i className="fa-solid fa-users-between-lines"></i>
            </div>
            <h3 className="text-xl font-extrabold text-slate-800">3. Wali Santri</h3>
            <p className="text-slate-500 text-xs mt-1 mb-4 font-medium">
              Orang Tua / Wali Murid
            </p>
            <ul className="text-xs text-slate-600 space-y-2.5 mb-6">
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-purple-600 mr-2 mt-0.5"></i>
                <span>Pantau Presensi Harian Santri (H, S, I, A)</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-purple-600 mr-2 mt-0.5"></i>
                <span>Lihat Catatan Pelanggaran & Sanksi</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-purple-600 mr-2 mt-0.5 font-bold"></i>
                <span>Chat Langsung ke Admin / Ustadz Pengajar</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-purple-600 mr-2 mt-0.5 font-bold"></i>
                <span>AI Konsultasi Parenting & Pola Asuh Santri</span>
              </li>
              <li className="flex items-start">
                <i className="fa-solid fa-circle-check text-purple-600 mr-2 mt-0.5"></i>
                <span>Akses Praktis dengan NIS Santri</span>
              </li>
            </ul>
          </div>
          <button
            type="button"
            onClick={() => onOpenLogin('wali')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 px-4 rounded-2xl text-sm transition shadow-md flex items-center justify-center space-x-2 focus:ring-2 focus:ring-purple-500"
          >
            <span>Login Wali Santri</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>
      </div>
    </div>
  );
};
