export type IncidentPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus = "ACTIVE" | "REPORTED" | "REJECTED" | "RESOLVED";

export type IncidentType =
	| "FIRE"
	| "ACCIDENT"
	| "PROTEST"
	| "POLLUTION"
	| "POLICE_ACTIVITY"
	| "OTHER"
	| "NOISE_POLLUTION";

export interface CreateIncidentRequest {
	title: string;
	description?: string;
	priority: IncidentPriority;
	type: IncidentType;
	latitude: number;
	longitude: number;
	address?: string;
	occurredAt?: string;
}

export interface Incident {
	id: string;
	title: string;
	description?: string | null;
	priority: IncidentPriority;
	type: IncidentType;
	latitude: number;
	longitude: number;
	address?: string | null;
	occurredAt?: string | null;
	status: IncidentStatus;
	createdAt: string;
	updatedAt: string;
	resolvedAt?: string | null;
}
