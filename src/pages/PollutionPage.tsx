import { useState } from "react";
import { VStack, Heading, Text, Box, Button } from "@chakra-ui/react";
import { PollutionMap } from "@/components/sections/pollution/PollutionMap";
import { PollutionWidget } from "@/components/sections/pollution/PollutionWidget";
import { PollutionHistoryChart } from "@/components/sections/pollution/PollutionHistoryChart";
import { PollutionSensorTable } from "@/components/sections/pollution/PollutionSensorTable";
import type { PollutionData, PollutionMetric } from "@/models/pollution";
import { getLegendForMetric } from "@/utils/mapUtils";
import { METRICS, CITY } from "@/constants/metrics";

export function PollutionPage() {
	const [selectedMetric, setSelectedMetric] = useState<PollutionMetric>(
		METRICS[0].key,
	);
	const [pollutionData, setPollutionData] = useState<PollutionData | null>(
		null,
	);

	const handleDataLoaded = (data: PollutionData) => {
		setPollutionData({ ...data, legend: getLegendForMetric(data.metric) });
	};

	return (
		<VStack align="stretch" gap="12">
			<Box>
				<Heading size="lg" letterSpacing="-0.3px">
					Air Quality Monitor
				</Heading>
				<Text color="fg.muted" fontSize="sm" mt="1">
					Real-time pollution data · Skopje
				</Text>
			</Box>

			<Box display="flex" gap="2" flexWrap="wrap">
				{METRICS.map((metricOption) => {
					const active = metricOption.key === selectedMetric;
					return (
						<Button
							key={metricOption.key}
							size="sm"
							borderRadius="full"
							variant={active ? "solid" : "outline"}
							colorPalette={active ? "accent" : "gray"}
							fontWeight={active ? 700 : 500}
							onClick={() => {
								if (metricOption.key === selectedMetric) {
									return;
								}

								setSelectedMetric(metricOption.key);
								setPollutionData(null);
							}}
						>
							<span>{metricOption.icon}</span>
							{metricOption.label}
						</Button>
					);
				})}
			</Box>

			<PollutionMap
				stations={pollutionData?.stations}
				legend={pollutionData?.legend}
				unit={pollutionData?.unit}
				metric={selectedMetric}
			/>

			<PollutionWidget
				city={CITY}
				metric={selectedMetric}
				onDataLoaded={handleDataLoaded}
			/>

			<PollutionHistoryChart
				metric={selectedMetric}
				unit={pollutionData?.unit ?? ""}
			/>

			{pollutionData ? (
				<PollutionSensorTable
					stations={pollutionData.stations}
					legend={pollutionData.legend}
					unit={pollutionData.unit}
				/>
			) : null}
		</VStack>
	);
}
