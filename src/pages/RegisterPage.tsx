import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/react";
import { Button, Heading, HStack, Text, VStack } from "@chakra-ui/react";

export function RegisterPage() {
	return (
		<VStack align="stretch" gap="3">
			<Heading size="lg">Register</Heading>
			<Show when="signed-out">
				<VStack align="stretch" gap="3">
					<Text color="fg.muted">Create a new account to get started.</Text>
					<HStack gap="3">
						<SignUpButton mode="modal">
							<Button colorPalette="accent">Sign up</Button>
						</SignUpButton>
						<SignInButton mode="modal">
							<Button variant="outline" colorPalette="accent">
								Already have an account?
							</Button>
						</SignInButton>
					</HStack>
				</VStack>
			</Show>
			<Show when="signed-in">
				<HStack gap="3">
					<Text color="fg.muted">Your account is active.</Text>
					<UserButton />
				</HStack>
			</Show>
		</VStack>
	);
}
