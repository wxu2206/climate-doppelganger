// Records only the real application and committed authentic NASA snapshot.
import { chromium } from "playwright";
import fs from "node:fs";
import crypto from "node:crypto";
const base = process.env.DEMO_URL || "http://127.0.0.1:4190";
const root = new URL("../", import.meta.url).pathname;
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
  args: ["--enable-unsafe-swiftshader"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  recordVideo: process.env.RECORD
    ? {
        dir: "/tmp/climate-submission-video",
        size: { width: 1440, height: 1000 },
      }
    : undefined,
});
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const manifest = [];
const shot = async (name, selector) => {
  await page.mouse.move(0, 0);
  await page.waitForTimeout(150);
  await page.evaluate(() => {
    if (document.activeElement instanceof HTMLElement)
      document.activeElement.blur();
    window.scrollTo(0, 0);
  });
  const target = selector ? page.locator(selector) : page;
  await target.screenshot({ path: root + "screenshots/" + name + ".png" });
  const b = fs.readFileSync(root + "screenshots/" + name + ".png");
  manifest.push({
    file: "screenshots/" + name + ".png",
    source:
      "Unmocked production browser screenshot; committed NASA POWER snapshot",
    sha256: crypto.createHash("sha256").update(b).digest("hex"),
  });
};
const hold = async (ms) => {
  await page.mouse.move(0, 0);
  if (process.env.RECORD) await page.waitForTimeout(ms);
};
try {
  await page.goto(base);
  await page.locator("[data-map-ready=true]").waitFor();
  await shot("01-desktop");
  await hold(6000);
  await page.getByLabel("Selected location").selectOption("lisbon");
  await shot("02-map", ".world-map");
  await hold(6000);
  await page
    .getByRole("button", { name: "Climate twins", exact: true })
    .click();
  await page.locator(".matches-section").scrollIntoViewIfNeeded();
  await hold(10000);
  await shot("03-climate-twins", ".matches-section");
  await shot("11-climate-detail", ".match-card:first-child");
  await page.getByRole("button", { name: "Change twins", exact: true }).click();
  await page.locator(".matches-section").scrollIntoViewIfNeeded();
  await hold(10000);
  await shot("04-change-twins", ".matches-section");
  await shot("12-change-detail", ".match-card:first-child");
  await page.locator(".evidence-grid").scrollIntoViewIfNeeded();
  await hold(10000);
  await shot("05-temperature", ".history");
  await page.getByLabel("Chart variable").selectOption("p");
  await hold(8000);
  await shot("06-precipitation", ".history");
  await page.locator(".stats-grid").scrollIntoViewIfNeeded();
  await hold(10000);
  await shot("07-statistics", ".stats-grid");
  await page.getByRole("button", { name: "Read the science" }).click();
  await hold(10000);
  await shot("08-methodology", "dialog");
  await page.keyboard.press("Escape");
  await page.getByLabel("Chart variable").selectOption("t");
  await page.setViewportSize({ width: 390, height: 844 });
  await shot("09-mobile");
  await hold(6000);
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByLabel("Chart view").selectOption("seasonal");
  await shot("10-seasonal", ".history");
  await hold(6000);
  await page.getByLabel("Chart view").selectOption("annual");
  await page.evaluate(() => window.scrollTo(0, 0));
  await hold(6000);
  if (errors.length) throw Error(errors.join("\n"));
  fs.writeFileSync(
    root + "screenshots/provenance.json",
    JSON.stringify(
      {
        dataset_sha256:
          "bc79b9e103e350c035a9716ecd8baf6343bc18ee49acddd87cd3e12ae0a44254",
        base_url: base,
        tool: "Chromium via Playwright; no mocked responses, image generation or scientific image editing",
        images: manifest,
      },
      null,
      2,
    ) + "\n",
  );
  const video = page.video();
  await context.close();
  if (process.env.RECORD) {
    fs.copyFileSync(await video.path(), root + "video/recording.webm");
    console.log("Recorded actual browser video");
  }
} finally {
  await browser.close();
}
