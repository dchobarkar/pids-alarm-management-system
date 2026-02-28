/** User's current geographic position (e.g. from browser geolocation). */
export type CurrentLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};
