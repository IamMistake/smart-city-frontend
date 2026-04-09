import type { Incident } from "../../models/incident";
import { Box, Text, VStack, Badge, Heading, HStack } from "@chakra-ui/react";

type Props = {
  incidents: Incident[];
};

const statusColorMap: Record<string, string> = {
  ACTIVE: "green.500",
  RESOLVED: "gray.400",
};

const priorityColorMap: Record<string, string> = {
  CRITICAL: "red.500",
  HIGH: "orange.400",
  MEDIUM: "yellow.400",
  LOW: "green.200",
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
        >
          <Heading size="md">{incident.title}</Heading>

          <HStack mt="2" gap="3">
            <Badge bg={statusColorMap[incident.status]} color="white">
              {incident.status}
            </Badge>

            <Badge bg={priorityColorMap[incident.priority]} color="white">
              {incident.priority}
            </Badge>
          </HStack>

          {incident.description && (
            <Text mt="2" color="gray.600">
              {incident.description}
            </Text>
          )}
        </Box>
      ))}
    </VStack>
  );
}