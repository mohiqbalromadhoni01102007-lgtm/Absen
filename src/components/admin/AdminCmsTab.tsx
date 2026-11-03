import React, { useState } from 'react';
import { LandingCMS } from '../../types';
import { defaultLandingCMS } from '../../data/initialData';

interface AdminCmsTabProps {
  cms: LandingCMS;
  onUpdateCMS: (updated: LandingCMS) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const AdminCmsTab: React.FC<AdminCmsTabProps> = ({
  cms,
  onUpdateCMS,
  onToast,
  onRequestConfirm,
}) => {
  const [formData, setFormData] = useState<LandingCMS>({ ...cms });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCMS(formData);
    onToast('Tampilan Halaman Depan (CMS) Berhasil Disimpan & Sinkron!', 'success');
  };

  const handleReset = () => {
    onRequestConfirm(
      'Reset CMS ke Bawaan',
      'Apakah Anda yakin ingin mengembalikan seluruh teks tampilan depan ke konfigurasi awal pesantren?',
      () => {
        setFormData({ ...defaultLandingCMS });
        onUpdateCMS({ ...defaultLandingCMS });
        onToast('Tampilan CMS telah di-reset ke bawaan pesantren.', 'info');
      }
    );
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
            <i className="fa-solid fa-sliders text-amber-500"></i>
            <span>Pengaturan CMS Tampilan Halaman Depan</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Ubah teks identitas pesantren, running announcement banner, visi & misi, serta kontak publik secara real-time.
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3.5 py-2 rounded-xl transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <i className="fa-solid fa-rotate-left"></i>
          <span>Reset Bawaan Pesantren</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-nama">
              Nama Pesantren:
            </label>
            <input
              id="cms-nama"
              name="namaPesantren"
              type="text"
              required
              value={formData.namaPesantren}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-tagline">
              Tagline / Subtitle Header:
            </label>
            <input
              id="cms-tagline"
              name="tagline"
              type="text"
              required
              value={formData.tagline}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-banner">
            Teks Running Alert Banner (Pengumuman Berjalan):
          </label>
          <input
            id="cms-banner"
            name="runningBanner"
            type="text"
            required
            value={formData.runningBanner}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-hero-title">
              Judul Hero Banner Depan:
            </label>
            <input
              id="cms-hero-title"
              name="heroTitle"
              type="text"
              required
              value={formData.heroTitle}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-bold"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-icon">
              Class Ikon Hero (FontAwesome):
            </label>
            <input
              id="cms-icon"
              name="heroIconClass"
              type="text"
              required
              placeholder="fa-solid fa-mosque"
              value={formData.heroIconClass}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
            />
          </div>
        </div>

        <div>
          <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-hero-desc">
            Deskripsi Sambutan Utama (Hero Description):
          </label>
          <textarea
            id="cms-hero-desc"
            name="heroDesc"
            rows={3}
            required
            value={formData.heroDesc}
            onChange={handleChange}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
          ></textarea>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-visi">
              Visi Pesantren:
            </label>
            <textarea
              id="cms-visi"
              name="visi"
              rows={3}
              required
              value={formData.visi}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-misi">
              Misi Pesantren:
            </label>
            <textarea
              id="cms-misi"
              name="misi"
              rows={3}
              required
              value={formData.misi}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-alamat">
              Alamat Lengkap Pesantren:
            </label>
            <input
              id="cms-alamat"
              name="alamat"
              type="text"
              required
              value={formData.alamat}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-telp">
              Nomor Telepon / WA:
            </label>
            <input
              id="cms-telp"
              name="telpWA"
              type="text"
              required
              value={formData.telpWA}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-700 mb-1" htmlFor="cms-email">
              Email Resmi Pesantren:
            </label>
            <input
              id="cms-email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-700 text-white font-bold py-3.5 rounded-xl shadow-md transition flex items-center justify-center space-x-2 text-xs"
          >
            <i className="fa-solid fa-floppy-disk"></i>
            <span>Simpan Perubahan Tampilan Depan (CMS)</span>
          </button>
        </div>
      </form>
    </div>
  );
};
