import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { MAP_CONFIG } from "@/utils/mapConfig.ts";
import { Box, AspectRatio, HStack, Switch } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { addEventLayer, removeEventLayer } from "./layers/eventLayer";
import {
	addPollutionLayer,
	removePollutionLayer,
} from "./layers/pollutionLayer";

import { mockEvents } from "./mockData/mockEvents.ts";
import { mockPollution } from "./mockData/mockPollution.ts";
import { getDirectionsLink } from "@/utils/getDirectionsLink";

function syncLayers(
	map: maplibregl.Map,
	{
		showEvents,
		showPollution,
	}: {
		showEvents: boolean;
		showPollution: boolean;
	},
) {
	if (showEvents) {
		addEventLayer(map, mockEvents);
	} else {
		removeEventLayer(map);
	}

	if (showPollution) {
		addPollutionLayer(map, mockPollution);
	} else {
		removePollutionLayer(map);
	}
}

export function MapView() {
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const styleLoadedRef = useRef(false);

	const [showEvents, setShowEvents] = useState(true);
	const [showPollution, setShowPollution] = useState(true);

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
			styleLoadedRef.current = true;
			syncLayers(map, { showEvents: true, showPollution: true });
		});

		map.on("mousemove", (event) => {
			if (!map.getLayer("events-layer")) {
				map.getCanvas().style.cursor = "";
				return;
			}

			const hasEventFeature =
				map.queryRenderedFeatures(event.point, {
					layers: ["events-layer"],
				}).length > 0;

			map.getCanvas().style.cursor = hasEventFeature ? "pointer" : "";
		});

		map.on("click", (event) => {
			if (!map.getLayer("events-layer")) {
				return;
			}

			const feature = map.queryRenderedFeatures(event.point, {
				layers: ["events-layer"],
			})[0];

			if (!feature || feature.geometry.type !== "Point") {
				return;
			}

			const [longitude, latitude] = feature.geometry.coordinates as [
				number,
				number,
			];

			window.open(
				getDirectionsLink(latitude, longitude),
				"_blank",
				"noopener,noreferrer",
			);
		});

		return () => {
			styleLoadedRef.current = false;
			mapRef.current = null;
			map.remove();
		};
	}, []);

	useEffect(() => {
		const map = mapRef.current;

		if (!map || !styleLoadedRef.current) {
			return;
		}

		syncLayers(map, { showEvents, showPollution });
	}, [showEvents, showPollution]);

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
