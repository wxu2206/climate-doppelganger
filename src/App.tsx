import { lazy, Suspense, useMemo, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Compass,
  Download,
  Earth,
  FlaskConical,
  Info,
  Layers,
  MapPin,
  Orbit,
  Search,
  Shuffle,
  Sparkles,
  Thermometer,
  Waves,
  X,
} from "lucide-react";
import type { Dataset, Location, Mode, Trend } from "./types";
import { fingerprint, rankMatches } from "./core/science";
import { useDataset } from "./hooks/useDataset";
const WorldMap = lazy(() => import("./components/WorldMap"));
const HistoryChart = lazy(() => import("./components/HistoryChart"));
const signed = (n: number, digits = 2) =>
  `${n >= 0 ? "+" : ""}${n.toFixed(digits)}`;
export default function App() {
  const { data, error } = useDataset();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to explorer
      </a>
      <header className="site-header">
        <a className="brand" href="#main">
          <span className="brand-symbol">
            <Orbit size={27} />
          </span>
          <span>
            climate<span className="brand-light">doppelgänger</span>
            <small>EARTH, CONNECTED.</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#main" className="nav-active">
            Explorer
          </a>
          <a href="#science">The science</a>
          <a
            href="https://power.larc.nasa.gov/"
            target="_blank"
            rel="noreferrer"
          >
            NASA data <ArrowUpRight size={12} />
          </a>
        </nav>
        <span className="challenge-tag">
          NASA SPACE APPS <b>2026</b>
        </span>
      </header>
      {data ? (
        <Explorer data={data} />
      ) : (
        <main id="main" className="empty-state">
          <Earth size={56} />
          <span className="eyebrow">NASA POWER · EARTH OBSERVATION</span>
          <h1>
            One planet.
            <br />
            <em>Unexpected connections.</em>
          </h1>
          {error ? (
            <div role="alert">
              <h2>Verified data is not available yet</h2>
              <p>{error}</p>
              <p>
                This explorer never substitutes simulated observations. Follow
                docs/data-sources.md to obtain the verified dataset.
              </p>
              <button onClick={() => window.location.reload()}>
                Retry dataset
              </button>
            </div>
          ) : (
            <p role="status">Loading verified monthly observations…</p>
          )}
          <section
            id="science"
            className="panel unavailable-science"
            aria-labelledby="offline-science-title"
          >
            <h2 id="offline-science-title">
              The method, even while data is unavailable
            </h2>
            <p>
              Climate twins compare average conditions and seasonal amplitude.
              Change twins compare trends and detrended variability. NASA POWER
              monthly temperatures are day-weighted; precipitation rates are
              multiplied by calendar days before annual aggregation.
            </p>
            <p>
              Linear trends use nominal Student-t slope intervals. Temporal
              autocorrelation and multiple comparisons can overstate
              significance; a match does not establish causation or predict
              future climate.
            </p>
            <a href="https://github.com/wxu2206/climate-doppelganger/blob/main/docs/methodology.md">
              Read the methodology and data limitations
            </a>
          </section>
        </main>
      )}
      <footer>
        <span>
          <Orbit size={16} /> Climate Doppelgänger
        </span>
        <p>
          Built for NASA Space Apps 2026 · Independent project, not endorsed by
          NASA.
        </p>
        <a href="https://github.com/wxu2206/climate-doppelganger">
          Source & methodology <ArrowUpRight size={13} />
        </a>
      </footer>
    </>
  );
}
export function Explorer({ data }: { data: Dataset }) {
  const [selectedId, setSelectedId] = useState(data.locations[0].id),
    [compareId, setCompareId] = useState(""),
    [mode, setMode] = useState<Mode>("change"),
    [start, setStart] = useState(data.start),
    [end, setEnd] = useState(data.end),
    [year, setYear] = useState(data.end),
    [query, setQuery] = useState(""),
    [temperature, setTemperature] = useState(70),
    [precipitation, setPrecipitation] = useState(30),
    [minKm, setMinKm] = useState(1500),
    [surpriseIndex, setSurpriseIndex] = useState(0),
    [notice, setNotice] = useState(""),
    [demo, setDemo] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null),
    demoButton = useRef<HTMLButtonElement>(null);
  const selected =
    data.locations.find((l) => l.id === selectedId) ?? data.locations[0];
  const fingerprints = useMemo(
    () => new Map(data.locations.map((l) => [l, fingerprint(l, start, end)])),
    [data.locations, start, end],
  );
  const matches = useMemo(
    () =>
      rankMatches(
        selected,
        data.locations,
        mode,
        start,
        end,
        { temperature, precipitation },
        minKm,
        fingerprints,
      ),
    [
      selected,
      data.locations,
      mode,
      start,
      end,
      temperature,
      precipitation,
      minKm,
      fingerprints,
    ],
  );
  const compared =
    matches.find((m) => m.location.id === compareId)?.location ??
    matches[0]?.location ??
    data.locations.find((l) => l.id !== selected.id)!;
  const match = matches.find((m) => m.location.id === compared.id),
    a = fingerprints.get(selected)!,
    b = fingerprints.get(compared)!;
  const currentYear = Math.max(start, Math.min(end, year)),
    annualA = a.annual.find((a) => a.year === currentYear)!,
    annualB = b.annual.find((a) => a.year === currentYear)!;
  const filtered = data.locations.filter((l) =>
    `${l.name} ${l.country}`.toLowerCase().includes(query.toLowerCase()),
  );
  function choose(id: string) {
    setSelectedId(id);
    setCompareId("");
    setNotice("");
  }
  function surprise() {
    const pairs = data.locations
      .flatMap((l) =>
        rankMatches(
          l,
          data.locations,
          "change",
          start,
          end,
          { temperature, precipitation },
          Math.max(5000, minKm),
          fingerprints,
        )
          .slice(0, 1)
          .map((m) => ({ from: l, match: m })),
      )
      .sort(
        (a, b) =>
          a.match.distance - b.match.distance ||
          a.from.id.localeCompare(b.from.id),
      );
    if (!pairs.length) {
      setNotice(
        "No pairs meet the distance filter. Reduce the minimum separation.",
      );
      return;
    }
    const pair = pairs[surpriseIndex % pairs.length];
    setSurpriseIndex((i) => i + 1);
    setSelectedId(pair.from.id);
    setCompareId(pair.match.location.id);
    setMode("change");
    setNotice(
      `${pair.from.name} ↔ ${pair.match.location.name}: ${Math.round(pair.match.km).toLocaleString()} km apart, with a change distance of ${pair.match.distance.toFixed(3)} for ${start}–${end} (temperature weight ${temperature}, precipitation ${precipitation}). At discovery, ranked using these weights; similarity is not causation.`,
    );
  }
  function exportComparison() {
    const payload = {
      dataset: data.version,
      period: [start, end],
      mode,
      weights: { temperature, precipitation },
      selected: { id: selected.id, source: selected.source, fingerprint: a },
      compared: { id: compared.id, source: compared.source, fingerprint: b },
      match,
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `climate-${selected.id}-${compared.id}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function openScience() {
    dialog.current?.showModal();
  }
  return (
    <main id="main">
      <section className="intro">
        <div>
          <div className="eyebrow">
            <span className="tiny-line" /> A DIFFERENT WAY TO SEE OUR CHANGING
            PLANET
          </div>
          <h1>
            Different worlds.
            <br />
            <em>The same story.</em>
          </h1>
          <p>
            Somewhere on Earth, another place is changing like yours.
            <br className="desktop-break" /> Discover your climate doppelgänger.
          </p>
        </div>
        <div className="intro-side">
          <span className="data-status">
            <span className="live-dot" />{" "}
            {data.version.startsWith("SYNTHETIC")
              ? "SYNTHETIC TEST FIXTURE · NOT NASA DATA"
              : "VALIDATED NASA POWER DATA"}
          </span>
          <p>
            {data.locations.length} locations. {data.end - data.start + 1}{" "}
            years.
            <br />A world of unexpected connections.
          </p>
          <button
            ref={demoButton}
            className="text-button"
            onClick={() => {
              setDemo((v) => !v);
              setNotice("");
            }}
          >
            {demo ? "Close demo guide" : "Take a 2-minute tour"}{" "}
            <ArrowRight size={15} />
          </button>
        </div>
      </section>
      {demo && (
        <section className="demo-guide panel" aria-label="Demonstration guide">
          <strong>
            01 Choose home → 02 Find its change twins → 03 Read the evidence
          </strong>
          <p>
            Places can have different average climates but similar trends. Start
            in Langley, switch between Climate twins and Change twins, then
            choose Surprise me to reveal a real, distant pair. Read its trend
            confidence intervals and the limitations before drawing conclusions.
          </p>
          <button
            onClick={() => {
              surprise();
              setDemo(false);
              demoButton.current?.focus();
            }}
          >
            Discover a verified pair <Sparkles size={15} />
          </button>
        </section>
      )}
      <div className="workspace-heading">
        <div className="section-title">
          <Compass size={18} />
          <h2>Global explorer</h2>
          <span className="subtle-badge">
            {data.locations.length} sampled locations
          </span>
        </div>
        <button className="surprise" onClick={surprise}>
          <Shuffle size={16} /> Surprise me <ArrowUpRight size={14} />
        </button>
      </div>
      {notice && (
        <div role="status" aria-label="Discovery" className="discovery-notice">
          <Sparkles size={19} />
          <p>{notice}</p>
          <button aria-label="Dismiss discovery" onClick={() => setNotice("")}>
            <X size={17} />
          </button>
        </div>
      )}
      <div className="explorer-grid">
        <aside className="control-panel panel" aria-label="Comparison controls">
          <div className="control-section">
            <label className="eyebrow" htmlFor="location-search">
              01 / CHOOSE YOUR LOCATION
            </label>
            <div className="search-box">
              <Search size={16} />
              <input
                id="location-search"
                type="search"
                placeholder="Search supported locations"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <label className="sr-only" htmlFor="location">
              Selected location
            </label>
            <select
              id="location"
              value={selected.id}
              onChange={(e) => choose(e.target.value)}
            >
              {data.locations.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}, {l.country}
                </option>
              ))}
            </select>
            {query && (
              <div
                className="search-results"
                aria-label="Location search results"
              >
                {filtered.length ? (
                  filtered.map((l) => (
                    <button
                      key={l.id}
                      aria-label={`Select ${l.name}, ${l.country}`}
                      onClick={() => {
                        choose(l.id);
                        setQuery("");
                      }}
                    >
                      {l.name}
                      <small>{l.country}</small>
                    </button>
                  ))
                ) : (
                  <p>No supported locations found.</p>
                )}
              </div>
            )}
            <div className="location-detail">
              <MapPin size={14} />
              <span>
                {selected.country}
                <small>
                  {selected.lat.toFixed(2)}°, {selected.lon.toFixed(2)}° ·
                  gridded estimate
                </small>
              </span>
            </div>
          </div>
          <div className="control-section">
            <span className="eyebrow">02 / FIND YOUR TWIN</span>
            <div
              className="mode-switch"
              role="group"
              aria-label="Comparison mode"
            >
              <button
                aria-pressed={mode === "climate"}
                className={mode === "climate" ? "active" : ""}
                onClick={() => setMode("climate")}
              >
                <Earth size={15} /> Climate twins
              </button>
              <button
                aria-pressed={mode === "change"}
                className={mode === "change" ? "active" : ""}
                onClick={() => setMode("change")}
              >
                <Layers size={15} /> Change twins
              </button>
            </div>
            <p className="control-help">
              {mode === "change"
                ? "Different climates. Similar directions of change. Compares trends and interannual variability."
                : "Similar average conditions. Compares mean temperature, rainfall and seasonal amplitude."}
            </p>
          </div>
          <div className="control-section">
            <div className="label-row">
              <span className="eyebrow">03 / WEIGHT THE VARIABLES</span>
              <button
                className="icon-button"
                aria-label="Explain comparison weights"
                onClick={openScience}
              >
                <Info size={15} />
              </button>
            </div>
            <label className="range-label" htmlFor="temperature">
              <span>
                <Thermometer size={15} /> Temperature
              </span>
              <output>{temperature}</output>
            </label>
            <input
              id="temperature"
              type="range"
              min={precipitation === 0 ? 1 : 0}
              max="100"
              value={temperature}
              onChange={(e) => setTemperature(+e.target.value)}
            />
            <label className="range-label" htmlFor="precipitation">
              <span>
                <Waves size={15} /> Precipitation
              </span>
              <output>{precipitation}</output>
            </label>
            <input
              id="precipitation"
              className="rain-range"
              type="range"
              min={temperature === 0 ? 1 : 0}
              max="100"
              value={precipitation}
              onChange={(e) => setPrecipitation(+e.target.value)}
            />
            <p className="control-help">
              Relative weights · normalized automatically
            </p>
          </div>
          <div className="control-section period-controls">
            <span className="eyebrow">04 / LOOK THROUGH TIME</span>
            <div className="period-row">
              <label>
                From
                <select
                  aria-label="Start year"
                  value={start}
                  onChange={(e) => {
                    setStart(+e.target.value);
                    setCompareId("");
                  }}
                >
                  {Array.from(
                    { length: end - data.start - 8 },
                    (_, i) => data.start + i,
                  ).map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </label>
              <span>—</span>
              <label>
                To
                <select
                  aria-label="End year"
                  value={end}
                  onChange={(e) => {
                    setEnd(+e.target.value);
                    setCompareId("");
                  }}
                >
                  {Array.from(
                    { length: data.end - start - 8 },
                    (_, i) => start + 9 + i,
                  ).map((y) => (
                    <option key={y}>{y}</option>
                  ))}
                </select>
              </label>
            </div>
            <label className="filter-label" htmlFor="distance">
              Minimum separation
              <select
                id="distance"
                value={minKm}
                onChange={(e) => setMinKm(+e.target.value)}
              >
                <option value="0">Any distance</option>
                <option value="1500">1,500 km</option>
                <option value="5000">5,000 km</option>
                <option value="10000">10,000 km</option>
              </select>
            </label>
          </div>
          <div className="control-foot">
            <Check size={13} /> No account. No live API required.
          </div>
        </aside>
        <div className="map-column">
          <Suspense
            fallback={
              <div className="map-loading" role="status">
                Loading map…
              </div>
            }
          >
            <WorldMap
              locations={data.locations}
              selected={selected}
              compared={compared}
              matches={matches}
              onSelect={choose}
            />
          </Suspense>
          <section className="timeline" aria-label="Climate time machine">
            <div>
              <span className="eyebrow">CLIMATE TIME MACHINE</span>
              <strong>{currentYear}</strong>
            </div>
            <div className="timeline-track">
              <label className="sr-only" htmlFor="timeline">
                Historical year
              </label>
              <input
                id="timeline"
                type="range"
                min={start}
                max={end}
                value={currentYear}
                onChange={(e) => setYear(+e.target.value)}
              />
              <div className="range-extents">
                <span>{start}</span>
                <span>Annual observations · move to explore</span>
                <span>{end}</span>
              </div>
            </div>
            <div className="timeline-value">
              <strong>
                {annualA.t.toFixed(1)}°C{" "}
                <span>/ {annualA.p.toFixed(0)} mm</span>
              </strong>
              <small>
                {selected.name} · {currentYear}
              </small>
              <small hidden={!matches.length}>
                Twin: {annualB.t.toFixed(1)}°C / {annualB.p.toFixed(0)} mm
              </small>
            </div>
          </section>
        </div>
      </div>
      <section className="matches-section" aria-labelledby="matches-title">
        <div className="section-heading">
          <div>
            <span className="eyebrow">DISTANT PLACES. FAMILIAR PATTERNS.</span>
            <h2 id="matches-title">
              Meet your {mode === "change" ? "change" : "climate"} twins
              <span className="count">{matches.length}</span>
            </h2>
          </div>
          <span className="muted match-hint">
            Standardized distance · lower is closer{" "}
            <button
              className="icon-button"
              aria-label="Explain similarity distance"
              onClick={openScience}
            >
              <Info size={14} />
            </button>
          </span>
        </div>
        <div className="match-cards">
          {matches.slice(0, 4).map((m, i) => {
            const f = fingerprints.get(m.location)!;
            return (
              <button
                key={m.location.id}
                className={`match-card ${compared.id === m.location.id ? "chosen" : ""}`}
                onClick={() => setCompareId(m.location.id)}
                aria-pressed={compared.id === m.location.id}
              >
                <div className="match-card-top">
                  <span className="rank">0{i + 1}</span>
                  <span className="distance-tag">
                    {m.distance.toFixed(3)} distance
                  </span>
                </div>
                <h3>{m.location.name}</h3>
                <p>
                  {m.location.country}{" "}
                  <span>↗ {Math.round(m.km).toLocaleString()} km</span>
                </p>
                <div className="match-metrics">
                  <span>
                    <Thermometer size={14} />
                    {signed(f.temperature.decade)}°C<small>/ decade</small>
                  </span>
                  <ArrowUpRight size={18} />
                </div>
                <div className="card-foot">
                  {compared.id === m.location.id ? (
                    <>
                      <Check size={12} /> Comparing now
                    </>
                  ) : (
                    "Explore this connection"
                  )}
                </div>
              </button>
            );
          })}
          {matches.length === 0 && (
            <p role="status">
              No sampled locations meet this separation. Choose a smaller
              minimum distance.
            </p>
          )}
        </div>
      </section>
      {matches.length > 0 && (
        <>
          <section className="comparison-heading">
            <div>
              <span className="eyebrow">
                SIDE BY SIDE / {start}–{end}
              </span>
              <h2>
                {selected.name} <span>↔</span> {compared.name}
              </h2>
            </div>
            <button className="secondary-button" onClick={exportComparison}>
              <Download size={15} /> Export analysis
            </button>
          </section>
          <div className="stats-grid">
            <TrendCard
              title="Temperature change"
              icon="temperature"
              first={a.temperature}
              second={b.temperature}
              a={selected}
              b={compared}
              unit="°C / decade"
            />
            <TrendCard
              title="Precipitation change"
              icon="rain"
              first={a.precipitation}
              second={b.precipitation}
              a={selected}
              b={compared}
              unit="mm / decade"
            />
            <section className="panel baseline-card">
              <span className="eyebrow">BASELINE CONDITIONS</span>
              <div>
                <span>{selected.name}</span>
                <strong>
                  {a.meanT.toFixed(1)}°C{" "}
                  <small>{a.meanP.toFixed(0)} mm/yr</small>
                </strong>
              </div>
              <div>
                <span>{compared.name}</span>
                <strong>
                  {b.meanT.toFixed(1)}°C{" "}
                  <small>{b.meanP.toFixed(0)} mm/yr</small>
                </strong>
              </div>
              <p>
                {a.annual.length} complete years ·{" "}
                {(a.completeness * 100).toFixed(0)}% monthly coverage
                <br />
                Selected-period means, not global normals
              </p>
            </section>
          </div>
          <div className="evidence-grid">
            <Suspense fallback={<p>Loading history chart…</p>}>
              <HistoryChart
                selected={selected}
                compared={compared}
                start={start}
                end={end}
              />
            </Suspense>
            <section className="panel explanation">
              <FlaskConical size={23} />
              <span className="eyebrow">WHY THIS CONNECTION?</span>
              <h2>
                Similarity,
                <br />
                with the science attached.
              </h2>
              <p>
                {mode === "change"
                  ? "We compare rates of change and detrended year-to-year variability. Baseline climates can be very different."
                  : "We compare average conditions and seasonal amplitudes. Matching climates can still be changing at different rates."}
              </p>
              {match && (
                <>
                  <div className="score-summary">
                    <strong>{match.distance.toFixed(3)}</strong>
                    <span>
                      weighted standardized distance
                      <br />0 = identical selected features
                    </span>
                  </div>
                  {match.contributions.map((c) => (
                    <div className="contribution" key={c.name}>
                      <span>{c.name}</span>
                      <strong>{c.contribution.toFixed(3)}</strong>
                    </div>
                  ))}
                  <small>
                    Contributions sum to squared distance. Not a probability or
                    forecast.
                  </small>
                </>
              )}
              <button className="text-button" onClick={openScience}>
                Explore the methodology <ArrowRight size={15} />
              </button>
            </section>
          </div>
        </>
      )}
      <section id="science" className="science-strip">
        <div className="science-icon">
          <FlaskConical size={25} />
        </div>
        <div>
          <span className="eyebrow">REAL DATA. HONEST UNCERTAINTY.</span>
          <h2>There’s a method behind every match.</h2>
          <p>
            NASA POWER gridded estimates · Ordinary least squares · 95% slope
            intervals.
            <br />
            Exploratory comparisons—not causal evidence or future predictions.
            Autocorrelation may overstate significance.
          </p>
        </div>
        <button className="secondary-button" onClick={openScience}>
          Read the science <ArrowUpRight size={15} />
        </button>
      </section>
      <div className="provenance">
        <span>
          <span className="live-dot" /> {data.source}
        </span>
        <span>
          {data.version} · Retrieved {selected.source.retrieved.slice(0, 10)}
        </span>
        <a href={selected.source.url} target="_blank" rel="noreferrer">
          View source response <ArrowUpRight size={12} />
        </a>
      </div>
      <dialog
        ref={dialog}
        className="method-dialog"
        aria-labelledby="method-title"
        onClick={(e) => {
          if (e.target === dialog.current) dialog.current.close();
        }}
      >
        <div className="dialog-heading">
          <span className="eyebrow">METHODOLOGY EXPLORER</span>
          <button
            autoFocus
            aria-label="Close methodology"
            onClick={() => dialog.current?.close()}
          >
            <X size={20} />
          </button>
        </div>
        <h2 id="method-title">The science behind the connection</h2>
        <h3>01 / NASA observations</h3>
        <p>
          NASA POWER monthly T2M (2 m air temperature, °C) and PRECTOTCORR
          (corrected precipitation, mm/day). These are gridded
          reanalysis-derived estimates at selected coordinates, not individual
          weather-station measurements. Monthly precipitation rates are
          multiplied by actual calendar days; temperature means are
          day-weighted.
        </p>
        <h3>02 / Two kinds of twin</h3>
        <p>
          Climate twins use mean temperature, seasonal temperature range, annual
          rainfall and seasonal rainfall variability. Change twins use
          temperature and precipitation slopes and their detrended annual
          variability. Monthly and annual anomalies subtract each location’s
          selected-period baseline.
        </p>
        <h3>03 / Transparent distance</h3>
        <p>
          Each feature difference is divided by its across-location population
          standard deviation for the selected period (minimum scale 10⁻⁶). The
          two features in each variable group share its normalized weight.
          Distance = √Σ(weight × standardized difference²). Lower is closer;
          zero means identical features. Scores depend on the sampled cohort and
          are not similarity percentages. Seasonal amplitude does not compare
          phase across hemispheres.
        </p>
        <h3>04 / Trends and uncertainty</h3>
        <p>
          OLS fits annual values against year. Slopes are multiplied by 10 for
          per-decade units. The 95% slope CI is slope ± Student-t(0.975, n−2) ×
          standard error. Two-sided p-values test a zero slope; p &lt; 0.05 is
          nominal evidence under independent, normally distributed residuals. No
          correction for serial correlation or multiple comparisons is applied;
          these can inflate apparent significance. No causal or predictive claim
          follows from a match.
        </p>
        <h3>05 / Coverage and limits</h3>
        <p>
          Only {data.locations.length} sampled points, {data.start}–{data.end},
          are supported. Coastal grid cells and terrain may not represent local
          conditions. We require 10 complete years. Matching uses no vegetation,
          ocean, land-use or attribution model. Annual aggregation hides
          extremes. Source hashes and retrieval timestamps accompany each
          location. A statistical match is a starting point for investigation.
        </p>
        <button
          className="secondary-button"
          onClick={() => dialog.current?.close()}
        >
          Back to exploring <ArrowRight size={15} />
        </button>
      </dialog>
    </main>
  );
}
function TrendCard({
  title,
  icon,
  first,
  second,
  a,
  b,
  unit,
}: {
  title: string;
  icon: string;
  first: Trend;
  second: Trend;
  a: Location;
  b: Location;
  unit: string;
}) {
  return (
    <section className="panel trend-card">
      <div className="label-row">
        <span className="eyebrow">{title}</span>
        {icon === "temperature" ? (
          <Thermometer size={17} />
        ) : (
          <Waves size={17} />
        )}
      </div>
      {[
        [a, first],
        [b, second],
      ].map(([location, trend]) => {
        const l = location as Location,
          t = trend as Trend;
        return (
          <div className="trend-row" key={l.id}>
            <span>{l.name}</span>
            <strong>
              {t.decade >= 0 ? (
                <ArrowUpRight size={17} />
              ) : (
                <ArrowDown size={17} />
              )}{" "}
              {signed(t.decade)}
              <small>{unit}</small>
            </strong>
            <small>
              95% CI [{signed(t.ci[0])}, {signed(t.ci[1])}] · p{" "}
              {t.p < 0.001 ? "< 0.001" : `= ${t.p.toFixed(3)}`} · n = {t.n}
            </small>
            <small className={t.p < 0.05 ? "significant" : "muted"}>
              {t.p < 0.05
                ? "Nominal evidence of a trend"
                : "No nominal evidence at p < 0.05"}
            </small>
          </div>
        );
      })}
    </section>
  );
}
