import React, { useState, useEffect } from 'react';
import { Role } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  role: Exclude<Role, null> | null;
  onClose: () => void;
  onLogin: (username: string, pass: string) => boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, role, onClose, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setShowPassword(false);
      setErrorMsg('');
    }
  }, [isOpen, role]);

  if (!isOpen || !role) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const success = onLogin(username.trim(), password.trim());
    if (!success) {
      if (role === 'admin') {
        setErrorMsg('Username atau Password Admin salah. Pastikan kredensial Anda benar.');
      } else if (role === 'guru') {
        setErrorMsg('Username atau Password Guru tidak terdaftar. Periksa kembali nama pengguna dan kata sandi Anda.');
      } else {
        setErrorMsg('NIS Santri atau Password Wali tidak sesuai. Pastikan 6-digit NIS dan kata sandi Anda benar.');
      }
    }
  };

  const getRoleConfig = () => {
    switch (role) {
      case 'admin':
        return {
          title: 'Login Admin Pondok',
          subtitle: 'Pengelola Pusat & Tata Usaha Pesantren (Privat & Aman)',
          icon: 'fa-solid fa-user-shield',
          iconColor: 'bg-emerald-100 text-emerald-800',
          submitBtn: 'bg-emerald-800 hover:bg-emerald-900',
          usernameLabel: 'Username Akun Admin',
          usernamePlaceholder: 'Masukkan username admin...',
        };
      case 'guru':
        return {
          title: 'Login Portal Guru',
          subtitle: 'Ustadz Pengajar & Pembina Santri (Akses Khusus Guru)',
          icon: 'fa-solid fa-chalkboard-user',
          iconColor: 'bg-blue-100 text-blue-800',
          submitBtn: 'bg-blue-600 hover:bg-blue-700',
          usernameLabel: 'Username Akun Guru / Ustadz',
          usernamePlaceholder: 'Masukkan username terdaftar...',
        };
      case 'wali':
        return {
          title: 'Login Wali Santri',
          subtitle: 'Portal Resmi Orang Tua / Wali Murid Santri',
          icon: 'fa-solid fa-users-between-lines',
          iconColor: 'bg-purple-100 text-purple-800',
          submitBtn: 'bg-purple-600 hover:bg-purple-700',
          usernameLabel: 'NIS Santri (Username)',
          usernamePlaceholder: 'Masukkan 6 digit NIS Santri Anda...',
        };
    }
  };

  const config = getRoleConfig();

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
          aria-label="Tutup Modal Login"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className={`w-14 h-14 rounded-2xl ${config.iconColor} mx-auto flex items-center justify-center text-2xl mb-3 shadow-inner`}>
            <i className={config.icon}></i>
          </div>
          <h3 className="text-lg font-extrabold text-slate-800">{config.title}</h3>
          <p className="text-xs text-slate-500 mt-0.5">{config.subtitle}</p>
        </div>

        {/* Privacy Notice Badge */}
        <div className="bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] p-2.5 rounded-xl mb-4 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-amber-600 shrink-0 text-xs"></i>
          <span>
            <strong>Akses Bersifat Privat:</strong> Masukkan kredensial akun terdaftar Anda secara manual. Tidak tersedia akses akun demo.
          </span>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-xl mb-4 flex items-center gap-2">
            <i className="fa-solid fa-circle-exclamation shrink-0"></i>
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="login-username">
              {config.usernameLabel}
            </label>
            <div className="relative">
              <input
                id="login-username"
                type="text"
                required
                autoComplete="username"
                spellCheck={false}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={config.usernamePlaceholder}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                <i className="fa-solid fa-user text-xs"></i>
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1.5" htmlFor="login-password">
              Password Login
            </label>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                spellCheck={false}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi pribadi Anda..."
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
                title={showPassword ? "Sembunyikan kata sandi" : "Lihat kata sandi"}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-xs`}></i>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className={`w-full ${config.submitBtn} text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs`}
            >
              <span>Masuk Sekarang</span>
              <i className="fa-solid fa-right-to-bracket"></i>
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
              <i className="fa-solid fa-lock text-[10px]"></i>
              <span>Lupa kata sandi? Hubungi Sekretariat Pondok Pesantren</span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
