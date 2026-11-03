export type Role = 'admin' | 'guru' | 'wali' | null;

export type Gender = 'Santriwan' | 'Santriwati';

export type AttendanceStatus = 'H' | 'S' | 'I' | 'A';

export type ViolationSeverity = 'Ringan' | 'Sedang' | 'Berat';

export interface Santri {
  id: number;
  nis: string;
  nama: string;
  kelas: string;
  jk: Gender;
  wali: string;
  hp: string;
  passWali: string;
}

export interface Guru {
  id: number;
  username: string;
  pass: string;
  nama: string;
  mapel: string;
  telp: string;
  assignedClasses: string[];
}

export interface Absensi {
  id: number;
  santriId: number;
  tanggal: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export interface Pelanggaran {
  id: number;
  santriId: number;
  tanggal: string; // YYYY-MM-DD
  pelanggaran: string;
  kategori: ViolationSeverity;
  sanksi: string;
}

export interface ChatMessage {
  id: number;
  santriId: number;
  senderRole: 'admin' | 'guru' | 'wali';
  recipientRole: 'admin' | 'guru' | 'wali';
  recipientId: number;
  text: string;
  time: string;
  readByAdmin: boolean;
  readByGuru: boolean;
  readByWali: boolean;
}

export interface LandingCMS {
  namaPesantren: string;
  tagline: string;
  runningBanner: string;
  heroTitle: string;
  heroDesc: string;
  heroIconClass: string;
  visi: string;
  misi: string;
  alamat: string;
  telpWA: string;
  email: string;
}

export interface AttendanceSummary {
  hadir: number;
  sakit: number;
  izin: number;
  alpha: number;
  total: number;
  persentaseHadir: number;
}
