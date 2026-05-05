import type { PollutionData, PollutionHistory } from "@/models/pollution";

export type State =
	| { status: "loading"; data: null; error: null }
	| { status: "error"; data: null; error: string }
	| { status: "success"; data: PollutionData; error: null };

export type Action =
	| { type: "FETCH_START" }
	| { type: "FETCH_SUCCESS"; payload: PollutionData }
	| { type: "FETCH_ERROR"; payload: string };

export type HistoryState =
	| { status: "loading"; data: null; error: null }
	| { status: "error"; data: null; error: string }
	| { status: "success"; data: PollutionHistory; error: null };

export type HistoryAction =
	| { type: "FETCH_START" }
	| { type: "FETCH_SUCCESS"; payload: PollutionHistory }
	| { type: "FETCH_ERROR"; payload: string };

export interface ChartPoint {
	at: string;
	value: number;
}
