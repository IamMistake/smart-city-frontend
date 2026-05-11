import maplibregl from "maplibre-gl";
import type { FeatureCollection } from "geojson";
import type { PollutionFeatureProperties } from "../types";

export const POLLUTION_LEVEL_COLORS: Record<number, string> = {
	1: "#22c55e",
	2: "#f59e0b",
	3: "#dc2626",
};

export const POLLUTION_LEVEL_LABELS: Record<number, string> = {
	1: "Low",
	2: "Moderate",
	3: "High",
};

export const POLLUTION_LAYER_IDS = {
	hit: "pollution-hit-area",
	badge: "pollution-layer",
	labels: "pollution-labels",
} as const;

type OnPollutionClick = (
	properties: PollutionFeatureProperties,
	lngLat: [number, number],
) => void;

export async function ensurePollutionIcons(map: maplibregl.Map) {
	const icons = Object.entries(POLLUTION_LEVEL_COLORS).map(([level, color]) => [
		`pollution-badge-${level}`,
		`<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="1" y="1" width="26" height="26" rx="8" fill="${color}"/><rect x="1" y="1" width="26" height="26" rx="8" stroke="rgba(255,255,255,0.88)" stroke-width="2"/></svg>`,
	]);

	await Promise.all(
		icons.map(async ([name, svg]) => {
			if (map.hasImage(name)) {
				return;
			}

			map.addImage(name, await loadSvgImage(svg));
		}),
	);
}

export function addPollutionLayer(
	map: maplibregl.Map,
	data: FeatureCollection,
	onClick?: OnPollutionClick,
) {
	if (map.getSource("pollution")) {
		return;
	}

	map.addSource("pollution", { type: "geojson", data, generateId: true });

	map.addLayer({
		id: POLLUTION_LAYER_IDS.badge,
		type: "symbol",
		source: "pollution",
		layout: {
			"icon-image": [
				"match",
				["get", "level"],
				1,
				"pollution-badge-1",
				2,
				"pollution-badge-2",
				3,
				"pollution-badge-3",
				"pollution-badge-1",
			],
			"icon-size": 1,
			"icon-allow-overlap": true,
			"icon-ignore-placement": true,
		},
	});

	map.addLayer({
		id: POLLUTION_LAYER_IDS.labels,
		type: "symbol",
		source: "pollution",
		layout: {
			"text-field": ["to-string", ["coalesce", ["get", "value"], 0]],
			"text-size": 11,
			"text-font": ["Open Sans Bold", "Arial Unicode MS Bold"],
			"text-allow-overlap": true,
			"text-ignore-placement": true,
		},
		paint: {
			"text-color": "#ffffff",
		},
	});

	map.addLayer({
		id: POLLUTION_LAYER_IDS.hit,
		type: "circle",
		source: "pollution",
		paint: {
			"circle-radius": 18,
			"circle-opacity": 0,
		},
	});

	if (!onClick) {
		return;
	}

	map.on("click", POLLUTION_LAYER_IDS.hit, (event) => {
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
}

export function removePollutionLayer(map: maplibregl.Map) {
	[
		POLLUTION_LAYER_IDS.hit,
		POLLUTION_LAYER_IDS.labels,
		POLLUTION_LAYER_IDS.badge,
	].forEach((layerId) => {
		if (map.getLayer(layerId)) {
			map.removeLayer(layerId);
		}
	});

	if (map.getSource("pollution")) {
		map.removeSource("pollution");
	}
}

async function loadSvgImage(svg: string) {
	const image = new Image();
	image.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
	await image.decode();
	return image;
}
