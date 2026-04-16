import { HStack, Box, Text } from "@chakra-ui/react";
import type { LegendItem } from "@/models/pollution";

export function LegendBar({ legend }: { legend: LegendItem[] }) {
  return (
    <HStack>
      {legend.map((l, i) => (
        <Box key={i} bg={l.color} px="3" py="1" borderRadius="md">
          <Text fontSize="sm">
            {l.label} ({l.from}-{l.to})
          </Text>
        </Box>
      ))}
    </HStack>
  );
}