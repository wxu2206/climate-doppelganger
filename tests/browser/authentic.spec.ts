import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
for (const width of [390, 768, 1440]) {
  test(`authentic NASA explorer at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    const external: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("request", (r) => {
      if (
        new URL(r.url()).hostname !== "127.0.0.1" &&
        !r.url().startsWith("blob:") &&
        !r.url().startsWith("data:")
      )
        external.push(r.url());
    });
    await page.goto("/");
    await expect(page.getByLabel("Selected location")).toHaveValue("vancouver");
    await expect(page.locator("[data-map-ready=true]")).toBeVisible();
    await page.getByLabel("Selected location").selectOption("lisbon");
    await page
      .getByRole("button", { name: "Climate twins", exact: true })
      .click();
    await expect(page.locator(".match-card").first()).toContainText(
      "Cape Town",
    );
    await expect(page.locator(".match-card").first()).toContainText("0.188");
    await page
      .getByRole("button", { name: "Change twins", exact: true })
      .click();
    await expect(page.locator(".match-card").first()).toContainText(
      "Reykjavík",
    );
    await expect(page.locator(".match-card").first()).toContainText("0.461");
    await page.getByText("View accessible data table").click();
    await expect(page.locator("tbody tr")).toHaveCount(34);
    await page.getByLabel("Start year").selectOption("2000");
    await expect(page.locator("tbody tr")).toHaveCount(25);
    await page.getByLabel("Start year").selectOption("1991");
    await page.getByLabel("Anomalies", { exact: true }).check();
    await page.getByLabel("Chart view").selectOption("seasonal");
    await expect(page.locator("tbody tr")).toHaveCount(12);
    await page.getByLabel("Chart view").selectOption("monthly");
    await expect(page.locator("tbody tr")).toHaveCount(408);
    await page.getByLabel("Chart view").selectOption("annual");
    await page.getByLabel("Anomalies", { exact: true }).uncheck();
    const download = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export analysis" }).click();
    const fs = await import("node:fs/promises");
    const result = JSON.parse(
      await fs.readFile((await (await download).path())!, "utf8"),
    );
    expect(result.selected.id).toBe("lisbon");
    expect(result.compared.id).toBe("reykjavik");
    expect(result.dataset).toBe("power-1991-2024-v1");
    expect(result.selected.source.title).toContain("NASA/POWER");
    expect(result.selected.fingerprint.temperature.decade).toBeCloseTo(
      0.098093213497554,
      10,
    );
    expect(result.selected.fingerprint.temperature.p).toBeGreaterThan(0.05);
    expect(
      await new AxeBuilder({ page })
        .analyze()
        .then((r) => r.violations.map((v) => v.id)),
    ).toEqual([]);
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    expect(errors).toEqual([]);
    expect(external).toEqual([]);
  });
}
