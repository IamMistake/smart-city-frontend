import { useState } from "react";
import { Alert, Box, Button, Input, Text, VStack } from "@chakra-ui/react";
import { MapView } from "@/components/map/MapView";
import type {
	CreateIncidentRequest,
	IncidentPriority,
	IncidentType,
} from "../../models/incident";
import { createIncident } from "../../services/api/emergencyService";

type FormErrors = Partial<Record<keyof CreateIncidentRequest, string>>;

type Props = {
	onCreated?: () => void;
	mapHeight?: string;
	showContainer?: boolean;
};

export default function EmergencyForm({
	onCreated,
	mapHeight,
	showContainer = true,
}: Props) {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [priority, setPriority] = useState<IncidentPriority>("LOW");
	const [type, setType] = useState<IncidentType>("OTHER");
	const [latitude, setLatitude] = useState("");
	const [longitude, setLongitude] = useState("");
	const [loading, setLoading] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const [errors, setErrors] = useState<FormErrors>({});
	const parsedLatitude = Number(latitude);
	const parsedLongitude = Number(longitude);

	const selectedCoordinates =
		latitude.trim() &&
		longitude.trim() &&
		!Number.isNaN(parsedLatitude) &&
		!Number.isNaN(parsedLongitude)
			? {
					latitude: parsedLatitude,
					longitude: parsedLongitude,
				}
			: null;

	const validate = (): CreateIncidentRequest | null => {
		const nextErrors: FormErrors = {};
		const trimmedTitle = title.trim();
		const trimmedDescription = description.trim();
		const nextLatitude = Number(latitude);
		const nextLongitude = Number(longitude);

		if (!trimmedTitle) {
			nextErrors.title = "Title is required.";
		}

		if (!priority) {
			nextErrors.priority = "Priority is required.";
		}

		if (!type) {
			nextErrors.type = "Type is required.";
		}

		if (!latitude.trim()) {
			nextErrors.latitude = "Latitude is required.";
		} else if (Number.isNaN(nextLatitude)) {
			nextErrors.latitude = "Latitude must be a valid number.";
		}

		if (!longitude.trim()) {
			nextErrors.longitude = "Longitude is required.";
		} else if (Number.isNaN(nextLongitude)) {
			nextErrors.longitude = "Longitude must be a valid number.";
		}

		setErrors(nextErrors);

		if (Object.keys(nextErrors).length > 0) {
			return null;
		}

		return {
			title: trimmedTitle,
			description: trimmedDescription || undefined,
			priority,
			type,
			latitude: nextLatitude,
			longitude: nextLongitude,
		};
	};

	const handleMapPick = ({
		latitude: nextLatitude,
		longitude: nextLongitude,
	}: {
		latitude: number;
		longitude: number;
	}) => {
		setLatitude(nextLatitude.toFixed(6));
		setLongitude(nextLongitude.toFixed(6));
		setErrors((current) => ({
			...current,
			latitude: undefined,
			longitude: undefined,
		}));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const payload = validate();

		if (!payload) {
			return;
		}

		try {
			setLoading(true);
			setSubmitError(null);
			await createIncident(payload);

			setTitle("");
			setDescription("");
			setPriority("LOW");
			setType("OTHER");
			setLatitude("");
			setLongitude("");
			setErrors({});

			onCreated?.();
		} catch (error) {
			console.error(error);
			setSubmitError(
				error instanceof Error ? error.message : "Failed to create incident.",
			);
		} finally {
			setLoading(false);
		}
	};

	const formContent = (
		<Box
			as="form"
			onSubmit={handleSubmit}
			borderWidth={showContainer ? "1px" : "0"}
			borderRadius="lg"
			p={showContainer ? "5" : "0"}
			mb={showContainer ? "6" : "0"}
			shadow={showContainer ? "sm" : "none"}
		>
			<VStack align="stretch" gap="3">
				{submitError && (
					<Alert.Root status="error" borderRadius="md">
						<Alert.Indicator />
						<Alert.Content>
							<Alert.Description>{submitError}</Alert.Description>
						</Alert.Content>
					</Alert.Root>
				)}

				<Box>
					<Text mb="1">Title</Text>
					<Input
						placeholder="Enter incident title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						required
					/>
					{errors.title && (
						<Text mt="1" color="red.500" fontSize="sm">
							{errors.title}
						</Text>
					)}
				</Box>

				<Box>
					<Text mb="1">Description</Text>
					<Input
						placeholder="Enter description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
					/>
				</Box>

				<Box>
					<Text mb="1">Priority</Text>
					<select
						value={priority}
						onChange={(e) => setPriority(e.target.value as IncidentPriority)}
						style={{
							width: "100%",
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						}}
					>
						<option value="LOW">LOW</option>
						<option value="MEDIUM">MEDIUM</option>
						<option value="HIGH">HIGH</option>
						<option value="CRITICAL">CRITICAL</option>
					</select>
					{errors.priority && (
						<Text mt="1" color="red.500" fontSize="sm">
							{errors.priority}
						</Text>
					)}
				</Box>

				<Box>
					<Text mb="1">Type</Text>
					<select
						value={type}
						onChange={(e) => setType(e.target.value as IncidentType)}
						style={{
							width: "100%",
							padding: "8px",
							borderRadius: "4px",
							border: "1px solid #ccc",
						}}
					>
						<option value="FIRE">FIRE</option>
						<option value="ACCIDENT">ACCIDENT</option>
						<option value="PROTEST">PROTEST</option>
						<option value="POLLUTION">POLLUTION</option>
						<option value="POLICE_ACTIVITY">POLICE_ACTIVITY</option>
						<option value="NOISE_POLLUTION">NOISE_POLLUTION</option>
						<option value="OTHER">OTHER</option>
					</select>
					{errors.type && (
						<Text mt="1" color="red.500" fontSize="sm">
							{errors.type}
						</Text>
					)}
				</Box>

				<Box>
					<Text mb="1">Location Picker</Text>
					<Text mb="2" color="fg.muted" fontSize="sm">
						Click on the map to choose the incident location.
					</Text>
					<MapView
						onPickCoordinates={handleMapPick}
						selectedCoordinates={selectedCoordinates}
						showMockLayers={false}
						showLayerToggles={false}
						height={mapHeight}
					/>
					{errors.latitude && (
						<Text mt="1" color="red.500" fontSize="sm">
							{errors.latitude}
						</Text>
					)}
					{errors.longitude && (
						<Text mt="1" color="red.500" fontSize="sm">
							{errors.longitude}
						</Text>
					)}

					{selectedCoordinates && (
						<Text mt="2" color="fg.muted" fontSize="sm">
							Selected coordinates: {selectedCoordinates.latitude.toFixed(6)},{" "}
							{selectedCoordinates.longitude.toFixed(6)}
						</Text>
					)}
				</Box>

				<Button type="submit" colorScheme="blue" loading={loading}>
					Create Incident
				</Button>
			</VStack>
		</Box>
	);

	return formContent;
}
