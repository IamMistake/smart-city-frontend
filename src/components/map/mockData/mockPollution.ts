import type {FeatureCollection} from "geojson";

export const mockPollution: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        { type: "Feature", properties: { level: 1, value: 25 }, geometry: { type: "Point", coordinates: [21.36, 42.01] } },
        { type: "Feature", properties: { level: 2, value: 58 }, geometry: { type: "Point", coordinates: [21.38, 41.99] } },
        { type: "Feature", properties: { level: 3, value: 95 }, geometry: { type: "Point", coordinates: [21.43, 41.99] } },
        { type: "Feature", properties: { level: 2, value: 62 }, geometry: { type: "Point", coordinates: [21.46, 41.98] } },
        { type: "Feature", properties: { level: 3, value: 110 }, geometry: { type: "Point", coordinates: [21.50, 41.99] } },
        { type: "Feature", properties: { level: 3, value: 145 }, geometry: { type: "Point", coordinates: [21.52, 42.00] } },
        { type: "Feature", properties: { level: 2, value: 70 }, geometry: { type: "Point", coordinates: [21.37, 41.96] } },
        { type: "Feature", properties: { level: 1, value: 20 }, geometry: { type: "Point", coordinates: [21.40, 41.95] } },
        { type: "Feature", properties: { level: 1, value: 30 }, geometry: { type: "Point", coordinates: [21.53, 41.97] } },
    ],
};
