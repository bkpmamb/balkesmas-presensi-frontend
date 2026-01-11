// src/lib/utils/geocoding.ts

/**
 * Mengambil nama alamat berdasarkan koordinat menggunakan OpenStreetMap
 * Dengan timeout dan retry mechanism
 */
export const getAddressFromCoords = async (
  lat: number,
  lon: number,
  retries = 2
): Promise<string> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000);

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

    clearTimeout(timeoutId);

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
    clearTimeout(timeoutId);

    if (retries > 0 && error instanceof Error && error.name !== "AbortError") {
      console.warn(`Geocoding retry, attempts left: ${retries}`);
      return getAddressFromCoords(lat, lon, retries - 1);
    }
    console.error("Geocoding Error:", error);
    return "Lokasi terdeteksi";
  }
};
