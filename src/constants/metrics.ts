import type { LegendItem, PollutionMetric } from "@/models/pollution";

export const METRIC_LEGENDS: Record<PollutionMetric, LegendItem[]> = {
	pm10: [
		{ from: 0, to: 25, color: "#1FA34A", label: "Good" },
		{ from: 26, to: 50, color: "#A3C73A", label: "Fair" },
		{ from: 51, to: 100, color: "#F4C430", label: "Moderate" },
		{ from: 101, to: 200, color: "#D94841", label: "Poor" },
	],
	pm25: [
		{ from: 0, to: 10, color: "#1FA34A", label: "Good" },
		{ from: 11, to: 25, color: "#A3C73A", label: "Fair" },
		{ from: 26, to: 50, color: "#F4C430", label: "Moderate" },
		{ from: 51, to: 100, color: "#D94841", label: "Poor" },
	],
	pm1: [
		{ from: 0, to: 10, color: "#1FA34A", label: "Good" },
		{ from: 11, to: 20, color: "#A3C73A", label: "Fair" },
		{ from: 21, to: 40, color: "#F4C430", label: "Moderate" },
		{ from: 41, to: 100, color: "#D94841", label: "Poor" },
	],
	no2: [
		{ from: 0, to: 40, color: "#1FA34A", label: "Good" },
		{ from: 41, to: 100, color: "#A3C73A", label: "Fair" },
		{ from: 101, to: 200, color: "#F4C430", label: "Moderate" },
		{ from: 201, to: 400, color: "#D94841", label: "Poor" },
	],
	o3: [
		{ from: 0, to: 60, color: "#1FA34A", label: "Good" },
		{ from: 61, to: 100, color: "#A3C73A", label: "Fair" },
		{ from: 101, to: 140, color: "#F4C430", label: "Moderate" },
		{ from: 141, to: 240, color: "#D94841", label: "Poor" },
	],
	temperature: [
		{ from: -20, to: 0, color: "#5B9BD5", label: "Cold" },
		{ from: 1, to: 10, color: "#A3C73A", label: "Cool" },
		{ from: 11, to: 25, color: "#1FA34A", label: "Comfortable" },
		{ from: 26, to: 35, color: "#F4C430", label: "Warm" },
		{ from: 36, to: 50, color: "#D94841", label: "Hot" },
	],
	humidity: [
		{ from: 0, to: 25, color: "#D94841", label: "Dry" },
		{ from: 26, to: 45, color: "#A3C73A", label: "Low" },
		{ from: 46, to: 65, color: "#1FA34A", label: "Optimal" },
		{ from: 66, to: 80, color: "#A3C73A", label: "High" },
		{ from: 81, to: 100, color: "#5B9BD5", label: "Humid" },
	],
	pressure: [
		{ from: 0, to: 1000, color: "#D94841", label: "Low" },
		{ from: 1001, to: 1013, color: "#A3C73A", label: "Normal" },
		{ from: 1014, to: 1022, color: "#1FA34A", label: "High" },
		{ from: 1023, to: 1050, color: "#F4C430", label: "Very High" },
	],
	noise_dba: [
		{ from: 0, to: 40, color: "#1FA34A", label: "Quiet" },
		{ from: 41, to: 55, color: "#A3C73A", label: "Moderate" },
		{ from: 56, to: 70, color: "#F4C430", label: "Loud" },
		{ from: 71, to: 150, color: "#D94841", label: "Very Loud" },
	],
};

export const METRICS: { key: PollutionMetric; label: string; icon: string }[] =
	[
		{ key: "pm10", label: "PM10", icon: "💨" },
		{ key: "pm25", label: "PM2.5", icon: "🌫️" },
		{ key: "pm1", label: "PM1", icon: "🔬" },
		{ key: "no2", label: "NO₂", icon: "🏭" },
		{ key: "o3", label: "O₃", icon: "☁️" },
		{ key: "temperature", label: "Temperature", icon: "🌡️" },
		{ key: "humidity", label: "Humidity", icon: "💧" },
		{ key: "pressure", label: "Pressure", icon: "🔵" },
		{ key: "noise_dba", label: "Noise", icon: "🔊" },
	];
export const CITY = "Skopje";

export const MK_BBOX = {
	latMin: 40.8,
	latMax: 42.4,
	lngMin: 20.4,
	lngMax: 23.1,
};

export const METRIC_ICONS: Record<PollutionMetric, string> = {
	pm10: "💨",
	pm25: "🌫️",
	pm1: "🔬",
	no2: "🏭",
	o3: "☁️",
	temperature: "🌡️",
	humidity: "💧",
	pressure: "🔵",
	noise_dba: "🔊",
};

export const SKOPJE = { lat: 41.9981, lng: 21.4254 };

export const DARK_TILE =
	"https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png";

export const LIGHT_TILE =
	"https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png";
