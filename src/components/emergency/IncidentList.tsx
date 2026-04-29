import type { Incident } from "../../models/incident";
import { Box, Text, VStack, Badge, Heading, HStack } from "@chakra-ui/react";
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

  return (
    <VStack align="stretch" gap="4">
      {incidents.map((incident) => (
        <Box
          key={incident.id}
          borderWidth="1px"
          borderRadius="lg"
          p="4"
          shadow="sm"
          cursor="pointer"
  _hover={{ bg: "gray.100" }}
  onClick={() => {
    // fallback coordinates used for demo when backend data is missing
    const lat = Number(incident.latitude) || 41.9964;
    const lng = Number(incident.longitude) || 21.4314;
    window.open(
    getDirectionsLink(lat, lng),
    "_blank"
  );
}}
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
<button
  style={{ cursor: "pointer" }}
  onClick={(e) => {
    e.stopPropagation();
    window.open(
      getDirectionsLink(
        Number(incident.latitude),
        Number(incident.longitude)
      ),
      "_blank"
    );
  }}
>
  🧭 Directions
</button>
        </Box>
      ))}
    </VStack>
  );
}
