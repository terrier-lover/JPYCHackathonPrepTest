import type { ReactNode } from "react";

import { ConnectWallet } from "@3rdweb/react";
import { Box, Center, Container, VStack } from "@chakra-ui/react";

export default function QuizLayout({ children }: { children: ReactNode }) {
  return (
    <Container
      width="100%"
      maxWidth="100%"
      height="100vh"
      minHeight="600px"
      paddingX="0px"
      marginX="0px"
      bgGradient="linear(to-br, #00255C, #0972AF)"
      position="relative"
    >
      <Center
        width="100%"
        height="100vh"
        minHeight="600px"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/backgroundImageMin.jpg)`,
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
            <VStack w="100%" h="100%" paddingLeft="44px" paddingRight="44px">
              {children}
            </VStack>
          </Center>
        </Box>
      </Center>
      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        boxShadow: "0 0 10px 10px rgba(255, 255, 255, 0.2)",
        borderRadius: "40%"
      }}>
        <ConnectWallet
          bg="white"
          borderColor="blue.500"
          _hover={{ borderColor: "blue.600" }}
          _active={{ borderColor: "blue.700" }}
          borderWidth={3}
          variant="outline"
        />
      </div>
    </Container>
  );
}
