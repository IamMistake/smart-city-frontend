import { Box, Badge, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { PRIORITY_COLOR_MAP, STATUS_COLOR_MAP } from "@/constants/incidentColors";
import { EVENT_TYPE_LABELS } from "./layers/eventLayer";
import { POLLUTION_LEVEL_COLORS, POLLUTION_LEVEL_LABELS } from "./layers/pollutionLayer";
import type { SelectedMarker } from "./types";

interface Props {
    marker: SelectedMarker;
    onClose: () => void;
}

export function MapMarkerInfo({ marker, onClose }: Props) {
    return (
        <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ bg: "gray.900", borderColor: "gray.700" }}
            shadow="lg"
            p={4}
        >
            {marker.kind === "event" ? (
                <EventPanel marker={marker} onClose={onClose} />
            ) : (
                <PollutionPanel marker={marker} onClose={onClose} />
            )}
        </Box>
    );
}

type EventMarker = Extract<SelectedMarker, { kind: "event" }>;
type PollutionMarker = Extract<SelectedMarker, { kind: "pollution" }>;

function EventPanel({ marker, onClose }: { marker: EventMarker; onClose: () => void }) {
    return (
        <VStack align="stretch" gap={2}>
            <HStack justify="space-between" align="start">
                <Badge
                    fontSize="xs"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    variant="subtle"
                    colorScheme="gray"
                >
                    {EVENT_TYPE_LABELS[marker.type] ?? marker.type}
                </Badge>
                <Box
                    as="span"
                    fontSize="sm"
                    color="gray.400"
                    cursor="pointer"
                    onClick={onClose}
                    _hover={{ color: "gray.600" }}
                    lineHeight={1}
                    userSelect="none"
                >
                    ✕
                </Box>
            </HStack>

            <Heading size="sm">{marker.title}</Heading>

            {marker.description && (
                <Text fontSize="sm" color="gray.600">
                    {marker.description}
                </Text>
            )}

            <HStack gap={2} flexWrap="wrap">
                <Badge bg={PRIORITY_COLOR_MAP[marker.priority]} color="white" fontSize="xs">
                    {marker.priority}
                </Badge>
                <Badge bg={STATUS_COLOR_MAP[marker.status]} color="white" fontSize="xs">
                    {marker.status}
                </Badge>
            </HStack>

            <Text fontSize="xs" color="gray.400">
                {marker.lngLat[1].toFixed(4)}°N, {marker.lngLat[0].toFixed(4)}°E
            </Text>
        </VStack>
    );
}

function PollutionPanel({ marker, onClose }: { marker: PollutionMarker; onClose: () => void }) {
    const levelColor = POLLUTION_LEVEL_COLORS[marker.level] ?? "#94a3b8";
    const levelLabel = POLLUTION_LEVEL_LABELS[marker.level] ?? "Unknown";

    return (
        <VStack align="stretch" gap={2}>
            <HStack justify="space-between">
                <Badge
                    fontSize="xs"
                    px={2}
                    py={0.5}
                    borderRadius="md"
                    variant="subtle"
                    colorScheme="gray"
                >
                    Pollution Station
                </Badge>
                <Box
                    as="span"
                    fontSize="sm"
                    color="gray.400"
                    cursor="pointer"
                    onClick={onClose}
                    _hover={{ color: "gray.600" }}
                    lineHeight={1}
                    userSelect="none"
                >
                    ✕
                </Box>
            </HStack>

            <Heading size="sm">{marker.stationName}</Heading>

            <HStack gap={2}>
                <Box w={3} h={3} borderRadius="full" bg={levelColor} flexShrink={0} />
                <Text fontSize="sm" fontWeight="medium">
                    {levelLabel} Pollution
                </Text>
                {marker.value != null && marker.metric && (
                    <Text fontSize="sm" color="gray.500">
                        · {marker.value} µg/m³ ({marker.metric})
                    </Text>
                )}
            </HStack>

            <Text fontSize="xs" color="gray.400">
                {marker.lngLat[1].toFixed(4)}°N, {marker.lngLat[0].toFixed(4)}°E
            </Text>
        </VStack>
    );
}
