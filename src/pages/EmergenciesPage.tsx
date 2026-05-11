import {
	Box,
	Button,
	Flex,
	Heading,
	Portal,
	Text,
	VStack,
} from "@chakra-ui/react";
import IncidentList from "../components/emergency/IncidentList";
import EmergencyForm from "../components/emergency/EmergencyForm";
import type { Incident } from "../models/incident";
import { useEffect, useState } from "react";
import { getIncidents } from "../services/api/emergencyService";
import { FaPlus } from "react-icons/fa";

export function EmergenciesPage() {
	const [incidents, setIncidents] = useState<Incident[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [isCreateOpen, setIsCreateOpen] = useState(false);

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

	useEffect(() => {
		if (!isCreateOpen) {
			return;
		}

		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setIsCreateOpen(false);
			}
		};

		window.addEventListener("keydown", handleKeyDown);

		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [isCreateOpen]);

	return (
		<VStack align="stretch" gap="12">
			<Flex
				justify="space-between"
				align={{ base: "stretch", md: "start" }}
				gap="4"
				wrap="wrap"
			>
				<VStack align="stretch" gap="1">
					<Heading size="lg">Emergencies</Heading>
					<Text color="fg.muted">
						Emergency incidents dashboard entry point.
					</Text>
				</VStack>
				<Button
					alignSelf={{ base: "start", md: "center" }}
					colorPalette="green"
					onClick={() => setIsCreateOpen(true)}
				>
					<FaPlus />
					New Incident
				</Button>
			</Flex>

			{loading && <Text>Loading incidents...</Text>}

			{error && <Text color="red.500">{error}</Text>}

			{!loading && !error && (
				<IncidentList incidents={incidents} onResolved={loadIncidents} />
			)}

			{isCreateOpen ? (
				<Portal>
					<Box
						position="fixed"
						inset="0"
						bg="blackAlpha.600"
						zIndex={1400}
						onClick={() => setIsCreateOpen(false)}
					>
						<Flex align="center" justify="center" minH="100%" p="4">
							<Box
								bg="bg.panel"
								borderRadius="xl"
								boxShadow="xl"
								w="full"
								maxW="600px"
								maxH="calc(100vh - 2rem)"
								overflowY="auto"
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
									onClick={() => setIsCreateOpen(false)}
									aria-label="Close incident form"
								>
									×
								</Button>
								<Box p="6" pr="12">
									<Heading size="md" mb="4">
										Create Incident
									</Heading>
									<EmergencyForm
										mapHeight="300px"
										showContainer={false}
										onCreated={() => {
											loadIncidents();
											setIsCreateOpen(false);
										}}
									/>
								</Box>
							</Box>
						</Flex>
					</Box>
				</Portal>
			) : null}
		</VStack>
	);
}
