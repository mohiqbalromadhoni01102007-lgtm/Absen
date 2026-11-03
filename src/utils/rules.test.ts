import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getAttendanceSummary,
  filterSantriList,
  calculateDisciplineScore,
  validateSantriInput,
  ALL_12_CLASSES
} from './rules';
import { Absensi, Pelanggaran, Santri } from '../types';

test('ALL_12_CLASSES should contain exactly 12 classes across Awaliyah and Wustho', () => {
  assert.equal(ALL_12_CLASSES.length, 12);
  assert.equal(ALL_12_CLASSES[0], '1 Awaliyah (Santriwan)');
  assert.equal(ALL_12_CLASSES[11], '3 Wustho (Santriwati)');
});

test('getAttendanceSummary calculates accurate counts and attendance percentage', () => {
  const mockAttendance: Absensi[] = [
    { id: 1, santriId: 1, tanggal: '2026-11-01', status: 'H' },
    { id: 2, santriId: 1, tanggal: '2026-11-02', status: 'H' },
    { id: 3, santriId: 1, tanggal: '2026-11-03', status: 'S' },
    { id: 4, santriId: 1, tanggal: '2026-11-04', status: 'A' },
    { id: 5, santriId: 2, tanggal: '2026-11-01', status: 'H' },
  ];

  const summarySantri1 = getAttendanceSummary(mockAttendance, 1);
  assert.equal(summarySantri1.hadir, 2);
  assert.equal(summarySantri1.sakit, 1);
  assert.equal(summarySantri1.alpha, 1);
  assert.equal(summarySantri1.izin, 0);
  assert.equal(summarySantri1.total, 4);
  assert.equal(summarySantri1.persentaseHadir, 50); // 2 out of 4 = 50%
});

test('filterSantriList correctly filters by Gender and Kelas', () => {
  const mockSantri: Santri[] = [
    { id: 1, nis: '001', nama: 'Ahmad', kelas: '1 Awaliyah (Santriwan)', jk: 'Santriwan', wali: 'Hendra', hp: '08123', passWali: '123' },
    { id: 2, nis: '002', nama: 'Fatimah', kelas: '1 Awaliyah (Santriwati)', jk: 'Santriwati', wali: 'Mahmud', hp: '08124', passWali: '123' },
    { id: 3, nis: '003', nama: 'Bilal', kelas: '2 Awaliyah (Santriwan)', jk: 'Santriwan', wali: 'Rabah', hp: '08125', passWali: '123' },
  ];

  const putra = filterSantriList(mockSantri, 'Santriwan', 'ALL');
  assert.equal(putra.length, 2);

  const putri = filterSantriList(mockSantri, 'Santriwati', 'ALL');
  assert.equal(putri.length, 1);
  assert.equal(putri[0].nama, 'Fatimah');

  const filteredClass = filterSantriList(mockSantri, 'ALL', '2 Awaliyah (Santriwan)');
  assert.equal(filteredClass.length, 1);
  assert.equal(filteredClass[0].nama, 'Bilal');
});

test('calculateDisciplineScore deducts correctly based on severity', () => {
  const mockViolations: Pelanggaran[] = [
    { id: 1, santriId: 1, tanggal: '2026-10-20', pelanggaran: 'Terlambat Shalat', kategori: 'Ringan', sanksi: '1 Juz' }, // -2
    { id: 2, santriId: 1, tanggal: '2026-10-22', pelanggaran: 'Keluar Tanpa Izin', kategori: 'Sedang', sanksi: 'Hafalan' }, // -5
    { id: 3, santriId: 2, tanggal: '2026-10-25', pelanggaran: 'Membawa HP Ilegal', kategori: 'Berat', sanksi: 'Panggilan' }, // -15
  ];

  const score1 = calculateDisciplineScore(mockViolations, 1);
  assert.equal(score1, 93); // 100 - 2 - 5 = 93

  const score2 = calculateDisciplineScore(mockViolations, 2);
  assert.equal(score2, 85); // 100 - 15 = 85

  const scoreClean = calculateDisciplineScore(mockViolations, 999);
  assert.equal(scoreClean, 100);
});

test('validateSantriInput catches empty or invalid fields', () => {
  const invalidNis = validateSantriInput({ nis: '1', nama: 'Test', wali: 'Wali', hp: '081234567' });
  assert.equal(invalidNis.isValid, false);

  const valid = validateSantriInput({ nis: '202401', nama: 'Zaid', wali: 'Utsman', hp: '0812345678' });
  assert.equal(valid.isValid, true);
});
