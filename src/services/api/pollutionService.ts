import type {
	PollutionData,
	PollutionHistory,
	PollutionMetric,
} from "@/models/pollution";
import { fastapiClient } from "../http/fastapiClient";

export async function fetchPollutionData(
	metric: PollutionMetric,
): Promise<PollutionData> {
	const res = await fastapiClient.get<PollutionData>("/api/pollution/current", {
		params: { metric },
	});
	return res.data;
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
	const res = await fastapiClient.get<PollutionHistory>(
		"/api/pollution/history",
		{
			params: {
				metric,
				windowHours,
				bucketMinutes,
				...(sensorId ? { sensorId } : {}),
			},
		},
	);
	return res.data;
}
