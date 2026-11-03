import React, { useState, useEffect } from 'react';
import {
  Absensi,
  ChatMessage,
  Guru,
  LandingCMS,
  Pelanggaran,
  Role,
  Santri,
} from './types';
import {
  defaultLandingCMS,
  initialAbsensi,
  initialGuru,
  initialMessages,
  initialPelanggaran,
  initialSantri,
  getStoredData,
  saveStoredData,
} from './data/initialData';
import { Navbar } from './components/Navbar';
import { LandingPortal } from './components/LandingPortal';
import { LoginModal } from './components/LoginModal';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ConfirmModal } from './components/ConfirmModal';
import { PrintableReport } from './components/PrintableReport';
import { AdminView } from './components/admin/AdminView';
import { GuruView } from './components/guru/GuruView';
import { WaliView } from './components/wali/WaliView';

interface ToastItem {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export default function App() {
  // Global State with LocalStorage Persistence
  const [cms, setCms] = useState<LandingCMS>(() =>
    getStoredData('cms', defaultLandingCMS)
  );
  const [santriList, setSantriList] = useState<Santri[]>(() =>
    getStoredData('santri', initialSantri)
  );
  const [guruList, setGuruList] = useState<Guru[]>(() =>
    getStoredData('guru', initialGuru)
  );
  const [absensiList, setAbsensiList] = useState<Absensi[]>(() =>
    getStoredData('absensi', initialAbsensi)
  );
  const [pelanggaranList, setPelanggaranList] = useState<Pelanggaran[]>(() =>
    getStoredData('pelanggaran', initialPelanggaran)
  );
  const [messages, setMessages] = useState<ChatMessage[]>(() =>
    getStoredData('messages', initialMessages)
  );

  // Synchronize state changes to LocalStorage
  useEffect(() => saveStoredData('cms', cms), [cms]);
  useEffect(() => saveStoredData('santri', santriList), [santriList]);
  useEffect(() => saveStoredData('guru', guruList), [guruList]);
  useEffect(() => saveStoredData('absensi', absensiList), [absensiList]);
  useEffect(() => saveStoredData('pelanggaran', pelanggaranList), [pelanggaranList]);
  useEffect(() => saveStoredData('messages', messages), [messages]);

  // Session & Portal State
  const [activeRole, setActiveRole] = useState<Role>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Modal Dialogs State
  const [loginModalRole, setLoginModalRole] = useState<Exclude<Role, null> | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const showToast = (message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  // Printable Report Generation State
  const [reportType, setReportType] = useState<'santri' | 'absen' | 'pelanggaran'>('santri');
  const [reportGenderFilter, setReportGenderFilter] = useState('ALL');
  const [reportClassFilter, setReportClassFilter] = useState('ALL');
  const [aiNarrative, setAiNarrative] = useState('');

  // All portal access is strictly private and authenticated manually. No auto-fill or URL param bypass.
  useEffect(() => {
    // Session begins at the landing page until authenticated manually
    setActiveRole(null);
    setCurrentUser(null);
  }, []);

  // Login handler
  const handleLogin = (u: string, p: string): boolean => {
    if (loginModalRole === 'admin') {
      if (u === 'admin' && p === 'admin123') {
        setActiveRole('admin');
        setCurrentUser({ name: 'Administrator Utama' });
        setLoginModalRole(null);
        showToast('Berhasil masuk sebagai Admin Pondok', 'success');
        return true;
      }
      return false;
    }

    if (loginModalRole === 'guru') {
      const found = guruList.find(g => g.username === u && g.pass === p);
      if (found) {
        setActiveRole('guru');
        setCurrentUser(found);
        setLoginModalRole(null);
        showToast(`Selamat datang, ${found.nama}`, 'success');
        return true;
      }
      return false;
    }

    if (loginModalRole === 'wali') {
      const found = santriList.find(s => s.nis === u && s.passWali === p);
      if (found) {
        setActiveRole('wali');
        setCurrentUser(found);
        setLoginModalRole(null);
        showToast(`Selamat datang Wali dari ${found.nama}`, 'success');
        return true;
      }
      return false;
    }

    return false;
  };

  const handleLogout = () => {
    setActiveRole(null);
    setCurrentUser(null);
    showToast('Anda telah keluar dari akun.', 'info');
  };

  // Confirmation Request Helper
  const requestConfirm = (title: string, message: string, onConfirm: () => void) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Data mutation actions
  const handleAddSantri = (newSantri: Omit<Santri, 'id'>) => {
    const nextId = santriList.length > 0 ? Math.max(...santriList.map(s => s.id)) + 1 : 1;
    setSantriList(prev => [...prev, { ...newSantri, id: nextId }]);
  };

  const handleUpdateSantri = (updated: Santri) => {
    setSantriList(prev => prev.map(s => (s.id === updated.id ? updated : s)));
    if (activeRole === 'wali' && currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const handleDeleteSantri = (id: number) => {
    setSantriList(prev => prev.filter(s => s.id !== id));
    setAbsensiList(prev => prev.filter(a => a.santriId !== id));
    setPelanggaranList(prev => prev.filter(p => p.santriId !== id));
    setMessages(prev => prev.filter(m => m.santriId !== id));
  };

  const handleAddGuru = (newGuru: Omit<Guru, 'id'>) => {
    const nextId = guruList.length > 0 ? Math.max(...guruList.map(g => g.id)) + 1 : 1;
    setGuruList(prev => [...prev, { ...newGuru, id: nextId }]);
  };

  const handleUpdateGuru = (updated: Guru) => {
    setGuruList(prev => prev.map(g => (g.id === updated.id ? updated : g)));
    if (activeRole === 'guru' && currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
  };

  const handleDeleteGuru = (id: number) => {
    setGuruList(prev => prev.filter(g => g.id !== id));
  };

  const handleResetWaliPassword = (santriId: number, newPass: string) => {
    setSantriList(prev =>
      prev.map(s => (s.id === santriId ? { ...s, passWali: newPass } : s))
    );
    if (activeRole === 'wali' && currentUser && currentUser.id === santriId) {
      setCurrentUser({ ...currentUser, passWali: newPass });
    }
  };

  const handleUpdateGuruSelfPassword = (guruId: number, newPass: string) => {
    setGuruList(prev =>
      prev.map(g => (g.id === guruId ? { ...g, pass: newPass } : g))
    );
    if (currentUser && currentUser.id === guruId) {
      setCurrentUser({ ...currentUser, pass: newPass });
    }
  };

  const handleSaveBatchAttendance = (batch: Absensi[]) => {
    setAbsensiList(prev => {
      const copy = [...prev];
      for (const item of batch) {
        const idx = copy.findIndex(
          a => a.santriId === item.santriId && a.tanggal === item.tanggal
        );
        if (idx !== -1) {
          copy[idx] = { ...copy[idx], status: item.status };
        } else {
          const nextId = copy.length > 0 ? Math.max(...copy.map(a => a.id)) + 1 : 1;
          copy.push({ ...item, id: nextId });
        }
      }
      return copy;
    });
  };

  const handleAddPelanggaran = (p: Omit<Pelanggaran, 'id'>) => {
    const nextId = pelanggaranList.length > 0 ? Math.max(...pelanggaranList.map(item => item.id)) + 1 : 1;
    setPelanggaranList(prev => [{ ...p, id: nextId }, ...prev]);
  };

  const handleDeletePelanggaran = (id: number) => {
    setPelanggaranList(prev => prev.filter(p => p.id !== id));
  };

  const handleSendMessage = (msg: Omit<ChatMessage, 'id' | 'time'>) => {
    const now = new Date();
    const timeStr = `${now.toISOString().split('T')[0]} ${now
      .getHours()
      .toString()
      .padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const nextId = messages.length > 0 ? Math.max(...messages.map(m => m.id)) + 1 : 1;
    setMessages(prev => [...prev, { ...msg, id: nextId, time: timeStr }]);
  };

  const handleMarkChatAsRead = (santriId: number) => {
    if (activeRole === 'admin') {
      setMessages(prev =>
        prev.map(m =>
          m.santriId === santriId && m.recipientRole === 'admin'
            ? { ...m, readByAdmin: true }
            : m
        )
      );
    } else if (activeRole === 'guru' && currentUser) {
      setMessages(prev =>
        prev.map(m =>
          m.santriId === santriId && m.recipientRole === 'guru' && m.recipientId === currentUser.id
            ? { ...m, readByGuru: true }
            : m
        )
      );
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Unread badge count for current user
  let unreadBadge = 0;
  if (activeRole === 'admin') {
    unreadBadge = messages.filter(m => m.recipientRole === 'admin' && !m.readByAdmin).length;
  } else if (activeRole === 'guru' && currentUser) {
    unreadBadge = messages.filter(
      m => m.recipientRole === 'guru' && m.recipientId === currentUser.id && !m.readByGuru
    ).length;
  }

  // Filtered lists for PDF report
  const filteredReportSantri = santriList.filter(s => {
    const matchGender = reportGenderFilter === 'ALL' || s.jk === reportGenderFilter;
    const matchClass = reportClassFilter === 'ALL' || s.kelas === reportClassFilter;
    return matchGender && matchClass;
  });

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* 1. TOP NAVBAR */}
      <Navbar
        brandName="SIPONDOK"
        pesantrenBadge={cms.namaPesantren}
        tagline={cms.tagline}
        activeRole={activeRole}
        currentUserName={currentUser?.nama || currentUser?.name || 'Pengguna'}
        unreadCount={unreadBadge}
        onOpenApiKey={() => setIsApiKeyModalOpen(true)}
        onSwitchRole={() => setActiveRole(null)}
        onLogout={handleLogout}
      />

      {/* 2. MAIN APPLICATION CONTENT */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 no-print">
        {!activeRole && (
          <LandingPortal
            cms={cms}
            onOpenLogin={(role) => setLoginModalRole(role)}
          />
        )}

        {activeRole === 'admin' && (
          <AdminView
            cms={cms}
            santriList={santriList}
            guruList={guruList}
            absensiList={absensiList}
            pelanggaranList={pelanggaranList}
            messages={messages}
            onAddSantri={handleAddSantri}
            onUpdateSantri={handleUpdateSantri}
            onDeleteSantri={handleDeleteSantri}
            onUpdateCMS={setCms}
            onAddGuru={handleAddGuru}
            onUpdateGuru={handleUpdateGuru}
            onDeleteGuru={handleDeleteGuru}
            onResetWaliPassword={handleResetWaliPassword}
            onDeletePelanggaran={handleDeletePelanggaran}
            onSendMessage={handleSendMessage}
            onMarkChatAsRead={handleMarkChatAsRead}
            reportType={reportType}
            setReportType={setReportType}
            reportGenderFilter={reportGenderFilter}
            setReportGenderFilter={setReportGenderFilter}
            reportClassFilter={reportClassFilter}
            setReportClassFilter={setReportClassFilter}
            aiNarrative={aiNarrative}
            setAiNarrative={setAiNarrative}
            onPrintReport={handlePrint}
            onToast={showToast}
            onRequestConfirm={requestConfirm}
          />
        )}

        {activeRole === 'guru' && currentUser && (
          <GuruView
            currentGuru={currentUser}
            santriList={santriList}
            absensiList={absensiList}
            pelanggaranList={pelanggaranList}
            messages={messages}
            onSaveBatchAttendance={handleSaveBatchAttendance}
            onAddPelanggaran={handleAddPelanggaran}
            onSendMessage={handleSendMessage}
            onMarkChatAsRead={handleMarkChatAsRead}
            onUpdatePassword={handleUpdateGuruSelfPassword}
            onToast={showToast}
          />
        )}

        {activeRole === 'wali' && currentUser && (
          <WaliView
            currentSantri={currentUser}
            guruList={guruList}
            absensiList={absensiList}
            pelanggaranList={pelanggaranList}
            messages={messages}
            onSendMessage={handleSendMessage}
            onUpdatePassword={handleResetWaliPassword}
            onToast={showToast}
          />
        )}
      </main>

      {/* 3. OFFICIAL FOOTER (NO-PRINT) */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-center text-xs no-print mt-auto">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <div className="flex justify-center items-center space-x-2 text-emerald-400 font-bold tracking-wider">
            <i className="fa-solid fa-kaaba"></i>
            <span>{cms.namaPesantren.toUpperCase()}</span>
          </div>
          <p className="text-slate-400">
            &copy; 2026 {cms.namaPesantren}. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <p className="text-[11px] text-slate-500 leading-relaxed max-w-2xl mx-auto">
            {cms.alamat} &bull; Telp/WA: {cms.telpWA} &bull; Email: {cms.email}
          </p>
        </div>
      </footer>

      {/* 4. PRINTABLE REPORT LAYOUT (ACTIVATED ON WINDOW.PRINT) */}
      <PrintableReport
        cms={cms}
        reportType={reportType}
        genderFilter={reportGenderFilter}
        classFilter={reportClassFilter}
        santriList={filteredReportSantri}
        absensiList={absensiList}
        pelanggaranList={pelanggaranList}
        aiNarrative={aiNarrative}
      />

      {/* 5. MODAL DIALOGS */}
      <LoginModal
        isOpen={loginModalRole !== null}
        role={loginModalRole}
        onClose={() => setLoginModalRole(null)}
        onLogin={handleLogin}
      />

      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onSaved={(msg) => showToast(msg, 'info')}
      />

      <ConfirmModal
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />

      {/* 6. TOAST NOTIFICATIONS */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto border p-3.5 rounded-2xl shadow-2xl text-xs flex items-center space-x-2.5 transform transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${
              t.type === 'success'
                ? 'bg-emerald-950/95 text-emerald-100 border-emerald-700'
                : t.type === 'error'
                ? 'bg-rose-950/95 text-rose-100 border-rose-700'
                : t.type === 'warning'
                ? 'bg-amber-950/95 text-amber-100 border-amber-700'
                : 'bg-slate-900/95 text-white border-slate-700'
            }`}
          >
            <i
              className={`fa-solid ${
                t.type === 'success'
                  ? 'fa-circle-check text-emerald-400'
                  : t.type === 'error'
                  ? 'fa-circle-exclamation text-rose-400'
                  : t.type === 'warning'
                  ? 'fa-triangle-exclamation text-amber-400'
                  : 'fa-info-circle text-blue-400'
              } text-base shrink-0`}
            ></i>
            <span className="font-medium">{t.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
