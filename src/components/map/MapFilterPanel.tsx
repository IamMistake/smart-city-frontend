import { useState } from "react";
import { Box, HStack, Text, VStack } from "@chakra-ui/react";
import type { IncidentType } from "@/models/incident";
import { ALL_INCIDENT_TYPES, ALL_POLLUTION_LEVELS } from "./types";
import type { MapFilters } from "./types";
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "./layers/eventLayer";
import { POLLUTION_LEVEL_COLORS, POLLUTION_LEVEL_LABELS } from "./layers/pollutionLayer";

interface Props {
    filters: MapFilters;
    onFiltersChange: (filters: MapFilters) => void;
}

export function MapFilterPanel({ filters, onFiltersChange }: Props) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleEventType = (type: IncidentType) => {
        const next = filters.activeEventTypes.includes(type)
            ? filters.activeEventTypes.filter((t) => t !== type)
            : [...filters.activeEventTypes, type];
        onFiltersChange({ ...filters, activeEventTypes: next });
    };

    const togglePollutionLevel = (level: number) => {
        const next = filters.activePollutionLevels.includes(level)
            ? filters.activePollutionLevels.filter((l) => l !== level)
            : [...filters.activePollutionLevels, level];
        onFiltersChange({ ...filters, activePollutionLevels: next });
    };

    const allTypesActive = filters.activeEventTypes.length === ALL_INCIDENT_TYPES.length;
    const allLevelsActive = filters.activePollutionLevels.length === ALL_POLLUTION_LEVELS.length;

    return (
        <Box
            bg="white"
            borderRadius="xl"
            border="1px solid"
            borderColor="gray.200"
            _dark={{ bg: "gray.900", borderColor: "gray.700" }}
            shadow="md"
            overflow="hidden"
            minW="210px"
        >
            <HStack
                px={3}
                py={2.5}
                borderBottom={isOpen ? "1px solid" : "none"}
                borderColor="gray.100"
                _dark={{ borderColor: "gray.700" }}
                justify="space-between"
                cursor="pointer"
                onClick={() => setIsOpen((v) => !v)}
                _hover={{ bg: "gray.50" }}
            >
                <Text fontWeight="semibold" fontSize="sm">
                    Layers & Filters
                </Text>
                <Text fontSize="xs" color="gray.400" userSelect="none">
                    {isOpen ? "▲" : "▼"}
                </Text>
            </HStack>

            {isOpen && (
                <VStack align="stretch" gap={0} p={3} pt={2}>
                    {/* Incidents section */}
                    <LayerRow
                        label="Incidents"
                        accentColor={EVENT_TYPE_COLORS.FIRE}
                        enabled={filters.showEvents}
                        onToggle={() =>
                            onFiltersChange({ ...filters, showEvents: !filters.showEvents })
                        }
                    />

                    {filters.showEvents && (
                        <VStack align="stretch" gap={0.5} pl={2} pb={2}>
                            <HStack justify="space-between" mb={1}>
                                <Text fontSize="xs" color="gray.500">
                                    Types
                                </Text>
                                <Box
                                    as="span"
                                    fontSize="xs"
                                    color="blue.500"
                                    cursor="pointer"
                                    onClick={() =>
                                        onFiltersChange({
                                            ...filters,
                                            activeEventTypes: allTypesActive
                                                ? []
                                                : [...ALL_INCIDENT_TYPES],
                                        })
                                    }
                                >
                                    {allTypesActive ? "None" : "All"}
                                </Box>
                            </HStack>
                            {ALL_INCIDENT_TYPES.map((type) => (
                                <TypeRow
                                    key={type}
                                    label={EVENT_TYPE_LABELS[type]}
                                    color={EVENT_TYPE_COLORS[type]}
                                    active={filters.activeEventTypes.includes(type)}
                                    onToggle={() => toggleEventType(type)}
                                />
                            ))}
                        </VStack>
                    )}

                    <Box
                        borderTop="1px solid"
                        borderColor="gray.100"
                        _dark={{ borderColor: "gray.700" }}
                        my={1}
                    />

                    {/* Pollution section */}
                    <LayerRow
                        label="Pollution Stations"
                        accentColor={POLLUTION_LEVEL_COLORS[1]}
                        enabled={filters.showPollution}
                        onToggle={() =>
                            onFiltersChange({ ...filters, showPollution: !filters.showPollution })
                        }
                    />

                    {filters.showPollution && (
                        <VStack align="stretch" gap={0.5} pl={2} pb={1}>
                            <HStack justify="space-between" mb={1}>
                                <Text fontSize="xs" color="gray.500">
                                    Levels
                                </Text>
                                <Box
                                    as="span"
                                    fontSize="xs"
                                    color="blue.500"
                                    cursor="pointer"
                                    onClick={() =>
                                        onFiltersChange({
                                            ...filters,
                                            activePollutionLevels: allLevelsActive
                                                ? []
                                                : [...ALL_POLLUTION_LEVELS],
                                        })
                                    }
                                >
                                    {allLevelsActive ? "None" : "All"}
                                </Box>
                            </HStack>
                            {ALL_POLLUTION_LEVELS.map((level) => (
                                <TypeRow
                                    key={level}
                                    label={POLLUTION_LEVEL_LABELS[level]}
                                    color={POLLUTION_LEVEL_COLORS[level]}
                                    active={filters.activePollutionLevels.includes(level)}
                                    onToggle={() => togglePollutionLevel(level)}
                                />
                            ))}
                        </VStack>
                    )}
                </VStack>
            )}
        </Box>
    );
}

function LayerRow({
    label,
    accentColor,
    enabled,
    onToggle,
}: {
    label: string;
    accentColor: string;
    enabled: boolean;
    onToggle: () => void;
}) {
    return (
        <HStack
            justify="space-between"
            py={1.5}
            px={1}
            borderRadius="md"
            cursor="pointer"
            onClick={onToggle}
            _hover={{ bg: "gray.50" }}
        >
            <HStack gap={2}>
                <Box
                    w={3}
                    h={3}
                    borderRadius="sm"
                    bg={enabled ? accentColor : "gray.300"}
                    transition="background 0.15s"
                    flexShrink={0}
                />
                <Text fontSize="sm" fontWeight="semibold">
                    {label}
                </Text>
            </HStack>
            <Text fontSize="xs" color={enabled ? "green.500" : "gray.400"} fontWeight="medium">
                {enabled ? "ON" : "OFF"}
            </Text>
        </HStack>
    );
}

function TypeRow({
    label,
    color,
    active,
    onToggle,
}: {
    label: string;
    color: string;
    active: boolean;
    onToggle: () => void;
}) {
    return (
        <HStack
            gap={2}
            py={1}
            px={1}
            borderRadius="md"
            cursor="pointer"
            opacity={active ? 1 : 0.4}
            onClick={onToggle}
            _hover={{ opacity: 1, bg: "gray.50" }}
            transition="opacity 0.15s"
        >
            <Box w={2.5} h={2.5} borderRadius="full" bg={color} flexShrink={0} />
            <Text fontSize="xs">{label}</Text>
        </HStack>
    );
}
