import { Heading, VStack } from "@chakra-ui/react";
import { MapView } from "@/components/map/MapView.tsx";

export function MapPage() {
	return (
		<VStack align="stretch" gap="3">
			<Heading size="lg">Map</Heading>
			<MapView />
		</VStack>
	);
}
