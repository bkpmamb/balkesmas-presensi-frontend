// src/lib/utils/geocoding.ts

/**
 * Mengambil nama alamat berdasarkan koordinat menggunakan OpenStreetMap (Gratis)
 */
export const getAddressFromCoords = async (
  lat: number,
  lon: number
): Promise<string> => {
  try {
    // User-Agent wajib diisi sesuai kebijakan penggunaan Nominatim
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`,
      {
        headers: {
          "Accept-Language": "id-ID",
          "User-Agent": "MyAttendanceApp/1.0",
        },
      }
    );

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    // Nominatim mengembalikan detail alamat yang sangat lengkap
    // Kita ambil bagian 'display_name' atau rakit sendiri
    const address = data.address;
    const road = address.road || address.suburb || "";
    const city = address.city || address.town || address.city_district || "";

    if (!road && !city) return "Lokasi tidak dikenal";

    return `${road}${road && city ? ", " : ""}${city}`;
  } catch (error) {
    console.error("Geocoding Error:", error);
    return "Gagal memuat alamat";
  }
};
