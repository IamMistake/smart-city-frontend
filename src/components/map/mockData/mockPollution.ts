import type {FeatureCollection} from "geojson";

// Temporary mock data for pollution layer testing
export const mockPollution: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [21.41, 41.98],
            },
            properties: {
                level: 1,
            },
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [21.47, 41.99],
            },
            properties: {
                level: 3,
            },
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [21.44, 41.97],
            },
            properties: {
                level: 5,
            },
        },
    ],
};