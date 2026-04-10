import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FC } from "react";
import type { LegendItem, Station, PollutionMetric } from "@/models/pollution";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const SKOPJE    = { lat: 41.9981, lng: 21.4254 };

const SENSOR_NAMES: Record<string, string> = {
  "sensor_dev_78308_493": "Butel 1",
  "sensor_dev_78844_374": "Centar",
  // додај уште по потреба
};

function formatSensorName(stationId: string, name: string): string {
  if (SENSOR_NAMES[stationId]) return SENSOR_NAMES[stationId];
  if (name === stationId) {
    const parts = stationId.replace("sensor_dev_", "").split("_");
    return parts.length >= 2 ? `Sensor ${parts.join("-")}` : stationId;
  }
  return name;
}
const DARK_TILE  = "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";
const LIGHT_TILE = "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";

interface PollutionMapProps {
  stations?: Station[];
  legend?: LegendItem[];
  unit?: string;
  metric?: PollutionMetric;
}

const MK_BBOX = { latMin: 40.8, latMax: 42.4, lngMin: 20.4, lngMax: 23.1 };

function isInMacedonia(lat: number, lng: number): boolean {
  return (
    lat >= MK_BBOX.latMin && lat <= MK_BBOX.latMax &&
    lng >= MK_BBOX.lngMin && lng <= MK_BBOX.lngMax
  );
}

function getColor(value: number, legend: LegendItem[]): string {
  return legend.find((l) => value >= l.from && value <= l.to)?.color ?? "#888";
}

function getLegendLabel(value: number, legend: LegendItem[]): string {
  return legend.find((l) => value >= l.from && value <= l.to)?.label ?? "—";
}

// All metrics from models/pollution.ts including new ones
const METRIC_ICONS: Record<PollutionMetric, string> = {
  pm10:        "💨",
  pm25:        "🌫️",
  pm1:         "🔬",
  no2:         "🏭",
  o3:          "☁️",
  temperature: "🌡️",
  humidity:    "💧",
  pressure:    "🔵",
  noise_dba:   "🔊",
};

function AutoFitBounds({ stations }: { stations: Station[] }) {
  const map  = useMap();
  const prev = useRef<number>(0);

  useEffect(() => {
    const valid = stations.filter((s) => isInMacedonia(s.position.lat, s.position.lng));
    if (valid.length === 0) return;
    if (valid.length === prev.current) return;
    prev.current = valid.length;
    const bounds = L.latLngBounds(valid.map((s) => [s.position.lat, s.position.lng]));
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14, animate: true });
  }, [stations, map]);

  return null;
}

function readIsDark(): boolean {
  const html = document.documentElement;
  const body = document.body;
  if (html.getAttribute("data-theme") === "dark") return true;
  if (body.getAttribute("data-theme") === "dark") return true;
  if (html.style.colorScheme === "dark") return true;
  if (body.style.colorScheme === "dark") return true;
  if (html.classList.contains("dark")) return true;
  if (body.classList.contains("dark")) return true;
  return false;
}

function useIsDark(): boolean {
  const [isDark, setIsDark] = useState(() => readIsDark());

  useEffect(() => {
    const update = () => setIsDark(readIsDark());
    const obs = new MutationObserver(update);
    const opts: MutationObserverInit = {
      attributes: true,
      attributeFilter: ["data-theme", "class", "style"],
    };
    obs.observe(document.documentElement, opts);
    obs.observe(document.body, opts);
    return () => obs.disconnect();
  }, []);

  return isDark;
}

export const PollutionMap: FC<PollutionMapProps> = ({
  stations = [],
  legend = [],
  unit = "",
  metric = "pm10",
}) => {
  const isDark      = useIsDark();
  const tileUrl     = isDark ? DARK_TILE : LIGHT_TILE;
  const borderClr   = isDark ? "#2b2b2b"                : "#e5e5e5";
  const legendBg    = isDark ? "rgba(17,17,17,0.88)"    : "rgba(255,255,255,0.90)";
  const legendText  = isDark ? "rgba(245,245,245,0.85)" : "#333";
  const popupBg     = isDark ? "#111111"                : "#ffffff";
  const popupBorder = isDark ? "#2b2b2b"                : "rgba(0,0,0,0.07)";
  const nameClr     = isDark ? "#f5f5f5"                : "#111";
  const subClr      = isDark ? "#bdbdbd"                : "#888";
  const valClr      = isDark ? "#f5f5f5"                : "#111";
  const unitClr     = isDark ? "#bdbdbd"                : "#777";
  const timeClr     = isDark ? "#bdbdbd"                : "#aaa";

  return (
    <div style={{
      position: "relative",
      borderRadius: "16px",
      overflow: "hidden",
      boxShadow: isDark ? "0 4px 24px rgba(0,0,0,0.45)" : "0 4px 24px rgba(0,0,0,0.10)",
      border: `1px solid ${borderClr}`,
    }}>
      <MapContainer
        center={[SKOPJE.lat, SKOPJE.lng]}
        zoom={12}
        style={{ height: "480px", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          key={tileUrl}
          url={tileUrl}
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
        />
        <AutoFitBounds stations={stations} />

        {stations.filter((s) => isInMacedonia(s.position.lat, s.position.lng)).map((station) => {
          const color = getColor(station.current.value, legend);
          const label = getLegendLabel(station.current.value, legend);
          const icon  = METRIC_ICONS[metric];

          // measuredAt can be null per backend model
          const timeLabel = station.current.measuredAt
            ? new Date(station.current.measuredAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : null;

          return (
            <CircleMarker
              key={station.stationId}
              center={[station.position.lat, station.position.lng]}
              radius={18}
              pathOptions={{
                color,
                weight:      2.5,
                fillColor:   color,
                fillOpacity: 0.22,
              }}
            >
              <Popup className="pulse-popup" closeButton={false}>
                <div style={{
                  fontFamily: '"Manrope Variable", Manrope, sans-serif',
                  minWidth: 175,
                  background: popupBg,
                  borderRadius: 14,
                  padding: "14px 16px",
                }}>
                  {/* Station name */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                    <div style={{
                      width: 10, height: 10, borderRadius: "50%", flexShrink: 0,
                      background: color, boxShadow: `0 0 8px ${color}`,
                    }} />
                    <span style={{ fontWeight: 700, fontSize: 15, color: nameClr }}>
                      {formatSensorName(station.stationId, station.name)}
                    </span>
                  </div>

                  {/* Value card */}
                  <div style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    background: `${color}18`, border: `1px solid ${color}33`,
                    borderRadius: 10, padding: "10px 14px", marginBottom: 8,
                  }}>
                    <div>
                      <div style={{
                        fontSize: 10, color: subClr,
                        textTransform: "uppercase", letterSpacing: "0.8px", marginBottom: 2,
                      }}>
                        {icon} Current
                      </div>
                      <div style={{ fontSize: 26, fontWeight: 800, color: valClr, lineHeight: 1.1 }}>
                        {station.current.value}
                        <span style={{ fontSize: 12, fontWeight: 400, color: unitClr, marginLeft: 3 }}>
                          {unit}
                        </span>
                      </div>
                    </div>
                    <div style={{
                      background: color, color: "#fff",
                      padding: "4px 10px", borderRadius: 100,
                      fontSize: 11, fontWeight: 700,
                    }}>
                      {label}
                    </div>
                  </div>

                  {/* Time */}
                  {timeLabel && (
                    <div style={{ fontSize: 11, color: timeClr, textAlign: "right" }}>
                      {timeLabel}
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Legend bar */}
      {legend.length > 0 && (
        <div style={{
          position: "absolute", bottom: 14, left: "50%", transform: "translateX(-50%)",
          zIndex: 1000, display: "flex", gap: 10,
          background: legendBg, backdropFilter: "blur(12px)",
          borderRadius: 100, padding: "7px 16px",
          boxShadow: "0 2px 16px rgba(0,0,0,0.18)",
          border: `1px solid ${borderClr}`, whiteSpace: "nowrap",
        }}>
          {legend.map((item) => (
            <div key={item.label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%", flexShrink: 0,
                background: item.color, boxShadow: `0 0 5px ${item.color}`,
              }} />
              <span style={{
                fontSize: 11, fontWeight: 600,
                fontFamily: '"Manrope Variable", Manrope, sans-serif',
                color: legendText,
              }}>
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}

      <style>{`
        .pulse-popup .leaflet-popup-content-wrapper {
          border-radius: 14px !important;
          box-shadow: 0 8px 32px rgba(0,0,0,0.18) !important;
          border: 1px solid ${popupBorder} !important;
          padding: 0 !important;
          background: ${popupBg} !important;
        }
        .pulse-popup .leaflet-popup-content { margin: 0 !important; }
        .pulse-popup .leaflet-popup-tip-container { display: none !important; }
      `}</style>
    </div>
  );
};