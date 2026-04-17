import type {
  Incident,
  IncidentPriority,
  IncidentType,
} from "../../models/incident";

import { springClient } from "../http/springClient";

const BASE_URL = "/api/incidents";

export const getIncidents = async (): Promise<Incident[]> => {
  try {
    console.log("Calling API...");

    const res = await springClient.get(
    "http://localhost:8080/api/incidents"
    );

    console.log("Response:", res);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch incidents:", error);

    throw new Error("Failed to fetch incidents");
  }
};

export const createIncident = async (
  title: string,
  description: string,
  priority: IncidentPriority,
  type: IncidentType
): Promise<Incident> => {
  try {
    const res = await springClient.post(BASE_URL, {
      title,
      description,
      priority,
      type,
    });

    return res.data;
  } catch (error) {
    console.error("Failed to create incident:", error);

    throw new Error("Failed to create incident");
  }
};

