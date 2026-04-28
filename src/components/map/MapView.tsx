import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { AspectRatio, Box } from "@chakra-ui/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MAP_CONFIG } from "@/utils/mapConfig.ts";
import { addEventLayer } from "./layers/eventLayer";
import { addPollutionLayer } from "./layers/pollutionLayer";
import { mockEvents } from "./mockData/mockEvents.ts";
import { mockPollution } from "./mockData/mockPollution.ts";
import { MapFilterPanel } from "./MapFilterPanel";
import { MapMarkerInfo } from "./MapMarkerInfo";
import {
    ALL_INCIDENT_TYPES,
    ALL_POLLUTION_LEVELS,
    DEFAULT_FILTERS,
} from "./types";
import type {
    EventFeatureProperties,
    MapFilters,
    PollutionFeatureProperties,
    SelectedMarker,
} from "./types";

export function MapView() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);
    const [mapLoaded, setMapLoaded] = useState(false);
    const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
    const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(null);

    const handleEventClick = useCallback(
        (props: EventFeatureProperties, lngLat: [number, number]) => {
            setSelectedMarker({ kind: "event", lngLat, ...props });
        },
        [],
    );

    const handlePollutionClick = useCallback(
        (props: PollutionFeatureProperties, lngLat: [number, number]) => {
            setSelectedMarker({ kind: "pollution", lngLat, ...props });
        },
        [],
    );

    // Initialize map once on mount
    useEffect(() => {
        if (!mapContainer.current) return;

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://tiles.openfreemap.org/styles/liberty",
            center: MAP_CONFIG.center,
            zoom: MAP_CONFIG.zoom,
        });

        mapRef.current = map;

        map.addControl(new maplibregl.NavigationControl(), "top-left");
        map.addControl(new maplibregl.ScaleControl(), "bottom-left");

        map.on("load", () => {
            addEventLayer(map, mockEvents, handleEventClick);
            addPollutionLayer(map, mockPollution, handlePollutionClick);
            setMapLoaded(true);
        });

        return () => {
            map.remove();
            mapRef.current = null;
        };
    }, [handleEventClick, handlePollutionClick]);

    // Apply filter changes to MapLibre after the map is ready
    useEffect(() => {
        if (!mapLoaded) return;
        const map = mapRef.current;
        if (!map) return;

        // Layer-level visibility toggles
        if (map.getLayer("events-layer")) {
            const vis = filters.showEvents ? "visible" : "none";
            map.setLayoutProperty("events-layer", "visibility", vis);
            if (map.getLayer("events-text")) {
                map.setLayoutProperty("events-text", "visibility", vis);
            }
        }
        if (map.getLayer("pollution-layer")) {
            map.setLayoutProperty(
                "pollution-layer",
                "visibility",
                filters.showPollution ? "visible" : "none",
            );
        }

        // Event type filter expression
        if (map.getLayer("events-layer")) {
            const active = filters.activeEventTypes;
            let eventFilter: unknown;
            if (active.length === 0) {
                eventFilter = ["boolean", false];
            } else if (active.length === ALL_INCIDENT_TYPES.length) {
                eventFilter = null; // null removes the filter – show all
            } else {
                eventFilter = ["in", ["get", "type"], ["literal", active]];
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.setFilter("events-layer", eventFilter as any);
            if (map.getLayer("events-text")) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                map.setFilter("events-text", eventFilter as any);
            }
        }

        // Pollution level filter expression
        if (map.getLayer("pollution-layer")) {
            const active = filters.activePollutionLevels;
            let pollutionFilter: unknown;
            if (active.length === 0) {
                pollutionFilter = ["boolean", false];
            } else if (active.length === ALL_POLLUTION_LEVELS.length) {
                pollutionFilter = null;
            } else {
                pollutionFilter = ["in", ["get", "level"], ["literal", active]];
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            map.setFilter("pollution-layer", pollutionFilter as any);
        }
    }, [filters, mapLoaded]);

    return (
        <Box position="relative">
            <AspectRatio ratio={16 / 9}>
                <Box ref={mapContainer} borderRadius="xl" overflow="hidden" />
            </AspectRatio>

            {/* Filter panel – top-right overlay */}
            <Box
                position="absolute"
                top={3}
                right={3}
                zIndex={10}
            >
                <MapFilterPanel filters={filters} onFiltersChange={setFilters} />
            </Box>

            {/* Marker info panel – bottom-right overlay */}
            {selectedMarker && (
                <Box
                    position="absolute"
                    bottom={8}
                    right={3}
                    zIndex={10}
                    maxW="320px"
                    w="full"
                >
                    <MapMarkerInfo
                        marker={selectedMarker}
                        onClose={() => setSelectedMarker(null)}
                    />
                </Box>
            )}
        </Box>
    );
}
