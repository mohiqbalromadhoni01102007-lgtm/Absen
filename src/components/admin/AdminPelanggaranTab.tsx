import React from 'react';
import { Pelanggaran, Santri } from '../../types';

interface AdminPelanggaranTabProps {
  pelanggaranList: Pelanggaran[];
  santriList: Santri[];
  onDeletePelanggaran: (id: number) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export const AdminPelanggaranTab: React.FC<AdminPelanggaranTabProps> = ({
  pelanggaranList,
  santriList,
  onDeletePelanggaran,
  onToast,
  onRequestConfirm,
}) => {
  const handleDelete = (p: Pelanggaran) => {
    const s = santriList.find(st => st.id === p.santriId);
    onRequestConfirm(
      'Hapus Catatan Pelanggaran',
      `Yakin ingin menghapus catatan pelanggaran "${p.pelanggaran}" santri ${s?.nama || ''}?`,
      () => {
        onDeletePelanggaran(p.id);
        onToast('Catatan pelanggaran telah dihapus.', 'info');
      }
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h3 className="text-base font-bold text-slate-800">Catatan Pelanggaran & Sanksi Santri</h3>
          <p className="text-xs text-slate-500">
            Rekapitulasi seluruh kedisiplinan dan hukuman mendidik yang diinput oleh Ustadz/Pengasuh
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">Tanggal</th>
              <th className="p-3.5">Nama Santri</th>
              <th className="p-3.5">Kelas</th>
              <th className="p-3.5">Bentuk Pelanggaran</th>
              <th className="p-3.5">Tingkat</th>
              <th className="p-3.5">Sanksi Mendidik</th>
              <th className="p-3.5 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pelanggaranList.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-slate-400">
                  Belum ada catatan pelanggaran santri.
                </td>
              </tr>
            ) : (
              pelanggaranList.map((p) => {
                const s = santriList.find((item) => item.id === p.santriId);
                return (
                  <tr key={p.id} className="hover:bg-slate-50 transition">
                    <td className="p-3.5 text-slate-500 font-mono">{p.tanggal}</td>
                    <td className="p-3.5 font-bold text-slate-800">{s?.nama || 'Santri'}</td>
                    <td className="p-3.5">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-semibold text-slate-700">
                        {s?.kelas || '-'}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-800">{p.pelanggaran}</td>
                    <td className="p-3.5">
                      {p.kategori === 'Ringan' && (
                        <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Ringan
                        </span>
                      )}
                      {p.kategori === 'Sedang' && (
                        <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Sedang
                        </span>
                      )}
                      {p.kategori === 'Berat' && (
                        <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          Berat
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-slate-700 max-w-xs">{p.sanksi}</td>
                    <td className="p-3.5 text-center">
                      <button
                        type="button"
                        onClick={() => handleDelete(p)}
                        className="text-rose-600 hover:text-rose-800 text-xs font-semibold p-1"
                      >
                        <i className="fa-solid fa-trash mr-1"></i>Hapus
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
