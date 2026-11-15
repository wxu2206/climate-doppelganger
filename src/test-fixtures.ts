import type { Dataset, Location } from "./types";
// SYNTHETIC TEST DATA ONLY. Not NASA observations, never loaded by the app.
export function syntheticDataset(): Dataset {
  const points = [
    ["langley", "Langley / Vancouver", "Canada", 49.1, -122.66, 10, 0.025],
    ["lisbon", "Lisbon", "Portugal", 38.72, -9.14, 17, 0.03],
    ["tokyo", "Tokyo", "Japan", 35.68, 139.69, 15, 0.09],
    ["cape-town", "Cape Town", "South Africa", -33.92, 18.42, 18, 0.032],
  ] as const;
  const locations: Location[] = points.map(
    ([id, name, country, lat, lon, base, slope]) => ({
      id,
      name,
      country,
      lat,
      lon,
      elevation: 0,
      source: {
        url: "https://power.larc.nasa.gov/api/temporal/monthly/point?synthetic-test-only",
        sha256: "0".repeat(64),
        retrieved: "2026-01-01T00:00:00Z",
        title: "SYNTHETIC TEST ONLY",
      },
      months: Array.from({ length: 34 * 12 }, (_, i) => ({
        date: `${1991 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`,
        t:
          base +
          slope * Math.floor(i / 12) +
          5 * Math.sin(((i % 12) / 12) * Math.PI * 2) +
          Math.sin(i * 2.3) * 0.3,
        p:
          2 +
          Math.sin(((i % 12) / 12) * Math.PI * 2) +
          Math.floor(i / 12) * 0.001,
      })),
    }),
  );
  return {
    version: "SYNTHETIC-TEST-ONLY",
    start: 1991,
    end: 2024,
    source: "SYNTHETIC TEST ONLY",
    units: { temperature: "C", precipitation: "mm/day" },
    locations,
  };
}
