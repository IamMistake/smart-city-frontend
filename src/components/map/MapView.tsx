import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { FaHandPointer } from "react-icons/fa";
import { MAP_CONFIG } from "@/utils/mapConfig.ts";
import {
	EVENT_LAYER_IDS,
	EVENT_TYPE_COLORS,
	EVENT_TYPE_LABELS,
	addEventLayer,
	ensureEventIcons,
} from "./layers/eventLayer";
import {
	POLLUTION_LAYER_IDS,
	POLLUTION_LEVEL_COLORS,
	POLLUTION_LEVEL_LABELS,
	addPollutionLayer,
	ensurePollutionIcons,
} from "./layers/pollutionLayer";
import { mockEvents } from "./mockData/mockEvents.ts";
import { mockPollution } from "./mockData/mockPollution.ts";
import { MapFilterPanel } from "./MapFilterPanel";
import { MapMarkerInfo } from "./MapMarkerInfo";
import { DEFAULT_FILTERS } from "./types";
import type {
	EventFeatureProperties,
	MapFilters,
	PollutionFeatureProperties,
	SelectedMarker,
} from "./types";

type Coordinates = {
	latitude: number;
	longitude: number;
};

type HoveredMarker =
	| {
			kind: "event";
			lngLat: [number, number];
			screenX: number;
			screenY: number;
			placement: "top" | "bottom";
			properties: EventFeatureProperties;
	  }
	| {
			kind: "pollution";
			lngLat: [number, number];
			screenX: number;
			screenY: number;
			placement: "top" | "bottom";
			properties: PollutionFeatureProperties;
	  }
	| {
			kind: "cluster";
			lngLat: [number, number];
			screenX: number;
			screenY: number;
			placement: "top" | "bottom";
			properties: Record<string, unknown>;
	  };

type HoverIntent =
	| { kind: "clear" }
	| {
			kind: "event" | "pollution" | "cluster";
			featureId?: string | number;
			lngLat: [number, number];
			properties: Record<string, unknown>;
	  };

type MapViewProps = {
	onPickCoordinates?: (coordinates: Coordinates) => void;
	selectedCoordinates?: Coordinates | null;
	showMockLayers?: boolean;
	showLayerToggles?: boolean;
	height?: string;
	enableFocusGate?: boolean;
};

const MAP_STYLE: maplibregl.StyleSpecification = {
	version: 8,
	sources: {
		positron: {
			type: "raster",
			tiles: [
				"https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
				"https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
				"https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
			],
			tileSize: 256,
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		},
	},
	layers: [{ id: "positron", type: "raster", source: "positron" }],
};

const EVENT_TOOLTIP_ICONS: Record<string, string> = {
	FIRE: "🔥",
	ACCIDENT: "🚗",
	PROTEST: "📣",
	POLLUTION: "☁",
	POLICE_ACTIVITY: "🛡",
	OTHER: "•",
};

export function MapView({
	onPickCoordinates,
	selectedCoordinates,
	showMockLayers = true,
	showLayerToggles = true,
	height,
	enableFocusGate = false,
}: MapViewProps) {
	const mapContainer = useRef<HTMLDivElement | null>(null);
	const mapFrameRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const markerRef = useRef<maplibregl.Marker | null>(null);
	const hoverTimeoutRef = useRef<number | null>(null);
	const hoveredEventIdRef = useRef<string | number | null>(null);
	const hoverIntentRef = useRef<HoverIntent>({ kind: "clear" });
	const hintTimeoutRef = useRef<number | null>(null);
	const mapFocusedRef = useRef(!enableFocusGate);
	const [mapLoaded, setMapLoaded] = useState(false);
	const [filters, setFilters] = useState<MapFilters>(DEFAULT_FILTERS);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [mapFocused, setMapFocused] = useState(!enableFocusGate);
	const [showExitHint, setShowExitHint] = useState(false);
	const [isCoarsePointer, setIsCoarsePointer] = useState(false);
	const [selectedMarker, setSelectedMarker] = useState<SelectedMarker | null>(
		null,
	);
	const [hoveredMarker, setHoveredMarker] = useState<HoveredMarker | null>(
		null,
	);

	useEffect(() => {
		mapFocusedRef.current = mapFocused;
	}, [mapFocused]);

	useEffect(() => {
		if (typeof window === "undefined") {
			return;
		}

		const mediaQuery = window.matchMedia("(pointer: coarse)");
		const updatePointer = () => setIsCoarsePointer(mediaQuery.matches);

		updatePointer();
		mediaQuery.addEventListener("change", updatePointer);

		return () => {
			mediaQuery.removeEventListener("change", updatePointer);
		};
	}, []);

	const visibleEvents = useMemo(() => {
		if (!showMockLayers || !filters.showEvents) {
			return [];
		}

		return mockEvents.features.filter((feature) => {
			const type = String(feature.properties?.type ?? "");
			return filters.activeEventTypes.includes(type as never);
		});
	}, [filters.activeEventTypes, filters.showEvents, showMockLayers]);

	const visiblePollution = useMemo(() => {
		if (!showMockLayers || !filters.showPollution) {
			return [];
		}

		return mockPollution.features.filter((feature) => {
			const level = Number(feature.properties?.level ?? 0);
			return filters.activePollutionLevels.includes(level);
		});
	}, [filters.activePollutionLevels, filters.showPollution, showMockLayers]);

	const activeIncidents = useMemo(
		() =>
			visibleEvents.filter((feature) => feature.properties?.status === "ACTIVE")
				.length,
		[visibleEvents],
	);

	const moderateZones = useMemo(
		() =>
			visiblePollution.filter((feature) => feature.properties?.level === 2)
				.length,
		[visiblePollution],
	);

	const airQualityLevel = useMemo(() => {
		if (visiblePollution.length === 0) {
			return 1;
		}

		const average =
			visiblePollution.reduce(
				(sum, feature) => sum + Number(feature.properties?.level ?? 1),
				0,
			) / visiblePollution.length;

		if (average >= 2.5) {
			return 3;
		}

		if (average >= 1.5) {
			return 2;
		}

		return 1;
	}, [visiblePollution]);

	useEffect(() => {
		if (!mapContainer.current) {
			return;
		}

		const map = new maplibregl.Map({
			container: mapContainer.current,
			style: MAP_STYLE,
			center: MAP_CONFIG.center,
			zoom: MAP_CONFIG.zoom,
		});

		mapRef.current = map;

		map.addControl(
			new maplibregl.NavigationControl({
				showCompass: false,
				visualizePitch: false,
			}),
			"bottom-right",
		);
		map.addControl(new maplibregl.ScaleControl(), "bottom-left");

		const bindHoverLayer = (layerId: string) => {
			map.on("mouseenter", layerId, (event) => {
				const feature = event.features?.[0];
				if (!feature || feature.geometry.type !== "Point") {
					return;
				}

				map.getCanvas().style.cursor = "pointer";
				const lngLat = feature.geometry.coordinates as [number, number];
				scheduleHover({
					kind: layerId === EVENT_LAYER_IDS.clusterHit ? "cluster" : "event",
					featureId: feature.id,
					lngLat,
					properties: feature.properties ?? {},
				});
			});

			map.on("mouseleave", layerId, () => {
				map.getCanvas().style.cursor = mapFocusedRef.current
					? "grab"
					: "default";
				scheduleHover({ kind: "clear" });
			});
		};

		bindHoverLayer(EVENT_LAYER_IDS.hit);
		bindHoverLayer(EVENT_LAYER_IDS.clusterHit);

		map.on("mouseenter", POLLUTION_LAYER_IDS.hit, (event) => {
			const feature = event.features?.[0];
			if (!feature || feature.geometry.type !== "Point") {
				return;
			}

			map.getCanvas().style.cursor = "pointer";
			scheduleHover({
				kind: "pollution",
				featureId: feature.id,
				lngLat: feature.geometry.coordinates as [number, number],
				properties: feature.properties ?? {},
			});
		});

		map.on("mouseleave", POLLUTION_LAYER_IDS.hit, () => {
			map.getCanvas().style.cursor = mapFocusedRef.current ? "grab" : "default";
			scheduleHover({ kind: "clear" });
		});

		map.on("click", EVENT_LAYER_IDS.clusterHit, async (event) => {
			const feature = event.features?.[0];
			const clusterId = feature?.properties?.cluster_id;
			const source = map.getSource("events") as
				| maplibregl.GeoJSONSource
				| undefined;

			if (!feature || typeof clusterId !== "number" || !source) {
				return;
			}

			if (feature.geometry.type !== "Point") {
				return;
			}

			const zoom = await source.getClusterExpansionZoom(clusterId);
			map.easeTo({
				center: feature.geometry.coordinates as [number, number],
				zoom,
				duration: 500,
			});
		});

		map.on("move", () => {
			setHoveredMarker((current) => {
				if (!current) {
					return current;
				}

				return buildHoveredMarker(
					current.kind,
					current.lngLat,
					current.properties as Record<string, unknown>,
					map,
				);
			});
		});

		map.on("load", async () => {
			await Promise.all([ensureEventIcons(map), ensurePollutionIcons(map)]);
			setMapInteractionState(map, !enableFocusGate);

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
				if (enableFocusGate && !mapFocusedRef.current) {
					return;
				}

				onPickCoordinates({
					latitude: event.lngLat.lat,
					longitude: event.lngLat.lng,
				});
			});
		}

		function scheduleHover(intent: HoverIntent) {
			hoverIntentRef.current = intent;

			if (hoverTimeoutRef.current) {
				window.clearTimeout(hoverTimeoutRef.current);
			}

			if (intent.kind === "clear") {
				if (hoveredEventIdRef.current != null) {
					map.setFeatureState(
						{ source: "events", id: hoveredEventIdRef.current },
						{ hovered: false },
					);
					hoveredEventIdRef.current = null;
				}

				setHoveredMarker(null);
				return;
			}

			if (intent.kind !== "event" && hoveredEventIdRef.current != null) {
				map.setFeatureState(
					{ source: "events", id: hoveredEventIdRef.current },
					{ hovered: false },
				);
				hoveredEventIdRef.current = null;
			}

			if (intent.kind === "event") {
				if (
					hoveredEventIdRef.current != null &&
					hoveredEventIdRef.current !== intent.featureId
				) {
					map.setFeatureState(
						{ source: "events", id: hoveredEventIdRef.current },
						{ hovered: false },
					);
				}

				if (intent.featureId != null) {
					hoveredEventIdRef.current = intent.featureId;
					map.setFeatureState(
						{ source: "events", id: intent.featureId },
						{ hovered: true },
					);
				}
			}

			hoverTimeoutRef.current = window.setTimeout(() => {
				const nextIntent = hoverIntentRef.current;
				if (nextIntent.kind === "clear") {
					return;
				}

				setHoveredMarker(
					buildHoveredMarker(
						nextIntent.kind,
						nextIntent.lngLat,
						nextIntent.properties,
						map,
					),
				);
			}, 200);
		}

		return () => {
			if (hoverTimeoutRef.current) {
				window.clearTimeout(hoverTimeoutRef.current);
			}
			if (hintTimeoutRef.current) {
				window.clearTimeout(hintTimeoutRef.current);
			}

			markerRef.current?.remove();
			markerRef.current = null;
			map.remove();
			mapRef.current = null;
			setMapLoaded(false);
		};
	}, [enableFocusGate, onPickCoordinates, showMockLayers]);

	useEffect(() => {
		if (!mapLoaded || !showMockLayers) {
			return;
		}

		const map = mapRef.current;
		if (!map) {
			return;
		}

		const eventsSource = map.getSource("events") as
			| maplibregl.GeoJSONSource
			| undefined;
		if (eventsSource) {
			eventsSource.setData({
				type: "FeatureCollection",
				features: visibleEvents,
			});
		}

		const pollutionSource = map.getSource("pollution") as
			| maplibregl.GeoJSONSource
			| undefined;
		if (pollutionSource) {
			pollutionSource.setData({
				type: "FeatureCollection",
				features: visiblePollution,
			});
		}
	}, [mapLoaded, showMockLayers, visibleEvents, visiblePollution]);

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

	useEffect(() => {
		const map = mapRef.current;
		if (!mapLoaded || !map) {
			return;
		}

		setMapInteractionState(map, mapFocused);

		if (hintTimeoutRef.current) {
			window.clearTimeout(hintTimeoutRef.current);
		}

		if (mapFocused && enableFocusGate) {
			hintTimeoutRef.current = window.setTimeout(() => {
				setShowExitHint(true);
			}, 300);
		}

		return () => {
			if (hintTimeoutRef.current) {
				window.clearTimeout(hintTimeoutRef.current);
			}
		};
	}, [enableFocusGate, mapFocused, mapLoaded]);

	useEffect(() => {
		if (!enableFocusGate || !mapFocused) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setShowExitHint(false);
				setMapFocused(false);
			}
		};

		const handleMouseDown = (event: MouseEvent) => {
			const target = event.target as Node;
			if (mapFrameRef.current?.contains(target)) {
				return;
			}

			setShowExitHint(false);
			setMapFocused(false);
		};

		document.addEventListener("keydown", handleKeyDown);
		document.addEventListener("mousedown", handleMouseDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
			document.removeEventListener("mousedown", handleMouseDown);
		};
	}, [enableFocusGate, mapFocused]);

	return (
		<Box
			ref={mapFrameRef}
			position="relative"
			h={height}
			overflow="hidden"
			className={mapFocused ? "map-frame map-frame-focused" : "map-frame"}
		>
			<Box
				ref={mapContainer}
				className="map-surface"
				h={height ?? "100%"}
				w="full"
			/>

			{enableFocusGate && (
				<Box
					position="absolute"
					inset="0"
					zIndex={10}
					bg="rgba(0,0,0,0.18)"
					opacity={mapFocused ? 0 : 1}
					transition="opacity 200ms ease"
					pointerEvents={mapFocused ? "none" : "auto"}
					display="flex"
					alignItems="center"
					justifyContent="center"
					onClick={() => {
						setShowExitHint(false);
						setMapFocused(true);
					}}
				>
					<HStack
						className="map-focus-prompt"
						gap="10px"
						bg="white"
						border="1px solid"
						borderColor="gray.200"
						borderRadius="10px"
						px="20px"
						py="12px"
						boxShadow="0 10px 24px rgba(15, 23, 42, 0.14)"
						fontSize="14px"
						fontWeight="500"
						color="gray.800"
					>
						<FaHandPointer />
						<Text>
							{isCoarsePointer ? "Tap to explore map" : "Click to explore map"}
						</Text>
					</HStack>
				</Box>
			)}

			{showLayerToggles && showMockLayers && (
				<MapFilterPanel
					filters={filters}
					onFiltersChange={setFilters}
					isOpen={drawerOpen}
					onOpen={() => setDrawerOpen(true)}
					onClose={() => setDrawerOpen(false)}
				/>
			)}

			{hoveredMarker && (
				<Box
					position="absolute"
					left={`${hoveredMarker.screenX}px`}
					top={`${hoveredMarker.screenY}px`}
					transform={
						hoveredMarker.placement === "top"
							? "translate(-50%, calc(-100% - 14px))"
							: "translate(-50%, 14px)"
					}
					zIndex={18}
					w="220px"
					bg="white"
					border="1px solid"
					borderColor="gray.200"
					borderRadius="8px"
					boxShadow="0 12px 28px rgba(15, 23, 42, 0.16)"
					p="12px"
					pointerEvents="none"
				>
					{hoveredMarker.kind === "event" && (
						<EventTooltip
							marker={hoveredMarker.properties}
							onView={() =>
								setSelectedMarker({
									kind: "event",
									lngLat: hoveredMarker.lngLat,
									...hoveredMarker.properties,
								})
							}
						/>
					)}
					{hoveredMarker.kind === "pollution" && (
						<PollutionTooltip marker={hoveredMarker.properties} />
					)}
					{hoveredMarker.kind === "cluster" && (
						<ClusterTooltip properties={hoveredMarker.properties} />
					)}
				</Box>
			)}

			{showMockLayers && selectedMarker && (
				<Box
					position="absolute"
					bottom={8}
					right={drawerOpen ? "316px" : 3}
					zIndex={18}
					maxW="320px"
					w="full"
					transition="right 240ms ease"
				>
					<MapMarkerInfo
						marker={selectedMarker}
						onClose={() => setSelectedMarker(null)}
					/>
				</Box>
			)}

			{showMockLayers && (
				<Flex
					position="absolute"
					left="50%"
					bottom="18px"
					transform="translateX(-50%)"
					zIndex={17}
					bg="rgba(0,0,0,0.55)"
					backdropFilter="blur(4px)"
					borderRadius="20px"
					px="16px"
					py="6px"
					gap="12px"
					fontSize="12px"
					color="white"
					align="center"
				>
					<StatChip
						color="#dc2626"
						label={`${activeIncidents} Active incidents`}
						onClick={() =>
							setFilters((current) => ({
								...current,
								showEvents: true,
								showPollution: false,
							}))
						}
					/>
					<Text opacity={0.55}>|</Text>
					<StatChip
						color="#facc15"
						label={`${moderateZones} Moderate zones`}
						onClick={() =>
							setFilters((current) => ({
								...current,
								showEvents: false,
								showPollution: true,
								activePollutionLevels: [2],
							}))
						}
					/>
					<Text opacity={0.55}>|</Text>
					<StatChip
						color={POLLUTION_LEVEL_COLORS[airQualityLevel]}
						label={`Air quality: ${POLLUTION_LEVEL_LABELS[airQualityLevel]}`}
						onClick={() =>
							setFilters((current) => ({
								...current,
								showEvents: false,
								showPollution: true,
								activePollutionLevels: [airQualityLevel],
							}))
						}
					/>
				</Flex>
			)}

			{enableFocusGate && (
				<Box
					position="absolute"
					left="16px"
					bottom="16px"
					zIndex={16}
					opacity={showExitHint ? 0.8 : 0}
					pointerEvents="none"
					transition="opacity 200ms ease"
				>
					<Box
						bg="white"
						border="1px solid"
						borderColor="gray.200"
						borderRadius="10px"
						px="12px"
						py="6px"
						boxShadow="0 8px 18px rgba(15, 23, 42, 0.12)"
					>
						<Text fontSize="11px" color="gray.700">
							Press Esc to exit
						</Text>
					</Box>
				</Box>
			)}
		</Box>
	);
}

function setMapInteractionState(map: maplibregl.Map, enabled: boolean) {
	const method = enabled ? "enable" : "disable";

	map.scrollZoom[method]();
	map.boxZoom[method]();
	map.dragRotate[method]();
	map.dragPan[method]();
	map.keyboard[method]();
	map.doubleClickZoom[method]();
	map.touchZoomRotate[method]();

	map.getCanvas().style.cursor = enabled ? "grab" : "default";
}

function buildHoveredMarker(
	kind: "event" | "pollution" | "cluster",
	lngLat: [number, number],
	properties: Record<string, unknown>,
	map: maplibregl.Map,
): HoveredMarker {
	const projected = map.project(lngLat);
	const container = map.getContainer().getBoundingClientRect();
	const screenX = Math.min(Math.max(projected.x, 120), container.width - 120);
	const placement = projected.y < 160 ? "bottom" : "top";

	return {
		kind,
		lngLat,
		screenX,
		screenY: projected.y,
		placement,
		properties,
	} as HoveredMarker;
}

function EventTooltip({
	marker,
	onView,
}: {
	marker: EventFeatureProperties;
	onView: () => void;
}) {
	return (
		<VStack align="stretch" gap="8px">
			<HStack gap="8px">
				<Box
					w="20px"
					h="20px"
					borderRadius="full"
					bg={EVENT_TYPE_COLORS[marker.type]}
					color="white"
					fontSize="11px"
					fontWeight="700"
					textAlign="center"
					lineHeight="20px"
				>
					{EVENT_TOOLTIP_ICONS[marker.type]}
				</Box>
				<Text fontSize="12px" color="gray.600" fontWeight="500">
					{EVENT_TYPE_LABELS[marker.type]}
				</Text>
			</HStack>
			<Text fontSize="14px" fontWeight="500" color="gray.900">
				{marker.title}
			</Text>
			{marker.description && (
				<Text fontSize="12px" color="gray.600" lineClamp={2}>
					{marker.description}
				</Text>
			)}
			<Text fontSize="12px" color="gray.500">
				{formatRelativeTime(marker.occurredAt)}
			</Text>
			<Box
				as="button"
				onClick={onView}
				fontSize="12px"
				fontWeight="500"
				color="blue.600"
				textAlign="left"
				pointerEvents="auto"
			>
				View →
			</Box>
		</VStack>
	);
}

function PollutionTooltip({ marker }: { marker: PollutionFeatureProperties }) {
	const pm25Status = resolvePollutionMetricStatus(marker.pm25 ?? 0, "pm25");
	const pm10Status = resolvePollutionMetricStatus(marker.pm10 ?? 0, "pm10");

	return (
		<VStack align="stretch" gap="10px">
			<Text fontSize="14px" fontWeight="500" color="gray.900">
				{marker.stationName}
			</Text>
			<Flex gap="10px">
				<MetricCard
					label="PM2.5"
					value={marker.pm25 ?? 0}
					status={pm25Status}
				/>
				<MetricCard label="PM10" value={marker.pm10 ?? 0} status={pm10Status} />
			</Flex>
		</VStack>
	);
}

function ClusterTooltip({
	properties,
}: {
	properties: Record<string, unknown>;
}) {
	const rows = [
		["Fire", "fireCount", "#dc2626"],
		["Accident", "accidentCount", "#f97316"],
		["Protest", "protestCount", "#facc15"],
		["Pollution", "pollutionCount", "#6b7280"],
		["Police Activity", "policeCount", "#2563eb"],
		["Other", "otherCount", "#94a3b8"],
	] as const;

	return (
		<VStack align="stretch" gap="8px">
			<Text fontSize="14px" fontWeight="500" color="gray.900">
				{String(properties.point_count ?? 0)} incidents in this area
			</Text>
			<VStack align="stretch" gap="4px">
				{rows.map(([label, key, color]) => {
					const count = Number(properties[key] ?? 0);
					if (count === 0) {
						return null;
					}

					return (
						<HStack key={key} gap="8px" fontSize="12px" color="gray.700">
							<Box w="8px" h="8px" borderRadius="full" bg={color} />
							<Text>
								{count} {label}
							</Text>
						</HStack>
					);
				})}
			</VStack>
		</VStack>
	);
}

function MetricCard({
	label,
	value,
	status,
}: {
	label: string;
	value: number;
	status: { label: string; color: string };
}) {
	return (
		<VStack
			align="stretch"
			gap="6px"
			flex="1"
			bg="gray.50"
			borderRadius="8px"
			p="8px"
		>
			<Text fontSize="11px" color="gray.500">
				{label}
			</Text>
			<Text fontSize="13px" fontWeight="600" color="gray.900">
				{value}
			</Text>
			<Box
				alignSelf="start"
				px="8px"
				py="2px"
				borderRadius="999px"
				bg={status.color}
				color="white"
				fontSize="11px"
				fontWeight="500"
			>
				{status.label}
			</Box>
		</VStack>
	);
}

function StatChip({
	color,
	label,
	onClick,
}: {
	color: string;
	label: string;
	onClick: () => void;
}) {
	return (
		<Box
			as="button"
			onClick={onClick}
			display="inline-flex"
			alignItems="center"
			gap="8px"
			cursor="pointer"
		>
			<Box w="8px" h="8px" borderRadius="full" bg={color} />
			<Text>{label}</Text>
		</Box>
	);
}

function resolvePollutionMetricStatus(value: number, metric: "pm25" | "pm10") {
	if (metric === "pm25") {
		if (value <= 15) {
			return { label: "Good", color: "#22c55e" };
		}

		if (value <= 35) {
			return { label: "Moderate", color: "#f59e0b" };
		}
	}

	if (metric === "pm10") {
		if (value <= 20) {
			return { label: "Good", color: "#22c55e" };
		}

		if (value <= 50) {
			return { label: "Moderate", color: "#f59e0b" };
		}
	}

	return { label: "High", color: "#dc2626" };
}

function formatRelativeTime(value?: string) {
	if (!value) {
		return "Recently reported";
	}

	const date = new Date(value);
	const diffMs = date.getTime() - Date.now();
	const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
	const minutes = Math.round(diffMs / (60 * 1000));

	if (Math.abs(minutes) < 60) {
		return formatter.format(minutes, "minute");
	}

	const hours = Math.round(minutes / 60);
	if (Math.abs(hours) < 24) {
		return formatter.format(hours, "hour");
	}

	const days = Math.round(hours / 24);
	return formatter.format(days, "day");
}
