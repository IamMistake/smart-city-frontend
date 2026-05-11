import maplibregl from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { EventFeatureProperties } from "../types";

const expression = <T>(value: T) =>
	value as T & maplibregl.ExpressionSpecification;

export const EVENT_TYPE_COLORS: Record<string, string> = {
	FIRE: "#dc2626",
	ACCIDENT: "#f97316",
	PROTEST: "#facc15",
	POLLUTION: "#6b7280",
	POLICE_ACTIVITY: "#2563eb",
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

export const EVENT_TYPE_ICONS: Record<string, string> = {
	FIRE: "incident-icon-fire",
	ACCIDENT: "incident-icon-accident",
	PROTEST: "incident-icon-protest",
	POLLUTION: "incident-icon-pollution",
	POLICE_ACTIVITY: "incident-icon-police",
	OTHER: "incident-icon-other",
};

export const EVENT_LAYER_IDS = {
	hit: "events-hit-area",
	marker: "events-layer",
	icon: "events-icons",
	clusterHalo: "events-clusters-halo",
	cluster: "events-clusters",
	clusterCount: "events-clusters-count",
	clusterHit: "events-clusters-hit-area",
} as const;

type OnEventClick = (
	properties: EventFeatureProperties,
	lngLat: [number, number],
) => void;

const CLUSTER_SIZE = expression([
	"step",
	["get", "point_count"],
	18,
	10,
	22,
	50,
	26,
]);

const CLUSTER_COLOR = expression([
	"case",
	[">", ["coalesce", ["get", "criticalCount"], 0], 0],
	"rgba(220, 38, 38, 0.85)",
	[">", ["coalesce", ["get", "elevatedCount"], 0], 0],
	"rgba(245, 158, 11, 0.85)",
	"rgba(13, 148, 136, 0.85)",
]);

export async function ensureEventIcons(map: maplibregl.Map) {
	const icons = [
		[
			EVENT_TYPE_ICONS.FIRE,
			`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2c.8 2.1-.3 3.9-1.4 5.1C7.4 8.4 7 9.3 7 10.4 7 12.4 8.6 14 10.6 14c1.8 0 3.4-1.4 3.4-3.3 0-1.8-1-3.2-2.1-4.6-.8 1.4-2 .7-1.9-.5z" fill="#fff"/><path d="M9.8 10.2c.3.8-.1 1.5-.5 2-.4.4-.6.8-.6 1.4 0 1 .8 1.8 1.9 1.8 1 0 1.8-.8 1.8-1.8 0-1-.6-1.8-1.4-2.7-.2.7-.8.6-1.2-.7z" fill="#fff"/></svg>`,
		],
		[
			EVENT_TYPE_ICONS.ACCIDENT,
			`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5 11.5h10l-1.2-3.2A2 2 0 0 0 11.9 7H8.1a2 2 0 0 0-1.9 1.3L5 11.5z" fill="#fff"/><path d="M4.5 12.5h11a1 1 0 0 1 1 1v1h-1.5a1.5 1.5 0 0 1-3 0H8a1.5 1.5 0 0 1-3 0H3.5v-1a1 1 0 0 1 1-1z" fill="#fff"/></svg>`,
		],
		[
			EVENT_TYPE_ICONS.PROTEST,
			`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 8.2V4.5l7 1.3v4L6 8.2z" fill="#fff"/><path d="M7.3 8.3h1.5l.9 7.2H8.2L7.3 8.3z" fill="#fff"/><path d="M12.8 6.1c1 .2 1.8 1.1 1.8 2.2 0 1-.7 1.9-1.7 2.2V6.1z" fill="#fff"/></svg>`,
		],
		[
			EVENT_TYPE_ICONS.POLLUTION,
			`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6.4 12.8a2.8 2.8 0 0 1 .4-5.6 3.7 3.7 0 0 1 7-1.2 2.7 2.7 0 1 1 .6 5.3H6.4z" fill="#fff"/><path d="M5 15h10" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/><path d="M7 17h6" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`,
		],
		[
			EVENT_TYPE_ICONS.POLICE_ACTIVITY,
			`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 3l5 2v3.6c0 3.3-2.1 5.7-5 7.4-2.9-1.7-5-4.1-5-7.4V5l5-2z" fill="#fff"/><path d="M10 6.2l.8 1.7 1.9.3-1.4 1.4.3 1.9-1.6-.9-1.6.9.3-1.9-1.4-1.4 1.9-.3.8-1.7z" fill="#2563eb"/></svg>`,
		],
		[
			EVENT_TYPE_ICONS.OTHER,
			`<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="2" fill="#fff"/><circle cx="5" cy="10" r="2" fill="#fff"/><circle cx="15" cy="10" r="2" fill="#fff"/></svg>`,
		],
	] as const;

	await Promise.all(
		icons.map(async ([name, svg]) => {
			if (map.hasImage(name)) {
				return;
			}

			map.addImage(name, await loadSvgImage(svg));
		}),
	);
}

export function addEventLayer(
	map: maplibregl.Map,
	data: FeatureCollection,
	onClick?: OnEventClick,
) {
	if (map.getSource("events")) {
		return;
	}

	map.addSource("events", {
		type: "geojson",
		data,
		generateId: true,
		cluster: true,
		clusterRadius: 50,
		clusterMaxZoom: 14,
		clusterProperties: {
			criticalCount: [
				"+",
				["case", ["==", ["get", "priority"], "CRITICAL"], 1, 0],
			],
			elevatedCount: [
				"+",
				[
					"case",
					[
						"any",
						["==", ["get", "priority"], "HIGH"],
						["==", ["get", "priority"], "MEDIUM"],
					],
					1,
					0,
				],
			],
			fireCount: ["+", ["case", ["==", ["get", "type"], "FIRE"], 1, 0]],
			accidentCount: ["+", ["case", ["==", ["get", "type"], "ACCIDENT"], 1, 0]],
			protestCount: ["+", ["case", ["==", ["get", "type"], "PROTEST"], 1, 0]],
			pollutionCount: [
				"+",
				["case", ["==", ["get", "type"], "POLLUTION"], 1, 0],
			],
			policeCount: [
				"+",
				["case", ["==", ["get", "type"], "POLICE_ACTIVITY"], 1, 0],
			],
			otherCount: ["+", ["case", ["==", ["get", "type"], "OTHER"], 1, 0]],
		},
	});

	map.addLayer({
		id: EVENT_LAYER_IDS.marker,
		type: "circle",
		source: "events",
		filter: ["!", ["has", "point_count"]],
		paint: {
			"circle-radius": expression([
				"case",
				["boolean", ["feature-state", "hovered"], false],
				20.7,
				18,
			]),
			"circle-color": expression([
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
			]),
			"circle-stroke-width": 2,
			"circle-stroke-color": "#ffffff",
			"circle-opacity": 0.96,
			"circle-radius-transition": { duration: 150, delay: 0 },
		},
	});

	map.addLayer({
		id: EVENT_LAYER_IDS.icon,
		type: "symbol",
		source: "events",
		filter: ["!", ["has", "point_count"]],
		layout: {
			"icon-image": expression([
				"match",
				["get", "type"],
				"FIRE",
				EVENT_TYPE_ICONS.FIRE,
				"ACCIDENT",
				EVENT_TYPE_ICONS.ACCIDENT,
				"PROTEST",
				EVENT_TYPE_ICONS.PROTEST,
				"POLLUTION",
				EVENT_TYPE_ICONS.POLLUTION,
				"POLICE_ACTIVITY",
				EVENT_TYPE_ICONS.POLICE_ACTIVITY,
				EVENT_TYPE_ICONS.OTHER,
			]),
			"icon-size": expression([
				"case",
				["boolean", ["feature-state", "hovered"], false],
				1.15,
				1,
			]),
			"icon-allow-overlap": true,
			"icon-ignore-placement": true,
		},
		paint: {
			"icon-opacity": 1,
		},
	});

	map.addLayer({
		id: EVENT_LAYER_IDS.clusterHalo,
		type: "circle",
		source: "events",
		filter: ["has", "point_count"],
		paint: {
			"circle-radius": expression(["+", CLUSTER_SIZE, 5]),
			"circle-color": "rgba(0,0,0,0)",
			"circle-stroke-width": 1,
			"circle-stroke-color": CLUSTER_COLOR,
			"circle-stroke-opacity": 0.4,
		},
	});

	map.addLayer({
		id: EVENT_LAYER_IDS.cluster,
		type: "circle",
		source: "events",
		filter: ["has", "point_count"],
		paint: {
			"circle-radius": CLUSTER_SIZE,
			"circle-color": CLUSTER_COLOR,
			"circle-stroke-width": 2,
			"circle-stroke-color": "rgba(255,255,255,0.18)",
		},
	});

	map.addLayer({
		id: EVENT_LAYER_IDS.clusterCount,
		type: "symbol",
		source: "events",
		filter: ["has", "point_count"],
		layout: {
			"text-field": ["get", "point_count_abbreviated"],
			"text-size": 14,
			"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
			"text-allow-overlap": true,
		},
		paint: {
			"text-color": "#ffffff",
		},
	});

	map.addLayer({
		id: EVENT_LAYER_IDS.hit,
		type: "circle",
		source: "events",
		filter: ["!", ["has", "point_count"]],
		paint: {
			"circle-radius": 24,
			"circle-opacity": 0,
		},
		layout: { visibility: "visible" },
	});

	map.addLayer({
		id: EVENT_LAYER_IDS.clusterHit,
		type: "circle",
		source: "events",
		filter: ["has", "point_count"],
		paint: {
			"circle-radius": expression(["+", CLUSTER_SIZE, 6]),
			"circle-opacity": 0,
		},
	});

	if (!onClick) {
		return;
	}

	map.on("click", EVENT_LAYER_IDS.hit, (event) => {
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
}

export function removeEventLayer(map: maplibregl.Map) {
	[
		EVENT_LAYER_IDS.clusterHit,
		EVENT_LAYER_IDS.hit,
		EVENT_LAYER_IDS.clusterCount,
		EVENT_LAYER_IDS.cluster,
		EVENT_LAYER_IDS.clusterHalo,
		EVENT_LAYER_IDS.icon,
		EVENT_LAYER_IDS.marker,
	].forEach((layerId) => {
		if (map.getLayer(layerId)) {
			map.removeLayer(layerId);
		}
	});

	if (map.getSource("events")) {
		map.removeSource("events");
	}
}

async function loadSvgImage(svg: string) {
	const image = new Image();
	image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	await image.decode();
	return image;
}
