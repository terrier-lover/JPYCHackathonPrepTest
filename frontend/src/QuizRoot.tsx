import type { ReactNode } from "react";

import { Box, Center, Container, VStack } from "@chakra-ui/react";

export default function QuizRoot({ children }: { children: ReactNode }) {
  return (
    <Container
      width="100%"
      maxWidth="100%"
      height="100vh"
      minHeight="600px"
      paddingX="0px"
      marginX="0px"
      bgGradient="linear(to-br, #00255C, #0972AF)"
    >
      <Center
        width="100%"
        height="100vh"
        minHeight="600px"
        style={{
          backgroundImage: "url(backgroundImageMin.jpg)",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "bottom"
        }}
      >
        <Box
          bgGradient="linear(to-b, rgba(115, 195, 232, 0.85), rgba(47, 113, 194, 0.85))"
          w="80%"
          maxWidth="800px"
          minWidth="720px"
          h="540px"
          borderWidth="0px"
          borderRadius="20px"
          overflow="hidden"
          boxShadow="dark-lg"
        >
          <Center w="100%" h="100%">
            <VStack h="100%">
              {children}
            </VStack>
          </Center>
        </Box>
      </Center>
    </Container>
  );
}
