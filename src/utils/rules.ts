import { Absensi, AttendanceSummary, Pelanggaran, Santri } from '../types';

export const SANTRIWAN_CLASSES = [
  '1 Awaliyah (Santriwan)',
  '2 Awaliyah (Santriwan)',
  '3 Awaliyah (Santriwan)',
  '1 Wustho (Santriwan)',
  '2 Wustho (Santriwan)',
  '3 Wustho (Santriwan)'
] as const;

export const SANTRIWATI_CLASSES = [
  '1 Awaliyah (Santriwati)',
  '2 Awaliyah (Santriwati)',
  '3 Awaliyah (Santriwati)',
  '1 Wustho (Santriwati)',
  '2 Wustho (Santriwati)',
  '3 Wustho (Santriwati)'
] as const;

export const ALL_12_CLASSES = [...SANTRIWAN_CLASSES, ...SANTRIWATI_CLASSES] as const;

/**
 * Calculates attendance summary counters and attendance rate percentage
 */
export function getAttendanceSummary(records: Absensi[], santriId?: number): AttendanceSummary {
  const filtered = santriId ? records.filter(r => r.santriId === santriId) : records;
  let hadir = 0;
  let sakit = 0;
  let izin = 0;
  let alpha = 0;

  for (const r of filtered) {
    if (r.status === 'H') hadir++;
    else if (r.status === 'S') sakit++;
    else if (r.status === 'I') izin++;
    else if (r.status === 'A') alpha++;
  }

  const total = hadir + sakit + izin + alpha;
  const persentaseHadir = total > 0 ? Math.round((hadir / total) * 100) : 100;

  return { hadir, sakit, izin, alpha, total, persentaseHadir };
}

/**
 * Filter santri list based on gender and class filters
 */
export function filterSantriList(
  list: Santri[],
  genderFilter: string,
  classFilter: string
): Santri[] {
  return list.filter(s => {
    const matchesGender = genderFilter === 'ALL' || s.jk === genderFilter;
    const matchesClass = classFilter === 'ALL' || s.kelas === classFilter;
    return matchesGender && matchesClass;
  });
}

/**
 * Calculates discipline index score out of 100
 * Ringan = -2, Sedang = -5, Berat = -15
 */
export function calculateDisciplineScore(violations: Pelanggaran[], santriId: number): number {
  const santriViolations = violations.filter(v => v.santriId === santriId);
  let deductions = 0;

  for (const v of santriViolations) {
    if (v.kategori === 'Ringan') deductions += 2;
    else if (v.kategori === 'Sedang') deductions += 5;
    else if (v.kategori === 'Berat') deductions += 15;
  }

  return Math.max(0, 100 - deductions);
}

/**
 * Validate santri input form
 */
export function validateSantriInput(input: Partial<Santri>): { isValid: boolean; error?: string } {
  if (!input.nis || input.nis.trim().length < 3) {
    return { isValid: false, error: 'NIS santri minimal 3 digit angka.' };
  }
  if (!input.nama || input.nama.trim().length < 2) {
    return { isValid: false, error: 'Nama santri tidak boleh kosong.' };
  }
  if (!input.wali || input.wali.trim().length < 2) {
    return { isValid: false, error: 'Nama wali santri wajib diisi.' };
  }
  if (!input.hp || input.hp.trim().length < 8) {
    return { isValid: false, error: 'Nomor telepon/WA wali santri minimal 8 digit.' };
  }
  return { isValid: true };
}
