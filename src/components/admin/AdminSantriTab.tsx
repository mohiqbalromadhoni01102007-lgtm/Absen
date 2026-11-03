import React, { useState } from 'react';
import { Santri } from '../../types';
import { ALL_12_CLASSES, filterSantriList, validateSantriInput } from '../../utils/rules';

interface AdminSantriTabProps {
  santriList: Santri[];
  onAddSantri: (newSantri: Omit<Santri, 'id'>) => void;
  onUpdateSantri: (updated: Santri) => void;
  onDeleteSantri: (id: number) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const AdminSantriTab: React.FC<AdminSantriTabProps> = ({
  santriList,
  onAddSantri,
  onUpdateSantri,
  onDeleteSantri,
  onToast,
  onRequestConfirm,
}) => {
  const [filterGender, setFilterGender] = useState('ALL');
  const [filterKelas, setFilterKelas] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nis, setNis] = useState('');
  const [nama, setNama] = useState('');
  const [jk, setJk] = useState<'Santriwan' | 'Santriwati'>('Santriwan');
  const [kelas, setKelas] = useState<string>('1 Awaliyah (Santriwan)');
  const [wali, setWali] = useState('');
  const [hp, setHp] = useState('');

  const filtered = filterSantriList(santriList, filterGender, filterKelas);

  const openAddModal = () => {
    setEditingId(null);
    setNis(`2024${String(santriList.length + 1).padStart(2, '0')}`);
    setNama('');
    setJk('Santriwan');
    setKelas('1 Awaliyah (Santriwan)');
    setWali('');
    setHp('');
    setIsModalOpen(true);
  };

  const openEditModal = (s: Santri) => {
    setEditingId(s.id);
    setNis(s.nis);
    setNama(s.nama);
    setJk(s.jk);
    setKelas(s.kelas);
    setWali(s.wali);
    setHp(s.hp);
    setIsModalOpen(true);
  };

  const handleGenderChange = (newGender: 'Santriwan' | 'Santriwati') => {
    setJk(newGender);
    if (newGender === 'Santriwan' && !kelas.includes('Santriwan')) {
      setKelas('1 Awaliyah (Santriwan)');
    } else if (newGender === 'Santriwati' && !kelas.includes('Santriwati')) {
      setKelas('1 Awaliyah (Santriwati)');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateSantriInput({ nis, nama, wali, hp });
    if (!validation.isValid) {
      onToast(validation.error || 'Input tidak valid', 'error');
      return;
    }

    if (editingId) {
      const existing = santriList.find(s => s.id === editingId);
      if (existing) {
        onUpdateSantri({
          ...existing,
          nis: nis.trim(),
          nama: nama.trim(),
          jk,
          kelas,
          wali: wali.trim(),
          hp: hp.trim(),
        });
        onToast(`Data santri ${nama} berhasil diperbarui!`, 'success');
      }
    } else {
      onAddSantri({
        nis: nis.trim(),
        nama: nama.trim(),
        jk,
        kelas,
        wali: wali.trim(),
        hp: hp.trim(),
        passWali: 'wali123',
      });
      onToast(`Santri baru ${nama} berhasil ditambahkan!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (s: Santri) => {
    onRequestConfirm(
      'Hapus Data Santri',
      `Apakah Anda yakin ingin menghapus data santri ${s.nama} (${s.nis}) dari basis data?`,
      () => {
        onDeleteSantri(s.id);
        onToast(`Data santri ${s.nama} telah dihapus.`, 'info');
      }
    );
  };

  return (
    <div className="space-y-4">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800">Kelola Data Santri</h3>
          <p className="text-xs text-slate-500">
            Daftar lengkap santri (12 Kelas: Awaliyah & Wustho Putra/Putri)
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 focus:outline-none font-semibold text-slate-700"
            aria-label="Filter Gender Santri"
          >
            <option value="ALL">Semua Gender</option>
            <option value="Santriwan">Santriwan (Putra)</option>
            <option value="Santriwati">Santriwati (Putri)</option>
          </select>
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 focus:outline-none font-semibold text-slate-700"
            aria-label="Filter Tingkat Kelas"
          >
            <option value="ALL">Semua Kelas (12 Kelas)</option>
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
          <button
            type="button"
            onClick={openAddModal}
            className="bg-emerald-800 hover:bg-emerald-900 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition flex items-center space-x-1.5"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Tambah Santri</span>
          </button>
        </div>
      </div>

      {/* Santri Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">NIS</th>
              <th className="p-3.5">Nama Santri</th>
              <th className="p-3.5">Gender</th>
              <th className="p-3.5">Kelas</th>
              <th className="p-3.5">Wali Santri</th>
              <th className="p-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-slate-400">
                  Tidak ada data santri untuk filter ini.
                </td>
              </tr>
            ) : (
              filtered.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono font-semibold text-slate-700">{s.nis}</td>
                  <td className="p-3.5 font-bold text-slate-800">{s.nama}</td>
                  <td className="p-3.5">
                    {s.jk === 'Santriwan' ? (
                      <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <i className="fa-solid fa-mars"></i> Santriwan
                      </span>
                    ) : (
                      <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                        <i className="fa-solid fa-venus"></i> Santriwati
                      </span>
                    )}
                  </td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {s.kelas}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-medium text-slate-800">{s.wali}</span>{' '}
                    <span className="text-slate-400">({s.hp})</span>
                  </td>
                  <td className="p-3.5 text-center space-x-2">
                    <button
                      type="button"
                      onClick={() => openEditModal(s)}
                      className="text-blue-600 hover:text-blue-800 font-semibold text-xs p-1"
                    >
                      <i className="fa-solid fa-pen mr-1"></i>Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(s)}
                      className="text-rose-600 hover:text-rose-800 font-semibold text-xs p-1"
                    >
                      <i className="fa-solid fa-trash mr-1"></i>Hapus
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Santri Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4">
              {editingId ? 'Edit Data Santri' : 'Tambah Data Santri Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="input-nis">
                    Nomor Induk Santri (NIS):
                  </label>
                  <input
                    id="input-nis"
                    type="text"
                    required
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="input-gender">
                    Jenis Kelamin:
                  </label>
                  <select
                    id="input-gender"
                    value={jk}
                    onChange={(e) => handleGenderChange(e.target.value as 'Santriwan' | 'Santriwati')}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold"
                  >
                    <option value="Santriwan">Santriwan (Putra)</option>
                    <option value="Santriwati">Santriwati (Putri)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="input-nama">
                  Nama Lengkap Santri:
                </label>
                <input
                  id="input-nama"
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="input-kelas">
                  Tingkat Kelas:
                </label>
                <select
                  id="input-kelas"
                  value={kelas}
                  onChange={(e) => setKelas(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-emerald-800"
                >
                  {ALL_12_CLASSES.filter(c => (jk === 'Santriwan' ? c.includes('Santriwan') : c.includes('Santriwati'))).map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="input-wali">
                    Nama Orang Tua / Wali:
                  </label>
                  <input
                    id="input-wali"
                    type="text"
                    required
                    value={wali}
                    onChange={(e) => setWali(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="input-hp">
                    Kontak HP / WhatsApp:
                  </label>
                  <input
                    id="input-hp"
                    type="text"
                    required
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold py-3 rounded-xl shadow transition"
                >
                  {editingId ? 'Simpan Perubahan Santri' : 'Tambahkan Santri'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
