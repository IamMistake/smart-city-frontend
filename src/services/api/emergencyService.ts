import type { Incident, IncidentPriority } from "../../models/incident";

const BASE_URL = "http://localhost:8080/api/incidents";

export const getIncidents = async (): Promise<Incident[]> => {
  const res = await fetch(BASE_URL);
  console.log("Fetching incidents...", res);

  if (!res.ok) {
    throw new Error("Failed to fetch incidents");
  }

  return res.json();
};

export const createIncident = async (
  title: string,
  description: string,
  priority: IncidentPriority
): Promise<Incident> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title,
      description,
      priority,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create incident");
  }

  return res.json();
};