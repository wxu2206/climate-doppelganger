import { readFileSync } from "node:fs";
import { validateDataset } from "../src/data/validate.ts";
try {
  const data = validateDataset(
    JSON.parse(
      readFileSync(
        new URL("../public/data/climate.json", import.meta.url),
        "utf8",
      ),
    ),
  );
  if (
    /synthetic|fixture/i.test(`${data.version} ${data.source}`) ||
    data.locations.some((l) => /synthetic|fixture/i.test(l.source.title))
  )
    throw new Error("Test fixtures cannot pass the submission data gate");
  console.log(
    `Validated ${data.locations.length} NASA POWER points, ${data.start}–${data.end}; review raw provenance before submission.`,
  );
} catch (error) {
  console.error(`Submission data check failed: ${error.message}`);
  process.exitCode = 1;
}
