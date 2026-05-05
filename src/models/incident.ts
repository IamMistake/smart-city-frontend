export type IncidentPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IncidentStatus = "ACTIVE" | "RESOLVED";

export type IncidentType =
	| "FIRE"
	| "ACCIDENT"
	| "PROTEST"
	| "POLLUTION"
	| "POLICE_ACTIVITY"
	| "OTHER";

export interface Incident {
	id: number;
	title: string;
	description?: string | null;
	priority: IncidentPriority;
	type: IncidentType;
	status: IncidentStatus;
	latitude?: number;
	longitude?: number;
	address?: string;
	createdAt: string;
	updatedAt: string;
	resolvedAt?: string | null;
}
