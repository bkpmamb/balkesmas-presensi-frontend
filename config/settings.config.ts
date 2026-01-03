// config/settings.config.ts

import type { GuideSection } from "@/lib/types/settings";

export const guideSections: GuideSection[] = [
  {
    icon: "📍",
    title: "Lokasi GPS Kantor",
    items: [
      "Klik 'Gunakan Lokasi Saat Ini' untuk menggunakan lokasi perangkat Anda",
      "Atau masukkan koordinat latitude dan longitude secara manual",
      "Atur radius maksimal untuk menentukan jarak yang diperbolehkan dari kantor",
      "Karyawan hanya bisa melakukan presensi jika berada dalam radius yang ditentukan",
    ],
  },
  {
    icon: "📂",
    title: "Kategori Karyawan",
    items: [
      "Kategori digunakan untuk mengelompokkan karyawan (contoh: Dokter, Perawat, Staff)",
      "Setiap kategori memiliki prefix unik untuk ID karyawan (contoh: DOC, PER, STF)",
      "ID karyawan akan otomatis dibuat dengan format: PREFIX + Nomor (contoh: DOC001)",
      "Nomor akan bertambah otomatis setiap ada karyawan baru",
    ],
  },
];

export const warningMessage = {
  title: "⚠️ Peringatan",
  description:
    "Hati-hati saat menghapus kategori. Pastikan tidak ada karyawan yang menggunakan kategori tersebut.",
};