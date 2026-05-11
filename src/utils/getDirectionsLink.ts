export function getDirectionsLink(
	lat?: number | null,
	lng?: number | null,
	address?: string | null,
) {
	if (lat != null && lng != null) {
		return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
	}

	if (address) {
		return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`;
	}

	return "https://www.google.com/maps";
}
