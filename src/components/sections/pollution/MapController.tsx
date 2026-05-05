import { useMap } from "react-leaflet";
import { useEffect } from "react";

interface Props {
	lat: number;
	lng: number;
}

export function MapController({ lat, lng }: Props) {
	const map = useMap();

	useEffect(() => {
		map.flyTo([lat, lng], 12, {
			duration: 1.5,
		});
	}, [lat, lng, map]);

	return null;
}
