import React, { useState } from 'react';
import { Absensi, ChatMessage, Guru, LandingCMS, Pelanggaran, Santri } from '../../types';
import { AdminSantriTab } from './AdminSantriTab';
import { AdminCmsTab } from './AdminCmsTab';
import { AdminGuruTab } from './AdminGuruTab';
import { AdminWaliTab } from './AdminWaliTab';
import { AdminPelanggaranTab } from './AdminPelanggaranTab';
import { AdminRekapTab } from './AdminRekapTab';
import { AdminChatTab } from './AdminChatTab';
import { AdminLaporanTab } from './AdminLaporanTab';

interface AdminViewProps {
  cms: LandingCMS;
  santriList: Santri[];
  guruList: Guru[];
  absensiList: Absensi[];
  pelanggaranList: Pelanggaran[];
  messages: ChatMessage[];
  onAddSantri: (newSantri: Omit<Santri, 'id'>) => void;
  onUpdateSantri: (updated: Santri) => void;
  onDeleteSantri: (id: number) => void;
  onUpdateCMS: (updated: LandingCMS) => void;
  onAddGuru: (newGuru: Omit<Guru, 'id'>) => void;
  onUpdateGuru: (updated: Guru) => void;
  onDeleteGuru: (id: number) => void;
  onResetWaliPassword: (santriId: number, newPass: string) => void;
  onDeletePelanggaran: (id: number) => void;
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'time'>) => void;
  onMarkChatAsRead: (santriId: number) => void;
  reportType: 'santri' | 'absen' | 'pelanggaran';
  setReportType: (t: 'santri' | 'absen' | 'pelanggaran') => void;
  reportGenderFilter: string;
  setReportGenderFilter: (g: string) => void;
  reportClassFilter: string;
  setReportClassFilter: (c: string) => void;
  aiNarrative: string;
  setAiNarrative: (n: string) => void;
  onPrintReport: () => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRequestConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

export type AdminTab =
  | 'santri'
  | 'cms'
  | 'guru'
  | 'wali'
  | 'pelanggaran'
  | 'rekap'
  | 'chat'
  | 'laporan';

export const AdminView: React.FC<AdminViewProps> = (props) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('santri');

  const unreadMessagesCount = props.messages.filter(
    m => m.recipientRole === 'admin' && !m.readByAdmin
  ).length;

  const totalSantriwan = props.santriList.filter(s => s.jk === 'Santriwan').length;
  const totalSantriwati = props.santriList.filter(s => s.jk === 'Santriwati').length;

  return (
    <div className="space-y-6">
      {/* Admin Stat Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Santriwan (Putra)</p>
            <h4 className="text-2xl font-black text-blue-700 mt-1">{totalSantriwan}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">6 Tingkat Kelas</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fa-solid fa-person"></i>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Santriwati (Putri)</p>
            <h4 className="text-2xl font-black text-purple-700 mt-1">{totalSantriwati}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">6 Tingkat Kelas</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fa-solid fa-person-dress"></i>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Ustadz / Guru</p>
            <h4 className="text-2xl font-black text-emerald-700 mt-1">{props.guruList.length}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Terdaftar Aktif</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fa-solid fa-chalkboard-user"></i>
          </div>
        </div>

        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Catatan Kedisiplinan</p>
            <h4 className="text-2xl font-black text-rose-700 mt-1">{props.pelanggaranList.length}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Sanksi Mendidik</p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-inner">
            <i className="fa-solid fa-triangle-exclamation"></i>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-1.5 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('santri')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'santri'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-graduation-cap"></i>
          <span>Data Santri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cms')}
          className={`flex-1 min-w-[130px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'cms'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'hover:bg-amber-50 text-amber-900 border border-amber-200/60'
          }`}
        >
          <i className="fa-solid fa-sliders"></i>
          <span>Edit CMS Depan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('guru')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'guru'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-chalkboard-user"></i>
          <span>Akun Guru</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('wali')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'wali'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-users"></i>
          <span>Akun Wali</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pelanggaran')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'pelanggaran'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-triangle-exclamation"></i>
          <span>Pelanggaran</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('rekap')}
          className={`flex-1 min-w-[110px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'rekap'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-clipboard-check"></i>
          <span>Rekap Absen</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 relative ${
            activeTab === 'chat'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-comments"></i>
          <span>Pesan Wali</span>
          {unreadMessagesCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {unreadMessagesCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('laporan')}
          className={`flex-1 min-w-[120px] py-2.5 px-3 rounded-xl font-semibold transition flex items-center justify-center space-x-1.5 ${
            activeTab === 'laporan'
              ? 'bg-emerald-800 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-file-pdf text-rose-500"></i>
          <span>Cetak PDF + AI</span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'santri' && (
        <AdminSantriTab
          santriList={props.santriList}
          onAddSantri={props.onAddSantri}
          onUpdateSantri={props.onUpdateSantri}
          onDeleteSantri={props.onDeleteSantri}
          onToast={props.onToast}
          onRequestConfirm={props.onRequestConfirm}
        />
      )}

      {activeTab === 'cms' && (
        <AdminCmsTab
          cms={props.cms}
          onUpdateCMS={props.onUpdateCMS}
          onToast={props.onToast}
          onRequestConfirm={props.onRequestConfirm}
        />
      )}

      {activeTab === 'guru' && (
        <AdminGuruTab
          guruList={props.guruList}
          onAddGuru={props.onAddGuru}
          onUpdateGuru={props.onUpdateGuru}
          onDeleteGuru={props.onDeleteGuru}
          onToast={props.onToast}
          onRequestConfirm={props.onRequestConfirm}
        />
      )}

      {activeTab === 'wali' && (
        <AdminWaliTab
          santriList={props.santriList}
          onResetPassword={props.onResetWaliPassword}
          onToast={props.onToast}
        />
      )}

      {activeTab === 'pelanggaran' && (
        <AdminPelanggaranTab
          pelanggaranList={props.pelanggaranList}
          santriList={props.santriList}
          onDeletePelanggaran={props.onDeletePelanggaran}
          onToast={props.onToast}
          onRequestConfirm={props.onRequestConfirm}
        />
      )}

      {activeTab === 'rekap' && (
        <AdminRekapTab
          santriList={props.santriList}
          absensiList={props.absensiList}
        />
      )}

      {activeTab === 'chat' && (
        <AdminChatTab
          santriList={props.santriList}
          messages={props.messages}
          onSendMessage={props.onSendMessage}
          onMarkAsRead={props.onMarkChatAsRead}
          onToast={props.onToast}
        />
      )}

      {activeTab === 'laporan' && (
        <AdminLaporanTab
          reportType={props.reportType}
          setReportType={props.setReportType}
          genderFilter={props.reportGenderFilter}
          setGenderFilter={props.setReportGenderFilter}
          classFilter={props.reportClassFilter}
          setClassFilter={props.setReportClassFilter}
          aiNarrative={props.aiNarrative}
          setAiNarrative={props.setAiNarrative}
          onPrintReport={props.onPrintReport}
          onToast={props.onToast}
        />
      )}
    </div>
  );
};
