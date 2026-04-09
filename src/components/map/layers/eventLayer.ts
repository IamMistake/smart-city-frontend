import maplibregl from "maplibre-gl";
import type {FeatureCollection} from "geojson";

export function addEventLayer(map: maplibregl.Map, data? : FeatureCollection) {

    if (map.getSource("events")) {
        return;
    }

    const eventData: FeatureCollection =
        data ?? {
            type: "FeatureCollection",
            features: [],
    };

    map.addSource("events", {
        type: "geojson",
        data: eventData,
    });

    map.addLayer({
        id: "events-layer",
        type: "circle",
        source: "events",
        paint: {
            "circle-radius": 8,
            "circle-color": [
                "match",
                ["get", "type"],
                "fire", "#ff3b30",
                "accident", "#ff9500",
                "#007aff"
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff",
        },
    });
}