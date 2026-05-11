import { Box, Flex, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { IncidentType } from "@/models/incident";
import { FaLayerGroup, FaTimes } from "react-icons/fa";
import { ALL_INCIDENT_TYPES, ALL_POLLUTION_LEVELS } from "./types";
import type { MapFilters } from "./types";
import { EVENT_TYPE_COLORS, EVENT_TYPE_LABELS } from "./layers/eventLayer";
import {
	POLLUTION_LEVEL_COLORS,
	POLLUTION_LEVEL_LABELS,
} from "./layers/pollutionLayer";

interface Props {
	filters: MapFilters;
	onFiltersChange: (filters: MapFilters) => void;
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export function MapFilterPanel({
	filters,
	onFiltersChange,
	isOpen,
	onOpen,
	onClose,
}: Props) {
	const drawerRef = useRef<HTMLDivElement | null>(null);
	const buttonRef = useRef<HTMLButtonElement | null>(null);

	useEffect(() => {
		if (!isOpen) {
			return;
		}

		const handlePointerDown = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				drawerRef.current?.contains(target) ||
				buttonRef.current?.contains(target)
			) {
				return;
			}

			onClose();
		};

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				onClose();
			}
		};

		document.addEventListener("mousedown", handlePointerDown);
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("mousedown", handlePointerDown);
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, [isOpen, onClose]);

	const toggleEventType = (type: IncidentType) => {
		const next = filters.activeEventTypes.includes(type)
			? filters.activeEventTypes.filter((item) => item !== type)
			: [...filters.activeEventTypes, type];

		onFiltersChange({ ...filters, activeEventTypes: next });
	};

	const togglePollutionLevel = (level: number) => {
		const next = filters.activePollutionLevels.includes(level)
			? filters.activePollutionLevels.filter((item) => item !== level)
			: [...filters.activePollutionLevels, level];

		onFiltersChange({ ...filters, activePollutionLevels: next });
	};

	return (
		<>
			<Box
				as="button"
				ref={buttonRef}
				onClick={isOpen ? onClose : onOpen}
				position="absolute"
				top="16px"
				right="16px"
				zIndex={20}
				w="40px"
				h="40px"
				borderRadius="8px"
				border="1px solid"
				borderColor="gray.200"
				bg="white"
				boxShadow="0 8px 20px rgba(15, 23, 42, 0.12)"
				color="gray.700"
				display="grid"
				placeItems="center"
				cursor="pointer"
				aria-label="Open layers and filters"
				pointerEvents="auto"
			>
				<Icon as={FaLayerGroup} boxSize={4} />
			</Box>

			<Box
				ref={drawerRef}
				position="absolute"
				top="0"
				right="0"
				bottom="0"
				w="300px"
				bg="white"
				borderLeft="1px solid"
				borderColor="gray.200"
				boxShadow="-12px 0 32px rgba(15, 23, 42, 0.12)"
				transform={isOpen ? "translateX(0)" : "translateX(100%)"}
				transition="transform 240ms ease"
				zIndex={19}
				pointerEvents={isOpen ? "auto" : "none"}
			>
				<Flex
					align="center"
					justify="space-between"
					px="18px"
					py="16px"
					borderBottom="1px solid"
					borderColor="gray.100"
				>
					<Text fontSize="15px" fontWeight="500" color="gray.900">
						Layers & Filters
					</Text>
					<Box
						as="button"
						onClick={onClose}
						fontSize="18px"
						lineHeight={1}
						color="gray.500"
						aria-label="Close layers and filters"
					>
						<Icon as={FaTimes} boxSize={4} />
					</Box>
				</Flex>

				<VStack align="stretch" gap="18px" p="18px">
					<FilterSection
						label="Incidents"
						enabled={filters.showEvents}
						onToggle={() =>
							onFiltersChange({
								...filters,
								showEvents: !filters.showEvents,
							})
						}
					>
						<HStack gap="8px" flexWrap="wrap">
							{ALL_INCIDENT_TYPES.map((type) => (
								<PillCheckbox
									key={type}
									label={EVENT_TYPE_LABELS[type]}
									color={EVENT_TYPE_COLORS[type]}
									checked={filters.activeEventTypes.includes(type)}
									onClick={() => toggleEventType(type)}
								/>
							))}
						</HStack>
					</FilterSection>

					<FilterSection
						label="Pollution Stations"
						enabled={filters.showPollution}
						onToggle={() =>
							onFiltersChange({
								...filters,
								showPollution: !filters.showPollution,
							})
						}
					>
						<HStack gap="8px" flexWrap="wrap">
							{ALL_POLLUTION_LEVELS.map((level) => (
								<PillCheckbox
									key={level}
									label={POLLUTION_LEVEL_LABELS[level]}
									color={POLLUTION_LEVEL_COLORS[level]}
									checked={filters.activePollutionLevels.includes(level)}
									onClick={() => togglePollutionLevel(level)}
								/>
							))}
						</HStack>
					</FilterSection>
				</VStack>
			</Box>
		</>
	);
}

function FilterSection({
	label,
	enabled,
	onToggle,
	children,
}: {
	label: string;
	enabled: boolean;
	onToggle: () => void;
	children: ReactNode;
}) {
	return (
		<VStack align="stretch" gap="12px">
			<Flex align="center" justify="space-between" gap="12px">
				<Text fontSize="14px" fontWeight="500" color="gray.900">
					{label}
				</Text>
				<ToggleSwitch checked={enabled} onToggle={onToggle} />
			</Flex>
			<Box opacity={enabled ? 1 : 0.45} transition="opacity 0.2s ease">
				{children}
			</Box>
		</VStack>
	);
}

function ToggleSwitch({
	checked,
	onToggle,
}: {
	checked: boolean;
	onToggle: () => void;
}) {
	return (
		<Box
			as="button"
			onClick={onToggle}
			w="42px"
			h="24px"
			borderRadius="999px"
			bg={checked ? "#22c55e" : "#cbd5e1"}
			position="relative"
			transition="background 0.2s ease"
			aria-pressed={checked}
		>
			<Box
				position="absolute"
				top="3px"
				left={checked ? "21px" : "3px"}
				w="18px"
				h="18px"
				borderRadius="full"
				bg="white"
				boxShadow="0 1px 3px rgba(15, 23, 42, 0.25)"
				transition="left 0.2s ease"
			/>
		</Box>
	);
}

function PillCheckbox({
	label,
	color,
	checked,
	onClick,
}: {
	label: string;
	color: string;
	checked: boolean;
	onClick: () => void;
}) {
	return (
		<Box
			as="button"
			onClick={onClick}
			px="10px"
			py="6px"
			fontSize="12px"
			fontWeight="500"
			borderRadius="999px"
			border="1px solid"
			borderColor={checked ? color : "gray.300"}
			bg={checked ? color : "white"}
			color={checked ? "white" : "gray.700"}
			transition="all 0.15s ease"
			_hover={{ borderColor: color }}
		>
			{label}
		</Box>
	);
}
