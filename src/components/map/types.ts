import type { IncidentPriority, IncidentStatus, IncidentType } from "@/models/incident";

export interface EventFeatureProperties {
    id: number;
    type: IncidentType;
    title: string;
    description?: string | null;
    priority: IncidentPriority;
    status: IncidentStatus;
}

export interface PollutionFeatureProperties {
    level: number;
    stationName: string;
    value?: number;
    metric?: string;
}

export type SelectedMarker =
    | ({ kind: "event"; lngLat: [number, number] } & EventFeatureProperties)
    | ({ kind: "pollution"; lngLat: [number, number] } & PollutionFeatureProperties);

export interface MapFilters {
    showEvents: boolean;
    showPollution: boolean;
    activeEventTypes: IncidentType[];
    activePollutionLevels: number[];
}

export const ALL_INCIDENT_TYPES: IncidentType[] = [
    "FIRE",
    "ACCIDENT",
    "PROTEST",
    "POLLUTION",
    "POLICE_ACTIVITY",
    "OTHER",
];

export const ALL_POLLUTION_LEVELS = [1, 2, 3];

export const DEFAULT_FILTERS: MapFilters = {
    showEvents: true,
    showPollution: true,
    activeEventTypes: [...ALL_INCIDENT_TYPES],
    activePollutionLevels: [...ALL_POLLUTION_LEVELS],
};
