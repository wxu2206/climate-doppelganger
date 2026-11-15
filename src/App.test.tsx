import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Explorer } from "./App";
import { syntheticDataset } from "./test-fixtures";
vi.mock("./components/WorldMap", () => ({
  default: () => <div>Map rendering tested in Playwright</div>,
}));
vi.mock("./components/HistoryChart", () => ({
  default: () => <div>History rendering tested in Playwright</div>,
}));
describe("explorer controls with explicit synthetic test fixture", () => {
  it("switches modes, locations, weights and selected period", async () => {
    const user = userEvent.setup();
    render(<Explorer data={syntheticDataset()} />);
    expect(
      screen.getByRole("button", { name: /Change twins/ }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.click(screen.getByRole("button", { name: /Climate twins/ }));
    expect(
      screen.getByRole("button", { name: /Climate twins/ }),
    ).toHaveAttribute("aria-pressed", "true");
    await user.selectOptions(
      screen.getByLabelText("Selected location"),
      "tokyo",
    );
    expect(screen.getByLabelText("Selected location")).toHaveValue("tokyo");
    await user.selectOptions(screen.getByLabelText("Start year"), "2000");
    expect(screen.getByText("SIDE BY SIDE / 2000–2024")).toBeVisible();
    fireEvent.change(screen.getByRole("slider", { name: /Temperature/ }), {
      target: { value: "20" },
    });
    expect(screen.getByRole("slider", { name: /Temperature/ })).toHaveValue(
      "20",
    );
    fireEvent.change(screen.getByLabelText("Historical year"), {
      target: { value: "2001" },
    });
    expect(
      screen.getByText("2001", { selector: ".timeline strong" }),
    ).toBeVisible();
  });
  it("searches only supported places and discovers calculated pairs", async () => {
    const user = userEvent.setup();
    render(<Explorer data={syntheticDataset()} />);
    await user.type(screen.getByRole("searchbox"), "nonexistent");
    expect(screen.getByText("No supported locations found.")).toBeVisible();
    await user.clear(screen.getByRole("searchbox"));
    await user.type(screen.getByRole("searchbox"), "Lisbon");
    await user.click(
      screen.getByRole("button", { name: "Select Lisbon, Portugal" }),
    );
    expect(screen.getByLabelText("Selected location")).toHaveValue("lisbon");
    await user.click(screen.getByRole("button", { name: /Surprise me/ }));
    await waitFor(() =>
      expect(
        screen.getByRole("status", { name: "Discovery" }),
      ).toHaveTextContent("change distance"),
    );
  });
});

it("does not present an excluded nearby point as a twin or exportable match", async () => {
  const data = syntheticDataset();
  data.locations = data.locations.slice(0, 2);
  data.locations[1].lat = data.locations[0].lat;
  data.locations[1].lon = data.locations[0].lon;
  render(<Explorer data={data} />);
  expect(
    screen.getByText(/No sampled locations meet this separation/),
  ).toBeVisible();
  expect(
    screen.queryByRole("button", { name: "Export analysis" }),
  ).not.toBeInTheDocument();
});
