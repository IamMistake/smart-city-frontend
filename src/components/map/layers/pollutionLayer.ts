import maplibregl from "maplibre-gl";
import type {FeatureCollection} from "geojson";

export function addPollutionLayer(map: maplibregl.Map, data?: FeatureCollection) {

    if (map.getSource("pollution"))
    {
        return;
    }

    const pollutionData: FeatureCollection = data ?? {
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
                "match",
                ["get", "level"],
                1, 16,
                2, 22,
                3, 28,
                16,
            ],

            "circle-color": [
                "interpolate",
                ["linear"],
                ["get", "level"],
                1, "#132dd1",
                2, "#f3de4c",
                3, "#3ce74d"
            ],
            "circle-opacity": 0.75,
            "circle-stroke-width": 1,
            "circle-stroke-color": "#111",
            "circle-blur": 0.25
        },
    });
}