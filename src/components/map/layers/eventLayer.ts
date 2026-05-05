import maplibregl from "maplibre-gl";
import type { FeatureCollection } from "geojson";

export function addEventLayer(map: maplibregl.Map, data?: FeatureCollection) {
	if (map.getSource("events")) return;

	const eventData: FeatureCollection = data ?? {
		type: "FeatureCollection",
		features: [],
	};

	map.addSource("events", {
		type: "geojson",
		data: eventData,
	});

	map
		.loadImage("https://cdn-icons-png.flaticon.com/32/684/684908.png")
		.then((image) => {
			if (!map.hasImage("event-pin")) {
				map.addImage("event-pin", image.data);
			}

			map.addLayer({
				id: "events-layer",
				type: "symbol",
				source: "events",
				layout: {
					"icon-image": "event-pin",
					"icon-size": 0.8,
					"icon-allow-overlap": true,
					"icon-anchor": "bottom",
				},
			});
		})
		.catch(() => {
			// fallback ако сликата не се вчита
			map.addLayer({
				id: "events-layer",
				type: "circle",
				source: "events",
				paint: {
					"circle-radius": 10,
					"circle-color": "#e53e3e",
					"circle-stroke-width": 2,
					"circle-stroke-color": "#fff",
				},
			});
		});
}

export function removeEventLayer(map: maplibregl.Map) {
	if (map.getLayer("events-layer")) map.removeLayer("events-layer");
	if (map.getSource("events")) map.removeSource("events");
	if (map.hasImage("event-pin")) map.removeImage("event-pin");
}
