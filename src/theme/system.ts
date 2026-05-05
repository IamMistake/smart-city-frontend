import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
	theme: {
		tokens: {
			fonts: {
				body: {
					value:
						'"Manrope Variable", "Manrope", "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif',
				},
				heading: {
					value:
						'"Manrope Variable", "Manrope", "Avenir Next", "Segoe UI", Helvetica, Arial, sans-serif',
				},
			},

			colors: {
				accent: {
					50: { value: "#e8f4ee" },
					100: { value: "#cde8d9" },
					200: { value: "#abd7bf" },
					300: { value: "#85c5a4" },
					400: { value: "#63b68b" },
					500: { value: "#3f9f70" },
					600: { value: "#2e7e57" },
					700: { value: "#225f42" },
					800: { value: "#18432f" },
					900: { value: "#102b1f" },
					950: { value: "#08150f" },
				},
			},
		},

		semanticTokens: {
			colors: {
				bg: {
					DEFAULT: { value: { _light: "#ffffff", _dark: "#000000" } },
					subtle: { value: { _light: "#f7f7f7", _dark: "#101010" } },
					muted: { value: { _light: "#efefef", _dark: "#1a1a1a" } },
					panel: { value: { _light: "#ffffff", _dark: "#111111" } },
				},

				fg: {
					DEFAULT: { value: { _light: "#111111", _dark: "#f5f5f5" } },
					muted: { value: { _light: "#555555", _dark: "#bdbdbd" } },
				},

				border: {
					DEFAULT: { value: { _light: "#e5e5e5", _dark: "#2b2b2b" } },
				},

				accent: {
					solid: { value: "{colors.accent.700}" },
					contrast: { value: "#ffffff" },
					fg: { value: "{colors.accent.600}" },
					muted: { value: "{colors.accent.100}" },
					subtle: { value: "{colors.accent.200}" },
					emphasized: { value: "{colors.accent.300}" },
					focusRing: { value: "{colors.accent.500}" },
				},

				incident: {
					status: {
						active: {
							value: {
								_light: "#22c55e",
								_dark: "#4ade80",
							},
						},
						reported: {
							value: {
								_light: "#f59e0b",
								_dark: "#fbbf24",
							},
						},
						rejected: {
							value: {
								_light: "#ef4444",
								_dark: "#ff6b6b",
							},
						},
						resolved: {
							value: {
								_light: "#16a34a",
								_dark: "#4ade80",
							},
						},
					},

					priority: {
						critical: {
							value: {
								_light: "#ef4444",
								_dark: "#ff6b6b",
							},
						},
						high: {
							value: {
								_light: "#f97316",
								_dark: "#fb923c",
							},
						},
						medium: {
							value: {
								_light: "#eab308",
								_dark: "#facc15",
							},
						},
						low: {
							value: {
								_light: "#22c55e",
								_dark: "#4ade80",
							},
						},
					},
				},
			},
		},
	},
});

export const system = createSystem(defaultConfig, config);
