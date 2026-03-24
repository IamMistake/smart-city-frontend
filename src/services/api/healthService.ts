import { httpClient } from "@/services/http/client";
import type { HealthResponse } from "@/models/health";

export async function getBackendHealth() {
	const { data } = await httpClient.get<HealthResponse>("/api/health/");
	return data;
}
