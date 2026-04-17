export const STATUS_COLOR_MAP = {
  ACTIVE: "incident.status.active",
  REPORTED: "incident.status.reported",
  REJECTED: "incident.status.rejected",
  RESOLVED: "incident.status.resolved",
} as const;

export const PRIORITY_COLOR_MAP = {
  CRITICAL: "incident.priority.critical",
  HIGH: "incident.priority.high",
  MEDIUM: "incident.priority.medium",
  LOW: "incident.priority.low",
} as const;
