import type { FeatureCollection } from "geojson";

export const mockPollution: FeatureCollection = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			properties: {
				level: 1,
				stationName: "Rasinoec Station",
				value: 18,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.36, 42.01] },
		},
		{
			type: "Feature",
			properties: {
				level: 2,
				stationName: "Karpoš Station",
				value: 42,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.38, 41.99] },
		},
		{
			type: "Feature",
			properties: {
				level: 3,
				stationName: "Centar Station",
				value: 87,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.43, 41.99] },
		},
		{
			type: "Feature",
			properties: {
				level: 2,
				stationName: "Čair Station",
				value: 35,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.46, 41.98] },
		},
		{
			type: "Feature",
			properties: {
				level: 3,
				stationName: "Aerodrom Station",
				value: 110,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.5, 41.99] },
		},
		{
			type: "Feature",
			properties: {
				level: 3,
				stationName: "Kisela Voda Station",
				value: 95,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.52, 42.0] },
		},
		{
			type: "Feature",
			properties: {
				level: 2,
				stationName: "Butel Station",
				value: 48,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.37, 41.96] },
		},
		{
			type: "Feature",
			properties: {
				level: 1,
				stationName: "Gazi Baba Station",
				value: 12,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.4, 41.95] },
		},
		{
			type: "Feature",
			properties: {
				level: 1,
				stationName: "Saraj Station",
				value: 9,
				metric: "PM10",
			},
			geometry: { type: "Point", coordinates: [21.53, 41.97] },
		},
	],
};
