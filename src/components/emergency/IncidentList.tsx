import type { Incident } from "../../models/incident";
import {
	Badge,
	Box,
	Button,
	Flex,
	HStack,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import { STATUS_COLOR_MAP } from "../../constants/incidentColors";
import { getDirectionsLink } from "@/utils/getDirectionsLink";
import { useEffect, useState } from "react";
import { updateIncidentStatus } from "@/services/api/emergencyService";

type Props = {
	incidents: Incident[];
	onResolved?: () => void | Promise<void>;
};

export default function IncidentList({ incidents, onResolved }: Props) {
	const [resolvingId, setResolvingId] = useState<Incident["id"] | null>(null);
	const [selectedIncident, setSelectedIncident] = useState<Incident | null>(
		null,
	);
	const [actionError, setActionError] = useState<string | null>(null);

	useEffect(() => {
		if (!selectedIncident) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setSelectedIncident(null);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [selectedIncident]);

	const openDirections = (
		latitude?: number | null,
		longitude?: number | null,
		address?: string | null,
	) => {
		window.open(
			getDirectionsLink(latitude, longitude, address),
			"_blank",
			"noopener,noreferrer",
		);
	};

	const handleResolve = async (incidentId: Incident["id"]) => {
		try {
			setResolvingId(incidentId);
			setActionError(null);
			await updateIncidentStatus(incidentId, "RESOLVED");
			await onResolved?.();
			if (selectedIncident?.id === incidentId) {
				setSelectedIncident((current) =>
					current
						? {
								...current,
								status: "RESOLVED",
								resolvedAt: new Date().toISOString(),
							}
						: current,
				);
			}
		} catch (error) {
			setActionError(
				error instanceof Error ? error.message : "Failed to update incident",
			);
		} finally {
			setResolvingId(null);
		}
	};

	const formatRelativeTime = (value?: string | null) => {
		if (!value) {
			return "just now";
		}

		const timestamp = new Date(value).getTime();

		if (Number.isNaN(timestamp)) {
			return value;
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
			return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
		}

		const diffDays = Math.floor(diffHours / 24);
		return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
	};

	const formatStatusLabel = (status: Incident["status"]) => {
		return status.charAt(0) + status.slice(1).toLowerCase();
	};

	const resolvePriorityBorderColor = (priority: Incident["priority"]) => {
		if (priority === "CRITICAL") {
			return "danger";
		}

		if (priority === "HIGH" || priority === "MEDIUM") {
			return "warning";
		}

		return "success";
	};

	if (!incidents.length) {
		return <Text>No incidents found.</Text>;
	}

	return (
		<VStack align="stretch" gap="4">
			{actionError ? <Text color="red.500">{actionError}</Text> : null}
			{incidents.map((incident) => {
				const hasCoordinates =
					incident.latitude != null && incident.longitude != null;
				const timestamp =
					incident.resolvedAt ??
					incident.occurredAt ??
					incident.updatedAt ??
					incident.createdAt;
				const isActive = incident.status === "ACTIVE";

				return (
					<Box
						key={incident.id}
						borderWidth="1px"
						borderLeftWidth="3px"
						borderLeftColor={resolvePriorityBorderColor(incident.priority)}
						borderTopLeftRadius="0"
						borderBottomLeftRadius="0"
						borderTopRightRadius="lg"
						borderBottomRightRadius="lg"
						p="4"
						shadow="sm"
						bg="bg.panel"
					>
						<VStack align="stretch" gap="3">
							<Flex align="center" justify="space-between" gap="3">
								<Text fontSize="15px" fontWeight="500" lineClamp="1">
									{incident.title}
								</Text>
								<Badge bg={STATUS_COLOR_MAP[incident.status]} color="white">
									{formatStatusLabel(incident.status)}
								</Badge>
							</Flex>

							{incident.description ? (
								<Text fontSize="13px" color="fg.muted" lineClamp="2">
									{incident.description}
								</Text>
							) : null}

							{hasCoordinates ? (
								<Text fontSize="sm" color="fg.muted">
									📍 {incident.latitude}, {incident.longitude}
								</Text>
							) : null}

							<Flex align="center" justify="space-between" gap="3" wrap="wrap">
								<Badge variant="subtle" borderRadius="full" px="2.5" py="1">
									{incident.type}
								</Badge>
								<Text fontSize="12px" color="fg.muted" flex="1" minW="120px">
									{formatRelativeTime(timestamp)}
								</Text>
								<HStack gap="2">
									<Button
										height="28px"
										size="sm"
										variant="outline"
										onClick={() => setSelectedIncident(incident)}
									>
										View
									</Button>
									{isActive ? (
										<Button
											height="28px"
											size="sm"
											bg="success"
											color="white"
											_hover={{ bg: "success" }}
											loading={resolvingId === incident.id}
											onClick={() => handleResolve(incident.id)}
										>
											Resolve
										</Button>
									) : null}
								</HStack>
							</Flex>
						</VStack>
					</Box>
				);
			})}

			{selectedIncident ? (
				<Portal>
					<Box
						position="fixed"
						inset="0"
						bg="blackAlpha.600"
						zIndex={1400}
						onClick={() => setSelectedIncident(null)}
					>
						<Flex align="center" justify="center" minH="100%" p="4">
							<Box
								bg="bg.panel"
								borderRadius="xl"
								boxShadow="xl"
								w="full"
								maxW="560px"
								position="relative"
								onClick={(event) => event.stopPropagation()}
							>
								<Button
									position="absolute"
									top="3"
									right="3"
									variant="ghost"
									minW="auto"
									px="2"
									onClick={() => setSelectedIncident(null)}
									aria-label="Close incident details"
								>
									×
								</Button>
								<VStack align="stretch" gap="4" p="6" pr="12">
									<Flex align="center" justify="space-between" gap="3">
										<Text fontSize="lg" fontWeight="600">
											{selectedIncident.title}
										</Text>
										<Badge
											bg={STATUS_COLOR_MAP[selectedIncident.status]}
											color="white"
										>
											{formatStatusLabel(selectedIncident.status)}
										</Badge>
									</Flex>
									{selectedIncident.description ? (
										<Text color="fg.muted">{selectedIncident.description}</Text>
									) : null}
									<VStack align="stretch" gap="2">
										<Text>
											<TypeLabel label="Type" value={selectedIncident.type} />
										</Text>
										<Text>
											<TypeLabel
												label="Priority"
												value={selectedIncident.priority}
											/>
										</Text>
										{selectedIncident.address ? (
											<Text color="fg.muted">
												Address: {selectedIncident.address}
											</Text>
										) : null}
										{selectedIncident.latitude != null &&
										selectedIncident.longitude != null ? (
											<>
												<Text color="fg.muted">
													📍 {selectedIncident.latitude},{" "}
													{selectedIncident.longitude}
												</Text>
												<Text fontSize="sm" color="fg.muted">
													Open turn-by-turn directions in Google Maps.
												</Text>
											</>
										) : selectedIncident.address ? (
											<Text fontSize="sm" color="fg.muted">
												Google Maps directions will use the incident address.
											</Text>
										) : null}
										<Text color="fg.muted">
											Updated: {formatRelativeTime(selectedIncident.updatedAt)}
										</Text>
									</VStack>
									<HStack justify="end" gap="2">
										{selectedIncident.latitude != null ||
										selectedIncident.longitude != null ||
										selectedIncident.address ? (
											<Button
												variant="outline"
												onClick={() =>
													openDirections(
														selectedIncident.latitude,
														selectedIncident.longitude,
														selectedIncident.address,
													)
												}
											>
												Directions in Google Maps
											</Button>
										) : null}
										{selectedIncident.status === "ACTIVE" ? (
											<Button
												bg="success"
												color="white"
												_hover={{ bg: "success" }}
												loading={resolvingId === selectedIncident.id}
												onClick={() => handleResolve(selectedIncident.id)}
											>
												Resolve
											</Button>
										) : null}
									</HStack>
								</VStack>
							</Box>
						</Flex>
					</Box>
				</Portal>
			) : null}
		</VStack>
	);
}

function TypeLabel({ label, value }: { label: string; value: string }) {
	return (
		<>
			<Text as="span" color="fg.muted">
				{label}:
			</Text>
			<Text as="span" fontWeight="medium">
				{value}
			</Text>
		</>
	);
}
