import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react'

function App() {
  return (
    <Box minH="100vh" bg="gray.50" px="6" py="12">
      <VStack
        maxW="3xl"
        mx="auto"
        p={{ base: '6', md: '10' }}
        borderWidth="1px"
        borderColor="gray.200"
        borderRadius="xl"
        bg="white"
        align="stretch"
        gap="4"
      >
        <Heading size="lg">Smart City Frontend</Heading>
        <Text color="gray.600">
          React + Vite + TypeScript + Chakra UI are configured and ready.
        </Text>
        <Button w={{ base: 'full', sm: 'fit-content' }} colorPalette="blue">
          Chakra works
        </Button>
      </VStack>
    </Box>
  )
}

export default App
