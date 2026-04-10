import type {
  PollutionData,
  PollutionHistory,
  PollutionMetric,
} from "@/models/pollution";

const BASE_URL = (import.meta.env.VITE_FASTAPI_API_BASE_URL ?? "").replace(/\/$/, "");

const isDev = import.meta.env.DEV;

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${BASE_URL}${path}`;

  if (isDev) {
    console.debug("[pollutionService] →", url);
  }

  let res: Response;
  try {
    res = await fetch(url, {
      headers: { Accept: "application/json" },
    });
  } catch (networkErr) {
    const msg = networkErr instanceof Error ? networkErr.message : String(networkErr);
    if (isDev) {
      console.error("[pollutionService] Network error:", msg, "\nURL:", url);
    }
    throw new Error(
      `Cannot reach backend at "${BASE_URL}". ` +
      `Check that FastAPI is running on port 8000. (${msg})`
    );
  }

  if (isDev) {
    console.debug("[pollutionService] ←", res.status, url);
  }

  if (!res.ok) {
    let message = `Request failed (${res.status})`;
    try {
      const body = await res.json();
      if (body?.detail?.message) message = body.detail.message;
      else if (typeof body?.detail === "string") message = body.detail;
    } catch {
      // ignore
    }
    if (isDev) {
      console.error("[pollutionService] HTTP error:", res.status, message);
    }
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

export async function fetchPollutionData(
  metric: PollutionMetric,
): Promise<PollutionData> {
  return apiFetch<PollutionData>(
    `/api/pollution/current?metric=${encodeURIComponent(metric)}`
  );
}

export async function fetchPollutionHistory(
  metric: PollutionMetric,
  options: {
    windowHours?: number;
    bucketMinutes?: number;
    sensorId?: string;
  } = {},
): Promise<PollutionHistory> {
  const { windowHours = 24, bucketMinutes = 60, sensorId } = options;
  const params = new URLSearchParams({
    metric,
    windowHours: String(windowHours),
    bucketMinutes: String(bucketMinutes),
  });
  if (sensorId) params.set("sensorId", sensorId);

  return apiFetch<PollutionHistory>(`/api/pollution/history?${params}`);
}