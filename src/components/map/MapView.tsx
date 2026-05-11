import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { AspectRatio, Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
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
import type { MapFilters, SelectedMarker } from "./types";

type Coordinates = {
	latitude: number;
	longitude: number;
};

type MapViewProps = {
	onPickCoordinates?: (coordinates: Coordinates) => void;
	selectedCoordinates?: Coordinates | null;
	showMockLayers?: boolean;
	showLayerToggles?: boolean;
	height?: string;
};

export function MapView({
	onPickCoordinates,
	selectedCoordinates,
	showMockLayers = true,
	showLayerToggles = true,
	height,
}: MapViewProps) {
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const markerRef = useRef<maplibregl.Marker | null>(null);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
	const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(
		null,
	);

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
		if (onPickCoordinates) {
			map.getCanvas().style.cursor = "crosshair";
		}
		map.addControl(new maplibregl.NavigationControl(), "top-left");
		map.addControl(new maplibregl.ScaleControl(), "bottom-left");

		map.on("load", () => {
			if (showMockLayers) {
				addEventLayer(map, mockEvents, (properties, lngLat) => {
					setSelectedMarker({ kind: "event", lngLat, ...properties });
				});

				addPollutionLayer(map, mockPollution, (properties, lngLat) => {
					setSelectedMarker({ kind: "pollution", lngLat, ...properties });
				});
			}

			setMapLoaded(true);
		});

		if (onPickCoordinates) {
			map.on("click", (event) => {
				onPickCoordinates({
					latitude: event.lngLat.lat,
					longitude: event.lngLat.lng,
				});
			});
		}

		return () => {
			markerRef.current?.remove();
			markerRef.current = null;
			map.remove();
			mapRef.current = null;
			setMapLoaded(false);
		};
	}, [onPickCoordinates, showMockLayers]);

	useEffect(() => {
		if (!mapLoaded || !showMockLayers) {
			return;
		}

		const map = mapRef.current;
		if (!map) {
			return;
		}

		if (map.getLayer("events-layer")) {
			const visibility = filters.showEvents ? "visible" : "none";
			map.setLayoutProperty("events-layer", "visibility", visibility);
			if (map.getLayer("events-text")) {
				map.setLayoutProperty("events-text", "visibility", visibility);
			}
		}

		if (map.getLayer("pollution-layer")) {
			const visibility = filters.showPollution ? "visible" : "none";
			map.setLayoutProperty("pollution-layer", "visibility", visibility);
			if (map.getLayer("pollution-labels")) {
				map.setLayoutProperty("pollution-labels", "visibility", visibility);
			}
		}

		if (map.getLayer("events-layer")) {
			const activeTypes = filters.activeEventTypes;
			let eventFilter: unknown;

			if (activeTypes.length === 0) {
				eventFilter = ["boolean", false];
			} else if (activeTypes.length === ALL_INCIDENT_TYPES.length) {
				eventFilter = null;
			} else {
				eventFilter = ["in", ["get", "type"], ["literal", activeTypes]];
			}

			map.setFilter(
				"events-layer",
				eventFilter as maplibregl.FilterSpecification | null,
			);
			if (map.getLayer("events-text")) {
				map.setFilter(
					"events-text",
					eventFilter as maplibregl.FilterSpecification | null,
				);
			}
		}

		if (map.getLayer("pollution-layer")) {
			const activeLevels = filters.activePollutionLevels;
			let pollutionFilter: unknown;

			if (activeLevels.length === 0) {
				pollutionFilter = ["boolean", false];
			} else if (activeLevels.length === ALL_POLLUTION_LEVELS.length) {
				pollutionFilter = null;
			} else {
				pollutionFilter = ["in", ["get", "level"], ["literal", activeLevels]];
			}

			map.setFilter(
				"pollution-layer",
				pollutionFilter as maplibregl.FilterSpecification | null,
			);
			if (map.getLayer("pollution-labels")) {
				map.setFilter(
					"pollution-labels",
					pollutionFilter as maplibregl.FilterSpecification | null,
				);
			}
		}
	}, [filters, mapLoaded, showMockLayers]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map) {
			return;
		}

		if (!selectedCoordinates) {
			markerRef.current?.remove();
			markerRef.current = null;
			return;
		}

		const lngLat: [number, number] = [
			selectedCoordinates.longitude,
			selectedCoordinates.latitude,
		];

		if (!markerRef.current) {
			markerRef.current = new maplibregl.Marker().setLngLat(lngLat).addTo(map);
		} else {
			markerRef.current.setLngLat(lngLat);
		}
	}, [selectedCoordinates]);

	return (
		<Box position="relative">
			{height ? (
				<Box
					ref={mapContainer}
					borderRadius="xl"
					overflow="hidden"
					h={height}
				/>
			) : (
				<AspectRatio ratio={16 / 9}>
					<Box ref={mapContainer} borderRadius="xl" overflow="hidden" />
				</AspectRatio>
			)}

			{showLayerToggles && showMockLayers && (
				<Box position="absolute" top={3} right={3} zIndex={10}>
					<MapFilterPanel filters={filters} onFiltersChange={setFilters} />
				</Box>
			)}

			{showMockLayers && selectedMarker && (
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
