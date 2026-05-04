import type { LegendItem, PollutionMetric, Station } from "@/models/pollution";
import { METRIC_LEGENDS, MK_BBOX } from "@/constants/metrics";
import { useEffect, useRef } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import type { State, Action } from "@/types/pollutionTypes";

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
		const valid = stations.filter((s) =>
			isInMacedonia(s.position.lat, s.position.lng),
		);

		if (!valid.length) return;
		if (valid.length === prev.current) return;

		prev.current = valid.length;

		const bounds = L.latLngBounds(
			valid.map((s) => [s.position.lat, s.position.lng]),
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
