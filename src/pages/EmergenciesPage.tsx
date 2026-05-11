import { Heading, Text, VStack } from "@chakra-ui/react";
import IncidentList from "../components/emergency/IncidentList";
import EmergencyForm from "../components/emergency/EmergencyForm";
import type { Incident } from "../models/incident";
import { useEffect, useState } from "react";
import { getIncidents } from "../services/api/emergencyService";

export function EmergenciesPage() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const loadIncidents = async () => {
		try {
			setLoading(true);
			const data = await getIncidents();
			setIncidents(data);
			setError(null);
		} catch (error) {
			setError(
				error instanceof Error ? error.message : "Error loading incidents.",
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		loadIncidents();
	}, []);

	return (
		<VStack align="stretch" gap="12">
			<VStack align="stretch" gap="1">
				<Heading size="lg">Emergencies</Heading>
				<Text color="fg.muted">Emergency incidents dashboard entry point.</Text>
			</VStack>

			<EmergencyForm onCreated={loadIncidents} />

			{loading && <Text>Loading incidents...</Text>}

			{error && <Text color="red.500">{error}</Text>}

			{!loading && !error && <IncidentList incidents={incidents} />}
		</VStack>
	);
}
