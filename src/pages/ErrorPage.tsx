import { Button, Center, Heading, Text, VStack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";

export function ErrorPage() {
    const navigate = useNavigate();

    return (
        <Center h="100vh">
            <VStack gap="4">
                <Heading size="2xl">403</Heading>
                <Heading size="md">Access Denied</Heading>
                <Text color="fg.muted">
                    You don't have permission to view this page.
                </Text>
                <Button onClick={() => navigate(ROUTES.home)}>
                    Go Home
                </Button>
            </VStack>
        </Center>
    );
}