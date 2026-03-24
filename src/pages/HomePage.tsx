import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { useState } from "react";
import { getBackendHealth } from "@/services/api/healthService";
import { useAppContext } from "@/hooks/useAppContext";

export function HomePage() {
	const { selectedCity } = useAppContext();
	const [healthStatus, setHealthStatus] = useState("Not checked");
	const [isLoading, setIsLoading] = useState(false);

	async function handleHealthCheck() {
		setIsLoading(true);
		try {
			const health = await getBackendHealth();
			setHealthStatus(health.status || "OK");
		} catch {
			setHealthStatus("Unavailable");
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<VStack align="stretch" gap="4">
			<Heading size="lg">Smart City Frontend</Heading>
			<Text color="fg.muted">Current city: {selectedCity}</Text>
			<HStack gap="3" flexWrap="wrap">
				<Button
					colorPalette="accent"
					onClick={handleHealthCheck}
					loading={isLoading}
				>
					Check Backend Health
				</Button>
				<Text fontWeight="medium">Status: {healthStatus}</Text>
			</HStack>
		</VStack>
	);
}
