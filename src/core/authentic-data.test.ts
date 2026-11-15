import { describe, it, expect } from "vitest";
import raw from "../../public/data/climate.json";
import reference from "../../tests/fixtures/nasa-analysis-reference.json";
import { validateDataset } from "../data/validate";
import { fingerprint, rankMatches } from "./science";
const data = validateDataset(raw);
describe("authentic NASA POWER snapshot", () => {
  for (const expected of reference.locations)
    it(`matches independent NumPy/SciPy calculations for ${expected.id}`, () => {
      const l = data.locations.find((l) => l.id === expected.id)!;
      const f = fingerprint(l, data.start, data.end);
      expect(f.annual).toHaveLength(34);
      expect(f.completeness).toBe(1);
      f.annual.forEach((a, i) => {
        expect(a.t).toBeCloseTo(expected.annual[i].t, 10);
        expect(a.p).toBeCloseTo(expected.annual[i].p, 8);
      });
      for (const [trend, want] of [
        [f.temperature, expected.trends.t],
        [f.precipitation, expected.trends.p],
      ] as const) {
        expect(trend.decade).toBeCloseTo(want.decade, 8);
        expect(trend.ci[0]).toBeCloseTo(want.ci[0], 8);
        expect(trend.ci[1]).toBeCloseTo(want.ci[1], 8);
        expect(trend.p).toBeCloseTo(want.p, 9);
      }
    });
  it("reproduces distinct Lisbon climate and change twins", () => {
    const l = data.locations.find((l) => l.id === "lisbon")!;
    const climate = rankMatches(
      l,
      data.locations,
      "climate",
      1991,
      2024,
      { temperature: 70, precipitation: 30 },
      1500,
    );
    const change = rankMatches(
      l,
      data.locations,
      "change",
      1991,
      2024,
      { temperature: 70, precipitation: 30 },
      1500,
    );
    expect(climate[0].location.id).toBe("cape-town");
    expect(climate[0].distance).toBeCloseTo(0.1877064181, 8);
    expect(change[0].location.id).toBe("reykjavik");
    expect(change[0].distance).toBeCloseTo(0.4609641831, 8);
    // Similar positive estimates do not imply significant positive trends.
    expect(fingerprint(l, 1991, 2024).temperature.p).toBeGreaterThan(0.05);
    expect(
      fingerprint(change[0].location, 1991, 2024).temperature.p,
    ).toBeGreaterThan(0.05);
  });
});
