export interface Month {
  date: string;
  t: number;
  p: number;
}
export interface Location {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
  elevation: number;
  months: Month[];
  source: { url: string; sha256: string; retrieved: string; title: string };
}
export interface Dataset {
  version: string;
  start: number;
  end: number;
  source: string;
  units: { temperature: string; precipitation: string };
  locations: Location[];
}
export type Mode = "climate" | "change";
export interface Annual {
  year: number;
  t: number;
  p: number;
}
export interface Trend {
  decade: number;
  intercept: number;
  ci: [number, number];
  p: number;
  n: number;
  r2: number;
}
export interface Fingerprint {
  annual: Annual[];
  temperature: Trend;
  precipitation: Trend;
  meanT: number;
  meanP: number;
  variabilityT: number;
  variabilityP: number;
  seasonT: number[];
  seasonP: number[];
  completeness: number;
}
export interface Contribution {
  name: string;
  contribution: number;
  difference: number;
  scale: number;
}
export interface Match {
  location: Location;
  distance: number;
  km: number;
  contributions: Contribution[];
}
