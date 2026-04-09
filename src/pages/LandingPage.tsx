import {
	Badge,
	Box,
	Button,
	Heading,
	HStack,
	Spinner,
	Stack,
	Text,
	VStack,
} from "@chakra-ui/react";
import { ModulesSection } from "@/components/sections/ModulesSection";
import { useAuth } from "@clerk/react";
import { useCallback, useEffect, useState } from "react";
import { HeroSection } from "@/components/sections/HeroSection";
import { useAppContext } from "@/hooks/useAppContext";
import type {
	PlatformHealthReport,
	ServiceHealthReport,
} from "@/models/health";
import {
	checkFastapiAuthenticatedUser,
	checkSpringAuthenticatedUser,
	type AuthenticatedUserResponse,
} from "@/services/api/authService";
import { checkAllServicesHealth } from "@/services/api/healthService";

type AuthTestStatus = "idle" | "loading" | "success" | "error";

type AuthTestResult = {
	status: AuthTestStatus;
	data?: AuthenticatedUserResponse;
	error?: string;
};

export function LandingPage() {
	const { selectedCity } = useAppContext();
	const { isLoaded, isSignedIn } = useAuth();
	const [healthReport, setHealthReport] = useState<PlatformHealthReport | null>(
		null,
	);
	const [isLoading, setIsLoading] = useState(false);
	const [authTestResults, setAuthTestResults] = useState<
		Record<ServiceHealthReport["name"], AuthTestResult>
	>({
		"spring-service": { status: "idle" },
		"fastapi-service": { status: "idle" },
	});

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

	const handleAuthTest = useCallback(
		async (serviceName: ServiceHealthReport["name"]) => {
			setAuthTestResults((current) => ({
				...current,
				[serviceName]: { status: "loading" },
			}));

			try {
				const data =
					serviceName === "spring-service"
						? await checkSpringAuthenticatedUser()
						: await checkFastapiAuthenticatedUser();

				setAuthTestResults((current) => ({
					...current,
					[serviceName]: {
						status: "success",
						data,
					},
				}));
			} catch (error) {
				const message =
					error instanceof Error ? error.message : "Request failed";

				setAuthTestResults((current) => ({
					...current,
					[serviceName]: {
						status: "error",
						error: message,
					},
				}));
			}
		},
		[],
	);

	return (
		<Stack gap={{ base: "8", md: "10" }}>
			<HeroSection city={selectedCity} />
			<ModulesSection />

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

										<HStack pt="2" gap="3" align="center" flexWrap="wrap">
											<Button
												size="sm"
												variant="outline"
												colorPalette="accent"
												onClick={() => handleAuthTest(service.name)}
												disabled={!isLoaded || !isSignedIn}
												loading={
													authTestResults[service.name].status === "loading"
												}
											>
												Test Auth Endpoint
											</Button>
											{!isLoaded ? (
												<Spinner size="sm" colorPalette="accent" />
											) : null}
											{isLoaded && !isSignedIn ? (
												<Text color="fg.muted" fontSize="sm">
													Sign in to test authenticated endpoint.
												</Text>
											) : null}
										</HStack>

										{authTestResults[service.name].status === "success" ? (
											<VStack align="start" gap="1" pt="1">
												<Text
													color="green.600"
													fontSize="sm"
													fontWeight="semibold"
												>
													Authenticated request succeeded
												</Text>
												<Text color="fg.muted" fontSize="sm">
													Email: {authTestResults[service.name].data?.email}
												</Text>
												<Text color="fg.muted" fontSize="sm">
													Clerk ID:{" "}
													{authTestResults[service.name].data?.clerkUserId}
												</Text>
												<Text color="fg.muted" fontSize="sm">
													Role: {authTestResults[service.name].data?.role}
												</Text>
												<Text color="fg.muted" fontSize="sm">
													Active:{" "}
													{String(authTestResults[service.name].data?.isActive)}
												</Text>
											</VStack>
										) : null}

										{authTestResults[service.name].status === "error" ? (
											<Text color="red.500" fontSize="sm" pt="1">
												{authTestResults[service.name].error}
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
