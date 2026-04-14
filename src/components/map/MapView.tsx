import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import {MAP_CONFIG} from "@/utils/mapConfig.ts";
import { Box, AspectRatio } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { addEventLayer } from "./layers/eventLayer";
import { addPollutionLayer } from "./layers/pollutionLayer";

import { mockEvents } from "./mockData/mockEvents.ts";
import { mockPollution } from "./mockData/mockPollution.ts";

export function MapView() {

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<maplibregl.Map | null>(null);

    useEffect(() => {
        if (!mapContainer.current) {
            return;
        }

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
            addEventLayer(map, mockEvents);
            addPollutionLayer(map, mockPollution);
        })

        return () => map.remove();
    }, []);

    return (
        <AspectRatio ratio={16 / 9}>
            <Box
                ref={mapContainer}
                borderRadius="xl"
                overflow="hidden"/>
        </AspectRatio>
    )

}
