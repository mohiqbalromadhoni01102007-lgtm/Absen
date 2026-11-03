import React, { useState } from 'react';
import { Guru } from '../../types';
import { ALL_12_CLASSES, SANTRIWAN_CLASSES, SANTRIWATI_CLASSES } from '../../utils/rules';

interface AdminGuruTabProps {
  guruList: Guru[];
  onAddGuru: (newGuru: Omit<Guru, 'id'>) => void;
  onUpdateGuru: (updated: Guru) => void;
  onDeleteGuru: (id: number) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const AdminGuruTab: React.FC<AdminGuruTabProps> = ({
  guruList,
  onAddGuru,
  onUpdateGuru,
  onDeleteGuru,
  onToast,
  onRequestConfirm,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [nama, setNama] = useState('');
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('guru123');
  const [mapel, setMapel] = useState('');
  const [telp, setTelp] = useState('');
  const [assignedClasses, setAssignedClasses] = useState<string[]>([]);
  const [revealedPass, setRevealedPass] = useState<Record<number, boolean>>({});

  const toggleReveal = (id: number) => {
    setRevealedPass(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const openAddModal = () => {
    setEditingId(null);
    setNama('');
    setUsername(`guru${guruList.length + 1}`);
    setPass('');
    setMapel('');
    setTelp('');
    setAssignedClasses([]);
    setIsModalOpen(true);
  };

  const openEditModal = (g: Guru) => {
    setEditingId(g.id);
    setNama(g.nama);
    setUsername(g.username);
    setPass(g.pass);
    setMapel(g.mapel);
    setTelp(g.telp);
    setAssignedClasses(g.assignedClasses || []);
    setIsModalOpen(true);
  };

  const toggleClassCheckbox = (className: string) => {
    if (assignedClasses.includes(className)) {
      setAssignedClasses(assignedClasses.filter(c => c !== className));
    } else {
      setAssignedClasses([...assignedClasses, className]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !username.trim() || !mapel.trim() || !pass.trim()) {
      onToast('Mohon lengkapi seluruh kolom yang wajib termasuk password!', 'error');
      return;
    }

    if (editingId) {
      const existing = guruList.find(g => g.id === editingId);
      if (existing) {
        onUpdateGuru({
          ...existing,
          nama: nama.trim(),
          username: username.trim(),
          pass: pass.trim(),
          mapel: mapel.trim(),
          telp: telp.trim(),
          assignedClasses,
        });
        onToast(`Akun guru ${nama} berhasil diperbarui!`, 'success');
      }
    } else {
      onAddGuru({
        nama: nama.trim(),
        username: username.trim(),
        pass: pass.trim(),
        mapel: mapel.trim(),
        telp: telp.trim(),
        assignedClasses,
      });
      onToast(`Akun guru ${nama} berhasil dibuat!`, 'success');
    }

    setIsModalOpen(false);
  };

  const handleDelete = (g: Guru) => {
    onRequestConfirm(
      'Hapus Akun Guru',
      `Apakah Anda yakin ingin menghapus akun guru ${g.nama} (${g.username})?`,
      () => {
        onDeleteGuru(g.id);
        onToast(`Akun guru ${g.nama} telah dihapus.`, 'info');
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span>Kelola Akun Guru & Alokasi Mengajar</span>
            <span className="text-[11px] font-bold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
              <i className="fa-solid fa-lock text-[10px] mr-1"></i>Privat
            </span>
          </h3>
          <p className="text-xs text-slate-500">
            Atur kredensial login, mata pelajaran, dan centang alokasi kelas yang diampu para ustadz. Password disamarkan demi privasi.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-2 rounded-xl text-xs font-semibold shadow transition flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <i className="fa-solid fa-user-plus text-xs"></i>
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Nama Guru / Ustadz</th>
              <th className="p-3.5">Username</th>
              <th className="p-3.5">Password (Privasi)</th>
              <th className="p-3.5">Mata Pelajaran</th>
              <th className="p-3.5">Alokasi Kelas Diampu</th>
              <th className="p-3.5">No. Telp</th>
              <th className="p-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {guruList.map((g) => (
              <tr key={g.id} className="hover:bg-slate-50 transition">
                <td className="p-3.5 font-bold text-slate-800">{g.nama}</td>
                <td className="p-3.5 font-mono text-blue-700 font-semibold">{g.username}</td>
                <td className="p-3.5">
                  <div className="inline-flex items-center gap-1.5 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 font-mono text-xs">
                    <span className="font-semibold text-slate-700">
                      {revealedPass[g.id] ? g.pass : '••••••••'}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleReveal(g.id)}
                      className="text-slate-400 hover:text-slate-600 ml-1 transition"
                      title={revealedPass[g.id] ? "Sembunyikan password" : "Lihat password"}
                    >
                      <i className={`fa-solid ${revealedPass[g.id] ? 'fa-eye-slash' : 'fa-eye'} text-[10px]`}></i>
                    </button>
                  </div>
                </td>
                <td className="p-3.5 font-medium text-slate-700">{g.mapel}</td>
                <td className="p-3.5 max-w-xs">
                  {g.assignedClasses && g.assignedClasses.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {g.assignedClasses.map((c) => (
                        <span
                          key={c}
                          className="bg-blue-50 text-blue-700 border border-blue-200 text-[10px] px-2 py-0.5 rounded font-semibold"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-slate-400 italic text-[11px]">Belum dialokasikan</span>
                  )}
                </td>
                <td className="p-3.5 text-slate-600">{g.telp}</td>
                <td className="p-3.5 text-center space-x-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(g)}
                    className="text-blue-600 hover:text-blue-800 font-semibold text-xs p-1"
                  >
                    <i className="fa-solid fa-pen mr-1"></i>Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(g)}
                    className="text-rose-600 hover:text-rose-800 font-semibold text-xs p-1"
                  >
                    <i className="fa-solid fa-trash mr-1"></i>Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Guru Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-slate-200 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-4">
              {editingId ? 'Edit Akun Guru & Alokasi Kelas' : 'Buat Akun Guru & Alokasi Kelas Baru'}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-nama">
                  Nama Lengkap & Gelar Ustadz:
                </label>
                <input
                  id="guru-nama"
                  type="text"
                  required
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Ustadz Ahmad Fauzi, S.Pd.I"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-username">
                    Username Login:
                  </label>
                  <input
                    id="guru-username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-pass">
                    Password Login:
                  </label>
                  <input
                    id="guru-pass"
                    type="text"
                    required
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-mapel">
                    Mata Pelajaran / Tugas:
                  </label>
                  <input
                    id="guru-mapel"
                    type="text"
                    required
                    value={mapel}
                    onChange={(e) => setMapel(e.target.value)}
                    placeholder="Contoh: Nahwu Shorof / Tahfidz"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-telp">
                    No. Telp / WhatsApp:
                  </label>
                  <input
                    id="guru-telp"
                    type="text"
                    required
                    value={telp}
                    onChange={(e) => setTelp(e.target.value)}
                    placeholder="08123456789"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
              </div>

              {/* Class Allocation Checkboxes */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Alokasi Kelas Mengajar (Centang Kelas Yang Diampu):
                </label>
                <div className="bg-slate-50 border border-slate-300 rounded-2xl p-3.5 space-y-3">
                  <div>
                    <span className="font-bold text-[11px] text-blue-800 block border-b border-blue-200 pb-1 mb-2 flex items-center gap-1">
                      <i className="fa-solid fa-mars"></i> Santriwan (Putra):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {SANTRIWAN_CLASSES.map((c) => (
                        <label key={c} className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={assignedClasses.includes(c)}
                            onChange={() => toggleClassCheckbox(c)}
                            className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                          />
                          <span className="font-medium text-slate-700">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-[11px] text-purple-800 block border-b border-purple-200 pb-1 mb-2 flex items-center gap-1">
                      <i className="fa-solid fa-venus"></i> Santriwati (Putri):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                      {SANTRIWATI_CLASSES.map((c) => (
                        <label key={c} className="flex items-center space-x-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={assignedClasses.includes(c)}
                            onChange={() => toggleClassCheckbox(c)}
                            className="rounded text-purple-600 focus:ring-purple-500 w-3.5 h-3.5"
                          />
                          <span className="font-medium text-slate-700">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition"
                >
                  {editingId ? 'Simpan Perubahan Akun Guru' : 'Buat Akun Guru Baru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
