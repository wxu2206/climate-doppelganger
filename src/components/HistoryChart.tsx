import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { anomalies, fingerprint, monthlyAnomalies } from "../core/science";
import type { Location } from "../types";
export default function HistoryChart({
  selected,
  compared,
  start,
  end,
}: {
  selected: Location;
  compared: Location;
  start: number;
  end: number;
}) {
  const [variable, setVariable] = useState<"t" | "p">("t"),
    [anomaly, setAnomaly] = useState(false),
    [view, setView] = useState<"annual" | "seasonal" | "monthly">("annual");
  const a = fingerprint(selected, start, end),
    b = fingerprint(compared, start, end),
    trendA = variable === "t" ? a.temperature : a.precipitation,
    trendB = variable === "t" ? b.temperature : b.precipitation;
  const av = a.annual.map((x) => x[variable]),
    bv = b.annual.map((x) => x[variable]),
    offsetA = anomaly ? av.reduce((s, x) => s + x, 0) / av.length : 0,
    offsetB = anomaly ? bv.reduce((s, x) => s + x, 0) / bv.length : 0;
  const aa = anomalies(av),
    ba = anomalies(bv);
  // Slope-uncertainty ribbon anchored at mean year; intercept uncertainty is not included.
  const center = (start + end) / 2;
  const annualData = a.annual.map((x, i) => {
    const dt = (x.year - center) / 10,
      estimate = trendA.intercept + (trendA.decade * x.year) / 10 - offsetA,
      delta = (Math.abs(dt) * (trendA.ci[1] - trendA.ci[0])) / 2;
    return {
      year: x.year,
      selected: anomaly ? aa[i] : av[i],
      compared: anomaly ? ba[i] : bv[i],
      trendA: estimate,
      trendB: trendB.intercept + (trendB.decade * x.year) / 10 - offsetB,
      band: [estimate - delta, estimate + delta],
    };
  });
  const am = monthlyAnomalies(selected, start, end),
    bm = monthlyAnomalies(compared, start, end);
  const data: {
    year: number | string;
    selected: number;
    compared: number;
    trendA?: number;
    trendB?: number;
    band?: number[];
  }[] =
    view === "annual"
      ? annualData
      : view === "seasonal"
        ? a.seasonT.map((_, i) => ({
            year: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ][i],
            selected: variable === "t" ? a.seasonT[i] : a.seasonP[i],
            compared: variable === "t" ? b.seasonT[i] : b.seasonP[i],
          }))
        : am.map((m, i) => ({
            year: m.date,
            selected: m[variable],
            compared: bm[i][variable],
          }));
  const unit =
    variable === "t" ? "°C" : view === "annual" ? "mm/year" : "mm/day";
  const description =
    view === "annual"
      ? `Annual ${anomaly ? "departures from each location’s selected-period mean" : "observations"}`
      : view === "seasonal"
        ? "Monthly seasonal climatology (selected-period mean)"
        : "Monthly anomalies relative to each calendar month’s selected-period mean";

  return (
    <section className="panel history" aria-labelledby="history-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">THE EVIDENCE</span>
          <h2 id="history-title">Different places. Shared patterns.</h2>
        </div>
        <div className="chart-controls">
          <select
            aria-label="Chart variable"
            value={variable}
            onChange={(e) => setVariable(e.target.value as "t" | "p")}
          >
            <option value="t">Temperature</option>
            <option value="p">Precipitation</option>
          </select>
          <select
            aria-label="Chart view"
            value={view}
            onChange={(e) => setView(e.target.value as typeof view)}
          >
            <option value="annual">Annual history</option>
            <option value="seasonal">Seasonal cycle</option>
            <option value="monthly">Monthly anomalies</option>
          </select>
          <label className="checkbox">
            <input
              type="checkbox"
              disabled={view !== "annual"}
              checked={anomaly}
              onChange={(e) => setAnomaly(e.target.checked)}
            />{" "}
            Anomalies
          </label>
        </div>
      </div>
      <p className="muted">
        {description} · {unit}
      </p>
      <div
        className="chart"
        role="img"
        aria-label={`${description}: ${variable === "t" ? "temperature" : "precipitation"} comparison for ${selected.name} and ${compared.name}, ${start} to ${end}. Exact values in the data table below.`}
      >
        <ResponsiveContainer width="100%" height={260}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#263441"
              strokeDasharray="3 6"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              minTickGap={45}
              tick={{ fill: "#93a5b7", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              width={48}
              tick={{ fill: "#93a5b7", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={{
                background: "#132330",
                border: "1px solid #365060",
                borderRadius: 8,
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(v) =>
                typeof v === "number" ? v.toFixed(2) : String(v)
              }
            />
            <Legend />
            {view === "annual" && (
              <Area
                isAnimationActive={false}
                dataKey="band"
                name="Selected slope uncertainty"
                stroke="none"
                fill="#6ee7d5"
                fillOpacity={0.08}
                legendType="none"
                tooltipType="none"
              />
            )}
            <Line
              isAnimationActive={false}
              dataKey="selected"
              name={selected.name}
              stroke="#6ee7d5"
              strokeWidth={2}
              dot={false}
            />
            <Line
              isAnimationActive={false}
              dataKey="compared"
              name={compared.name}
              stroke="#a8bdff"
              strokeWidth={2}
              dot={false}
            />
            {view === "annual" && (
              <Line
                isAnimationActive={false}
                dataKey="trendA"
                name="Selected trend"
                stroke="#6ee7d5"
                strokeDasharray="5 5"
                dot={false}
                legendType="none"
              />
            )}
            {view === "annual" && (
              <Line
                isAnimationActive={false}
                dataKey="trendB"
                name="Twin trend"
                stroke="#a8bdff"
                strokeDasharray="5 5"
                dot={false}
                legendType="none"
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      {view === "annual" && (
        <p className="chart-note">
          Dashed lines: OLS fits. Shading: selected-location slope uncertainty
          about the midpoint, not a prediction interval. Full 95% slope CIs
          appear above.
        </p>
      )}
      <details>
        <summary>View accessible data table</summary>
        <div
          className="table-scroll"
          tabIndex={0}
          role="region"
          aria-label="Scrollable climate data table"
        >
          <table>
            <caption>
              {unit} · {description}
            </caption>
            <thead>
              <tr>
                <th>
                  {view === "seasonal"
                    ? "Month"
                    : view === "monthly"
                      ? "Year–month"
                      : "Year"}
                </th>
                <th>{selected.name}</th>
                <th>{compared.name}</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.year}>
                  <th>{d.year}</th>
                  <td>{d.selected.toFixed(2)}</td>
                  <td>{d.compared.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}
