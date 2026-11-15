import { describe, expect, it } from "vitest";
import {
  regression,
  fingerprint,
  rankMatches,
  haversine,
  anomalies,
  monthlyAnomalies,
} from "./science";
import type { Location } from "../types";
// Explicit synthetic mathematical fixture, never exported as NASA observations.
const location = (id: string, offset = 0, slope = 0.1): Location => ({
  id,
  name: id,
  country: "Test fixture",
  lat: 0,
  lon: id === "a" ? 0 : 90,
  elevation: 0,
  source: {
    url: "https://example.invalid",
    sha256: "0".repeat(64),
    retrieved: "2026-01-01",
    title: "synthetic test only",
  },
  months: Array.from({ length: 15 * 12 }, (_, i) => ({
    date: `${2000 + Math.floor(i / 12)}-${String((i % 12) + 1).padStart(2, "0")}`,
    t: 10 + offset + slope * Math.floor(i / 12),
    p: 2,
  })),
});
describe("scientific engine", () => {
  it("finds a known trend in °C per decade and exact CI", () => {
    const r = regression([2000, 2001, 2002, 2003], [1, 2, 3, 4]);
    expect(r.decade).toBeCloseTo(10);
    expect(r.ci[0]).toBeCloseTo(10);
    expect(r.p).toBe(0);
  });
  it("reports constant series as no evidence of change", () => {
    const r = regression([1, 2, 3, 4], [2, 2, 2, 2]);
    expect(r.p).toBe(1);
    expect(r.decade).toBe(0);
  });
  it("rejects insufficient, duplicate and nonfinite years", () => {
    expect(() => regression([1, 2], [1, 2])).toThrow();
    expect(() => regression([1, 1, 1], [1, 2, 3])).toThrow();
    expect(() => regression([1, 2, 3], [1, NaN, 3])).toThrow();
  });
  it("aggregates precipitation by actual calendar days, including leap years", () => {
    const f = fingerprint(location("a"), 2000, 2014);
    expect(f.annual[0].p).toBe(732);
    expect(f.annual[1].p).toBe(730);
    expect(f.temperature.decade).toBeCloseTo(1);
    expect(f.completeness).toBe(1);
  });
  it("recomputes sample size and monthly baseline for selected range", () => {
    const f = fingerprint(location("a"), 2005, 2014);
    expect(f.annual).toHaveLength(10);
    expect(f.annual[0].year).toBe(2005);
    expect(anomalies([1, 2, 3])).toEqual([-1, 0, 1]);
    const monthly = monthlyAnomalies(location("a"), 2000, 2014);
    expect(monthly[0].t).toBeCloseTo(-0.7);
  });
  it("excludes incomplete years and reports completeness", () => {
    const a = location("a");
    a.months.pop();
    const f = fingerprint(a, 2000, 2014);
    expect(f.annual).toHaveLength(14);
    expect(f.completeness).toBeLessThan(1);
  });
  it("separates climate and change twins and excludes nearby locations", () => {
    const a = location("a"),
      b = location("b", 15),
      c = location("c", 0, 0.4);
    const climate = rankMatches(
      a,
      [a, b, c],
      "climate",
      2000,
      2014,
      { temperature: 1, precipitation: 0 },
      1000,
    );
    const change = rankMatches(
      a,
      [a, b, c],
      "change",
      2000,
      2014,
      { temperature: 1, precipitation: 0 },
      1000,
    );
    expect(climate[0].location.id).toBe("c");
    expect(change[0].location.id).toBe("b");
    expect(change[0].distance).toBeCloseTo(0);
    expect(
      change[0].contributions.reduce((s, f) => s + f.contribution, 0),
    ).toBeCloseTo(change[0].distance ** 2);
    expect(
      rankMatches(a, [a], "change", 2000, 2014, {
        temperature: 1,
        precipitation: 1,
      }),
    ).toEqual([]);
  });
  it("rejects zero weights and measures geographic distance", () => {
    expect(() =>
      rankMatches(location("a"), [location("b")], "climate", 2000, 2014, {
        temperature: 0,
        precipitation: 0,
      }),
    ).toThrow();
    expect(haversine(0, 0, 0, 90)).toBeCloseTo(10007.54, 1);
  });
});

describe("independent SciPy numerical reference", () => {
  it("matches Student-t probabilities and confidence intervals for noisy series", async () => {
    const { default: cases } = await import(
      "../../tests/fixtures/regression-reference.json"
    );
    for (const c of cases) {
      const actual = regression(c.x, c.y);
      expect(actual.decade).toBeCloseTo(c.decade, 9);
      expect(actual.p).toBeCloseTo(c.p, 9);
      expect(actual.ci[0]).toBeCloseTo(c.ci[0], 9);
      expect(actual.ci[1]).toBeCloseTo(c.ci[1], 9);
    }
  });
});

it("preserves significance under a change of measurement scale", () => {
  const x = [2000, 2001, 2002, 2003, 2004],
    y = [1, 3, 2, 5, 4];
  expect(
    regression(
      x,
      y.map((v) => v * 1e-14),
    ).p,
  ).toBeCloseTo(regression(x, y).p, 10);
});
it("rejects corrupt monthly values before deriving fingerprints", () => {
  const a = location("a");
  a.months[0].t = NaN;
  expect(() => fingerprint(a, 2000, 2014)).toThrow();
});
it("compares seasons only over complete years", () => {
  const l = location("a");
  l.months.pop();
  for (const m of l.months.filter((m) => m.date.startsWith("2014"))) m.t = 60;
  const f = fingerprint(l, 2000, 2014);
  expect(Math.max(...f.seasonT)).toBeLessThan(15);
});
it("handles the dateline and rejects invalid geography", () => {
  expect(haversine(0, 179, 0, -179)).toBeCloseTo(222.39, 1);
  expect(haversine(90, 0, -90, 0)).toBeCloseTo(20015.09, 1);
  expect(() => haversine(NaN, 0, 0, 0)).toThrow();
});
