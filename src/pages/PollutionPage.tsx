import { useState } from "react";
import { VStack, Heading, Text, Box, Button } from "@chakra-ui/react";
import { PollutionMap } from "@/components/sections/pollution/PollutionMap";
import { PollutionWidget } from "@/components/sections/pollution/PollutionWidget";
import { PollutionHistoryChart } from "@/components/sections/pollution/PollutionHistoryChart";
import type { PollutionData, PollutionMetric } from "@/models/pollution";
import { getLegendForMetric } from "@/utils/mapUtils";
import { METRICS, CITY } from "@/constants/metrics";

export function PollutionPage() {
  const [selectedMetric, setSelectedMetric] = useState<PollutionMetric>(METRICS[0].key);
  const [pollutionData,  setPollutionData]  = useState<PollutionData | null>(null);

  const handleDataLoaded = (data: PollutionData) => {
    setPollutionData({ ...data, legend: getLegendForMetric(data.metric) });
  };

  return (
    <VStack align="stretch" gap="5">
      <Box>
        <Heading size="lg" letterSpacing="-0.3px">Air Quality Monitor</Heading>
        <Text color="fg.muted" fontSize="sm" mt="1">
          Real-time pollution data · Skopje
        </Text>
      </Box>

      {/* Metric switcher */}
      <Box display="flex" gap="2" flexWrap="wrap">
        {METRICS.map((m) => {
          const active = m.key === selectedMetric;
          return (
            <Button
              key={m.key}
              size="sm"
              borderRadius="full"
              variant={active ? "solid" : "outline"}
              colorPalette={active ? "accent" : "gray"}
              fontWeight={active ? 700 : 500}
              onClick={() => {
                if (m.key === selectedMetric) return;
                setSelectedMetric(m.key);
                setPollutionData(null);
              }}
            >
              <span>{m.icon}</span>
              {m.label}
            </Button>
          );
        })}
      </Box>

      {/* Map */}
      <PollutionMap
        stations={pollutionData?.stations}
        legend={pollutionData?.legend}
        unit={pollutionData?.unit}
        metric={selectedMetric}
      />

      {/* Current data */}
      <PollutionWidget
        city={CITY}
        metric={selectedMetric}
        onDataLoaded={handleDataLoaded}
      />

      {/* History chart */}
      <PollutionHistoryChart
        metric={selectedMetric}
        unit={pollutionData?.unit ?? ""}
      />
    </VStack>
  );
}