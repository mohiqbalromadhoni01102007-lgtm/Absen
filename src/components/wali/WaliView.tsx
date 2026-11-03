import React, { useState } from 'react';
import { Absensi, ChatMessage, Guru, Pelanggaran, Santri } from '../../types';
import { calculateDisciplineScore, getAttendanceSummary } from '../../utils/rules';
import { callGeminiService } from '../../services/gemini';

interface WaliViewProps {
  currentSantri: Santri;
  guruList: Guru[];
  absensiList: Absensi[];
  pelanggaranList: Pelanggaran[];
  messages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'time'>) => void;
  onUpdatePassword: (santriId: number, newPass: string) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const WaliView: React.FC<WaliViewProps> = ({
  currentSantri,
  guruList,
  absensiList,
  pelanggaranList,
  messages,
  onSendMessage,
  onUpdatePassword,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'chat' | 'ai'>('dashboard');

  // Recipient selection: role 'admin' (recipientId 0) or 'guru' (recipientId)
  const [selectedRecipient, setSelectedRecipient] = useState<{
    role: 'admin' | 'guru';
    id: number;
    name: string;
    sub: string;
  }>({
    role: 'admin',
    id: 0,
    name: 'Admin Pondok',
    sub: 'Sekretariat & Pengurus Utama',
  });

  const [chatInput, setChatInput] = useState('');

  // AI Parenting Chat State
  const [aiChatHistory, setAiChatHistory] = useState<
    Array<{ sender: 'user' | 'ai'; text: string }>
  >([
    {
      sender: 'ai',
      text: "Assalamu'alaikum Warahmatullahi Wabarakatuh Bapak/Ibu Wali Santri. Saya adalah Asisten Konsultasi Parenting Islami Pesantren Miftahul Ulum Kalisat. Silakan tanyakan bimbingan pola asuh Islami, memotivasi hafalan Al-Qur'an anak, atau tips mengatasi santri yang merasa rindu rumah (homesick).",
    },
  ]);
  const [aiInput, setAiInput] = useState('');
  const [isAiConsulting, setIsAiConsulting] = useState(false);

  // Password Modal
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [newSelfPass, setNewSelfPass] = useState('');

  // Stats
  const summary = getAttendanceSummary(absensiList, currentSantri.id);
  const myPelanggaran = pelanggaranList.filter(p => p.santriId === currentSantri.id);
  const disciplineScore = calculateDisciplineScore(pelanggaranList, currentSantri.id);

  // Chat Thread Filter
  const currentChatThread = messages.filter((m) => {
    if (m.santriId !== currentSantri.id) return false;
    if (selectedRecipient.role === 'admin') {
      return m.recipientRole === 'admin' || m.senderRole === 'admin';
    } else {
      return (
        (m.recipientRole === 'guru' && m.recipientId === selectedRecipient.id) ||
        (m.senderRole === 'guru' && m.recipientId === currentSantri.id)
      );
    }
  });

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    onSendMessage({
      santriId: currentSantri.id,
      senderRole: 'wali',
      recipientRole: selectedRecipient.role,
      recipientId: selectedRecipient.id,
      text: chatInput.trim(),
      readByAdmin: selectedRecipient.role !== 'admin',
      readByGuru: selectedRecipient.role !== 'guru',
      readByWali: true,
    });

    setChatInput('');
    onToast('Pesan Anda telah berhasil terkirim!', 'success');
  };

  // AI Parenting Ask
  const handleAskAi = async (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    setAiChatHistory(prev => [...prev, { sender: 'user', text: q }]);
    setAiInput('');
    setIsAiConsulting(true);

    try {
      const advice = await callGeminiService({
        userQuery: q,
        systemPrompt:
          'Anda adalah Asisten Pakar Parenting Islami dan Pembinaan Santri Pesantren Miftahul Ulum Kalisat Jember. Berikan jawaban konseling yang sangat menyejukkan hati wali santri, Islami, praktis, dan memotivasi. Sebutkan doa atau ayat pendek jika relevan. Jawab singkat dan padat.',
      });
      setAiChatHistory(prev => [...prev, { sender: 'ai', text: advice }]);
    } catch {
      setAiChatHistory(prev => [
        ...prev,
        {
          sender: 'ai',
          text: 'Mohon maaf, terjadi kendala jaringan sementara. Silakan ulangi pertanyaan Anda beberapa saat lagi.',
        },
      ]);
    } finally {
      setIsAiConsulting(false);
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSelfPass.trim()) {
      onToast('Password baru tidak boleh kosong!', 'error');
      return;
    }
    onUpdatePassword(currentSantri.id, newSelfPass.trim());
    onToast('Password Wali Santri berhasil diperbarui!', 'success');
    setIsPassModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Wali Banner */}
      <div className="bg-gradient-to-r from-purple-950 via-purple-900 to-slate-900 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-purple-800/40">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-500/25 border border-purple-400/30 flex items-center justify-center text-3xl font-bold text-white shadow-inner">
            <i className="fa-solid fa-user-graduate"></i>
          </div>
          <div>
            <span className="bg-purple-500/30 text-purple-200 text-xs px-3 py-0.5 rounded-full border border-purple-300/25 font-semibold inline-block mb-1">
              Portal Wali Santri Resmi
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">{currentSantri.nama}</h2>
            <p className="text-xs text-purple-200/90 font-medium">
              NIS: <span className="font-mono">{currentSantri.nis}</span> &bull; Tingkat: <strong>{currentSantri.kelas}</strong> &bull; Wali: {currentSantri.wali}
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
          <span>Ubah Password Wali</span>
        </button>
      </div>

      {/* Wali Navigation Tabs */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 flex flex-wrap gap-2 text-xs sm:text-sm">
        <button
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
            activeTab === 'dashboard'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-chart-pie"></i>
          <span>Ringkasan & Kedisiplinan</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('chat')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
            activeTab === 'chat'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-comments"></i>
          <span>Chat Ustadz / Admin</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2.5 px-4 rounded-xl font-semibold transition flex items-center justify-center space-x-2 ${
            activeTab === 'ai'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'hover:bg-slate-100 text-slate-600'
          }`}
        >
          <i className="fa-solid fa-brain"></i>
          <span>AI Parenting Islami</span>
        </button>
      </div>

      {/* TAB 1: RINGKASAN & KEDISIPLINAN */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Attendance Counters Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Hadir (H)</p>
                <h4 className="text-2xl font-black text-emerald-600 mt-1">{summary.hadir} Hari</h4>
                <p className="text-[10px] text-emerald-700 font-semibold mt-0.5">Tingkat {summary.persentaseHadir}%</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shadow-inner">
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Sakit (S)</p>
                <h4 className="text-2xl font-black text-amber-600 mt-1">{summary.sakit} Hari</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Surat Izin Kesehatan</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-xl shadow-inner">
                <i className="fa-solid fa-bed"></i>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Izin (I)</p>
                <h4 className="text-2xl font-black text-blue-600 mt-1">{summary.izin} Hari</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Keperluan Keluarga</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shadow-inner">
                <i className="fa-solid fa-envelope-open-text"></i>
              </div>
            </div>

            <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Alpha (A)</p>
                <h4 className="text-2xl font-black text-rose-600 mt-1">{summary.alpha} Hari</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Tanpa Keterangan</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shadow-inner">
                <i className="fa-solid fa-circle-xmark"></i>
              </div>
            </div>
          </div>

          {/* Details & Disciplinary History */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Santri Card */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm flex items-center space-x-2">
                <i className="fa-solid fa-address-card text-purple-600"></i>
                <span>Detail Biodata Santri</span>
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Nama Lengkap Santri:</span>
                  <span className="font-bold text-slate-800 text-sm">{currentSantri.nama}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nomor Induk Santri (NIS):</span>
                  <span className="font-mono font-semibold text-slate-700">{currentSantri.nis}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tingkatan Kelas:</span>
                  <span className="font-semibold text-slate-700">{currentSantri.kelas}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Jenis Kelamin:</span>
                  <span className="font-semibold text-slate-700">{currentSantri.jk}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Nama Orang Tua / Wali:</span>
                  <span className="font-semibold text-slate-700">{currentSantri.wali}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Kontak Terdaftar:</span>
                  <span className="font-semibold text-slate-700">{currentSantri.hp}</span>
                </div>
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block text-[11px]">Indeks Kedisiplinan:</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xl font-black text-purple-700">{disciplineScore} / 100</span>
                    <span className="text-[10px] bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full font-bold">
                      {disciplineScore >= 90 ? 'Sangat Baik' : disciplineScore >= 75 ? 'Baik' : 'Perlu Pembinaan'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Catatan Pelanggaran */}
            <div className="lg:col-span-2 bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 text-sm flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <i className="fa-solid fa-shield-halved text-amber-500"></i>
                  <span>Riwayat Catatan Pelanggaran & Sanksi Mendidik</span>
                </span>
                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {myPelanggaran.length} Catatan
                </span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead className="bg-slate-100 text-slate-700 uppercase font-semibold border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">Tanggal</th>
                      <th className="p-2.5">Bentuk Pelanggaran</th>
                      <th className="p-2.5">Tingkat</th>
                      <th className="p-2.5">Sanksi Mendidik Diberikan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myPelanggaran.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-6 text-center text-slate-400">
                          Alhamdulillah, ananda memiliki catatan kedisiplinan yang sangat baik (0 Pelanggaran).
                        </td>
                      </tr>
                    ) : (
                      myPelanggaran.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50 transition">
                          <td className="p-2.5 text-slate-500 font-mono">{p.tanggal}</td>
                          <td className="p-2.5 font-bold text-slate-800">{p.pelanggaran}</td>
                          <td className="p-2.5">
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
                          <td className="p-2.5 text-slate-700">{p.sanksi}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CHAT USTADZ / ADMIN */}
      {activeTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 min-h-[500px] overflow-hidden">
          {/* Recipient Selector */}
          <div className="border-b md:border-b-0 md:border-r border-slate-200 p-4 space-y-3 bg-slate-50/70">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <i className="fa-solid fa-paper-plane text-purple-600"></i>
              <span>Kirim Pesan Ke:</span>
            </h3>

            <div className="space-y-2">
              {/* Option 1: Admin */}
              <button
                type="button"
                onClick={() =>
                  setSelectedRecipient({
                    role: 'admin',
                    id: 0,
                    name: 'Admin Pondok',
                    sub: 'Sekretariat & Pengurus Utama',
                  })
                }
                className={`w-full text-left p-3 rounded-2xl cursor-pointer transition border ${
                  selectedRecipient.role === 'admin'
                    ? 'bg-purple-100/80 border-purple-400 font-bold shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-200'
                }`}
              >
                <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <i className="fa-solid fa-user-shield text-emerald-600"></i>
                  <span>Admin Pondok</span>
                </h5>
                <p className="text-[11px] text-slate-500 font-medium">Sekretariat & Pengurus Utama</p>
              </button>

              {/* Option 2+: Teachers */}
              {guruList.map((g) => (
                <button
                  type="button"
                  key={g.id}
                  onClick={() =>
                    setSelectedRecipient({
                      role: 'guru',
                      id: g.id,
                      name: g.nama,
                      sub: g.mapel,
                    })
                  }
                  className={`w-full text-left p-3 rounded-2xl cursor-pointer transition border ${
                    selectedRecipient.role === 'guru' && selectedRecipient.id === g.id
                      ? 'bg-purple-100/80 border-purple-400 font-bold shadow-sm'
                      : 'bg-white hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <h5 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <i className="fa-solid fa-user-tie text-blue-600"></i>
                    <span>{g.nama}</span>
                  </h5>
                  <p className="text-[11px] text-slate-500 font-medium">{g.mapel}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active Chat Area */}
          <div className="md:col-span-2 flex flex-col justify-between p-4 bg-white">
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shadow-inner">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    Pesan Kepada: {selectedRecipient.name}
                  </h4>
                  <p className="text-[11px] text-slate-400">{selectedRecipient.sub}</p>
                </div>
              </div>
            </div>

            <div className="flex-grow overflow-y-auto space-y-3 p-2 text-xs max-h-[350px]">
              {currentChatThread.length === 0 ? (
                <div className="text-center text-slate-400 py-16 space-y-2">
                  <i className="fa-solid fa-comments text-4xl text-slate-300"></i>
                  <p>Belum ada percakapan. Tuliskan pesan di bawah untuk mengajukan pertanyaan kepada pengurus.</p>
                </div>
              ) : (
                currentChatThread.map((m) => {
                  const isMe = m.senderRole === 'wali';
                  return (
                    <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed ${
                          isMe
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                        }`}
                      >
                        <div className="font-bold text-[10px] mb-1 opacity-80 flex items-center justify-between gap-4">
                          <span>{isMe ? 'Anda (Wali Santri)' : selectedRecipient.name}</span>
                          <span>{m.time}</span>
                        </div>
                        <div>{m.text}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="border-t border-slate-100 pt-3 mt-2">
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder={`Tuliskan pesan / pertanyaan Anda untuk ${selectedRecipient.name}...`}
                  className="flex-grow bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="submit"
                  className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
                >
                  <i className="fa-solid fa-paper-plane text-xs"></i>
                  <span>Kirim</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI PARENTING ISLAMI */}
      {activeTab === 'ai' && (
        <div className="bg-gradient-to-br from-purple-950 via-purple-900 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4 max-w-3xl mx-auto border border-purple-800/40">
          <div className="flex items-center justify-between border-b border-purple-800/50 pb-3">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-purple-500/30 text-purple-300 flex items-center justify-center text-lg border border-purple-400/30 shadow-inner">
                <i className="fa-solid fa-robot"></i>
              </div>
              <div>
                <h4 className="font-bold text-base text-purple-100">
                  AI Konsultasi Perkembangan & Pola Asuh Santri
                </h4>
                <p className="text-xs text-purple-300/80">
                  Konsultasikan motivasi anak, istiqomah ibadah, dan bimbingan kepesantrenan
                </p>
              </div>
            </div>
          </div>

          {/* Chat History Box */}
          <div className="bg-slate-950/50 rounded-2xl p-4 h-72 overflow-y-auto space-y-3 border border-purple-800/40 text-xs">
            {aiChatHistory.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3.5 rounded-2xl max-w-[85%] leading-relaxed shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-purple-600 text-white ml-auto'
                    : 'bg-purple-900/40 border border-purple-700/40 text-purple-100'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isAiConsulting && (
              <div className="bg-purple-900/40 border border-purple-700/40 text-purple-200 p-3.5 rounded-2xl max-w-[85%] text-xs flex items-center space-x-2 animate-pulse">
                <i className="fa-solid fa-spinner animate-spin"></i>
                <span>Gemini AI sedang menyusun jawaban bimbingan...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestion Chips */}
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() =>
                handleAskAi(
                  'Bagaimana saran terbaik mengatasi anak yang merasa rindu rumah (homesick) di awal masuk pondok?'
                )
              }
              className="bg-purple-800/40 hover:bg-purple-700/50 text-purple-200 px-3 py-1.5 rounded-full border border-purple-600/30 transition text-left"
            >
              💡 Solusi Anak Homesick
            </button>
            <button
              type="button"
              onClick={() =>
                handleAskAi(
                  'Bagaimana cara orang tua mendukung kedisiplinan shalat subuh santri saat liburan pesantren?'
                )
              }
              className="bg-purple-800/40 hover:bg-purple-700/50 text-purple-200 px-3 py-1.5 rounded-full border border-purple-600/30 transition text-left"
            >
              💡 Motivasi Shalat Subuh
            </button>
            <button
              type="button"
              onClick={() =>
                handleAskAi(
                  'Bagaimana cara orang tua menyimak dan mendukung hafalan Al-Quran santri tanpa membebani?'
                )
              }
              className="bg-purple-800/40 hover:bg-purple-700/50 text-purple-200 px-3 py-1.5 rounded-full border border-purple-600/30 transition text-left"
            >
              💡 Dukungan Hafalan Al-Quran
            </button>
          </div>

          {/* Form Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAi(aiInput);
            }}
            className="flex gap-2 pt-1"
          >
            <input
              type="text"
              required
              value={aiInput}
              onChange={(e) => setAiInput(e.target.value)}
              placeholder="Tuliskan pertanyaan konsultasi pola asuh Anda..."
              className="flex-grow bg-slate-900 border border-purple-700/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-purple-400 focus:outline-none focus:border-purple-400"
            />
            <button
              type="submit"
              disabled={isAiConsulting}
              className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow-md disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
              <span>Kirim</span>
            </button>
          </form>
        </div>
      )}

      {/* Password Modal */}
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

            <h3 className="text-base font-bold text-slate-800 mb-1">Ubah Password Wali Santri</h3>
            <p className="text-xs text-slate-500 mb-4">Santri: {currentSantri.nama}</p>

            <form onSubmit={handleSavePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1" htmlFor="wali-self-pass">
                  Password Baru:
                </label>
                <input
                  id="wali-self-pass"
                  type="password"
                  required
                  value={newSelfPass}
                  onChange={(e) => setNewSelfPass(e.target.value)}
                  placeholder="Masukkan password baru..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl shadow transition"
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
