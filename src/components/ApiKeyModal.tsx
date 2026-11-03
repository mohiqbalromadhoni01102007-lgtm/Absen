import React, { useState, useEffect } from 'react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: (msg: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [key, setKey] = useState('');

  useEffect(() => {
    if (isOpen) {
      setKey(localStorage.getItem('gemini_api_key') || '');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
      onSaved('API Key Google AI Studio berhasil disimpan!');
    } else {
      localStorage.removeItem('gemini_api_key');
      onSaved('Menggunakan API runtime server Gemini bawaan.');
    }
    onClose();
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setKey('');
    onSaved('API Key dihapus. Kembali ke default runtime.');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
          aria-label="Tutup Modal"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-microchip"></i>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">Pengaturan Google AI Studio</h3>
            <p className="text-xs text-slate-500">Kunci API Gemini untuk fitur cerdas pesantren</p>
          </div>
        </div>

        <p className="text-xs text-slate-600 mb-4 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
          Fitur Gemini AI (Evaluasi narasi PDF, saran sanksi mendidik, draf balasan wali, dan AI Parenting) sudah memiliki generator bawaan yang siap pakai. Jika Anda ingin menggunakan API key Anda sendiri dari Google AI Studio, masukkan di bawah ini.
        </p>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="api-key-input">
              Gemini API Key (Opsional):
            </label>
            <input
              id="api-key-input"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={handleClear}
              className="w-1/3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition text-xs"
            >
              Hapus / Reset
            </button>
            <button
              type="submit"
              className="w-2/3 bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl shadow transition text-xs flex items-center justify-center gap-1.5"
            >
              <i className="fa-solid fa-floppy-disk"></i>
              <span>Simpan Kunci</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
