import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function ErrorPage() {
	const navigate = useNavigate();

	return (
		<Center h="100vh">
			<VStack gap="4">
				<Heading size="2xl">Oops!</Heading>
				<Heading size="md">Something went wrong</Heading>
				<Text color="fg.muted" maxW="sm">
					We couldn’t load this page. Try going back home or refreshing the
					page.
				</Text>
				<Button onClick={() => navigate(ROUTES.home)}>Back</Button>
			</VStack>
		</Center>
	);
}
