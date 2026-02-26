import { getDistance } from "geolib";

/**
 * Distance between two points in meters (Haversine).
 */
export function calculateDistanceMeters(
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number {
  return getDistance(
    { latitude: from.latitude, longitude: from.longitude },
    { latitude: to.latitude, longitude: to.longitude },
  );
}

export const GEO_TOLERANCE_METERS = 100;

/**
 * Returns true if distance is within tolerance (≤ 100m).
 */
export function isWithinGeoRadius(distanceMeters: number): boolean {
  return distanceMeters <= GEO_TOLERANCE_METERS;
}
