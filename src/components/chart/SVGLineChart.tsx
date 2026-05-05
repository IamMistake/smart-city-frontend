import { Box, HStack, Text } from "@chakra-ui/react";
import type { LegendItem } from "@/models/pollution";
import type { ChartPoint } from "@/types/pollutionTypes";
import { CHART_DIMENSIONS } from "@/constants/metrics";
import {
	toX,
	toY,
	buildPoints,
	buildYTicks,
	buildXTicks,
	formatTick,
	getColorForValue,
} from "@/utils/mapUtils";

const { W, H, PAD } = CHART_DIMENSIONS;
const innerW = W - PAD.left - PAD.right;
const innerH = H - PAD.top - PAD.bottom;

interface SVGLineChartProps {
	data: ChartPoint[];
	unit: string;
	legend: LegendItem[];
	windowHours: number;
}

export function SVGLineChart({
	data,
	unit,
	legend,
	windowHours,
}: SVGLineChartProps) {
	const values = data.map((d) => d.value);

	const minVal = Math.floor(Math.min(...values));
	const maxVal = Math.ceil(Math.max(...values));
	const range = maxVal - minVal || 1;

	const points = buildPoints(data, minVal, range);
	const yTicks = buildYTicks(minVal, maxVal);
	const xTicks = buildXTicks(data);

	const lineColor = "var(--chakra-colors-accent-500)";
	const gridColor = "var(--chakra-colors-border)";
	const textColor = "var(--chakra-colors-fg-muted)";

	return (
		<Box position="relative" w="100%">
			<svg
				viewBox={`0 0 ${W} ${H}`}
				style={{ width: "100%", display: "block" }}
				preserveAspectRatio="xMidYMid meet"
			>
				<g transform={`translate(${PAD.left},${PAD.top})`}>
					{/* GRID */}
					{yTicks.map((v) => (
						<line
							key={v}
							x1={0}
							y1={toY(v, minVal, range)}
							x2={innerW}
							y2={toY(v, minVal, range)}
							stroke={gridColor}
							strokeWidth={1}
						/>
					))}

					{/* THRESHOLD LINES */}
					{legend.slice(0, -1).map((l) => {
						const y = toY(l.to, minVal, range);
						if (y < 0 || y > innerH) return null;

						return (
							<line
								key={l.to}
								x1={0}
								y1={y}
								x2={innerW}
								y2={y}
								stroke={l.color}
								strokeWidth={1}
								strokeDasharray="4 4"
								opacity={0.5}
							/>
						);
					})}

					{/* AREA */}
					<polyline
						points={`${toX(0, data.length)},${innerH} ${points} ${toX(
							data.length - 1,
							data.length,
						)},${innerH}`}
						fill={lineColor}
						fillOpacity={0.08}
						stroke="none"
					/>

					{/* LINE */}
					<polyline
						points={points}
						fill="none"
						stroke={lineColor}
						strokeWidth={2}
						strokeLinejoin="round"
						strokeLinecap="round"
					/>

					{/* DOTS */}
					{data.length <= 32 &&
						data.map((d, i) => (
							<circle
								key={i}
								cx={toX(i, data.length)}
								cy={toY(d.value, minVal, range)}
								r={3}
								fill={getColorForValue(d.value, legend)}
								stroke="white"
								strokeWidth={1.5}
							/>
						))}

					{/* Y LABELS */}
					{yTicks.map((v) => (
						<text
							key={v}
							x={-6}
							y={toY(v, minVal, range) + 4}
							textAnchor="end"
							fontSize={9}
							fill={textColor}
						>
							{v}
						</text>
					))}

					{/* X LABELS */}
					{xTicks.map(({ i, d }) => (
						<text
							key={i}
							x={toX(i, data.length)}
							y={innerH + 16}
							textAnchor="middle"
							fontSize={9}
							fill={textColor}
						>
							{formatTick(d.at, windowHours)}
						</text>
					))}

					{/* UNIT */}
					<text x={-PAD.left + 2} y={-4} fontSize={9} fill={textColor}>
						{unit}
					</text>
				</g>
			</svg>

			{/* MIN MAX */}
			<HStack position="absolute" top="1" right="1" gap="3">
				<Box textAlign="right">
					<Text fontSize="9px" color="fg.muted">
						Max
					</Text>
					<Text
						fontSize="11px"
						fontWeight="700"
						style={{ color: getColorForValue(maxVal, legend) }}
					>
						{maxVal} {unit}
					</Text>
				</Box>

				<Box textAlign="right">
					<Text fontSize="9px" color="fg.muted">
						Min
					</Text>
					<Text
						fontSize="11px"
						fontWeight="700"
						style={{ color: getColorForValue(minVal, legend) }}
					>
						{minVal} {unit}
					</Text>
				</Box>
			</HStack>
		</Box>
	);
}
