import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
maplibregl.setWorkerUrl(workerUrl);
import type { GeoJSONSource, Map as GLMap } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Location, Match } from "../types";
import { LocateFixed, Minus, Plus } from "lucide-react";
interface Props {
  locations: Location[];
  selected: Location;
  compared: Location;
  matches: Match[];
  onSelect: (id: string) => void;
}
export default function WorldMap({
  locations,
  selected,
  compared,
  matches,
  onSelect,
}: Props) {
  const container = useRef<HTMLDivElement>(null),
    map = useRef<GLMap | null>(null),
    [failed, setFailed] = useState(false);
  const latest = useRef({ locations, selected, compared, matches });
  useEffect(() => {
    latest.current = { locations, selected, compared, matches };
  }, [locations, selected, compared, matches]);
  const selectRef = useRef(onSelect);
  useEffect(() => {
    selectRef.current = onSelect;
  }, [onSelect]);
  useEffect(() => {
    if (!container.current) return;
    let instance: GLMap;
    try {
      instance = new maplibregl.Map({
        container: container.current,
        center: [15, 15],
        zoom: 0.65,
        minZoom: 0.2,
        maxZoom: 6,
        attributionControl: false,
        style: {
          version: 8,
          sources: {
            land: {
              type: "geojson",
              data: `${import.meta.env.BASE_URL}data/land.geojson`,
            },
          },
          layers: [
            {
              id: "ocean",
              type: "background",
              paint: { "background-color": "#0b1724" },
            },
            {
              id: "land",
              type: "fill",
              source: "land",
              paint: {
                "fill-color": "#203648",
                "fill-outline-color": "#385268",
              },
            },
          ],
        },
      });
      map.current = instance;
      instance.addControl(
        new maplibregl.AttributionControl({
          compact: true,
          customAttribution: "Natural Earth · public domain",
        }),
        "bottom-right",
      );
      instance.on("error", () => setFailed(true));
      instance.on("load", () => {
        if (container.current) container.current.dataset.mapReady = "true";
        instance.addSource("points", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        instance.addLayer({
          id: "samples",
          type: "circle",
          source: "points",
          paint: {
            "circle-radius": ["case", ["get", "active"], 8, 5],
            "circle-color": [
              "case",
              ["get", "active"],
              "#6ee7d5",
              ["get", "match"],
              "#a8bdff",
              "#708ba0",
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#0b1724",
          },
        });
        instance.addSource("connection", {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });
        instance.addLayer({
          id: "connection",
          type: "line",
          source: "connection",
          paint: {
            "line-color": "#6ee7d5",
            "line-width": 1.5,
            "line-dasharray": [3, 3],
            "line-opacity": 0.65,
          },
        });
        updateMap(
          instance,
          latest.current.locations,
          latest.current.selected,
          latest.current.compared,
          latest.current.matches,
        );
        instance.on("click", "samples", (e) => {
          const id = e.features?.[0]?.properties?.id;
          if (typeof id === "string") selectRef.current(id);
        });
        instance.on("mouseenter", "samples", () => {
          instance.getCanvas().style.cursor = "pointer";
        });
        instance.on("mouseleave", "samples", () => {
          instance.getCanvas().style.cursor = "";
        });
      });
    } catch {
      // Initialization failure of an imperative WebGL API must update the fallback UI.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFailed(true);
    }
    return () => {
      instance?.remove();
      map.current = null;
    };
    // Initialization owns the map lifecycle; subsequent props update sources below.
  }, []);
  useEffect(() => {
    if (map.current?.getSource("points"))
      updateMap(map.current, locations, selected, compared, matches);
  }, [locations, selected, compared, matches]);
  return (
    <section className="world-map" aria-label="Global sample location map">
      <div ref={container} className="map-canvas" />
      {failed && (
        <div className="map-fallback">
          <p>
            WebGL map unavailable. Select any location using the accessible
            location controls.
          </p>
          <div className="coordinate-grid">
            {locations.map((l) => (
              <button
                key={l.id}
                style={{
                  left: `${((l.lon + 180) / 360) * 95}%`,
                  top: `${((90 - l.lat) / 180) * 80 + 5}%`,
                }}
                onClick={() => onSelect(l.id)}
                title={l.name}
                aria-label={`Select ${l.name}`}
              >
                ●
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="map-kicker">
        <span className="live-dot" /> EARTH OBSERVATION NETWORK{" "}
        <span className="map-coordinate">
          {selected.lat.toFixed(2)}° {selected.lon.toFixed(2)}°
        </span>
      </div>
      <div className="map-label origin">
        <span>YOUR LOCATION</span>
        <strong>{selected.name}</strong>
      </div>
      <div className="map-label destination" hidden={!matches.length}>
        <span>SELECTED TWIN</span>
        <strong>{compared.name}</strong>
      </div>
      <div className="map-tools">
        <button
          aria-label="Zoom in"
          onClick={() => map.current?.zoomIn()}
          disabled={failed}
        >
          <Plus size={17} />
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => map.current?.zoomOut()}
          disabled={failed}
        >
          <Minus size={17} />
        </button>
        <button
          aria-label="Reset global map"
          onClick={() =>
            map.current?.flyTo({ center: [15, 15], zoom: 0.65, duration: 0 })
          }
          disabled={failed}
        >
          <LocateFixed size={17} />
        </button>
      </div>
      <div className="map-legend">
        <span>
          <i className="mint" /> Selected location
        </span>
        <span>
          <i className="blue" /> Closest matches
        </span>
        <span>
          <i /> Supported sample
        </span>
      </div>
    </section>
  );
}
function updateMap(
  map: GLMap,
  locations: Location[],
  selected: Location,
  compared: Location,
  matches: Match[],
) {
  const ids = new Set(matches.slice(0, 5).map((m) => m.location.id));
  (map.getSource("points") as GeoJSONSource | undefined)?.setData({
    type: "FeatureCollection",
    features: locations.map((l) => ({
      type: "Feature",
      properties: {
        id: l.id,
        active: l.id === selected.id,
        match: ids.has(l.id),
      },
      geometry: { type: "Point", coordinates: [l.lon, l.lat] },
    })),
  });
  // Unwrap longitude to take the shortest dateline-crossing path.
  let endLon = compared.lon;
  while (endLon - selected.lon > 180) endLon -= 360;
  while (endLon - selected.lon < -180) endLon += 360;
  (map.getSource("connection") as GeoJSONSource | undefined)?.setData({
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: matches.length
        ? [
            [selected.lon, selected.lat],
            [endLon, compared.lat],
          ]
        : [],
    },
  });
}
