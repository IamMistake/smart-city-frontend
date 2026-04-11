import maplibregl from "maplibre-gl";
import type {FeatureCollection} from "geojson";

export function addEventLayer(map: maplibregl.Map, data?: FeatureCollection) {

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
            "circle-radius": 18,
            "circle-color": [
                "match",
                ["get", "type"],
                "Fire", "#ff3b30",
                "Accident", "#ff9500",
                "#4a90e2",
            ],
            "circle-opacity": 1,
            "circle-stroke-width": 3,
            "circle-stroke-color": "#000000",
        },
    });

    map.on("click", "events-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature || feature.geometry.type !== "Point")
        {
            return;
        }

        const [lng, lat] = feature.geometry.coordinates;
        const type = feature.properties?.type ?? "Unknown";

        new maplibregl.Popup()
            .setLngLat([lng, lat])
            .setHTML(` 
                    <strong>Event Type:</strong> ${type}
                    <br/>
                    <strong>Coordinates:</strong> ${lng.toFixed(3)}, ${lat.toFixed(3)}
            `).addTo(map);
    });
}