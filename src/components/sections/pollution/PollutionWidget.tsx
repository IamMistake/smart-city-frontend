import { useEffect, useReducer, useRef } from "react";
import { Skeleton } from "@chakra-ui/react";
import {
	Box,
	Heading,
	Text,
	VStack,
	HStack,
	Alert,
	Badge,
	Separator,
} from "@chakra-ui/react";
import type { PollutionData, PollutionMetric } from "@/models/pollution";
import { fetchPollutionData } from "@/services/api/pollutionService";
import { LegendBar } from "@/components/sections/pollution/LegendBar";
import { getLegendForMetric, isInMacedonia, reducer } from "@/utils/mapUtils";

interface PollutionWidgetProps {
	city: string;
	metric: PollutionMetric;
	onDataLoaded?: (data: PollutionData) => void;
}

export function PollutionWidget({
	city,
	metric,
	onDataLoaded,
}: PollutionWidgetProps) {
	const [state, dispatch] = useReducer(reducer, {
		status: "loading",
		data: null,
		error: null,
	});

	const onDataLoadedRef = useRef(onDataLoaded);
	useEffect(() => {
		onDataLoadedRef.current = onDataLoaded;
	});

	useEffect(() => {
		let cancelled = false;
		dispatch({ type: "FETCH_START" });

		fetchPollutionData(metric)
			.then((response) => {
				if (cancelled) {
					return;
				}

				dispatch({ type: "FETCH_SUCCESS", payload: response });
				onDataLoadedRef.current?.(response);
			})
			.catch((error: Error) => {
				if (cancelled) {
					return;
				}

				dispatch({ type: "FETCH_ERROR", payload: error.message });
			});

		return () => {
			cancelled = true;
		};
	}, [city, metric]);

	if (state.status === "loading") {
		return (
			<VStack
				align="stretch"
				gap="4"
				border="1px solid"
				borderColor="border"
				p="5"
				borderRadius="lg"
				bg="bg.panel"
			>
				<HStack justify="space-between">
					<Skeleton height="22px" width="180px" />
					<Skeleton height="20px" width="80px" borderRadius="md" />
				</HStack>

				<HStack gap="3">
					<Skeleton height="52px" width="52px" borderRadius="full" />
					<VStack align="start" gap="2">
						<Skeleton height="16px" width="120px" />
						<Skeleton height="14px" width="160px" />
					</VStack>
				</HStack>

				<Skeleton height="12px" width="100%" borderRadius="md" />

				<VStack gap="2">
					<Skeleton height="48px" borderRadius="md" />
					<Skeleton height="48px" borderRadius="md" />
					<Skeleton height="48px" borderRadius="md" />
				</VStack>
			</VStack>
		);
	}

	if (state.status === "error") {
		return (
			<Alert.Root status="error" borderRadius="md">
				<Alert.Indicator />
				<Alert.Content>
					<Alert.Title>Could not load pollution data</Alert.Title>
					<Alert.Description>{state.error}</Alert.Description>
				</Alert.Content>
			</Alert.Root>
		);
	}

	const { data } = state;
	const validStations = data.stations.filter((station) =>
		isInMacedonia(station.position.lat, station.position.lng),
	);
	const hasStations = validStations.length > 0;
	const hasCityValue = data.summary.cityValue != null;

	const frontendLegend = getLegendForMetric(data.metric);
	const cityLegend = hasCityValue
		? frontendLegend.find(
				(legendItem) =>
					data.summary.cityValue! >= legendItem.from &&
					data.summary.cityValue! <= legendItem.to,
			)
		: undefined;

	return (
		<VStack
			align="stretch"
			gap="4"
			border="1px solid"
			borderColor="border"
			p="5"
			borderRadius="lg"
			bg="bg.panel"
		>
			<HStack justify="space-between" wrap="wrap" gap="2">
				<Heading size="md" letterSpacing="-0.3px">
					{data.city.charAt(0).toUpperCase() + data.city.slice(1)} —{" "}
					{data.metric.toUpperCase()}
				</Heading>
				<HStack gap="2">
					{data.stale && (
						<Badge colorPalette="orange" variant="subtle">
							Stale
						</Badge>
					)}
					<Badge variant="subtle" fontSize="xs">
						{validStations.length} station
						{validStations.length !== 1 ? "s" : ""}
					</Badge>
				</HStack>
			</HStack>

			{data.errors.length > 0 && (
				<Alert.Root status="warning" borderRadius="md" size="sm">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Description>{data.errors[0].message}</Alert.Description>
					</Alert.Content>
				</Alert.Root>
			)}

			{!hasStations && !hasCityValue ? (
				<Alert.Root status="info" borderRadius="md">
					<Alert.Indicator />
					<Alert.Content>
						<Alert.Title>No data available</Alert.Title>
						<Alert.Description>
							There are currently no {metric.toUpperCase()} readings from Pulse
							Eco for Skopje. This metric may not be measured by active sensors
							right now.
						</Alert.Description>
					</Alert.Content>
				</Alert.Root>
			) : (
				<>
					<HStack gap="3" align="center">
						<Box
							w="52px"
							h="52px"
							borderRadius="full"
							display="flex"
							alignItems="center"
							justifyContent="center"
							style={{ backgroundColor: cityLegend?.color ?? "#888" }}
							flexShrink={0}
						>
							<Text fontWeight="800" color="white" fontSize="sm">
								{hasCityValue ? data.summary.cityValue : "—"}
							</Text>
						</Box>
						<VStack align="start" gap="0">
							<Text fontWeight="semibold">{data.summary.statusText}</Text>
							<Text fontSize="sm" color="fg.muted">
								City average:{" "}
								{hasCityValue ? `${data.summary.cityValue} ${data.unit}` : "—"}
							</Text>
						</VStack>
					</HStack>

					<Separator />

					<Box>
						<Heading size="sm" mb="2">
							Scale
						</Heading>
						<LegendBar legend={getLegendForMetric(data.metric)} />
					</Box>
				</>
			)}

			<Text fontSize="xs" color="fg.muted">
				Source: {data.source} · Fetched at{" "}
				{new Date(data.fetchedAt).toLocaleTimeString()}
				{data.coverage.interpolationEnabled && " · Interpolation enabled"}
			</Text>
		</VStack>
	);
}
