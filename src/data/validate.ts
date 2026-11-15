import type { Dataset } from "../types";
const object = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null && !Array.isArray(v);
const finite = (v: unknown): v is number =>
  typeof v === "number" && Number.isFinite(v);
export function validateDataset(value: unknown): Dataset {
  if (
    !object(value) ||
    typeof value.version !== "string" ||
    value.version.length > 120 ||
    !value.version.trim() ||
    typeof value.source !== "string" ||
    !value.source.trim() ||
    value.source.length > 512 ||
    !Number.isInteger(value.start) ||
    !Number.isInteger(value.end) ||
    !finite(value.start) ||
    !finite(value.end) ||
    value.start < 1981 ||
    value.end > 2100 ||
    value.end - value.start < 9 ||
    !Array.isArray(value.locations) ||
    value.locations.length < 2 ||
    value.locations.length > 100 ||
    !object(value.units) ||
    value.units.temperature !== "C" ||
    value.units.precipitation !== "mm/day"
  )
    throw new Error("Dataset metadata or units are invalid");
  const ids = new Set<string>();
  for (const l of value.locations) {
    if (
      !object(l) ||
      typeof l.id !== "string" ||
      !l.id ||
      l.id.length > 80 ||
      ids.has(l.id) ||
      typeof l.name !== "string" ||
      !l.name.trim() ||
      l.name.length > 120 ||
      typeof l.country !== "string" ||
      !l.country.trim() ||
      l.country.length > 120 ||
      !finite(l.lat) ||
      Math.abs(l.lat) > 90 ||
      !finite(l.lon) ||
      Math.abs(l.lon) > 180 ||
      !finite(l.elevation) ||
      !Array.isArray(l.months) ||
      l.months.length !== (value.end - value.start + 1) * 12 ||
      !object(l.source) ||
      typeof l.source.url !== "string" ||
      !l.source.url.startsWith(
        "https://power.larc.nasa.gov/api/temporal/monthly/point?",
      ) ||
      typeof l.source.sha256 !== "string" ||
      !/^[a-f0-9]{64}$/.test(l.source.sha256) ||
      typeof l.source.retrieved !== "string" ||
      !Number.isFinite(Date.parse(l.source.retrieved)) ||
      typeof l.source.title !== "string"
    )
      throw new Error("Invalid location or provenance");
    ids.add(l.id);
    for (let i = 0; i < l.months.length; i++) {
      const m = l.months[i],
        expected = `${value.start + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`;
      if (
        !object(m) ||
        m.date !== expected ||
        !finite(m.t) ||
        m.t < -100 ||
        m.t > 65 ||
        !finite(m.p) ||
        m.p < 0 ||
        m.p > 1000
      )
        throw new Error(`Invalid observation for ${l.name}`);
    }
  }
  return value as unknown as Dataset;
}
export async function loadDataset(signal?: AbortSignal): Promise<Dataset> {
  const response = await fetch(`${import.meta.env.BASE_URL}data/climate.json`, {
    signal,
  });
  if (!response.ok)
    throw new Error(
      `NASA dataset is unavailable (${response.status}). Run the documented data pipeline; no synthetic fallback is used.`,
    );
  const text = await response.text();
  if (text.length > 5_000_000) throw new Error("Dataset exceeds size limit");
  return validateDataset(JSON.parse(text));
}
