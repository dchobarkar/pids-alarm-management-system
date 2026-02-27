import { getDistance } from "geolib";

export const GEO_TOLERANCE_METERS = 100;

/** Distance between two points in meters (Haversine). */
export const calculateDistanceMeters = (
  from: { latitude: number; longitude: number },
  to: { latitude: number; longitude: number },
): number =>
  getDistance(
    { latitude: from.latitude, longitude: from.longitude },
    { latitude: to.latitude, longitude: to.longitude },
  );

/** Returns true if distance is within tolerance (≤ GEO_TOLERANCE_METERS). */
export const isWithinGeoRadius = (distanceMeters: number): boolean =>
  distanceMeters <= GEO_TOLERANCE_METERS;
