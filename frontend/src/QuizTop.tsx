import { Text, Container, HStack, VStack, Button } from "@chakra-ui/react";
import CertificationCard from "./CertificationCard";
import { useQuizContext } from "./QuizContextProvider";
import QuizState from "./QuizState";

export default function QuizTop() {
  const { setCurrentQuizState } = useQuizContext();

  return (
    <HStack justify="space-between">
      <CertificationCard />
      <VStack
        paddingLeft="20px"
        paddingRight="20px"
        maxWidth="440px"
        minWidth="410px"
        height="100%"
        justify="space-evenly"
      >
        <Container>
          <Text
            fontWeight="extrabold"
            color="white"
            fontSize="5xl"
            display="block"
            align="center"
            textShadow="0 0 5px #0972AF"
          >
            日本円ハッカソン
          </Text>
          <Text
            marginTop={-4}
            fontWeight="extrabold"
            color="white"
            fontSize="5xl"
            display="block"
            align="center"
            textShadow="0 0 5px #0972AF"
          >
            事前テスト
          </Text>
        </Container>
        <Text color="white" fontSize="lg" display="block" textShadow="0 0 5px #0972AF">
          ハッカソン参加のためには合格証が必要になります。テストに合格すると合格証が授与されます。Metamask Wallet をお繋ぎになり、Rinkeby Test Network を選択してください。合格後、お繋ぎ頂いた Wallet 宛に合格証が発行されます。
        </Text>
        <HStack justify="center">
          <Button
            marginTop="12px"
            bgGradient="linear(to-r, #865325, #b3671f)"
            color="#ffffff"
            size="lg"
            _hover={{
              bgGradient: "linear(to-r, #6b421d, #9e5b1b)"
            }}
            _active={{
              bgGradient: "linear(to-r, #523216, #804a17)"
            }}
            onClick={() => setCurrentQuizState(QuizState.QUESTIONS)}
          >
            テストを開始する
          </Button>
        </HStack>
      </VStack>
    </HStack>
  );
}
