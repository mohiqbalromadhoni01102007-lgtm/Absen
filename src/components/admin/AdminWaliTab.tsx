import React, { useState } from 'react';
import { Santri } from '../../types';

interface AdminWaliTabProps {
  santriList: Santri[];
  onResetPassword: (santriId: number, newPass: string) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminWaliTab: React.FC<AdminWaliTabProps> = ({
  santriList,
  onResetPassword,
  onToast,
}) => {
  const [selectedSantri, setSelectedSantri] = useState<Santri | null>(null);
  const [newPass, setNewPass] = useState('');
  const [revealedPass, setRevealedPass] = useState<Record<number, boolean>>({});

  const toggleReveal = (id: number) => {
    setRevealedPass(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openResetModal = (s: Santri) => {
    setSelectedSantri(s);
    setNewPass('');
  };

  const handleSaveReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantri) return;
    if (!newPass.trim()) {
      onToast('Password baru tidak boleh kosong!', 'error');
      return;
    }
    onResetPassword(selectedSantri.id, newPass.trim());
    onToast(`Password wali santri ${selectedSantri.nama} berhasil diperbarui!`, 'success');
    setSelectedSantri(null);
  };

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Kelola Akun & Reset Password Wali Santri</span>
            <span className="text-[11px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
              <i className="fa-solid fa-lock text-[10px] mr-1"></i>Privat
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Akun Wali Santri terhubung langsung dengan NIS. Password disamarkan secara otomatis untuk menjaga privasi wali.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">NIS (Username)</th>
              <th className="p-3.5">Nama Santri & Kelas</th>
              <th className="p-3.5">Nama Orang Tua / Wali</th>
              <th className="p-3.5">Kontak HP / WA</th>
              <th className="p-3.5">Password (Privasi)</th>
              <th className="p-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {santriList.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-mono font-bold text-purple-700">{s.nis}</td>
                <td className="p-3.5">
                  <div className="font-bold text-slate-800">{s.nama}</div>
                  <div className="text-[11px] text-slate-400">{s.kelas}</div>
                </td>
                <td className="p-3.5 font-medium text-slate-800">{s.wali}</td>
                <td className="p-3.5 text-slate-600">{s.hp}</td>
                <td className="p-3.5">
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-mono text-xs">
                    <span className="font-semibold text-slate-700">
                      {revealedPass[s.id] ? s.passWali : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleReveal(s.id)}
                      className="text-slate-400 hover:text-slate-600 ml-1 transition"
                      title={revealedPass[s.id] ? "Sembunyikan password" : "Lihat password"}
                    >
                      <i className={`fa-solid ${revealedPass[s.id] ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                    </button>
                  </div>
                </td>
                <td className="p-3.5 text-center">
                  <button
                    type="button"
                    onClick={() => openResetModal(s)}
                    className="bg-purple-50 text-purple-700 hover:bg-purple-100 px-3 py-1.5 rounded-xl font-semibold text-xs border border-purple-200 transition flex items-center space-x-1.5 mx-auto"
                  >
                    <i className="fa-solid fa-key text-[10px]"></i>
                    <span>Reset Password</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Reset Modal */}
      {selectedSantri && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setSelectedSantri(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-1">
              Reset Password Wali Santri
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Santri: <strong className="text-slate-800">{selectedSantri.nama}</strong> (NIS: {selectedSantri.nis})
            </p>

            <form onSubmit={handleSaveReset} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="new-wali-pass">
                  Password Baru:
                </label>
                <input
                  id="new-wali-pass"
                  type="text"
                  required
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow transition"
              >
                Simpan Password Baru
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
