export type HealthResponse = {
	status: string;
	service?: string;
	db_status?: "UP" | "DOWN";
	message?: string;
	error?: string;
	timestamp?: string;
};

export type ServiceHealthStatus = "UP" | "DEGRADED" | "DOWN";

export type PlatformHealthStatus = "UP" | "DEGRADED" | "DOWN";

export type ServiceHealthReport = {
	name: "spring-service" | "fastapi-service";
	status: ServiceHealthStatus;
	checkedAt: string;
	details?: HealthResponse;
	error?: string;
};

export type PlatformHealthReport = {
	status: PlatformHealthStatus;
	checkedAt: string;
	services: ServiceHealthReport[];
};
