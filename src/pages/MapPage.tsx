import { Box } from "@chakra-ui/react";
import { MapView } from "@/components/map/MapView.tsx";

export function MapPage() {
	return (
		<Box>
			<MapView height="calc(100vh - 56px)" enableFocusGate />
		</Box>
	);
}
