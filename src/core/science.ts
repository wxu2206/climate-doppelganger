import type {
  Annual,
  Fingerprint,
  Location,
  Match,
  Mode,
  Trend,
} from "../types";
export const mean = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const deviation = (a: number[]) =>
  Math.sqrt(mean(a.map((x) => (x - mean(a)) ** 2)));
// Lanczos log-gamma and continued-fraction incomplete beta for Student-t inference.
function logGamma(z: number): number {
  const c = [
    676.5203681218851, -1259.1392167224028, 771.3234287776531,
    -176.6150291621406, 12.507343278686905, -0.13857109526572012,
    9.984369578019572e-6, 1.5056327351493116e-7,
  ];
  if (z < 0.5)
    return (
      Math.log(Math.PI) - Math.log(Math.sin(Math.PI * z)) - logGamma(1 - z)
    );
  z -= 1;
  let x = 0.9999999999998099;
  for (let i = 0; i < c.length; i++) x += c[i] / (z + i + 1);
  const t = z + c.length - 0.5;
  return (
    0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x)
  );
}
function betaFraction(a: number, b: number, x: number) {
  const tiny = 1e-30;
  let c = 1,
    d = 1 - ((a + b) * x) / (a + 1);
  if (Math.abs(d) < tiny) d = tiny;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 200; m++) {
    let aa = (m * (b - m) * x) / ((a + 2 * m - 1) * (a + 2 * m));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (a + b + m) * x) / ((a + 2 * m) * (a + 2 * m + 1));
    d = 1 + aa * d;
    if (Math.abs(d) < tiny) d = tiny;
    c = 1 + aa / c;
    if (Math.abs(c) < tiny) c = tiny;
    d = 1 / d;
    const delta = d * c;
    h *= delta;
    if (Math.abs(delta - 1) < 3e-14) break;
  }
  return h;
}
function beta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const bt = Math.exp(
    logGamma(a + b) -
      logGamma(a) -
      logGamma(b) +
      a * Math.log(x) +
      b * Math.log1p(-x),
  );
  return x < (a + 1) / (a + b + 2)
    ? (bt * betaFraction(a, b, x)) / a
    : 1 - (bt * betaFraction(b, a, 1 - x)) / b;
}
const tP = (t: number, df: number) => beta(df / (df + t * t), df / 2, 0.5);
const criticalValues = new Map<number, number>();
function critical(df: number) {
  const cached = criticalValues.get(df);
  if (cached !== undefined) return cached;
  let lo = 0,
    hi = 100;
  for (let i = 0; i < 70; i++) {
    const mid = (lo + hi) / 2;
    if (tP(mid, df) > 0.05) lo = mid;
    else hi = mid;
  }
  const result = (lo + hi) / 2;
  criticalValues.set(df, result);
  return result;
}
export function regression(x: number[], y: number[]): Trend {
  if (
    x.length < 3 ||
    x.length !== y.length ||
    [...x, ...y].some((v) => !Number.isFinite(v)) ||
    new Set(x).size !== x.length
  )
    throw new Error(
      "Regression needs at least three distinct finite years and matching values",
    );
  const n = x.length,
    mx = mean(x),
    my = mean(y),
    ssx = x.reduce((s, v) => s + (v - mx) ** 2, 0);
  const slope = x.reduce((s, v, i) => s + (v - mx) * (y[i] - my), 0) / ssx,
    intercept = my - slope * mx;
  const residual = y.reduce(
    (s, v, i) => s + (v - (my + slope * (x[i] - mx))) ** 2,
    0,
  );
  const se = Math.sqrt(residual / (n - 2) / ssx),
    margin = critical(n - 2) * se,
    total = y.reduce((s, v) => s + (v - my) ** 2, 0);
  return {
    decade: slope * 10,
    intercept,
    ci: [(slope - margin) * 10, (slope + margin) * 10],
    p: se === 0 ? (slope === 0 ? 1 : 0) : tP(Math.abs(slope / se), n - 2),
    n,
    r2: total === 0 ? 0 : Math.max(0, 1 - residual / total),
  };
}
export function fingerprint(
  location: Location,
  start: number,
  end: number,
): Fingerprint {
  if (
    !Number.isInteger(start) ||
    !Number.isInteger(end) ||
    start > end ||
    start < 1981 ||
    end > 2100
  )
    throw new Error("Invalid period");
  const months = location.months.filter(
    (m) => +m.date.slice(0, 4) >= start && +m.date.slice(0, 4) <= end,
  );
  const dates = new Set<string>();
  for (const m of months) {
    if (
      !/^\d{4}-(0[1-9]|1[0-2])$/.test(m.date) ||
      dates.has(m.date) ||
      !Number.isFinite(m.t) ||
      !Number.isFinite(m.p) ||
      m.t < -100 ||
      m.t > 65 ||
      m.p < 0 ||
      m.p > 1000
    )
      throw new Error("Invalid or duplicate monthly observation");
    dates.add(m.date);
  }
  const annual: Annual[] = [];
  for (let year = start; year <= end; year++) {
    const ms = months.filter((m) => +m.date.slice(0, 4) === year);
    if (ms.length !== 12 || new Set(ms.map((m) => m.date)).size !== 12)
      continue;
    let t = 0,
      p = 0,
      days = 0;
    for (const m of ms) {
      const d = new Date(Date.UTC(year, +m.date.slice(5, 7), 0)).getUTCDate();
      t += m.t * d;
      p += m.p * d;
      days += d;
    }
    annual.push({ year, t: t / days, p });
  }
  if (annual.length < 10)
    throw new Error("Choose a period with at least 10 complete years");
  const temperature = regression(
      annual.map((a) => a.year),
      annual.map((a) => a.t),
    ),
    precipitation = regression(
      annual.map((a) => a.year),
      annual.map((a) => a.p),
    );
  const completeYears = new Set(annual.map((a) => a.year));
  const completeMonths = months.filter((m) =>
    completeYears.has(+m.date.slice(0, 4)),
  );
  const seasonT = Array.from({ length: 12 }, (_, i) =>
    mean(
      completeMonths.filter((m) => +m.date.slice(5) === i + 1).map((m) => m.t),
    ),
  );
  const seasonP = Array.from({ length: 12 }, (_, i) =>
    mean(
      completeMonths.filter((m) => +m.date.slice(5) === i + 1).map((m) => m.p),
    ),
  );
  const residual = (key: "t" | "p", trend: Trend) =>
    annual.map(
      (a) => a[key] - (trend.intercept + (trend.decade * a.year) / 10),
    );
  return {
    annual,
    temperature,
    precipitation,
    meanT: mean(annual.map((a) => a.t)),
    meanP: mean(annual.map((a) => a.p)),
    variabilityT: deviation(residual("t", temperature)),
    variabilityP: deviation(residual("p", precipitation)),
    seasonT,
    seasonP,
    completeness: months.length / ((end - start + 1) * 12),
  };
}
export const anomalies = (values: number[]) => {
  const m = mean(values);
  return values.map((v) => v - m);
};
export function monthlyAnomalies(
  location: Location,
  start: number,
  end: number,
) {
  const f = fingerprint(location, start, end);
  return location.months
    .filter((m) => +m.date.slice(0, 4) >= start && +m.date.slice(0, 4) <= end)
    .map((m) => ({
      ...m,
      t: m.t - f.seasonT[+m.date.slice(5) - 1],
      p: m.p - f.seasonP[+m.date.slice(5) - 1],
    }));
}
export function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) {
  if (
    ![lat1, lon1, lat2, lon2].every(Number.isFinite) ||
    Math.abs(lat1) > 90 ||
    Math.abs(lat2) > 90 ||
    Math.abs(lon1) > 180 ||
    Math.abs(lon2) > 180
  )
    throw new Error("Invalid geographic coordinates");
  const rad = Math.PI / 180,
    a =
      Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
      Math.cos(lat1 * rad) *
        Math.cos(lat2 * rad) *
        Math.sin(((lon2 - lon1) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, a)));
}
function features(f: Fingerprint, mode: Mode) {
  return mode === "climate"
    ? [
        {
          name: "Mean temperature",
          value: f.meanT,
          group: "temperature" as const,
        },
        {
          name: "Temperature seasonality",
          value: Math.max(...f.seasonT) - Math.min(...f.seasonT),
          group: "temperature" as const,
        },
        {
          name: "Annual precipitation",
          value: f.meanP,
          group: "precipitation" as const,
        },
        {
          name: "Precipitation seasonality",
          value: deviation(f.seasonP),
          group: "precipitation" as const,
        },
      ]
    : [
        {
          name: "Temperature trend",
          value: f.temperature.decade,
          group: "temperature" as const,
        },
        {
          name: "Temperature variability",
          value: f.variabilityT,
          group: "temperature" as const,
        },
        {
          name: "Precipitation trend",
          value: f.precipitation.decade,
          group: "precipitation" as const,
        },
        {
          name: "Precipitation variability",
          value: f.variabilityP,
          group: "precipitation" as const,
        },
      ];
}
export function rankMatches(
  selected: Location,
  locations: Location[],
  mode: Mode,
  start: number,
  end: number,
  weights: { temperature: number; precipitation: number },
  minKm = 1500,
  prepared?: ReadonlyMap<Location, Fingerprint>,
): Match[] {
  if (!Number.isFinite(minKm) || minKm < 0)
    throw new Error("Invalid minimum separation");
  const total = weights.temperature + weights.precipitation;
  if (
    !Number.isFinite(total) ||
    total <= 0 ||
    weights.temperature < 0 ||
    weights.precipitation < 0
  )
    throw new Error("Select at least one positive variable weight");
  // UI callers may reuse fingerprints computed for this exact selected interval.
  const resolve = (location: Location) =>
    prepared?.get(location) ?? fingerprint(location, start, end);
  const cohort = locations.map((location) => ({
    location,
    features: features(resolve(location), mode),
  }));
  const target = features(resolve(selected), mode);
  const scales = target.map((_, i) =>
    Math.max(deviation(cohort.map((c) => c.features[i].value)), 1e-6),
  );
  return cohort
    .filter((c) => c.location.id !== selected.id)
    .map((c) => {
      const contributions = target.map((f, i) => {
        const difference = c.features[i].value - f.value;
        return {
          name: f.name,
          difference,
          scale: scales[i],
          contribution:
            (weights[f.group] / (total * 2)) * (difference / scales[i]) ** 2,
        };
      });
      return {
        location: c.location,
        km: haversine(
          selected.lat,
          selected.lon,
          c.location.lat,
          c.location.lon,
        ),
        distance: Math.sqrt(
          contributions.reduce((s, f) => s + f.contribution, 0),
        ),
        contributions,
      };
    })
    .filter((m) => m.km >= minKm)
    .sort(
      (a, b) =>
        a.distance - b.distance || a.location.id.localeCompare(b.location.id),
    );
}
