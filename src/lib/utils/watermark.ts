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
        const MAX_WIDTH = 1080; // Batasi lebar maksimal 1080px
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        // Gambar foto dengan ukuran yang sudah di-resize
        ctx.drawImage(img, 0, 0, width, height);

        // --- LOGIKA WATERMARK (Gunakan variabel 'width' & 'height' baru) ---
        const baseSize = width * 0.03;
        const padding = width * 0.04;
        const lineHeight = baseSize * 1.5;

        // ... (Logika gradient dan fillText tetap sama menggunakan width/height baru) ...
        // Contoh penyesuaian:
        ctx.textAlign = "left";
        ctx.font = `bold ${baseSize * 1.2}px Inter, sans-serif`;
        ctx.fillText(
          data.name.toUpperCase(),
          padding,
          height - padding - lineHeight
        );

        // --- OPTIMASI 2: QUALITY COMPRESSION ---
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error("Canvas to Blob failed"));
          },
          "image/jpeg",
          0.7 // Kualitas diatur ke 0.7 (70%) - Sangat optimal untuk web
        );
      };
    };
  });
};
