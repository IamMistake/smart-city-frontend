import { useState } from "react";
import { Box, Input, Button, Text, VStack } from "@chakra-ui/react";
import type { IncidentPriority } from "../../models/incident";
import { createIncident } from "../../services/api/emergencyService";

type Props = {
  onCreated?: () => void;
};

export default function EmergencyForm({ onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<IncidentPriority>("LOW");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createIncident(title, description, priority);

      setTitle("");
      setDescription("");
      setPriority("LOW");

      onCreated?.(); 
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit}
      borderWidth="1px"
      borderRadius="lg"
      p="5"
      mb="6"
      shadow="sm"
    >
      <VStack align="stretch" gap="3">

        <Box>
          <Text mb="1">Title</Text>
          <Input
            placeholder="Enter incident title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </Box>

        <Box>
          <Text mb="1">Description</Text>
          <Input
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Box>

        <Box>
          <Text mb="1">Priority</Text>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as IncidentPriority)}
            style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="CRITICAL">CRITICAL</option>
          </select>
        </Box>

        <Button
          type="submit"
          colorScheme="blue"
          loading={loading}
        >
          Create Incident
        </Button>
      </VStack>
    </Box>
  );
}