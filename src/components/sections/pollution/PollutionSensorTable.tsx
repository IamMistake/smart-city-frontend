import { useMemo, useState } from "react";
import {
	Badge,
	Box,
	Button,
	HStack,
	Input,
	Table,
	Text,
	VStack,
} from "@chakra-ui/react";
import type { LegendItem, Station } from "@/models/pollution";
import {
	formatSensorName,
	getLabelForValue,
	isInMacedonia,
} from "@/utils/mapUtils";

type PollutionSensorTableProps = {
	stations: Station[];
	legend: LegendItem[];
	unit: string;
};

type NormalizedLevel = "Good" | "Moderate" | "High";

type SortKey = "status" | "name" | "value" | "level" | "updated";

type SortState = {
	key: SortKey;
	direction: "asc" | "desc";
};

type SensorRow = {
	id: string;
	status: NormalizedLevel;
	name: string;
	uuid: string;
	value: number;
	level: NormalizedLevel;
	updatedAt: string | null;
	updatedLabel: string;
	updatedSortValue: number;
};

const PAGE_SIZE = 20;

const levelStyles: Record<
	NormalizedLevel,
	{ border: string; badgeBg: string; badgeColor: string; sortValue: number }
> = {
	Good: {
		border: "aqi.good",
		badgeBg: "aqi.good",
		badgeColor: "white",
		sortValue: 0,
	},
	Moderate: {
		border: "aqi.moderate",
		badgeBg: "aqi.moderate",
		badgeColor: "black",
		sortValue: 1,
	},
	High: {
		border: "aqi.high",
		badgeBg: "aqi.high",
		badgeColor: "white",
		sortValue: 2,
	},
};

const sortLabels: Record<SortKey, string> = {
	status: "Status",
	name: "Name",
	value: "Current value (µg/m³)",
	level: "Level",
	updated: "Last updated",
};

export function PollutionSensorTable({
	stations,
	legend,
	unit,
}: PollutionSensorTableProps) {
	const [search, setSearch] = useState("");
	const [page, setPage] = useState(1);
	const [sort, setSort] = useState<SortState>({
		key: "updated",
		direction: "desc",
	});

	const rows = useMemo<SensorRow[]>(() => {
		return stations
			.filter((station) =>
				isInMacedonia(station.position.lat, station.position.lng),
			)
			.map((station) => {
				const label = getLabelForValue(station.current.value, legend);
				const level = normalizeLevel(label);
				const updatedAt = station.current.measuredAt;

				return {
					id: station.stationId,
					status: level,
					name: formatSensorName(station.stationId, station.name),
					uuid: station.stationId,
					value: station.current.value,
					level,
					updatedAt,
					updatedLabel: formatRelativeTime(updatedAt),
					updatedSortValue: updatedAt ? new Date(updatedAt).getTime() : 0,
				};
			});
	}, [legend, stations]);

	const filteredRows = useMemo(() => {
		const query = search.trim().toLowerCase();

		if (!query) {
			return rows;
		}

		return rows.filter((row) => row.name.toLowerCase().includes(query));
	}, [rows, search]);

	const sortedRows = useMemo(() => {
		const next = [...filteredRows];

		next.sort((left, right) => {
			const direction = sort.direction === "asc" ? 1 : -1;

			switch (sort.key) {
				case "status":
				case "level": {
					return (
						(levelStyles[left.level].sortValue -
							levelStyles[right.level].sortValue) *
						direction
					);
				}
				case "name":
					return left.name.localeCompare(right.name) * direction;
				case "value":
					return (left.value - right.value) * direction;
				case "updated":
					return (left.updatedSortValue - right.updatedSortValue) * direction;
			}
		});

		return next;
	}, [filteredRows, sort]);

	const totalPages = Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE));
	const currentPage = Math.min(page, totalPages);
	const paginatedRows = sortedRows.slice(
		(currentPage - 1) * PAGE_SIZE,
		currentPage * PAGE_SIZE,
	);

	if (!rows.length) {
		return null;
	}

	return (
		<VStack align="stretch" gap="4">
			<HStack justify="space-between" gap="4" flexWrap="wrap">
				<Input
					value={search}
					onChange={(event) => {
						setSearch(event.target.value);
						setPage(1);
					}}
					placeholder="Search sensors"
					maxW={{ base: "full", md: "320px" }}
				/>
				<Text fontSize="sm" color="fg.muted">
					{filteredRows.length} sensor{filteredRows.length === 1 ? "" : "s"}
				</Text>
			</HStack>

			<Box
				borderWidth="1px"
				borderColor="border"
				borderRadius="lg"
				overflowX="auto"
			>
				<Table.Root size="sm" variant="line">
					<Table.Header>
						<Table.Row>
							{(Object.keys(sortLabels) as SortKey[]).map((key) => (
								<Table.ColumnHeader key={key} px="4" py="4">
									<Button
										variant="ghost"
										size="sm"
										px="0"
										height="auto"
										fontWeight="semibold"
										onClick={() => handleSort(key, sort, setSort, setPage)}
									>
										{sortLabels[key]}
										<Text as="span" color="fg.muted" ml="2">
											{resolveSortIndicator(key, sort)}
										</Text>
									</Button>
								</Table.ColumnHeader>
							))}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{paginatedRows.map((row) => (
							<Table.Row
								key={row.id}
								borderLeftWidth="3px"
								borderLeftColor={levelStyles[row.status].border}
							>
								<Table.Cell px="4" py="4">
									<Text fontSize="sm" color="fg.muted">
										{row.status}
									</Text>
								</Table.Cell>
								<Table.Cell px="4" py="4">
									<VStack align="start" gap="1">
										<Text fontWeight="semibold">{row.name}</Text>
										<Text fontSize="sm" color="fg.muted">
											{truncateUuid(row.uuid)}
										</Text>
									</VStack>
								</Table.Cell>
								<Table.Cell px="4" py="4" textAlign="end">
									<Text fontWeight="semibold">
										{formatValue(row.value)}
										<Text as="span" color="fg.muted" fontWeight="normal" ml="1">
											{unit || "µg/m³"}
										</Text>
									</Text>
								</Table.Cell>
								<Table.Cell px="4" py="4">
									<Badge
										borderRadius="full"
										px="2.5"
										py="1"
										fontSize="xs"
										bg={levelStyles[row.level].badgeBg}
										color={levelStyles[row.level].badgeColor}
									>
										{row.level}
									</Badge>
								</Table.Cell>
								<Table.Cell px="4" py="4">
									<Text color="fg.muted">{row.updatedLabel}</Text>
								</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</Box>

			<HStack justify="space-between" gap="4" flexWrap="wrap">
				<Text fontSize="sm" color="fg.muted">
					Page {currentPage} of {totalPages}
				</Text>
				<HStack gap="2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => setPage((current) => Math.max(1, current - 1))}
						disabled={currentPage === 1}
					>
						Prev
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							setPage((current) => Math.min(totalPages, current + 1))
						}
						disabled={currentPage === totalPages}
					>
						Next
					</Button>
				</HStack>
			</HStack>
		</VStack>
	);
}

function handleSort(
	key: SortKey,
	current: SortState,
	setSort: (value: SortState) => void,
	setPage: (value: number) => void,
) {
	setPage(1);

	if (current.key === key) {
		setSort({
			key,
			direction: current.direction === "asc" ? "desc" : "asc",
		});
		return;
	}

	setSort({ key, direction: key === "name" ? "asc" : "desc" });
}

function resolveSortIndicator(key: SortKey, sort: SortState) {
	if (sort.key !== key) {
		return "↕";
	}

	return sort.direction === "asc" ? "↑" : "↓";
}

function truncateUuid(value: string) {
	return `${value.slice(0, 8)}…`;
}

function formatValue(value: number) {
	return Number.isInteger(value) ? value.toString() : value.toFixed(1);
}

function normalizeLevel(label: string): NormalizedLevel {
	const normalized = label.toLowerCase();

	if (
		["good", "optimal", "comfortable", "normal", "quiet"].includes(normalized)
	) {
		return "Good";
	}

	if (
		[
			"fair",
			"moderate",
			"cool",
			"warm",
			"low",
			"high",
			"humid",
			"loud",
		].includes(normalized)
	) {
		return "Moderate";
	}

	return "High";
}

function formatRelativeTime(value: string | null) {
	if (!value) {
		return "No reading";
	}

	const timestamp = new Date(value).getTime();

	if (Number.isNaN(timestamp)) {
		return "Unknown";
	}

	const diffMs = Date.now() - timestamp;
	const diffMinutes = Math.max(0, Math.floor(diffMs / 60000));

	if (diffMinutes < 1) {
		return "just now";
	}

	if (diffMinutes < 60) {
		return `${diffMinutes} min ago`;
	}

	const diffHours = Math.floor(diffMinutes / 60);

	if (diffHours < 24) {
		return `${diffHours} hr ago`;
	}

	const diffDays = Math.floor(diffHours / 24);
	return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
}
