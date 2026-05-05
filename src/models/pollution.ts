export type PollutionMetric =
	| "pm10"
	| "pm25"
	| "pm1"
	| "no2"
	| "o3"
	| "temperature"
	| "humidity"
	| "pressure"
	| "noise_dba";

export interface LegendItem {
	from: number;
	to: number;
	color: string;
	label: string;
}

export interface Station {
	stationId: string;
	name: string;
	position: { lat: number; lng: number };
	isConfirmed: boolean;
	isActive: boolean;
	current: {
		value: number;
		measuredAt: string | null;
	};
	last24h: { at: string; value: number }[];
}

export interface PollutionCoverage {
	mode: "multi-station" | "single-station";
	activeStationCount: number;
	interpolationEnabled: boolean;
}

export interface PollutionError {
	code: string;
	message: string;
	retryable: boolean;
}

export interface PollutionData {
	source: string;
	city: string;
	metric: PollutionMetric;
	unit: string;
	fetchedAt: string;
	stale: boolean;
	summary: {
		cityValue: number | null;
		statusText: string;
		scaleMin: number;
		scaleMax: number;
	};
	coverage: PollutionCoverage;
	legend: LegendItem[];
	stations: Station[];
	errors: PollutionError[];
}

// ── History ────────────────────────────────────────────────────────────────────

export interface HistoryPoint {
	at: string;
	value: number | null;
}

export interface PollutionHistory {
	source: string;
	city: string;
	metric: PollutionMetric;
	unit: string;
	sensorId: string | null;
	from: string;
	to: string;
	bucketMinutes: number;
	fetchedAt: string;
	stale: boolean;
	series: HistoryPoint[];
	errors: PollutionError[];
}
