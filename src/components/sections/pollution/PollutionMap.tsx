import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { FC } from "react";
import type { LegendItem, Station, PollutionMetric } from "@/models/pollution";
import { useToken } from "@chakra-ui/react";
import { SKOPJE, DARK_TILE, LIGHT_TILE, METRIC_ICONS } from "@/constants/metrics";
import { useIsDark, AutoFitBounds, isInMacedonia, getColor, getLegendLabel } from "@/utils/mapUtils";

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)
  ._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});


interface PollutionMapProps {
  stations?: Station[];
  legend?: LegendItem[];
  unit?: string;
  metric?: PollutionMetric;
}


export const PollutionMap: FC<PollutionMapProps> = ({
  stations = [],
  legend = [],
  unit = "",
  metric = "pm10",
}) => {
  const isDark = useIsDark();
  const tileUrl = isDark ? DARK_TILE : LIGHT_TILE;

  const [borderClr] = useToken("colors", ["border"]);
  const [legendBg] = useToken("colors", ["bg.panel"]);
  const [legendText] = useToken("colors", ["fg.muted"]);
  const [popupBg] = useToken("colors", ["bg.panel"]);
  const [valClr] = useToken("colors", ["fg"]);
  const [subClr] = useToken("colors", ["fg.muted"]);
  const [timeClr] = useToken("colors", ["fg.muted"]);

  return (
    <div
      style={{
        position: "relative",
        borderRadius: "16px",
        overflow: "hidden",
        border: `1px solid ${borderClr}`,
      }}
    >
      <MapContainer
        center={[SKOPJE.lat, SKOPJE.lng]}
        zoom={12}
        style={{ height: "480px", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer key={tileUrl} url={tileUrl} />

        <AutoFitBounds stations={stations} />

        {stations
          .filter((s) =>
            isInMacedonia(s.position.lat, s.position.lng)
          )
          .map((station) => {
            const color = getColor(
              station.current.value,
              legend
            );

            const label = getLegendLabel(
              station.current.value,
              legend
            );

            const icon = METRIC_ICONS[metric];

            const timeLabel = station.current.measuredAt
              ? new Date(
                  station.current.measuredAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null;

            return (
              <CircleMarker
                key={station.stationId}
                center={[
                  station.position.lat,
                  station.position.lng,
                ]}
                radius={18}
                pathOptions={{
                  color,
                  weight: 2.5,
                  fillColor: color,
                  fillOpacity: 0.22,
                }}
              >
                <Popup closeButton={false}>
                  <div
                    style={{
                      minWidth: 175,
                      background: popupBg,
                      borderRadius: 14,
                      padding: "14px 16px",
                    }}
                  >
                    <div
                      style={{
                        fontSize: 10,
                        color: subClr,
                        marginBottom: 4,
                      }}
                    >
                      {icon} Current
                    </div>

                    <div
                      style={{
                        fontSize: 26,
                        fontWeight: 800,
                        color: valClr,
                      }}
                    >
                      {station.current.value} {unit}
                    </div>

                    <div
                      style={{
                        fontSize: 12,
                        color: subClr,
                        marginTop: 4,
                      }}
                    >
                      {label}
                    </div>

                    {timeLabel && (
                      <div
                        style={{
                          fontSize: 11,
                          color: timeClr,
                          textAlign: "right",
                        }}
                      >
                        {timeLabel}
                      </div>
                    )}
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
      </MapContainer>

      {legend.length > 0 && (
        <div
          style={{
            position: "absolute",
            bottom: 14,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 10,
            background: legendBg,
            borderRadius: 100,
            padding: "7px 16px",
            border: `1px solid ${borderClr}`,
          }}
        >
          {legend.map((item) => (
            <div
              key={item.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: item.color,
                }}
              />
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: legendText,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};