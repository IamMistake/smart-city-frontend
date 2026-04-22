import { Heading, Text, VStack } from "@chakra-ui/react";
import IncidentList from "../components/emergency/IncidentList";
import EmergencyForm from "../components/emergency/EmergencyForm";
import type { Incident } from "../models/incident";
import { useEffect, useState } from "react";
import { getIncidents } from "../services/api/emergencyService";

export function EmergenciesPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadIncidents = async () => {
    try {
      setLoading(true);
      const data = await getIncidents();
      setIncidents(data);
      setError(false);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIncidents();
  }, []);

  return (
    <VStack align="stretch" gap="3">
      <Heading size="lg">Emergencies</Heading>
      <Text color="fg.muted">
        Emergency incidents dashboard entry point.
      </Text>

      <EmergencyForm onCreated={loadIncidents} />

      {loading && <Text>Loading incidents...</Text>}

      {error && (
        <Text color="red.500">
          Error loading incidents.
        </Text>
      )}

      {!loading && !error && (
        <IncidentList incidents={incidents} />
      )}
    </VStack>
  );
}