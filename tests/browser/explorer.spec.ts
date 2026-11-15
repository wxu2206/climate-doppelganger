import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";
import { syntheticDataset } from "../../src/test-fixtures";
test("missing NASA data is explicit and never replaced with invented observations", async ({
  page,
}) => {
  await page.route("**/data/climate.json", (route) =>
    route.fulfill({ status: 404, body: "Not found" }),
  );
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Verified data is not available yet" }),
  ).toBeVisible();
  await expect(page.getByRole("alert")).toContainText("no synthetic fallback");
  await page.getByRole("link", { name: "The science", exact: true }).click();
  await expect(
    page.getByRole("heading", {
      name: "The method, even while data is unavailable",
    }),
  ).toBeVisible();
});
test("explorer interactions and responsive layout with labelled synthetic test fixture", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.route("**/data/climate.json", (route) =>
    route.fulfill({ json: syntheticDataset() }),
  );
  await page.goto("/");
  await expect(
    page.getByText("SYNTHETIC-TEST-ONLY", { exact: false }),
  ).toBeVisible();
  await expect(page.locator(".map-canvas")).toHaveAttribute(
    "data-map-ready",
    "true",
  );
  expect(
    await page
      .locator(".map-canvas")
      .evaluate((e) => e.getBoundingClientRect().height),
  ).toBeGreaterThan(300);
  await page.getByRole("button", { name: "Zoom in", exact: true }).click();
  await page
    .getByRole("button", { name: "Reset global map", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Climate twins", exact: true })
    .click();
  await expect(
    page.getByRole("button", { name: "Climate twins", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Selected location").selectOption("tokyo");
  await page.getByLabel("Start year").selectOption("2000");
  await expect(page.getByText("SIDE BY SIDE / 2000–2024")).toBeVisible();
  await page.getByLabel("Historical year").fill("2005");
  await expect(page.locator(".timeline>div>strong").first()).toHaveText("2005");
  await page.getByRole("button", { name: "Surprise me", exact: false }).click();
  await expect(page.getByRole("status", { name: "Discovery" })).toContainText(
    "change distance",
  );
  await page.getByRole("button", { name: "Read the science" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).not.toBeVisible();
  await page.getByLabel("Chart variable").selectOption("p");
  await page.getByLabel("Chart view").selectOption("seasonal");
  await expect(
    page.getByText(
      "Monthly seasonal climatology (selected-period mean) · mm/day",
    ),
  ).toBeVisible();
  await page.getByLabel("Chart view").selectOption("monthly");
  await expect(page.getByLabel("Anomalies", { exact: true })).toBeDisabled();
  await page.getByLabel("Chart view").selectOption("annual");
  await page.getByText("View accessible data table").click();
  await expect(page.getByRole("table")).toBeVisible();
  await page.screenshot({
    path: "test-results/explorer-synthetic-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect
    .poll(() =>
      page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    )
    .toBe(true);
  await expect(page.getByLabel("Start year")).toBeVisible();
  await page.getByLabel("Selected location").selectOption("langley");
  await page.screenshot({
    path: "test-results/explorer-synthetic-mobile.png",
    fullPage: true,
  });
  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(
    accessibility.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      nodes: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  expect(errors).toEqual([]);
});

for (const viewport of [
  { width: 390, height: 844 },
  { width: 768, height: 1024 },
  { width: 1440, height: 1000 },
]) {
  test(`complete controls and export at ${viewport.width}px`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    const fixture = syntheticDataset();
    await page.route("**/data/climate.json", (r) =>
      r.fulfill({ json: fixture }),
    );
    await page.goto("/");
    await page.getByRole("button", { name: "Take a 2-minute tour" }).click();
    await expect(
      page.getByRole("region", { name: "Demonstration guide" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close demo guide" }).click();
    await page.getByLabel("Selected location").selectOption("lisbon");
    await page
      .getByRole("button", { name: "Climate twins", exact: true })
      .click();
    await page.getByRole("slider", { name: /Temperature/ }).fill("0");
    await page.getByRole("slider", { name: /Precipitation/ }).fill("100");
    await page.getByLabel("Start year").selectOption("2000");
    await page.getByLabel("End year").selectOption("2020");
    await page.getByLabel("Chart view").selectOption("seasonal");
    await page.getByText("View accessible data table").click();
    await expect(
      page.getByRole("columnheader", { name: "Month", exact: true }),
    ).toBeVisible();
    await page.getByLabel("Chart view").selectOption("monthly");
    await expect(
      page.getByRole("columnheader", { name: "Year–month", exact: true }),
    ).toBeVisible();
    await page.getByLabel("Chart view").selectOption("annual");
    await page.getByLabel("Anomalies", { exact: true }).check();
    const downloaded = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export analysis" }).click();
    const file = await downloaded;
    const fs = await import("node:fs/promises");
    const report = JSON.parse(await fs.readFile((await file.path())!, "utf8"));
    expect(report.period).toEqual([2000, 2020]);
    expect(report.weights).toEqual({ temperature: 0, precipitation: 100 });
    expect(report.selected.id).toBe("lisbon");
    expect(report.selected.fingerprint.annual).toHaveLength(21);
    expect(report.match.distance).toBeGreaterThanOrEqual(0);
    await page.getByRole("button", { name: "Read the science" }).click();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("button", { name: "Read the science" }),
    ).toBeFocused();
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.map((v) => v.id)).toEqual([]);
  });
}

test("loading and malformed data fail clearly", async ({ page }) => {
  let release: () => void = () => {};
  const waiting = new Promise<void>((resolve) => {
    release = resolve;
  });
  await page.route("**/data/climate.json", async (r) => {
    await waiting;
    await r.fulfill({ json: { bad: "schema" } });
  });
  await page.goto("/");
  await expect(page.getByRole("status")).toContainText(
    "Loading verified monthly",
  );
  release();
  await expect(page.getByRole("alert")).toContainText(
    "Dataset metadata or units are invalid",
  );
});

test("empty matches do not invent a twin and WebGL fallback remains usable", async ({
  page,
}) => {
  const fixture = syntheticDataset();
  fixture.locations = fixture.locations.slice(0, 2);
  fixture.locations[1].lat = fixture.locations[0].lat;
  fixture.locations[1].lon = fixture.locations[0].lon;
  await page.route("**/data/climate.json", (r) => r.fulfill({ json: fixture }));
  await page.route("**/data/land.geojson", (r) =>
    r.fulfill({ status: 404, body: "test failure" }),
  );
  await page.goto("/");
  await expect(
    page.getByText(/No sampled locations meet this separation/),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "Export analysis" }),
  ).toHaveCount(0);
  await expect(
    page.getByText("SELECTED TWIN", { exact: true }),
  ).not.toBeVisible();
  await page.getByLabel("Minimum separation").selectOption("0");
  await expect(
    page.getByRole("button", { name: "Export analysis" }),
  ).toBeVisible();
});

test("selects an actual rendered map point", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.route("**/data/climate.json", (r) =>
    r.fulfill({ json: syntheticDataset() }),
  );
  await page.goto("/");
  await expect(page.locator(".map-canvas")).toHaveAttribute(
    "data-map-ready",
    "true",
  );
  const canvas = page.locator("canvas.maplibregl-canvas");
  const box = (await canvas.boundingBox())!;
  const mercator = (lat: number) =>
    (1 - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) / Math.PI) / 2;
  const size = 512 * 2 ** 0.65;
  const position = {
    x: box.width / 2 + ((-9.14 - 15) / 360) * size,
    y: box.height / 2 + (mercator(38.72) - mercator(15)) * size,
  };
  await expect
    .poll(async () => {
      await canvas.click({ position });
      return page.getByLabel("Selected location").inputValue();
    })
    .toBe("lisbon");
});
