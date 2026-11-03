import React, { useState } from 'react';
import { Absensi, Santri } from '../../types';
import { filterSantriList } from '../../utils/rules';

interface AdminRekapTabProps {
  santriList: Santri[];
  absensiList: Absensi[];
}

export const AdminRekapTab: React.FC<AdminRekapTabProps> = ({ santriList, absensiList }) => {
  const [filterKelas, setFilterKelas] = useState('ALL');

  const filtered = filterSantriList(santriList, 'ALL', filterKelas);

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-3">
        <div>
          <h3 className="text-base font-bold text-slate-800">Rekapitulasi Kehadiran Santri</h3>
          <p className="text-xs text-slate-500">
            Statistik akumulasi presensi santri (Hadir, Sakit, Izin, Alpha)
          </p>
        </div>
        <select
          value={filterKelas}
          onChange={(e) => setFilterKelas(e.target.value)}
          className="bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 focus:outline-none font-semibold text-slate-700"
          aria-label="Filter Rekap Kelas"
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
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
            <tr>
              <th className="p-3.5">NIS</th>
              <th className="p-3.5">Nama Santri</th>
              <th className="p-3.5">Kelas</th>
              <th className="p-3.5 text-center text-emerald-600 font-bold">Hadir (H)</th>
              <th className="p-3.5 text-center text-amber-600 font-bold">Sakit (S)</th>
              <th className="p-3.5 text-center text-blue-600 font-bold">Izin (I)</th>
              <th className="p-3.5 text-center text-rose-600 font-bold">Alpha (A)</th>
              <th className="p-3.5 text-center">Tingkat Kehadiran</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((s) => {
              const h = absensiList.filter(a => a.santriId === s.id && a.status === 'H').length;
              const sc = absensiList.filter(a => a.santriId === s.id && a.status === 'S').length;
              const i = absensiList.filter(a => a.santriId === s.id && a.status === 'I').length;
              const a = absensiList.filter(a => a.santriId === s.id && a.status === 'A').length;
              const total = h + sc + i + a;
              const percentage = total > 0 ? Math.round((h / total) * 100) : 100;

              return (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="p-3.5 font-mono text-slate-700">{s.nis}</td>
                  <td className="p-3.5 font-bold text-slate-800">{s.nama}</td>
                  <td className="p-3.5">
                    <span className="bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                      {s.kelas}
                    </span>
                  </td>
                  <td className="p-3.5 text-center font-bold text-emerald-600">{h} Hari</td>
                  <td className="p-3.5 text-center font-bold text-amber-600">{sc} Hari</td>
                  <td className="p-3.5 text-center font-bold text-blue-600">{i} Hari</td>
                  <td className="p-3.5 text-center font-bold text-rose-600">{a} Hari</td>
                  <td className="p-3.5 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-16 bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            percentage >= 80
                              ? 'bg-emerald-500'
                              : percentage >= 60
                              ? 'bg-amber-500'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-[11px] text-slate-700">{percentage}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
