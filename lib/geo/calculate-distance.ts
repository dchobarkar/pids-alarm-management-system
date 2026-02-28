import { getDistance } from "geolib";

import { GEO_TOLERANCE_METERS } from "@/constants/geo";

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
