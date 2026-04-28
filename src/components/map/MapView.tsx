import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_CONFIG } from "@/utils/mapConfig.ts";
import { Box, AspectRatio, HStack, Switch } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

import { addEventLayer, removeEventLayer } from "./layers/eventLayer";
import { addPollutionLayer, removePollutionLayer } from "./layers/pollutionLayer";

import { mockEvents } from "./mockData/mockEvents.ts";
import { mockPollution } from "./mockData/mockPollution.ts";
import { getDirectionsLink } from "@/utils/getDirectionsLink";

export function MapView() {
    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    const [showEvents, setShowEvents] = useState(true);
    const [showPollution, setShowPollution] = useState(true);

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
            if (showEvents) addEventLayer(map, mockEvents);
            if (showPollution) addPollutionLayer(map, mockPollution);

            // TEST MARKER 
    const marker = new maplibregl.Marker()
        .setLngLat([21.4314, 41.9964]) 
        .addTo(map);

    marker.getElement().style.cursor = "pointer";

    marker.getElement().addEventListener("click", () => {
        window.open(
            getDirectionsLink(41.9964, 21.4314),
            "_blank"
        );
    });
            // optional UX: cursor pointer on hover (events layer)
    map.on("mouseenter", "event-layer", () => {
        map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "event-layer", () => {
        map.getCanvas().style.cursor = "";
    });

    // CLICK → Google Maps directions
    map.on("click", "event-layer", (e) => {
        const feature = e.features?.[0];
        if (!feature) return;

        const lat = Number(feature.properties.latitude);
        const lng = Number(feature.properties.longitude);

        // safety check (avoid NaN)
        if (Number.isNaN(lat) || Number.isNaN(lng)) return;

        window.open(getDirectionsLink(lat, lng), "_blank");
    });
        });

        return () => map.remove();
    }, [showEvents, showPollution]);

    // handle toggles safely
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;

        if (showEvents) {
            addEventLayer(map, mockEvents);
        } else {
            removeEventLayer(map);
        }
    }, [showEvents]);

    useEffect(() => {
        const map = mapRef.current;
        if (!map || !map.isStyleLoaded()) return;

        if (showPollution) {
            addPollutionLayer(map, mockPollution);
        } else {
            removePollutionLayer(map);
        }
    }, [showPollution]);

    return (
        <>
            <Box
                mb={3}
                p={3}
                bg="white"
                borderRadius="lg"
                boxShadow="sm"
                border="1px solid"
                borderColor="gray.200"
                _dark={{ bg: "gray.800", borderColor: "gray.600" }}
            >
                <HStack gap={6} flexWrap="wrap">
                    <Switch.Root
                        checked={showEvents}
                        onCheckedChange={(e) => setShowEvents(e.checked)}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label fontWeight="medium">🚨 Incidents</Switch.Label>
                    </Switch.Root>

                    <Switch.Root
                        checked={showPollution}
                        onCheckedChange={(e) => setShowPollution(e.checked)}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control />
                        <Switch.Label fontWeight="medium">🌫️ Pollution</Switch.Label>
                    </Switch.Root>
                </HStack>
            </Box>

            <AspectRatio ratio={16 / 9}>
                <Box ref={mapContainer} borderRadius="xl" overflow="hidden" />
            </AspectRatio>
        </>
    );
}