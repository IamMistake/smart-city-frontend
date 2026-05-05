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

						<HStack mt="2" gap="3">
							<Badge bg={STATUS_COLOR_MAP[incident.status]} color="white">
								{incident.status}
							</Badge>

							<Badge bg={PRIORITY_COLOR_MAP[incident.priority]} color="white">
								{incident.priority}
							</Badge>
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
					</Box>
				);
			})}
		</VStack>
	);
}
