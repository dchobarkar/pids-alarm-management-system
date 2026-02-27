export type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

/**
 * Browser-only: get current position via Geolocation API.
 * Rejects if permission denied or error.
 */
export const getCurrentLocation = (): Promise<CurrentLocation> =>
  new Promise((resolve, reject) => {
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
        reject(
          err.code === 1
            ? new Error("Location permission denied")
            : new Error(err.message || "Failed to get location"),
        );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
  });
