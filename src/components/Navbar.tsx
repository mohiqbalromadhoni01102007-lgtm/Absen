import React from 'react';
import { Role } from '../types';

interface NavbarProps {
  brandName: string;
  pesantrenBadge: string;
  tagline: string;
  activeRole: Role;
  currentUserName: string;
  unreadCount: number;
  onOpenApiKey: () => void;
  onSwitchRole: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brandName,
  pesantrenBadge,
  tagline,
  activeRole,
  currentUserName,
  unreadCount,
  onOpenApiKey,
  onSwitchRole,
  onLogout,
}) => {
  return (
    <header className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-slate-900 text-white shadow-xl sticky top-0 z-40 no-print border-b border-emerald-800/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Dynamic Header Title */}
          <button
            type="button"
            className="flex items-center space-x-3 text-left focus:outline-none focus:ring-2 focus:ring-emerald-400 rounded-xl p-1"
            onClick={onSwitchRole}
            aria-label="Kembali ke Beranda atau Pilih Peran"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white shadow-lg font-bold text-xl border border-emerald-300/40 shrink-0">
              <i className="fa-solid fa-kaaba"></i>
            </div>
            <div>
              <div className="font-bold text-sm sm:text-base leading-tight tracking-wide flex items-center gap-1.5 flex-wrap">
                <span>{brandName}</span>
                <span className="bg-emerald-700/60 text-emerald-200 text-[11px] px-2 py-0.5 rounded-md font-bold border border-emerald-400/30">
                  {pesantrenBadge}
                </span>
                <span className="bg-emerald-500/25 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full border border-emerald-400/30 font-semibold flex items-center gap-1">
                  <i className="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                  Gemini AI
                </span>
              </div>
              <p className="text-[11px] text-emerald-200/80 hidden xs:block">{tagline}</p>
            </div>
          </button>

          {/* Controls & User Session Status */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Google AI Studio Settings Modal trigger */}
            <button
              type="button"
              onClick={onOpenApiKey}
              className="bg-slate-800/90 hover:bg-slate-700/90 text-emerald-300 border border-emerald-500/30 px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition shadow-sm"
              title="Pengaturan API Key Google AI Studio"
              aria-label="Pengaturan API Key Google AI Studio"
            >
              <i className="fa-solid fa-microchip text-emerald-400"></i>
              <span className="hidden sm:inline">Google AI Studio</span>
            </button>

            {/* Active User Badge */}
            {activeRole ? (
              <div className="flex items-center space-x-2 bg-emerald-800/60 px-3 py-1.5 rounded-full border border-emerald-600/50 text-xs">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="font-medium text-emerald-100 max-w-[130px] sm:max-w-[180px] truncate">
                  {activeRole === 'admin' && `Admin: ${currentUserName}`}
                  {activeRole === 'guru' && `Guru: ${currentUserName}`}
                  {activeRole === 'wali' && `Wali: ${currentUserName}`}
                </span>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center space-x-2 bg-emerald-950/60 px-3 py-1.5 rounded-full border border-emerald-800/40 text-xs text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Belum Login</span>
              </div>
            )}

            {activeRole && (
              <button
                type="button"
                onClick={onLogout}
                className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition flex items-center space-x-1"
                aria-label="Keluar dari akun"
              >
                <i className="fa-solid fa-right-from-bracket"></i>
                <span className="hidden md:inline">Keluar</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSwitchRole}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow transition flex items-center space-x-1"
              aria-label="Pilih atau ganti portal peran"
            >
              <i className="fa-solid fa-arrows-rotate"></i>
              <span className="hidden sm:inline">Ganti Peran</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
