import {
	Badge,
	Box,
	Button,
	Heading,
	HStack,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { useAppContext } from "@/hooks/useAppContext";
import type {
	PlatformHealthReport,
	ServiceHealthReport,
} from "@/models/health";
import { checkAllServicesHealth } from "@/services/api/healthService";

export function LandingPage() {
	const { selectedCity } = useAppContext();
	const [healthReport, setHealthReport] = useState<PlatformHealthReport | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);

	const handleHealthCheck = useCallback(async () => {
		setIsLoading(true);
		try {
			const report = await checkAllServicesHealth();
			setHealthReport(report);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		handleHealthCheck();
	}, [handleHealthCheck]);

	function resolveBadgeColor(status: PlatformHealthReport["status"]) {
		if (status === "UP") {
			return "green";
		}

		if (status === "DEGRADED") {
			return "orange";
		}

		return "red";
	}

	function resolveServiceColor(status: ServiceHealthReport["status"]) {
		if (status === "UP") {
			return "green";
		}

		if (status === "DEGRADED") {
			return "orange";
		}

		return "red";
	}

	return (
		<Stack gap={{ base: "8", md: "10" }}>
			<HeroSection city={selectedCity} />

			<Box
				as="section"
				aria-labelledby="service-health-title"
				borderWidth="1px"
				borderColor="border"
				borderRadius="2xl"
				p={{ base: "5", md: "6" }}
				bg="bg.panel"
			>
				<VStack align="stretch" gap="4">
					<HStack justify="space-between" gap="4" flexWrap="wrap">
						<Heading id="service-health-title" as="h2" size="lg">
							Microservice Health
						</Heading>

						<HStack gap="3" flexWrap="wrap" align="center">
							<Button
								colorPalette="accent"
								onClick={handleHealthCheck}
								loading={isLoading}
							>
								Refresh Status
							</Button>

							{healthReport ? (
								<Badge colorPalette={resolveBadgeColor(healthReport.status)}>
									Platform: {healthReport.status}
								</Badge>
							) : (
								<Text fontWeight="medium">Status: Not checked</Text>
							)}
						</HStack>
					</HStack>

					<Stack gap="3">
						{healthReport?.services.map((service) => (
							<Box
								key={service.name}
								borderWidth="1px"
								borderColor="border"
								borderRadius="md"
								p="4"
								bg="bg"
							>
								<HStack justify="space-between" align="flex-start" gap="4">
									<VStack align="start" gap="1">
										<Text fontWeight="semibold">{service.name}</Text>
										<Text color="fg.muted" fontSize="sm">
											Checked at: {new Date(service.checkedAt).toLocaleString()}
										</Text>
										{service.details?.db_status ? (
											<Text color="fg.muted" fontSize="sm">
												DB status: {service.details.db_status}
											</Text>
										) : null}
										{service.details?.message ? (
											<Text color="fg.muted" fontSize="sm">
												{service.details.message}
											</Text>
										) : null}
										{service.error ? (
											<Text color="red.500" fontSize="sm">
												{service.error}
											</Text>
										) : null}
									</VStack>
									<Badge colorPalette={resolveServiceColor(service.status)}>
										{service.status}
									</Badge>
								</HStack>
							</Box>
						))}
					</Stack>
				</VStack>
			</Box>
		</Stack>
	);
}
