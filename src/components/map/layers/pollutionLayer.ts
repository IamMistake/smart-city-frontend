import maplibregl from "maplibre-gl";
import type {FeatureCollection} from "geojson";

export function addPollutionLayer(map: maplibregl.Map, data?: FeatureCollection) {

    if (map.getSource("pollution")) {
        return;
    }

    const pollutionData: FeatureCollection =
        data ?? {
           type: "FeatureCollection",
           features: [],
    };

    map.addSource("pollution", {
        type: "geojson",
        data: pollutionData,
    });

    map.addLayer({
        id: "pollution-layer",
        type: "circle",
        source: "pollution",
        paint: {
            "circle-radius": [
                "interpolate",
                ["linear"],
                ["get", "level"],
                1, 6,
                5, 18,
            ],

            "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "level"],
                1, "#2ecc71",
                3, "#f1c40f",
                5, "#e74c3c",
            ],
            "circle-opacity": 0.4,
            "circle-blur": 0.6,
        },
    });
}