import type { FeatureCollection } from "geojson";

// Temporary mock data for event layer testing
export const mockEvents: FeatureCollection = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.38, 42.02] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.39, 42.01] },
		},
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.43, 42.03] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.46, 42.02] },
		},
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.52, 42.02] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.53, 42.0] },
		},
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.34, 41.99] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.35, 41.97] },
		},
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.43, 41.99] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.44, 41.98] },
		},
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.5, 41.99] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.51, 41.97] },
		},
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.37, 41.95] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.38, 41.96] },
		},
		{
			type: "Feature",
			properties: { type: "Fire" },
			geometry: { type: "Point", coordinates: [21.52, 41.95] },
		},
		{
			type: "Feature",
			properties: { type: "Accident" },
			geometry: { type: "Point", coordinates: [21.54, 41.96] },
		},
	],
};
