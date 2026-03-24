import type {
	HealthResponse,
	PlatformHealthReport,
	ServiceHealthReport,
	ServiceHealthStatus,
} from "@/models/health";
import type { ApiError } from "@/types/api";
import { fastapiClient } from "@/services/http/fastapiClient";
import { springClient } from "@/services/http/springClient";

const HEALTH_ENDPOINT = "/api/health/";

function normalizeStatus(value: string | undefined): ServiceHealthStatus {
	if (!value) {
		return "DOWN";
	}

	const normalized = value.toUpperCase();

	if (normalized === "UP") {
		return "UP";
	}

	if (normalized === "DOWN") {
		return "DEGRADED";
	}

	return "DOWN";
}

function resolveErrorMessage(error: unknown) {
	const apiError = error as ApiError;
	return apiError?.message || "Service unavailable";
}

async function checkService(
	name: ServiceHealthReport["name"],
	check: () => Promise<HealthResponse>,
): Promise<ServiceHealthReport> {
	const checkedAt = new Date().toISOString();

	try {
		const data = await check();
		const status = normalizeStatus(data.status);
		const detailsError = data.error?.trim();
		const detailsMessage = data.message?.trim();

		return {
			name,
			status,
			checkedAt,
			details: data,
			error: detailsError || (status !== "UP" ? detailsMessage : undefined),
		};
	} catch (error) {
		return {
			name,
			status: "DOWN",
			checkedAt,
			error: resolveErrorMessage(error),
		};
	}
}

export async function checkSpringHealth() {
	const { data } = await springClient.get<HealthResponse>(HEALTH_ENDPOINT);
	return data;
}

export async function checkFastapiHealth() {
	const { data } = await fastapiClient.get<HealthResponse>(HEALTH_ENDPOINT);
	return data;
}

export async function checkAllServicesHealth(): Promise<PlatformHealthReport> {
	const settled = await Promise.allSettled([
		checkService("spring-service", checkSpringHealth),
		checkService("fastapi-service", checkFastapiHealth),
	]);

	const services = settled.map((result, index) => {
		const name = index === 0 ? "spring-service" : "fastapi-service";
		if (result.status === "fulfilled") {
			return result.value;
		}

		return {
			name,
			status: "DOWN",
			checkedAt: new Date().toISOString(),
			error: resolveErrorMessage(result.reason),
		} satisfies ServiceHealthReport;
	});

	const hasUp = services.some((service) => service.status === "UP");
	const hasDegraded = services.some((service) => service.status === "DEGRADED");
	const hasDown = services.some((service) => service.status === "DOWN");

	let status: PlatformHealthReport["status"] = "DOWN";

	if (hasUp && !hasDegraded && !hasDown) {
		status = "UP";
	} else if (hasUp || hasDegraded) {
		status = "DEGRADED";
	}

	return {
		status,
		checkedAt: new Date().toISOString(),
		services,
	};
}
