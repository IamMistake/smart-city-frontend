// fastapiClient is configured with VITE_FASTAPI_API_BASE_URL which causes CORS.
// We create a separate axios instance with empty baseURL to go through Vite proxy.
import axios from "axios";
import type { PollutionData, PollutionHistory, PollutionMetric } from "@/models/pollution";

const pollutionClient = axios.create({
  baseURL: "",
  timeout: 15000,
  headers: { Accept: "application/json" },
});

export async function fetchPollutionData(
  metric: PollutionMetric,
): Promise<PollutionData> {
  const res = await pollutionClient.get<PollutionData>(
    `/api/pollution/current?metric=${encodeURIComponent(metric)}`
  );
  return res.data;
}

export async function fetchPollutionHistory(
  metric: PollutionMetric,
  options: { windowHours?: number; bucketMinutes?: number; sensorId?: string } = {},
): Promise<PollutionHistory> {
  const { windowHours = 24, bucketMinutes = 60, sensorId } = options;
  const params = new URLSearchParams({
    metric,
    windowHours: String(windowHours),
    bucketMinutes: String(bucketMinutes),
  });
  if (sensorId) params.set("sensorId", sensorId);

  const res = await pollutionClient.get<PollutionHistory>(`/api/pollution/history?${params}`);
  return res.data;
}