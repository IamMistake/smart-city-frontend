import { useEffect, useReducer, useState } from "react";
import {
  Box,
  Heading,
  Text,
  HStack,
  Skeleton,
  Alert,
  Button,
  VStack,
} from "@chakra-ui/react";

import type { PollutionMetric } from "@/models/pollution";
import type { HistoryState, HistoryAction } from "@/types/pollutionTypes";

import { HISTORY_WINDOWS } from "@/constants/metrics";
import { getLegendForMetric, toChartData } from "@/utils/mapUtils";

import { fetchPollutionHistory } from "@/services/api/pollutionService";
import { SVGLineChart } from "@/components/chart/SVGLineChart";

interface Props {
  metric: PollutionMetric;
  unit: string;
}

function historyReducer(
  _state: HistoryState,
  action: HistoryAction
): HistoryState {
  switch (action.type) {
    case "FETCH_START":
      return { status: "loading", data: null, error: null };

    case "FETCH_SUCCESS":
      return { status: "success", data: action.payload, error: null };

    case "FETCH_ERROR":
      return { status: "error", data: null, error: action.payload };
  }
}

export function PollutionHistoryChart({ metric, unit }: Props) {
  const [state, dispatch] = useReducer(historyReducer, {
    status: "loading",
    data: null,
    error: null,
  });

  const [windowIdx, setWindowIdx] = useState(1);

  useEffect(() => {
    let cancelled = false;

    dispatch({ type: "FETCH_START" });

    const { hours, bucket } = HISTORY_WINDOWS[windowIdx];

    fetchPollutionHistory(metric, {
      windowHours: hours,
      bucketMinutes: bucket,
    })
      .then((res) => {
        if (cancelled) return;
        dispatch({ type: "FETCH_SUCCESS", payload: res });
      })
      .catch((err: Error) => {
        if (cancelled) return;
        dispatch({ type: "FETCH_ERROR", payload: err.message });
      });

    return () => {
      cancelled = true;
    };
  }, [metric, windowIdx]);

  const legend = getLegendForMetric(metric);

  // LOADING
  if (state.status === "loading") {
    return (
      <Box border="1px solid" borderColor="border" borderRadius="lg" p="5" bg="bg.panel">
        <Skeleton h="18px" w="140px" mb="4" borderRadius="md" />
        <Skeleton h="200px" borderRadius="md" />
      </Box>
    );
  }

  // ERROR
  if (state.status === "error") {
    return (
      <Alert.Root status="error" borderRadius="md">
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Title>Could not load history</Alert.Title>
          <Alert.Description>{state.error}</Alert.Description>
        </Alert.Content>
      </Alert.Root>
    );
  }

  const chartData = toChartData(state.data);

  return (
    <Box border="1px solid" borderColor="border" borderRadius="lg" p="5" bg="bg.panel">
      <HStack justify="space-between" mb="4" wrap="wrap" gap="2">
        <Heading size="sm">{metric.toUpperCase()} · History</Heading>

        <HStack gap="1">
          {HISTORY_WINDOWS.map((w, i) => (
            <Button
              key={w.label}
              size="xs"
              borderRadius="full"
              variant={windowIdx === i ? "solid" : "outline"}
              colorPalette={windowIdx === i ? "accent" : "gray"}
              onClick={() => setWindowIdx(i)}
            >
              {w.label}
            </Button>
          ))}
        </HStack>
      </HStack>

      {chartData.length === 0 ? (
        <VStack py="10">
          <Text fontSize="sm" color="fg.muted">
            No historical data available for this period.
          </Text>
        </VStack>
      ) : (
        <SVGLineChart
          data={chartData}
          unit={unit}
          legend={legend}
          windowHours={HISTORY_WINDOWS[windowIdx].hours}
        />
      )}

      <HStack justify="space-between" mt="3" wrap="wrap">
        {state.data.stale && (
          <Text fontSize="xs" color="fg.muted">
            ⚠ Data may be stale
          </Text>
        )}

        <Text fontSize="xs" color="fg.muted" ml="auto">
          {state.data.sensorId
            ? `Sensor ${state.data.sensorId}`
            : "All sensors"}{" "}
          · {new Date(state.data.fetchedAt).toLocaleTimeString()}
        </Text>
      </HStack>
    </Box>
  );
}