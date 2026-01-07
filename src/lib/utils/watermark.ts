// src/lib/utils/watermark.ts

interface WatermarkData {
  name: string;
  date: string;
  location: string;
  coordinates: string;
  notes?: string;
}

export const processImageWithWatermark = async (
  imageFile: File,
  data: WatermarkData
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = (event) => {
      const img = new window.Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // --- OPTIMASI 1: RESIZING ---
        const MAX_WIDTH = 1080;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        // 1. Gambar foto utama
        ctx.drawImage(img, 0, 0, width, height);

        // --- LOGIKA WATERMARK ---
        const padding = width * 0.04;
        const fontSizeMain = width * 0.035;
        const fontSizeSub = width * 0.025;
        const lineHeight = fontSizeMain * 1.4;

        // 2. Buat Gradient Gelap di bagian bawah agar teks terbaca (Scrim)
        const gradient = ctx.createLinearGradient(
          0,
          height,
          0,
          height - padding * 6
        );
        gradient.addColorStop(0, "rgba(0, 0, 0, 0.7)"); // Gelap di paling bawah
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)"); // Transparan ke atas
        ctx.fillStyle = gradient;
        ctx.fillRect(0, height - padding * 6, width, padding * 6);

        // 3. Gambar Teks (Posisi di Kiri Bawah)
        ctx.textAlign = "left";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "#ffffff"; // Warna putih murni

        // Baris 4: Koordinat (Paling bawah)
        ctx.font = `${fontSizeSub}px sans-serif`;
        ctx.fillText(data.coordinates, padding, height - padding);

        // Baris 3: Alamat/Lokasi
        ctx.font = `${fontSizeSub}px sans-serif`;
        ctx.fillText(
          data.location,
          padding,
          height - padding - lineHeight * 0.8
        );

        // Baris 2: Tanggal & Waktu
        ctx.font = `${fontSizeSub}px sans-serif`;
        ctx.fillText(data.date, padding, height - padding - lineHeight * 1.6);

        // Baris 1: Nama Karyawan (Paling Besar)
        ctx.font = `bold ${fontSizeMain}px sans-serif`;
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 4;
        ctx.fillText(
          data.name.toUpperCase(),
          padding,
          height - padding - lineHeight * 2.6
        );

        // --- OPTIMASI 2: QUALITY COMPRESSION ---
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas to Blob failed"));
          },
          "image/jpeg",
          0.8 // Kualitas 80% seimbang antara ketajaman teks dan ukuran file
        );
      };
    };
  });
};
