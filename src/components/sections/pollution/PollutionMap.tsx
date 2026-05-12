import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Box, Text, useToken } from "@chakra-ui/react";
import type { FC } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { FeatureCollection } from "geojson";
import type { LegendItem, Station, PollutionMetric } from "@/models/pollution";
import { SKOPJE } from "@/constants/metrics";
import {
	getColor,
	getLegendLabel,
	formatSensorName,
	isInMacedonia,
} from "@/utils/mapUtils";

interface PollutionMapProps {
	stations?: Station[];
	legend?: LegendItem[];
	unit?: string;
	metric?: PollutionMetric;
}

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

const HEAT_SOURCE_ID = "pollution-heat-source";
const HEAT_LAYER_ID = "pollution-heatmap";

export const PollutionMap: FC<PollutionMapProps> = ({
	stations = [],
	legend = [],
	unit = "",
	metric = "pm10",
}) => {
	const mapContainerRef = useRef<HTMLDivElement | null>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const popupRef = useRef<maplibregl.Popup | null>(null);
	const markerRefs = useRef<maplibregl.Marker[]>([]);
	const [mapLoaded, setMapLoaded] = useState(false);

	const [borderClr] = useToken("colors", ["border"]);
	const [popupBg] = useToken("colors", ["bg.panel"]);
	const [valClr] = useToken("colors", ["fg"]);
	const [subClr] = useToken("colors", ["fg.muted"]);
	const [timeClr] = useToken("colors", ["fg.muted"]);

 const visibleStations = useMemo(
		() => stations.filter((station) => isInMacedonia(station.position.lat, station.position.lng)),
		[stations],
	);

	const heatmapData = useMemo<FeatureCollection>(
		() => ({
			type: "FeatureCollection",
			features: visibleStations.map((station) => ({
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [station.position.lng, station.position.lat],
				},
				properties: {
					value: station.current.value,
					stationId: station.stationId,
					stationName: station.name,
					pm25: station.current.value,
					pm10: station.current.value,
				},
			})),
		}),
		[visibleStations],
	);

	useEffect(() => {
		if (!mapContainerRef.current) {
			return;
		}

		const map = new maplibregl.Map({
			container: mapContainerRef.current,
			style: MAP_STYLE,
			center: [SKOPJE.lng, SKOPJE.lat],
			zoom: 12,
		});

		mapRef.current = map;
		popupRef.current = new maplibregl.Popup({
			closeButton: false,
			closeOnClick: true,
			maxWidth: "none",
		});

		map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-right");
		map.addControl(new maplibregl.ScaleControl(), "bottom-left");

		map.on("load", () => {
			if (!map.getSource(HEAT_SOURCE_ID)) {
				map.addSource(HEAT_SOURCE_ID, {
					type: "geojson",
					data: heatmapData,
				});

				map.addLayer(
					{
						id: HEAT_LAYER_ID,
						type: "heatmap",
						source: HEAT_SOURCE_ID,
						paint: {
							"heatmap-radius": [
								"interpolate",
								["linear"],
								["zoom"],
								9,
								80,
								13,
								160,
							],
							"heatmap-weight": [
								"interpolate",
								["linear"],
								["coalesce", ["get", "value"], 0],
								0,
								0,
								50,
								0.5,
								150,
								1,
							],
							"heatmap-intensity": [
								"interpolate",
								["linear"],
								["zoom"],
								9,
								1,
								13,
								2,
							],
							"heatmap-color": [
								"interpolate",
								["linear"],
								["heatmap-density"],
								0,
								"rgba(0, 0, 0, 0)",
								0.1,
								"rgba(80, 200, 100, 0.55)",
								0.3,
								"rgba(200, 220, 50, 0.60)",
								0.5,
								"rgba(255, 165, 0, 0.65)",
								0.7,
								"rgba(220, 60, 30, 0.70)",
								1,
								"rgba(150, 0, 50, 0.80)",
							],
							"heatmap-opacity": [
								"interpolate",
								["linear"],
								["zoom"],
								10,
								0.9,
								14,
								0.4,
							],
						},
					},
					map.getStyle().layers?.find((layer) => layer.type === "symbol")?.id,
				);
			}

			fitMapToStations(map, visibleStations);

			setMapLoaded(true);
		});

		return () => {
			markerRefs.current.forEach((marker) => marker.remove());
			markerRefs.current = [];
			popupRef.current?.remove();
			popupRef.current = null;
			map.remove();
			mapRef.current = null;
			setMapLoaded(false);
		};
	}, [heatmapData, visibleStations]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !mapLoaded) {
			return;
		}

		const heatSource = map.getSource(HEAT_SOURCE_ID) as maplibregl.GeoJSONSource | undefined;
		if (heatSource) {
			heatSource.setData(heatmapData);
		}

		fitMapToStations(map, visibleStations);
	}, [heatmapData, mapLoaded, visibleStations]);

	useEffect(() => {
		const map = mapRef.current;
		if (!map || !mapLoaded) {
			return;
		}

		markerRefs.current.forEach((marker) => marker.remove());
		markerRefs.current = visibleStations.map((station) => {
			const color = getColor(station.current.value, legend);
			const label = getLegendLabel(station.current.value, legend);
			const metricLabel = metric.toUpperCase();
			const timeLabel = station.current.measuredAt
				? new Date(station.current.measuredAt).toLocaleTimeString([], {
						hour: "2-digit",
						minute: "2-digit",
					})
				: null;

			const markerEl = document.createElement("button");
			markerEl.type = "button";
			markerEl.setAttribute("aria-label", station.name);
			markerEl.style.width = "36px";
			markerEl.style.height = "36px";
			markerEl.style.borderRadius = "999px";
			markerEl.style.border = `2px solid ${color}`;
			markerEl.style.background = `${color}22`;
			markerEl.style.boxShadow = `0 0 0 2px ${color}33`;
			markerEl.style.cursor = "pointer";
			markerEl.style.padding = "0";
			markerEl.style.outline = "none";
			markerEl.style.boxSizing = "border-box";

			const marker = new maplibregl.Marker({ element: markerEl, anchor: "center" })
				.setLngLat([station.position.lng, station.position.lat])
				.addTo(map);

			markerEl.addEventListener("click", () => {
				popupRef.current?.remove();
				popupRef.current = new maplibregl.Popup({
					closeButton: false,
					closeOnClick: true,
					maxWidth: "none",
				})
					.setLngLat([station.position.lng, station.position.lat])
					.setDOMContent(buildPopupContent({
						station,
						color,
						label,
						metricLabel,
						unit,
						timeLabel,
						popupBg,
						subClr,
						valClr,
						timeClr,
					}))
					.addTo(map);
			});

			return marker;
		});
	}, [legend, mapLoaded, metric, popupBg, subClr, timeClr, unit, valClr, visibleStations]);

	return (
		<Box
			position="relative"
			borderRadius="16px"
			overflow="hidden"
			border="1px solid"
			borderColor={borderClr}
		>
			<Box ref={mapContainerRef} h="480px" w="full" />

			<Box
				position="absolute"
				bottom="28px"
				right="10px"
				zIndex={10}
				bg="white"
				border="1px solid"
				borderColor="rgba(0,0,0,0.15)"
				borderRadius="6px"
				px="10px"
				py="6px"
			>
				<Box
					h="10px"
					w="180px"
					borderRadius="4px"
					bg="linear-gradient(to right, #50C864, #C8DC32, #FFA500, #DC3C1E, #960032)"
				/>
				<Box display="flex" justifyContent="space-between" mt="4px" fontSize="10px" color="gray.500">
					<Text>0 µg/m³</Text>
					<Text>150+ µg/m³</Text>
				</Box>
			</Box>
		</Box>
	);
};

function fitMapToStations(map: maplibregl.Map, stations: Station[]) {
	const valid = stations.filter((station) =>
		station.position.lat >= 40.8 && station.position.lat <= 42.4,
	);

	if (!valid.length) {
		return;
	}

	const bounds = valid.reduce(
		(acc, station) => acc.extend([station.position.lng, station.position.lat]),
		new maplibregl.LngLatBounds(
			[valid[0].position.lng, valid[0].position.lat],
			[valid[0].position.lng, valid[0].position.lat],
		),
	);

	map.fitBounds(bounds, {
		padding: 48,
		maxZoom: 14,
		duration: 500,
	});
}

function buildPopupContent({
	station,
	color,
	label,
	metricLabel,
	unit,
	timeLabel,
	popupBg,
	subClr,
	valClr,
	timeClr,
}: {
	station: Station;
	color: string;
	label: string;
	metricLabel: string;
	unit: string;
	timeLabel: string | null;
	popupBg: string;
	subClr: string;
	valClr: string;
	timeClr: string;
}) {
	const root = document.createElement("div");
	root.style.fontFamily = '"Manrope Variable", Manrope, sans-serif';
	root.style.minWidth = "175px";
	root.style.background = popupBg;
	root.style.borderRadius = "14px";
	root.style.padding = "14px 16px";

	root.innerHTML = `
		<div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
			<div style="width:10px;height:10px;border-radius:50%;background:${color};box-shadow:0 0 8px ${color};flex-shrink:0;"></div>
			<span style="font-weight:700;font-size:14px;">${formatSensorName(station.stationId, station.name)}</span>
		</div>
		<div style="display:flex;align-items:center;justify-content:space-between;background:${color}18;border:1px solid ${color}33;border-radius:10px;padding:10px 14px;margin-bottom:8px;">
			<div>
				<div style="font-size:10px;color:${subClr};text-transform:uppercase;letter-spacing:0.8px;margin-bottom:2px;">${metricLabel} current</div>
				<div style="font-size:26px;font-weight:800;color:${valClr};line-height:1.1;">${station.current.value}<span style="font-size:12px;font-weight:400;color:${subClr};margin-left:3px;">${unit}</span></div>
			</div>
			<div style="background:${color};color:#fff;padding:4px 10px;border-radius:100px;font-size:11px;font-weight:700;">${label}</div>
		</div>
		${timeLabel ? `<div style="font-size:11px;color:${timeClr};text-align:right;">${timeLabel}</div>` : ""}
	`;

	return root;
}
