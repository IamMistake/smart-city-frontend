import maplibregl from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { PollutionFeatureProperties } from "../types";

export const POLLUTION_LEVEL_COLORS: Record<number, string> = {
    1: "#22c55e",
    2: "#eab308",
    3: "#ef4444",
};

export const POLLUTION_LEVEL_LABELS: Record<number, string> = {
    1: "Low",
    2: "Moderate",
    3: "High",
};

type OnPollutionClick = (props: PollutionFeatureProperties, lngLat: [number, number]) => void;

export function addPollutionLayer(
    map: maplibregl.Map,
    data: FeatureCollection,
    onClick?: OnPollutionClick,
) {
    if (map.getSource("pollution")) return;

    map.addSource("pollution", { type: "geojson", data });

    map.addLayer({
        id: "pollution-layer",
        type: "circle",
        source: "pollution",
        paint: {
            "circle-radius": [
                "match",
                ["get", "level"],
                1, 16,
                2, 22,
                3, 28,
                16,
            ],
            "circle-color": [
                "match",
                ["get", "level"],
                1, POLLUTION_LEVEL_COLORS[1],
                2, POLLUTION_LEVEL_COLORS[2],
                3, POLLUTION_LEVEL_COLORS[3],
                "#94a3b8",
            ],
            "circle-opacity": 0.6,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#111",
            "circle-blur": 0.3,
        },
    });

    if (!onClick) return;

    map.on("click", "pollution-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point") return;

        const [lng, lat] = feature.geometry.coordinates as [number, number];
        onClick(feature.properties as PollutionFeatureProperties, [lng, lat]);
    });

    map.on("mouseenter", "pollution-layer", () => {
        map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "pollution-layer", () => {
        map.getCanvas().style.cursor = "";
    });
}
