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

type OnPollutionClick = (
	properties: PollutionFeatureProperties,
	lngLat: [number, number],
) => void;

export function addPollutionLayer(
	map: maplibregl.Map,
	data: FeatureCollection,
	onClick?: OnPollutionClick,
) {
	if (map.getSource("pollution")) {
		return;
	}

	map.addSource("pollution", { type: "geojson", data });

	map.addLayer({
		id: "pollution-layer",
		type: "circle",
		source: "pollution",
		paint: {
			"circle-radius": ["match", ["get", "level"], 1, 16, 2, 22, 3, 28, 16],
			"circle-color": [
				"match",
				["get", "level"],
				1,
				POLLUTION_LEVEL_COLORS[1],
				2,
				POLLUTION_LEVEL_COLORS[2],
				3,
				POLLUTION_LEVEL_COLORS[3],
				"#94a3b8",
			],
			"circle-opacity": 0.6,
			"circle-stroke-width": 1,
			"circle-stroke-color": "#111",
			"circle-blur": 0.3,
		},
	});

	map.addLayer({
		id: "pollution-labels",
		type: "symbol",
		source: "pollution",
		layout: {
			"text-field": ["to-string", ["get", "value"]],
			"text-size": 12,
			"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
			"text-allow-overlap": true,
			"text-anchor": "center",
		},
		paint: {
			"text-color": "#ffffff",
			"text-halo-color": "rgba(0,0,0,0.3)",
			"text-halo-width": 1,
		},
	});

	if (!onClick) {
		return;
	}

	map.on("click", "pollution-layer", (event) => {
		const feature = event.features?.[0];
		if (!feature || feature.geometry.type !== "Point") {
			return;
		}

		const [longitude, latitude] = feature.geometry.coordinates as [
			number,
			number,
		];
		onClick(feature.properties as PollutionFeatureProperties, [
			longitude,
			latitude,
		]);
	});

	map.on("mouseenter", "pollution-layer", () => {
		map.getCanvas().style.cursor = "pointer";
	});

	map.on("mouseleave", "pollution-layer", () => {
		map.getCanvas().style.cursor = "";
	});
}

export function removePollutionLayer(map: maplibregl.Map) {
	if (map.getLayer("pollution-labels")) {
		map.removeLayer("pollution-labels");
	}
	if (map.getLayer("pollution-layer")) {
		map.removeLayer("pollution-layer");
	}
	if (map.getSource("pollution")) {
		map.removeSource("pollution");
	}
}
