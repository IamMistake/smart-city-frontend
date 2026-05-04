import type { Incident } from "../../models/incident";
import {
	Badge,
	Box,
	Button,
	Heading,
	HStack,
	Text,
	VStack,
} from "@chakra-ui/react";
import {
	STATUS_COLOR_MAP,
	PRIORITY_COLOR_MAP,
} from "../../constants/incidentColors";
import { getDirectionsLink } from "@/utils/getDirectionsLink";

type Props = {
	incidents: Incident[];
};

export default function IncidentList({ incidents }: Props) {
	if (!incidents.length) {
		return <Text>No incidents found.</Text>;
	}

	const openDirections = (latitude: number, longitude: number) => {
		window.open(
			getDirectionsLink(latitude, longitude),
			"_blank",
			"noopener,noreferrer",
		);
	};

	const formatDate = (value?: string | null) => {
		if (!value) {
			return null;
		}

		const date = new Date(value);
		return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
	};

	return (
		<VStack align="stretch" gap="4">
			{incidents.map((incident) => {
				const hasCoordinates =
					incident.latitude != null && incident.longitude != null;

				return (
					<Box
						key={incident.id}
						borderWidth="1px"
						borderRadius="lg"
						p="4"
						shadow="sm"
						cursor={hasCoordinates ? "pointer" : "default"}
						_hover={hasCoordinates ? { bg: "gray.100" } : undefined}
						onClick={
							hasCoordinates
								? () => openDirections(incident.latitude!, incident.longitude!)
								: undefined
						}
					>
						<Heading size="md">{incident.title}</Heading>

						<HStack mt="2" gap="3" flexWrap="wrap">
							<Badge bg={STATUS_COLOR_MAP[incident.status]} color="white">
								{incident.status}
							</Badge>

							<Badge bg={PRIORITY_COLOR_MAP[incident.priority]} color="white">
								{incident.priority}
							</Badge>

							<Badge variant="subtle">{incident.type}</Badge>
						</HStack>

						{incident.description && (
							<Text mt="2" color="gray.600">
								{incident.description}
							</Text>
						)}

						{hasCoordinates && (
							<Button
								mt="3"
								size="sm"
								variant="outline"
								onClick={(event) => {
									event.stopPropagation();
									openDirections(incident.latitude!, incident.longitude!);
								}}
							>
								Directions
							</Button>
						)}

						<VStack align="stretch" gap="1" mt="3">
							<Text fontSize="sm" color="fg.muted">
								Coordinates: {incident.latitude}, {incident.longitude}
							</Text>

							{incident.address && (
								<Text fontSize="sm" color="fg.muted">
									Address: {incident.address}
								</Text>
							)}

							{formatDate(incident.occurredAt) && (
								<Text fontSize="sm" color="fg.muted">
									Occurred: {formatDate(incident.occurredAt)}
								</Text>
							)}

							<Text fontSize="sm" color="fg.muted">
								Created: {formatDate(incident.createdAt) ?? incident.createdAt}
							</Text>

							<Text fontSize="sm" color="fg.muted">
								Updated: {formatDate(incident.updatedAt) ?? incident.updatedAt}
							</Text>

							{formatDate(incident.resolvedAt) && (
								<Text fontSize="sm" color="fg.muted">
									Resolved: {formatDate(incident.resolvedAt)}
								</Text>
							)}
						</VStack>
					</Box>
				);
			})}
		</VStack>
	);
}
