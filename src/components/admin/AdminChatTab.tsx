import React, { useState } from 'react';
import { ChatMessage, Santri } from '../../types';
import { callGeminiService } from '../../services/gemini';

interface AdminChatTabProps {
  santriList: Santri[];
  messages: ChatMessage[];
  onSendMessage: (msg: Omit<ChatMessage, 'id' | 'time'>) => void;
  onMarkAsRead: (santriId: number) => void;
  onToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminChatTab: React.FC<AdminChatTabProps> = ({
  santriList,
  messages,
  onSendMessage,
  onMarkAsRead,
  onToast,
}) => {
  const [selectedSantriId, setSelectedSantriId] = useState<number | null>(
    santriList.length > 0 ? santriList[0].id : null
  );
  const [inputText, setInputText] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  const selectedSantri = santriList.find(s => s.id === selectedSantriId);

  const handleSelectSantri = (id: number) => {
    setSelectedSantriId(id);
    onMarkAsRead(id);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSantriId || !inputText.trim()) return;

    onSendMessage({
      santriId: selectedSantriId,
      senderRole: 'admin',
      recipientRole: 'wali',
      recipientId: selectedSantriId,
      text: inputText.trim(),
      readByAdmin: true,
      readByGuru: true,
      readByWali: false,
    });

    setInputText('');
    onToast('Pesan balasan admin berhasil terkirim!', 'success');
  };

  const handleGenerateAiDraft = async () => {
    if (!selectedSantri) return;
    setIsGeneratingAi(true);

    const thread = messages.filter(m => m.santriId === selectedSantri.id);
    const lastMsg = thread.length > 0 ? thread[thread.length - 1].text : 'Pertanyaan seputar perkembangan santri.';

    try {
      const draft = await callGeminiService({
        userQuery: `Pesan terakhir dari Wali Santri (${selectedSantri.wali} orang tua dari ${selectedSantri.nama}): "${lastMsg}". Buatkan draf balasan ramah, santun, Islami, dan informatif dari pihak Admin Sekretariat Pengurus Pesantren. Maksimal 2-3 kalimat.`,
        systemPrompt: 'Anda adalah Admin Sekretariat Pesantren Miftahul Ulum Kalisat. Berikan draf balasan resmi yang santun, hangat, dan Islami.'
      });
      setInputText(draft);
      onToast('Draf balasan AI berhasil dimasukkan ke kolom pesan!', 'success');
    } catch {
      onToast('Gagal menyusun draf AI.', 'error');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const currentThread = selectedSantriId
    ? messages.filter(m => m.santriId === selectedSantriId)
    : [];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-3 min-h-[520px] overflow-hidden">
      {/* Sidebar Contact List Wali */}
      <div className="border-b md:border-b-0 md:border-r border-slate-200 p-4 space-y-3 bg-slate-50/70">
        <h3 className="font-bold text-slate-800 text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <i className="fa-solid fa-comments text-emerald-600"></i>
            <span>Daftar Wali Santri</span>
          </span>
          <span className="text-[11px] text-slate-400 font-normal">
            {santriList.length} Kontak
          </span>
        </h3>

        <div className="space-y-1.5 overflow-y-auto max-h-[440px] pr-1">
          {santriList.map((s) => {
            const unreadCount = messages.filter(
              m => m.santriId === s.id && m.recipientRole === 'admin' && !m.readByAdmin
            ).length;
            const isSelected = selectedSantriId === s.id;

            return (
              <button
                type="button"
                key={s.id}
                onClick={() => handleSelectSantri(s.id)}
                className={`w-full text-left p-3 rounded-2xl cursor-pointer transition flex items-center justify-between border ${
                  isSelected
                    ? 'bg-emerald-100/80 border-emerald-400 font-bold shadow-sm'
                    : 'bg-white hover:bg-slate-100 border-slate-200'
                }`}
              >
                <div>
                  <h5 className="text-xs font-bold text-slate-800">{s.wali}</h5>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Santri: {s.nama} ({s.kelas})
                  </p>
                </div>
                {unreadCount > 0 && (
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                    {unreadCount} Baru
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Chat Thread Area */}
      <div className="md:col-span-2 flex flex-col justify-between p-4 bg-white">
        {selectedSantri ? (
          <>
            {/* Chat Header */}
            <div className="border-b border-slate-100 pb-3 mb-3 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shadow-inner">
                  <i className="fa-solid fa-user"></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">
                    Obrolan dengan {selectedSantri.wali}
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Wali dari: <strong className="text-slate-600">{selectedSantri.nama}</strong> ({selectedSantri.kelas}) &bull; Telp: {selectedSantri.hp}
                  </p>
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-grow overflow-y-auto space-y-3 p-2 text-xs max-h-[350px]">
              {currentThread.length === 0 ? (
                <div className="text-center text-slate-400 py-16 space-y-2">
                  <i className="fa-solid fa-comments text-4xl text-slate-300"></i>
                  <p>Belum ada percakapan dengan {selectedSantri.wali}. Ketik pesan di bawah untuk memulai obrolan.</p>
                </div>
              ) : (
                currentThread.map((m) => {
                  const isAdmin = m.senderRole === 'admin';
                  return (
                    <div key={m.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm text-xs leading-relaxed ${
                          isAdmin
                            ? 'bg-emerald-800 text-white rounded-br-none'
                            : 'bg-slate-100 text-slate-800 border border-slate-200 rounded-bl-none'
                        }`}
                      >
                        <div className="font-bold text-[10px] mb-1 opacity-80 flex items-center justify-between gap-4">
                          <span>{isAdmin ? 'Admin Pondok' : selectedSantri.wali}</span>
                          <span>{m.time}</span>
                        </div>
                        <div>{m.text}</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input & AI Assistant */}
            <div className="border-t border-slate-100 pt-3 mt-2 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <button
                  type="button"
                  onClick={handleGenerateAiDraft}
                  disabled={isGeneratingAi}
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center space-x-1.5 transition shadow-sm disabled:opacity-50"
                >
                  <i className={`fa-solid ${isGeneratingAi ? 'fa-spinner animate-spin' : 'fa-wand-magic-sparkles'} text-emerald-600`}></i>
                  <span>{isGeneratingAi ? 'Menyusun Balasan AI...' : 'Bantu Draf Balasan AI'}</span>
                </button>
              </div>

              <form onSubmit={handleSend} className="flex gap-2">
                <input
                  type="text"
                  required
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Ketik pesan balasan untuk ${selectedSantri.wali}...`}
                  className="flex-grow bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  className="bg-emerald-800 hover:bg-emerald-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs transition flex items-center space-x-1.5 shadow"
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
            <p>Pilih salah satu Wali Santri dari daftar sebelah kiri.</p>
          </div>
        )}
      </div>
    </div>
  );
};
