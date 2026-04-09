import type {FeatureCollection} from "geojson";

// Temporary mock data for event layer testing
export const mockEvents: FeatureCollection = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [21.43, 41.99],
            },
            properties: {
                type: "fire",
            },
        },
        {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [21.45, 41.995],
            },
            properties: {
                type: "accident",
            },
        },
    ],
};