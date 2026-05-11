import type { FeatureCollection } from "geojson";

const hoursAgo = (hours: number) =>
	new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

export const mockEvents: FeatureCollection = {
	type: "FeatureCollection",
	features: [
		{
			type: "Feature",
			properties: {
				id: 1,
				type: "FIRE",
				title: "Building Fire in Čair",
				description:
					"Residential building fire reported on 3rd floor. Fire department dispatched.",
				priority: "CRITICAL",
				status: "ACTIVE",
				occurredAt: hoursAgo(2),
			},
			geometry: { type: "Point", coordinates: [21.38, 42.02] },
		},
		{
			type: "Feature",
			properties: {
				id: 2,
				type: "ACCIDENT",
				title: "Traffic Collision on Blvd. Ilinden",
				description:
					"Two-vehicle collision at main intersection, minor injuries reported.",
				priority: "HIGH",
				status: "ACTIVE",
				occurredAt: hoursAgo(4),
			},
			geometry: { type: "Point", coordinates: [21.39, 42.01] },
		},
		{
			type: "Feature",
			properties: {
				id: 3,
				type: "FIRE",
				title: "Vegetation Fire near Gazi Baba",
				description: "Dry grass fire spreading near residential area.",
				priority: "HIGH",
				status: "ACTIVE",
				occurredAt: hoursAgo(6),
			},
			geometry: { type: "Point", coordinates: [21.43, 42.03] },
		},
		{
			type: "Feature",
			properties: {
				id: 4,
				type: "PROTEST",
				title: "Public Demonstration – City Center",
				description:
					"Peaceful protest at Macedonia Square, road closures in effect.",
				priority: "MEDIUM",
				status: "ACTIVE",
				occurredAt: hoursAgo(9),
			},
			geometry: { type: "Point", coordinates: [21.46, 42.02] },
		},
		{
			type: "Feature",
			properties: {
				id: 5,
				type: "FIRE",
				title: "Industrial Fire – Aerodrom",
				description: "Fire at storage facility, hazmat team on site.",
				priority: "CRITICAL",
				status: "ACTIVE",
				occurredAt: hoursAgo(1),
			},
			geometry: { type: "Point", coordinates: [21.52, 42.02] },
		},
		{
			type: "Feature",
			properties: {
				id: 6,
				type: "ACCIDENT",
				title: "Vehicle Rollover on A1 Highway",
				description: "Single vehicle accident, highway lane partially blocked.",
				priority: "HIGH",
				status: "RESOLVED",
				occurredAt: hoursAgo(30),
			},
			geometry: { type: "Point", coordinates: [21.53, 42.0] },
		},
		{
			type: "Feature",
			properties: {
				id: 7,
				type: "POLICE_ACTIVITY",
				title: "Police Operation – Butel",
				description: "Active police operation in progress, avoid the area.",
				priority: "HIGH",
				status: "ACTIVE",
				occurredAt: hoursAgo(3),
			},
			geometry: { type: "Point", coordinates: [21.34, 41.99] },
		},
		{
			type: "Feature",
			properties: {
				id: 8,
				type: "POLLUTION",
				title: "Illegal Waste Dumping – Kisela Voda",
				description:
					"Illegal chemical waste dumped near river bank. Environmental team notified.",
				priority: "HIGH",
				status: "ACTIVE",
				occurredAt: hoursAgo(12),
			},
			geometry: { type: "Point", coordinates: [21.35, 41.97] },
		},
		{
			type: "Feature",
			properties: {
				id: 9,
				type: "FIRE",
				title: "Apartment Fire – Karpoš",
				description:
					"Kitchen fire contained to one unit. Residents evacuated safely.",
				priority: "MEDIUM",
				status: "RESOLVED",
				occurredAt: hoursAgo(48),
			},
			geometry: { type: "Point", coordinates: [21.43, 41.99] },
		},
		{
			type: "Feature",
			properties: {
				id: 10,
				type: "ACCIDENT",
				title: "Cyclist Accident – Old Bazaar",
				description:
					"Cyclist struck by vehicle near Old Bazaar area, medical team dispatched.",
				priority: "MEDIUM",
				status: "ACTIVE",
				occurredAt: hoursAgo(8),
			},
			geometry: { type: "Point", coordinates: [21.44, 41.98] },
		},
		{
			type: "Feature",
			properties: {
				id: 11,
				type: "OTHER",
				title: "Power Outage – Centar",
				description: "Widespread power outage affecting 200+ households.",
				priority: "MEDIUM",
				status: "ACTIVE",
				occurredAt: hoursAgo(14),
			},
			geometry: { type: "Point", coordinates: [21.5, 41.99] },
		},
		{
			type: "Feature",
			properties: {
				id: 12,
				type: "PROTEST",
				title: "Worker Strike – Industrial Zone",
				description:
					"Workers blocking factory entrance, traffic disruption expected.",
				priority: "LOW",
				status: "ACTIVE",
				occurredAt: hoursAgo(18),
			},
			geometry: { type: "Point", coordinates: [21.51, 41.97] },
		},
		{
			type: "Feature",
			properties: {
				id: 13,
				type: "FIRE",
				title: "Car Fire on Ring Road",
				description:
					"Vehicle fire extinguished. No injuries, traffic normalized.",
				priority: "LOW",
				status: "RESOLVED",
				occurredAt: hoursAgo(72),
			},
			geometry: { type: "Point", coordinates: [21.37, 41.95] },
		},
		{
			type: "Feature",
			properties: {
				id: 14,
				type: "POLICE_ACTIVITY",
				title: "Police Checkpoint – Saraj",
				description: "Routine checkpoint, expect minor delays.",
				priority: "LOW",
				status: "ACTIVE",
				occurredAt: hoursAgo(20),
			},
			geometry: { type: "Point", coordinates: [21.38, 41.96] },
		},
		{
			type: "Feature",
			properties: {
				id: 15,
				type: "ACCIDENT",
				title: "Bus Accident – Gjorche Petrov",
				description:
					"Bus collided with parked vehicle. Passengers being assessed for injuries.",
				priority: "HIGH",
				status: "ACTIVE",
				occurredAt: hoursAgo(5),
			},
			geometry: { type: "Point", coordinates: [21.52, 41.95] },
		},
		{
			type: "Feature",
			properties: {
				id: 16,
				type: "OTHER",
				title: "Gas Leak Report – Shuto Orizari",
				description:
					"Suspected gas leak reported. Utility team dispatched for inspection.",
				priority: "CRITICAL",
				status: "ACTIVE",
				occurredAt: hoursAgo(2.5),
			},
			geometry: { type: "Point", coordinates: [21.54, 41.96] },
		},
	],
};
