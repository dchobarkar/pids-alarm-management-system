/**
 * Browser-only: get current position via Geolocation API.
 * Rejects if permission denied or error.
 */
export function getCurrentLocation(): Promise<{
  latitude: number;
  longitude: number;
  accuracy?: number;
}> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation is not supported"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (err) => {
        if (err.code === 1) {
          reject(new Error("Location permission denied"));
        } else {
          reject(new Error(err.message || "Failed to get location"));
        }
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
}
