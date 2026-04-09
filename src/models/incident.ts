export type IncidentPriority =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

export type IncidentStatus =
  | "ACTIVE"
  | "RESOLVED";

export interface Incident {
  id: number;
  title: string;
  description?: string | null;
  priority: IncidentPriority;
  status: IncidentStatus;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string | null;
}