import type { CreateIncidentRequest, Incident } from "../../models/incident";

import { springClient } from "../http/springClient";

const BASE_URL = "/api/incidents";

export const getIncidents = async (): Promise<Incident[]> => {
	try {
		const res = await springClient.get(BASE_URL);
		return res.data;
	} catch (error) {
		console.error("Failed to fetch incidents:", error);

		throw new Error("Failed to fetch incidents");
	}
};

export const createIncident = async (
	incident: CreateIncidentRequest,
): Promise<Incident> => {
	try {
		const res = await springClient.post(BASE_URL, incident);

		return res.data;
	} catch (error) {
		console.error("Failed to create incident:", error);

		throw new Error("Failed to create incident");
	}
};
