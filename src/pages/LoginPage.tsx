import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";

export function LoginPage() {
	return (
		<VStack align="stretch" gap="3">
			<Heading size="lg">Login</Heading>
			<Show when="signed-out">
				<VStack align="stretch" gap="3">
					<Text color="fg.muted">Sign in to continue using the platform.</Text>
					<HStack gap="3">
						<SignInButton mode="modal">
							<Button colorPalette="accent">Sign in</Button>
						</SignInButton>
						<SignUpButton mode="modal">
							<Button variant="outline" colorPalette="accent">
								Create account
							</Button>
						</SignUpButton>
					</HStack>
				</VStack>
			</Show>
			<Show when="signed-in">
				<HStack gap="3">
					<Text color="fg.muted">You are already signed in.</Text>
					<UserButton />
				</HStack>
			</Show>
		</VStack>
	);
}
