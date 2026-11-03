import { Absensi, ChatMessage, Guru, LandingCMS, Pelanggaran, Santri } from '../types';

export const defaultLandingCMS: LandingCMS = {
  namaPesantren: "Pondok Pesantren Miftahul Ulum Kalisat",
  tagline: "Sistem Manajemen & Pembinaan Santri Terpadu",
  runningBanner: "📢 PENGUMUMAN: Pendaftaran Santri Baru Tahun Ajaran 2026/2027 PP Miftahul Ulum Kalisat Telah Dibuka! | Libur Akhir Semester Dimulai Tanggal 15 Desember.",
  heroTitle: "Sistem Informasi Pesantren & Pembinaan Santri Terpadu",
  heroDesc: "Platform resmi pengelolaan data santri (12 Kelas Awaliyah & Wustho Putra/Putri), absensi harian, kedisiplinan, laporan PDF resmi ber-KOP Surat, serta layanan obrolan Wali Santri & konseling Gemini AI.",
  heroIconClass: "fa-solid fa-mosque",
  visi: "Terwujudnya Generasi Santri Berakhlakul Karimah, Unggul Dalam Ilmu Agama, Tafaqquh Fiddin, dan Berwawasan Tekno-Sains.",
  misi: "1. Menyelenggarakan pendidikan madrasah diniyah berkualitas (Awaliyah & Wustho).\n2. Membina hafalan Al-Qur'an dan penguasaan Kitab Kuning secara terstruktur.\n3. Membangun komunikasi transparan antara Pengurus, Ustadz, dan Wali Santri.",
  alamat: "Jl. Raya Kalisat, Kecamatan Kalisat, Kabupaten Jember, Jawa Timur (Kode Pos 68193)",
  telpWA: "(0331) 567890 / 0812-3456-7890",
  email: "info@miftahululum-kalisat.sch.id"
};

export const initialSantri: Santri[] = [
  { id: 1, nis: "202401", nama: "Ahmad Fulan", kelas: "1 Awaliyah (Santriwan)", jk: "Santriwan", wali: "Bpk. Hendra", hp: "08123456789", passWali: "wali123" },
  { id: 2, nis: "202402", nama: "Muhammad Rizky", kelas: "2 Awaliyah (Santriwan)", jk: "Santriwan", wali: "Bpk. Suparno", hp: "08139876543", passWali: "wali123" },
  { id: 3, nis: "202403", nama: "Zayd Ibn Tsabit", kelas: "3 Awaliyah (Santriwan)", jk: "Santriwan", wali: "Bpk. Utsman", hp: "08967788990", passWali: "wali123" },
  { id: 4, nis: "202404", nama: "Umar Al-Faruq", kelas: "1 Wustho (Santriwan)", jk: "Santriwan", wali: "Bpk. Khattab", hp: "08129988776", passWali: "wali123" },
  { id: 5, nis: "202405", nama: "Ali bin Abi Thalib", kelas: "2 Wustho (Santriwan)", jk: "Santriwan", wali: "Bpk. Abu Thalib", hp: "08381122445", passWali: "wali123" },
  { id: 6, nis: "202406", nama: "Bilal bin Rabah", kelas: "3 Wustho (Santriwan)", jk: "Santriwan", wali: "Bpk. Rabah", hp: "08198877665", passWali: "wali123" },
  
  { id: 7, nis: "202407", nama: "Aisyah Nur", kelas: "1 Awaliyah (Santriwati)", jk: "Santriwati", wali: "Bpk. Bambang", hp: "08215544332", passWali: "wali123" },
  { id: 8, nis: "202408", nama: "Fatimah Azzahra", kelas: "2 Awaliyah (Santriwati)", jk: "Santriwati", wali: "Bpk. Mahmud", hp: "08571122334", passWali: "wali123" },
  { id: 9, nis: "202409", nama: "Khadijah Al-Kubra", kelas: "3 Awaliyah (Santriwati)", jk: "Santriwati", wali: "Bpk. Khuwailid", hp: "08124455667", passWali: "wali123" },
  { id: 10, nis: "202410", nama: "Maryam Binti Imran", kelas: "1 Wustho (Santriwati)", jk: "Santriwati", wali: "Bpk. Imran", hp: "08961122334", passWali: "wali123" },
  { id: 11, nis: "202411", nama: "Ruqayyah Binti Rasulullah", kelas: "2 Wustho (Santriwati)", jk: "Santriwati", wali: "Bpk. Muhammad", hp: "08385566778", passWali: "wali123" },
  { id: 12, nis: "202412", nama: "Ummu Kultsum", kelas: "3 Wustho (Santriwati)", jk: "Santriwati", wali: "Bpk. Zakariya", hp: "08219900112", passWali: "wali123" }
];

export const initialGuru: Guru[] = [
  {
    id: 1,
    username: "guru1",
    pass: "guru123",
    nama: "Ustadz Ahmad",
    mapel: "Nahwu Shorof (Santriwan)",
    telp: "081211112222",
    assignedClasses: ["1 Awaliyah (Santriwan)", "2 Awaliyah (Santriwan)"]
  },
  {
    id: 2,
    username: "guru2",
    pass: "guru123",
    nama: "Ustadz Mansur",
    mapel: "Tahfidz Al-Qur'an (Santriwan/wati)",
    telp: "081333334444",
    assignedClasses: ["1 Wustho (Santriwan)", "2 Wustho (Santriwan)", "3 Wustho (Santriwan)"]
  },
  {
    id: 3,
    username: "guru3",
    pass: "guru123",
    nama: "Ustadzah Fatimah",
    mapel: "Akhlaq & Hadits (Santriwati)",
    telp: "085755556666",
    assignedClasses: ["1 Awaliyah (Santriwati)", "2 Awaliyah (Santriwati)", "3 Awaliyah (Santriwati)"]
  }
];

export const initialAbsensi: Absensi[] = [
  { id: 1, santriId: 1, tanggal: "2026-11-01", status: "H" },
  { id: 2, santriId: 1, tanggal: "2026-11-02", status: "H" },
  { id: 3, santriId: 1, tanggal: "2026-11-03", status: "S" },
  { id: 4, santriId: 2, tanggal: "2026-11-03", status: "H" },
  { id: 5, santriId: 3, tanggal: "2026-11-03", status: "H" },
  { id: 6, santriId: 4, tanggal: "2026-11-03", status: "H" },
  { id: 7, santriId: 5, tanggal: "2026-11-03", status: "I" },
  { id: 8, santriId: 6, tanggal: "2026-11-03", status: "H" },
  { id: 9, santriId: 7, tanggal: "2026-11-02", status: "H" },
  { id: 10, santriId: 7, tanggal: "2026-11-03", status: "H" },
  { id: 11, santriId: 8, tanggal: "2026-11-02", status: "I" },
  { id: 12, santriId: 8, tanggal: "2026-11-03", status: "H" },
  { id: 13, santriId: 9, tanggal: "2026-11-03", status: "H" },
  { id: 14, santriId: 10, tanggal: "2026-11-03", status: "H" },
  { id: 15, santriId: 11, tanggal: "2026-11-03", status: "H" },
  { id: 16, santriId: 12, tanggal: "2026-11-03", status: "A" }
];

export const initialPelanggaran: Pelanggaran[] = [
  {
    id: 1,
    santriId: 1,
    tanggal: "2026-10-25",
    pelanggaran: "Terlambat Shalat Subuh Berjamaah",
    kategori: "Ringan",
    sanksi: "Membaca Al-Qur'an 1 Juz & Pembiasaan Bangun Pagi"
  },
  {
    id: 2,
    santriId: 7,
    tanggal: "2026-10-28",
    pelanggaran: "Terlambat Masuk Jam Masrukiyah / Diniyah",
    kategori: "Ringan",
    sanksi: "Membaca Nadhom Imrithi 50 Bait bersama pembimbing"
  },
  {
    id: 3,
    santriId: 4,
    tanggal: "2026-10-30",
    pelanggaran: "Keluar Area Asrama Tanpa Surat Izin Keamanan",
    kategori: "Sedang",
    sanksi: "Kerja bakti pembersihan Masjid Pesantren selama 3 hari & setoran hafalan Surah Al-Waqi'ah"
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: 1,
    santriId: 1,
    senderRole: 'wali',
    recipientRole: 'guru',
    recipientId: 1,
    text: "Assalamu'alaikum Ustadz Ahmad, izin bertanya bagaimana perkembangan hafalan Al-Qur'an ananda Ahmad Fulan minggu ini?",
    time: "2026-11-02 09:15",
    readByGuru: false,
    readByAdmin: true,
    readByWali: true
  },
  {
    id: 2,
    santriId: 1,
    senderRole: 'guru',
    recipientRole: 'wali',
    recipientId: 1,
    text: "Wa'alaikumussalam Bpk. Hendra. Alhamdulillah Ahmad Fulan sangat rajin, saat ini sudah menyelesaikan hafalan Juz 30 dengan lancar dan mulai masuk Juz 1.",
    time: "2026-11-02 09:30",
    readByGuru: true,
    readByAdmin: true,
    readByWali: true
  },
  {
    id: 3,
    santriId: 7,
    senderRole: 'wali',
    recipientRole: 'admin',
    recipientId: 0,
    text: "Assalamu'alaikum Admin Pondok, mohon informasi mengenai jadwal kepulangan santri libur semester ganjil.",
    time: "2026-11-03 08:20",
    readByAdmin: false,
    readByGuru: true,
    readByWali: true
  }
];

export function getStoredData<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`sipondok_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

export function saveStoredData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(`sipondok_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error('Storage write error', err);
  }
}
