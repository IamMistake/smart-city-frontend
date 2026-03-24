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
	return value?.toUpperCase() === "UP" ? "UP" : "DOWN";
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
		return {
			name,
			status: normalizeStatus(data.status),
			checkedAt,
			details: data,
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

	const upCount = services.filter((service) => service.status === "UP").length;

	let status: PlatformHealthReport["status"] = "DOWN";

	if (upCount === services.length) {
		status = "UP";
	} else if (upCount > 0) {
		status = "DEGRADED";
	}

	return {
		status,
		checkedAt: new Date().toISOString(),
		services,
	};
}
