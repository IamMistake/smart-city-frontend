import type {
	LegendItem,
	PollutionHistory,
	PollutionMetric,
	Station,
} from "@/models/pollution";
import { CHART_DIMENSIONS, METRIC_LEGENDS, MK_BBOX } from "@/constants/metrics";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import type { Action, ChartPoint, State } from "@/types/pollutionTypes";

const innerW =
	CHART_DIMENSIONS.W - CHART_DIMENSIONS.PAD.left - CHART_DIMENSIONS.PAD.right;
const innerH =
	CHART_DIMENSIONS.H - CHART_DIMENSIONS.PAD.top - CHART_DIMENSIONS.PAD.bottom;

export function getLegendForMetric(metric: PollutionMetric): LegendItem[] {
	return METRIC_LEGENDS[metric];
}

export function getColorForValue(value: number, legend: LegendItem[]): string {
	return legend.find((l) => value >= l.from && value <= l.to)?.color ?? "#888";
}

export function getLabelForValue(value: number, legend: LegendItem[]): string {
	return legend.find((l) => value >= l.from && value <= l.to)?.label ?? "—";
}

export function useIsDark() {
	return document.documentElement.dataset.theme === "dark";
}

export function AutoFitBounds({ stations }: { stations: Station[] }) {
	const map = useMap();
	const prev = useRef<number>(0);

	useEffect(() => {
		const valid = stations.filter((station) =>
			isInMacedonia(station.position.lat, station.position.lng),
		);

		if (!valid.length || valid.length === prev.current) {
			return;
		}

		prev.current = valid.length;

		const bounds = L.latLngBounds(
			valid.map((station) => [station.position.lat, station.position.lng]),
		);

		map.fitBounds(bounds, {
			padding: [48, 48],
			maxZoom: 14,
			animate: true,
		});
	}, [stations, map]);

	return null;
}

export function isInMacedonia(lat: number, lng: number) {
	return (
		lat >= MK_BBOX.latMin &&
		lat <= MK_BBOX.latMax &&
		lng >= MK_BBOX.lngMin &&
		lng <= MK_BBOX.lngMax
	);
}

export function getColor(value: number, legend: LegendItem[]) {
	return legend.find((l) => value >= l.from && value <= l.to)?.color ?? "#888";
}

export function getLegendLabel(value: number, legend: LegendItem[]) {
	return legend.find((l) => value >= l.from && value <= l.to)?.label ?? "—";
}

export function formatSensorName(stationId: string, name: string): string {
	if (name === stationId) {
		const parts = stationId.replace("sensor_dev_", "").split("_");
		return parts.length >= 2 ? `Sensor ${parts.join("-")}` : stationId;
	}

	return name;
}

export function reducer(_state: State, action: Action): State {
	switch (action.type) {
		case "FETCH_START":
			return { status: "loading", data: null, error: null };
		case "FETCH_SUCCESS":
			return { status: "success", data: action.payload, error: null };
		case "FETCH_ERROR":
			return { status: "error", data: null, error: action.payload };
	}
}

export function toX(i: number, length: number): number {
	return (i / Math.max(length - 1, 1)) * innerW;
}

export function toY(value: number, minVal: number, range: number): number {
	return innerH - ((value - minVal) / range) * innerH;
}

export function buildPoints(
	data: ChartPoint[],
	minVal: number,
	range: number,
): string {
	return data
		.map(
			(d, i) =>
				`${toX(i, data.length).toFixed(1)},${toY(
					d.value,
					minVal,
					range,
				).toFixed(1)}`,
		)
		.join(" ");
}

export function buildYTicks(
	minVal: number,
	maxVal: number,
	count = 5,
): number[] {
	const range = maxVal - minVal || 1;
	return Array.from({ length: count }, (_, i) =>
		Math.round(minVal + (range / (count - 1)) * i),
	);
}

export function buildXTicks(data: ChartPoint[], maxTicks = 5) {
	const step = Math.max(1, Math.floor(data.length / maxTicks));
	return data
		.map((d, i) => ({ i, d }))
		.filter((_, i) => i % step === 0 || i === data.length - 1);
}

export function formatTick(iso: string, windowHours: number): string {
	const date = new Date(iso);
	return windowHours <= 48
		? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
		: date.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function toChartData(history: PollutionHistory): ChartPoint[] {
	return history.series
		.filter((point) => point.value !== null)
		.map((point) => ({ at: point.at, value: point.value as number }));
}
