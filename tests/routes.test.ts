import { describe, expect, it } from "vitest";

import { ROUTES } from "../src/constants/routes";

describe("ROUTES", () => {
	it("keeps the public app routes stable", () => {
		expect(ROUTES).toEqual({
			home: "/",
			map: "/map",
			emergencies: "/emergencies",
			pollution: "/pollution",
			chatbot: "/chatbot",
			login: "/auth/login",
			register: "/auth/register",
		});
	});
});
