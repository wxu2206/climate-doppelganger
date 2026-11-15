import { describe, expect, it, vi, afterEach } from "vitest";
import { validateDataset, loadDataset } from "./validate";
import { syntheticDataset } from "../test-fixtures";
afterEach(() => vi.unstubAllGlobals());
describe("dataset boundary", () => {
  it("accepts a structurally complete explicitly synthetic test fixture", () => {
    expect(validateDataset(syntheticDataset()).locations).toHaveLength(4);
  });
  it.each([
    "missing",
    "nonfinite",
    "units",
    "coordinates",
    "duplicate",
    "provenance",
    "order",
    "range",
  ])("rejects %s corruption", (kind) => {
    const d = syntheticDataset();
    if (kind === "missing") d.locations[0].months.pop();
    if (kind === "nonfinite") d.locations[0].months[0].t = Infinity;
    if (kind === "units") d.units.precipitation = "mm/month";
    if (kind === "coordinates") d.locations[0].lat = 91;
    if (kind === "duplicate") d.locations[1].id = d.locations[0].id;
    if (kind === "provenance")
      d.locations[0].source.url = "javascript:alert(1)";
    if (kind === "order") d.locations[0].months.reverse();
    if (kind === "range") d.locations[0].months[0].p = -999;
    expect(() => validateDataset(d)).toThrow();
  });
  it("reports missing static data without any generated fallback", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({ ok: false, status: 404 }),
    );
    await expect(loadDataset()).rejects.toThrow("no synthetic fallback");
  });
  it("loads and validates a successful response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve(JSON.stringify(syntheticDataset())),
      }),
    );
    expect((await loadDataset()).version).toBe("SYNTHETIC-TEST-ONLY");
  });
  it("rejects oversized response content", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: () => Promise.resolve("x".repeat(5_000_001)),
      }),
    );
    await expect(loadDataset()).rejects.toThrow("size limit");
  });
});
