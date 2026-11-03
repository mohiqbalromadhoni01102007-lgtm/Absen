import React, { useState } from 'react';
import { Absensi, AttendanceStatus, ChatMessage, Guru, Pelanggaran, Santri, ViolationSeverity } from '../../types';
import { callGeminiService } from '../../services/gemini';

interface GuruViewProps {
  currentGuru: Guru;
  santriList: Santri[];
  absensiList: Absensi[];
  pelanggaranList: Pelanggaran[];
  messages: ChatMessage[];
  onSaveBatchAttendance: (newAttendance: Absensi[]) => void;
  onAddPelanggaran: (p: Omit<Pelanggaran, 'id'>) => void;
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'time'>) => void;
  onMarkChatAsRead: (santriId: number) => void;
  onUpdatePassword: (guruId: number, newPass: string) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const GuruView: React.FC<GuruViewProps> = ({
  currentGuru,
  santriList,
  absensiList,
  pelanggaranList,
  messages,
  onSaveBatchAttendance,
  onAddPelanggaran,
  onSendMessage,
  onMarkChatAsRead,
  onUpdatePassword,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'absen' | 'pelanggaran' | 'chat'>('absen');

  // Attendance Tab State
  const assigned = currentGuru.assignedClasses || [];
  const [selectedClass, setSelectedClass] = useState<string>(
    assigned.length > 0 ? assigned[0] : ''
  );
  const [absenDate, setAbsenDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  // local edits for radio buttons before saving
  const [localAttendance, setLocalAttendance] = useState<Record<number, AttendanceStatus>>({});

  // Pelanggaran Tab State
  const [pelanggaranSantriId, setPelanggaranSantriId] = useState<number>(
    santriList.length > 0 ? santriList[0].id : 1
  );
  const [pelanggaranTanggal, setPelanggaranTanggal] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [pelanggaranKategori, setPelanggaranKategori] = useState<ViolationSeverity>('Ringan');
  const [pelanggaranNama, setPelanggaranNama] = useState('');
  const [pelanggaranSanksi, setPelanggaranSanksi] = useState('');
  const [isAiSanctionLoading, setIsAiSanctionLoading] = useState(false);

  // Chat Tab State
  const [selectedChatSantriId, setSelectedChatSantriId] = useState<number | null>(
    santriList.length > 0 ? santriList[0].id : null
  );
  const [chatInput, setChatInput] = useState('');
  const [isAiDraftLoading, setIsAiDraftLoading] = useState(false);

  // Password Modal
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [newSelfPass, setNewSelfPass] = useState('');

  // Attendance Helpers
  const classStudents = santriList.filter(s => s.kelas === selectedClass);

  const getStudentStatus = (santriId: number): AttendanceStatus => {
    if (localAttendance[santriId]) return localAttendance[santriId];
    const existing = absensiList.find(
      a => a.santriId === santriId && a.tanggal === absenDate
    );
    return existing ? existing.status : 'H';
  };

  const handleSetStudentStatus = (santriId: number, status: AttendanceStatus) => {
    setLocalAttendance(prev => ({ ...prev, [santriId]: status }));
  };

  const handleSetAllPresent = () => {
    const updated: Record<number, AttendanceStatus> = {};
    classStudents.forEach(s => {
      updated[s.id] = 'H';
    });
    setLocalAttendance(prev => ({ ...prev, ...updated }));
    onToast(`Seluruh santri kelas ${selectedClass} di-set Hadir (H)`, 'info');
  };

  const handleSaveAttendance = () => {
    if (!selectedClass) {
      onToast('Pilih kelas mengajar terlebih dahulu!', 'error');
      return;
    }
    if (classStudents.length === 0) {
      onToast('Tidak ada santri di kelas terpilih.', 'error');
      return;
    }

    const batch: Absensi[] = classStudents.map(s => {
      const existing = absensiList.find(
        a => a.santriId === s.id && a.tanggal === absenDate
      );
      const status = localAttendance[s.id] || (existing ? existing.status : 'H');
      return {
        id: existing ? existing.id : Date.now() + s.id,
        santriId: s.id,
        tanggal: absenDate,
        status,
      };
    });

    onSaveBatchAttendance(batch);
    onToast(`Presensi kelas ${selectedClass} tanggal ${absenDate} berhasil disimpan & disinkronkan!`, 'success');
  };

  // Pelanggaran AI Generator
  const handleFetchAiSanction = async () => {
    if (!pelanggaranNama.trim()) {
      onToast('Ketikkan bentuk pelanggaran terlebih dahulu!', 'error');
      return;
    }
    setIsAiSanctionLoading(true);

    try {
      const recommendation = await callGeminiService({
        userQuery: `Santri melakukan pelanggaran: "${pelanggaranNama}" dengan tingkat "${pelanggaranKategori}" di Pesantren Miftahul Ulum Kalisat. 
Berikan 1 bentuk sanksi yang sangat mendidik, edukatif, Islami (misal: hafalan surah, membaca kitab, khidmah masjid) beserta 1 kalimat nasihat bijak singkat. (Maksimal 2 kalimat total).`,
        systemPrompt: 'Sajikan langsung jawaban ringkas sanksi mendidik yang santun dan beradab.'
      });
      setPelanggaranSanksi(recommendation);
      onToast('Rekomendasi sanksi mendidik AI berhasil dibuat!', 'success');
    } catch {
      onToast('Gagal memanggil asisten AI.', 'error');
    } finally {
      setIsAiSanctionLoading(false);
    }
  };

  const handleSubmitPelanggaran = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pelanggaranNama.trim() || !pelanggaranSanksi.trim()) {
      onToast('Mohon lengkapi nama pelanggaran dan sanksi!', 'error');
      return;
    }

    onAddPelanggaran({
      santriId: pelanggaranSantriId,
      tanggal: pelanggaranTanggal,
      kategori: pelanggaranKategori,
      pelanggaran: pelanggaranNama.trim(),
      sanksi: pelanggaranSanksi.trim(),
    });

    const s = santriList.find(st => st.id === pelanggaranSantriId);
    onToast(`Catatan kedisiplinan ${s?.nama || ''} berhasil disimpan!`, 'success');
    setPelanggaranNama('');
    setPelanggaranSanksi('');
  };

  // Chat Helpers
  const handleSelectChat = (santriId: number) => {
    setSelectedChatSantriId(santriId);
    onMarkChatAsRead(santriId);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChatSantriId || !chatInput.trim()) return;

    onSendMessage({
      santriId: selectedChatSantriId,
      senderRole: 'guru',
      recipientRole: 'wali',
      recipientId: selectedChatSantriId,
      text: chatInput.trim(),
      readByAdmin: true,
      readByGuru: true,
      readByWali: false,
    });

    setChatInput('');
    onToast('Balasan pesan terkirim ke Wali Santri!', 'success');
  };

  const handleGenerateAiChatDraft = async () => {
    const s = santriList.find(st => st.id === selectedChatSantriId);
    if (!s) return;

    setIsAiDraftLoading(true);
    const thread = messages.filter(m => m.santriId === s.id);
    const lastMsg = thread.length > 0 ? thread[thread.length - 1].text : 'Pertanyaan mengenai kegiatan dan akhlaq santri.';

    try {
      const draft = await callGeminiService({
        userQuery: `Pesan terakhir Wali Santri (${s.wali} orang tua dari ${s.nama}): "${lastMsg}".
Buatkan draf balasan ramah, santun, Islami, dan mendidik dari Ustadz ${currentGuru.nama} pengampu ${currentGuru.mapel}. Maksimal 2-3 kalimat.`,
        systemPrompt: 'Berikan jawaban yang menyejukkan hati orang tua, apresiatif, dan bersahaja.'
      });
      setChatInput(draft);
      onToast('Draf balasan AI berhasil dibuat!', 'success');
    } catch {
      onToast('Gagal menyusun draf AI.', 'error');
    } finally {
      setIsAiDraftLoading(false);
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSelfPass.trim()) {
      onToast('Password baru tidak boleh kosong!', 'error');
      return;
    }
    onUpdatePassword(currentGuru.id, newSelfPass.trim());
    onToast('Password Anda berhasil diperbarui!', 'success');
    setIsPassModalOpen(false);
  };

  const unreadCount = messages.filter(
    m => m.recipientRole === 'guru' && m.recipientId === currentGuru.id && !m.readByGuru
  ).length;

  const currentChatSantri = santriList.find(s => s.id === selectedChatSantriId);
  const currentChatThread = selectedChatSantriId
    ? messages.filter(
        m => m.santriId === selectedChatSantriId && (m.recipientRole === 'guru' || m.senderRole === 'guru')
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Teacher Profile Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-blue-800/40">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-blue-500/25 border border-blue-400/30 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
            <i className="fa-solid fa-chalkboard-user"></i>
          </div>
          <div>
            <span className="bg-blue-500/30 text-blue-200 text-xs px-3 py-1 rounded-full border border-blue-400/30 font-semibold inline-block mb-1">
              Portal Guru & Pengajar Kitab
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{currentGuru.nama}</h2>
            <p className="text-xs text-blue-200/90 font-medium mt-0.5">
              Mata Pelajaran: <strong>{currentGuru.mapel}</strong> &bull; Username: <span className="font-mono">{currentGuru.username}</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            setNewSelfPass('');
            setIsPassModalOpen(true);
          }}
          className="self-start md:self-auto bg-white/10 hover:bg-white/20 text-white border border-white/25 px-4 py-2.5 rounded-xl text-xs font-semibold transition flex items-center space-x-2"
        >
          <i className="fa-solid fa-key"></i>
          <span>Ubah Password Guru</span>
        </button>
      </div>

      {/* Guru Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('absen')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
            activeTab === 'absen'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-clipboard-user"></i>
          <span>Presensi Harian Santri</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pelanggaran')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
            activeTab === 'pelanggaran'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-pen-to-square"></i>
          <span>Catat Pelanggaran & AI Sanksi</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 relative ${
            activeTab === 'chat'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-comments"></i>
          <span>Pesan Wali Santri</span>
          {unreadCount > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: PRESENSI HARIAN SANTRI */}
      {activeTab === 'absen' && (
        <div className="space-y-4">
          {assigned.length === 0 ? (
            <div className="bg-amber-50 border border-amber-300 p-8 rounded-3xl text-amber-900 text-xs text-center space-y-3">
              <i className="fa-solid fa-triangle-exclamation text-amber-600 text-4xl"></i>
              <h4 className="font-bold text-base">Belum Ada Kelas Yang Dialokasikan</h4>
              <p className="max-w-md mx-auto text-amber-800">
                Akun Anda belum dialokasikan untuk mengajar di kelas manapun oleh Admin Pondok. Silakan hubungi Sekretariat Admin Pondok untuk mendaftarkan kelas yang Anda ampu.
              </p>
            </div>
          ) : (
            <>
              {/* Presensi Filter & Action Bar */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="guru-select-class">
                      Pilih Kelas Mengajar Anda:
                    </label>
                    <select
                      id="guru-select-class"
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 w-full sm:w-auto focus:outline-none font-bold text-blue-800"
                    >
                      {assigned.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-semibold text-slate-700 mb-1" htmlFor="guru-select-date">
                      Tanggal Presensi:
                    </label>
                    <input
                      id="guru-select-date"
                      type="date"
                      value={absenDate}
                      onChange={(e) => setAbsenDate(e.target.value)}
                      className="bg-slate-50 border border-slate-300 rounded-xl text-xs py-2 px-3 focus:outline-none w-full sm:w-auto font-medium"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleSetAllPresent}
                    className="flex-1 sm:flex-initial bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition"
                  >
                    <i className="fa-solid fa-check-double text-emerald-600 mr-1.5"></i>
                    Semua Hadir
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAttendance}
                    className="flex-1 sm:flex-initial bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow transition flex items-center justify-center space-x-2"
                  >
                    <i className="fa-solid fa-floppy-disk text-xs"></i>
                    <span>Simpan Presensi Kelas</span>
                  </button>
                </div>
              </div>

              {/* Attendance Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">NIS</th>
                      <th className="p-3.5">Nama Santri</th>
                      <th className="p-3.5 text-center text-emerald-700 font-bold">Hadir (H)</th>
                      <th className="p-3.5 text-center text-amber-700 font-bold">Sakit (S)</th>
                      <th className="p-3.5 text-center text-blue-700 font-bold">Izin (I)</th>
                      <th className="p-3.5 text-center text-rose-700 font-bold">Alpha (A)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {classStudents.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-6 text-center text-slate-400">
                          Tidak ada data santri di kelas {selectedClass}.
                        </td>
                      </tr>
                    ) : (
                      classStudents.map((s) => {
                        const status = getStudentStatus(s.id);
                        return (
                          <tr key={s.id} className="hover:bg-slate-50 transition">
                            <td className="p-3.5 font-mono text-slate-700 font-semibold">{s.nis}</td>
                            <td className="p-3.5 font-bold text-slate-800">{s.nama}</td>
                            <td className="p-3.5 text-center">
                              <label className="inline-flex items-center cursor-pointer p-1">
                                <input
                                  type="radio"
                                  name={`absen_${s.id}`}
                                  value="H"
                                  checked={status === 'H'}
                                  onChange={() => handleSetStudentStatus(s.id, 'H')}
                                  className="w-4 h-4 text-emerald-600 accent-emerald-600"
                                  aria-label={`Presensi Hadir ${s.nama}`}
                                />
                              </label>
                            </td>
                            <td className="p-3.5 text-center">
                              <label className="inline-flex items-center cursor-pointer p-1">
                                <input
                                  type="radio"
                                  name={`absen_${s.id}`}
                                  value="S"
                                  checked={status === 'S'}
                                  onChange={() => handleSetStudentStatus(s.id, 'S')}
                                  className="w-4 h-4 text-amber-600 accent-amber-600"
                                  aria-label={`Presensi Sakit ${s.nama}`}
                                />
                              </label>
                            </td>
                            <td className="p-3.5 text-center">
                              <label className="inline-flex items-center cursor-pointer p-1">
                                <input
                                  type="radio"
                                  name={`absen_${s.id}`}
                                  value="I"
                                  checked={status === 'I'}
                                  onChange={() => handleSetStudentStatus(s.id, 'I')}
                                  className="w-4 h-4 text-blue-600 accent-blue-600"
                                  aria-label={`Presensi Izin ${s.nama}`}
                                />
                              </label>
                            </td>
                            <td className="p-3.5 text-center">
                              <label className="inline-flex items-center cursor-pointer p-1">
                                <input
                                  type="radio"
                                  name={`absen_${s.id}`}
                                  value="A"
                                  checked={status === 'A'}
                                  onChange={() => handleSetStudentStatus(s.id, 'A')}
                                  className="w-4 h-4 text-rose-600 accent-rose-600"
                                  aria-label={`Presensi Alpha ${s.nama}`}
                                />
                              </label>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: CATAT PELANGGARAN & AI SANKSI */}
      {activeTab === 'pelanggaran' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Input */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 flex items-center space-x-2">
              <i className="fa-solid fa-pen-to-square text-blue-600"></i>
              <span>Input Catatan Pelanggaran & Sanksi</span>
            </h3>

            <form onSubmit={handleSubmitPelanggaran} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-pel-santri">
                  Pilih Santri:
                </label>
                <select
                  id="guru-pel-santri"
                  value={pelanggaranSantriId}
                  onChange={(e) => setPelanggaranSantriId(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800"
                >
                  {santriList.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.nama} ({s.kelas}) - NIS: {s.nis}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-pel-tgl">
                    Tanggal Kejadian:
                  </label>
                  <input
                    id="guru-pel-tgl"
                    type="date"
                    required
                    value={pelanggaranTanggal}
                    onChange={(e) => setPelanggaranTanggal(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-pel-kat">
                    Tingkat Pelanggaran:
                  </label>
                  <select
                    id="guru-pel-kat"
                    value={pelanggaranKategori}
                    onChange={(e) => setPelanggaranKategori(e.target.value as ViolationSeverity)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 font-semibold text-slate-800"
                  >
                    <option value="Ringan">Ringan (Teguran / Bimbingan)</option>
                    <option value="Sedang">Sedang (Tugas Khidmah / Hafalan)</option>
                    <option value="Berat">Berat (Peringatan Formal & Sidang)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-pel-nama">
                  Bentuk Pelanggaran:
                </label>
                <input
                  id="guru-pel-nama"
                  type="text"
                  required
                  value={pelanggaranNama}
                  onChange={(e) => setPelanggaranNama(e.target.value)}
                  placeholder="Contoh: Terlambat shalat subuh berjamaah di masjid"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-800"
                />
              </div>

              {/* Gemini AI Sanction Box */}
              <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-900 text-[11px] flex items-center gap-1.5">
                    <i className="fa-solid fa-wand-magic-sparkles text-blue-600"></i>
                    Bantuan AI Sanksi Mendidik
                  </span>
                  <button
                    type="button"
                    onClick={handleFetchAiSanction}
                    disabled={isAiSanctionLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold px-3 py-1 rounded-lg transition flex items-center space-x-1 shadow-sm disabled:opacity-50"
                  >
                    <i className={`fa-solid ${isAiSanctionLoading ? 'fa-spinner animate-spin' : 'fa-brain'}`}></i>
                    <span>{isAiSanctionLoading ? 'Menganalisis...' : 'Dapatkan Saran AI'}</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={pelanggaranSanksi}
                  onChange={(e) => setPelanggaranSanksi(e.target.value)}
                  placeholder="Ketik sanksi atau klik 'Dapatkan Saran AI' untuk sanksi edukatif Islami otomatis..."
                  className="w-full bg-white border border-blue-300 rounded-xl p-2.5 text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition text-xs"
              >
                Simpan Catatan Kedisiplinan
              </button>
            </form>
          </div>

          {/* Recent Violations Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-slate-400"></i>
                <span>Riwayat Catatan Terakhir</span>
              </span>
              <span className="text-xs bg-slate-100 px-2.5 py-0.5 rounded-full font-bold text-slate-600">
                {pelanggaranList.length} Total
              </span>
            </h3>

            <div className="space-y-3 overflow-y-auto max-h-[380px] pr-1">
              {pelanggaranList.map((p) => {
                const s = santriList.find(st => st.id === p.santriId);
                return (
                  <div key={p.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">{s?.nama} ({s?.kelas})</span>
                      <span className="text-[10px] text-slate-400 font-mono">{p.tanggal}</span>
                    </div>
                    <p className="font-medium text-slate-700">{p.pelanggaran}</p>
                    <div className="text-[11px] text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      <strong>Sanksi:</strong> {p.sanksi}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PESAN WALI SANTRI */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 min-h-[500px] overflow-hidden">
          {/* Wali Contact List */}
          <div className="border-b md:border-b-0 md:border-r border-slate-200 p-4 space-y-3 bg-slate-50/70">
            <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
              <span className="flex items-center gap-2">
                <i className="fa-solid fa-comments text-blue-600"></i>
                <span>Wali Santri</span>
              </span>
            </h3>

            <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
              {santriList.map((s) => {
                const unread = messages.filter(
                  m => m.santriId === s.id && m.recipientRole === 'guru' && m.recipientId === currentGuru.id && !m.readByGuru
                ).length;
                const isSelected = selectedChatSantriId === s.id;

                return (
                  <button
                    type="button"
                    key={s.id}
                    onClick={() => handleSelectChat(s.id)}
                    className={`w-full text-left p-3 rounded-2xl cursor-pointer transition flex items-center justify-between border ${
                      isSelected
                        ? 'bg-blue-100/80 border-blue-400 font-bold shadow-sm'
                        : 'bg-white hover:bg-slate-100 border-slate-200'
                    }`}
                  >
                    <div>
                      <h5 className="text-xs font-bold text-slate-800">{s.wali}</h5>
                      <p className="text-[11px] text-slate-500 font-medium">
                        Santri: {s.nama} ({s.kelas})
                      </p>
                    </div>
                    {unread > 0 && (
                      <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                        {unread} Baru
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Thread */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 bg-white">
            {currentChatSantri ? (
              <>
                <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shadow-inner">
                      <i className="fa-solid fa-user-tie"></i>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-800">
                        Obrolan Wali: {currentChatSantri.wali}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        Santri: <strong className="text-slate-600">{currentChatSantri.nama}</strong> ({currentChatSantri.kelas})
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex-grow overflow-y-auto space-y-3 p-2 text-xs max-h-[350px]">
                  {currentChatThread.length === 0 ? (
                    <div className="text-center text-slate-400 py-16 space-y-2">
                      <i className="fa-solid fa-comments text-4xl text-slate-300"></i>
                      <p>Belum ada obrolan langsung dengan {currentChatSantri.wali}. Ketik pesan di bawah untuk memulai.</p>
                    </div>
                  ) : (
                    currentChatThread.map((m) => {
                      const isGuru = m.senderRole === 'guru';
                      return (
                        <div key={m.id} className={`flex ${isGuru ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed ${
                              isGuru
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                            }`}
                          >
                            <div className="font-bold text-[10px] mb-1 opacity-80 flex items-center justify-between gap-4">
                              <span>{isGuru ? currentGuru.nama : currentChatSantri.wali}</span>
                              <span>{m.time}</span>
                            </div>
                            <div>{m.text}</div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="border-t border-slate-100 pt-3 mt-2 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <button
                      type="button"
                      onClick={handleGenerateAiChatDraft}
                      disabled={isAiDraftLoading}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 transition shadow-sm disabled:opacity-50"
                    >
                      <i className={`fa-solid ${isAiDraftLoading ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'} text-blue-600`}></i>
                      <span>{isAiDraftLoading ? 'Menyusun AI...' : 'Bantu Draf Balasan AI'}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSendChat} className="flex gap-2">
                    <input
                      type="text"
                      required
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder={`Ketik balasan untuk ${currentChatSantri.wali}...`}
                      className="flex-grow bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
                    >
                      <i className="fa-solid fa-paper-plane text-xs"></i>
                      <span>Kirim</span>
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="text-center text-slate-400 py-20">
                <i className="fa-solid fa-user-xmark text-4xl mb-2 text-slate-300"></i>
                <p>Pilih salah satu Wali Santri di panel kiri.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Password Self Change Modal */}
      {isPassModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsPassModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-100 transition"
            >
              <i className="fa-solid fa-xmark text-lg"></i>
            </button>

            <h3 className="text-base font-bold text-slate-800 mb-1">Ubah Password Guru</h3>
            <p className="text-xs text-slate-500 mb-4">Ustadz: {currentGuru.nama}</p>

            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="guru-self-pass">
                  Password Baru:
                </label>
                <input
                  id="guru-self-pass"
                  type="password"
                  required
                  value={newSelfPass}
                  onChange={(e) => setNewSelfPass(e.target.value)}
                  placeholder="Masukkan password baru..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl shadow transition"
              >
                Perbarui Password Saya
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
