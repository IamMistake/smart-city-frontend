import maplibregl from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { EventFeatureProperties } from "../types";

export const EVENT_TYPE_COLORS: Record<string, string> = {
	FIRE: "#ef4444",
	ACCIDENT: "#f97316",
	PROTEST: "#8b5cf6",
	POLLUTION: "#6b7280",
	POLICE_ACTIVITY: "#3b82f6",
	OTHER: "#94a3b8",
};

export const EVENT_TYPE_LABELS: Record<string, string> = {
	FIRE: "Fire",
	ACCIDENT: "Accident",
	PROTEST: "Protest",
	POLLUTION: "Pollution",
	POLICE_ACTIVITY: "Police Activity",
	OTHER: "Other",
};

type OnEventClick = (
	properties: EventFeatureProperties,
	lngLat: [number, number],
) => void;

export function addEventLayer(
	map: maplibregl.Map,
	data: FeatureCollection,
	onClick?: OnEventClick,
) {
	if (map.getSource("events")) {
		return;
	}

	map.addSource("events", { type: "geojson", data });

	map.addLayer({
		id: "events-layer",
		type: "circle",
		source: "events",
		paint: {
			"circle-radius": 14,
			"circle-color": [
				"match",
				["get", "type"],
				"FIRE",
				EVENT_TYPE_COLORS.FIRE,
				"ACCIDENT",
				EVENT_TYPE_COLORS.ACCIDENT,
				"PROTEST",
				EVENT_TYPE_COLORS.PROTEST,
				"POLLUTION",
				EVENT_TYPE_COLORS.POLLUTION,
				"POLICE_ACTIVITY",
				EVENT_TYPE_COLORS.POLICE_ACTIVITY,
				EVENT_TYPE_COLORS.OTHER,
			],
			"circle-opacity": 0.92,
			"circle-stroke-width": [
				"match",
				["get", "priority"],
				"CRITICAL",
				4,
				"HIGH",
				3,
				"MEDIUM",
				2,
				1,
			],
			"circle-stroke-color": "#1a1a2e",
		},
	});

	map.addLayer({
		id: "events-text",
		type: "symbol",
		source: "events",
		layout: {
			"text-field": [
				"match",
				["get", "type"],
				"FIRE",
				"F",
				"ACCIDENT",
				"A",
				"PROTEST",
				"P",
				"POLLUTION",
				"PL",
				"POLICE_ACTIVITY",
				"PO",
				"?",
			],
			"text-size": 10,
			"text-font": [
				"Noto Sans Bold",
				"Open Sans Bold",
				"Arial Unicode MS Bold",
			],
			"text-allow-overlap": true,
			"text-ignore-placement": true,
		},
		paint: {
			"text-color": "#ffffff",
		},
	});

	if (!onClick) {
		return;
	}

	map.on("click", "events-layer", (event) => {
		const feature = event.features?.[0];
		if (!feature || feature.geometry.type !== "Point") {
			return;
		}

		const [longitude, latitude] = feature.geometry.coordinates as [
			number,
			number,
		];
		onClick(feature.properties as EventFeatureProperties, [
			longitude,
			latitude,
		]);
	});

	map.on("mouseenter", "events-layer", () => {
		map.getCanvas().style.cursor = "pointer";
	});

	map.on("mouseleave", "events-layer", () => {
		map.getCanvas().style.cursor = "";
	});
}

export function removeEventLayer(map: maplibregl.Map) {
	if (map.getLayer("events-text")) {
		map.removeLayer("events-text");
	}
	if (map.getLayer("events-layer")) {
		map.removeLayer("events-layer");
	}
	if (map.getSource("events")) {
		map.removeSource("events");
	}
}
