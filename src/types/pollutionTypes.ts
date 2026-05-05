import type { PollutionData } from "@/models/pollution";

export type State =
	| { status: "loading"; data: null; error: null }
	| { status: "error"; data: null; error: string }
	| { status: "success"; data: PollutionData; error: null };

export type Action =
	| { type: "FETCH_START" }
	| { type: "FETCH_SUCCESS"; payload: PollutionData }
	| { type: "FETCH_ERROR"; payload: string };
