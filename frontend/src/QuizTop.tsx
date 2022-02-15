import { Text, Container, HStack, VStack, Button, Tooltip } from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import CertificationCard from "./CertificationCard";
import { useQuizContext, DEFAULT_QUESTION_ID } from "./QuizContextProvider";
import { useWalletContext } from "./WalletContextProvider";
import QuizState from "./QuizState";

export default function QuizTop() {
  return (
    <HStack justify="space-between" marginTop="12px">
      <CertificationCard />
      <VStack
        paddingLeft="10px"
        width="400px"
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
          <StartButton>
            テストを開始する
          </StartButton>
        </HStack>
      </VStack>
    </HStack>
  );
}

function StartButton({ children }: { children: ReactNode }) {
  const { setCurrentQuizState, setCurrentQuestionID } = useQuizContext();
  const { currentAddress } = useWalletContext();

  const onStartClick = useCallback(() => {
    setCurrentQuizState(QuizState.QUESTIONS);
    setCurrentQuestionID(DEFAULT_QUESTION_ID + 1);
  }, []);

  const isAddressEmpty = currentAddress == null;

  return (
    <Tooltip label="右上のボタンよりWalletに接続してください" isDisabled={!isAddressEmpty}>
      <span>
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
          onClick={onStartClick}
          disabled={ isAddressEmpty }
        >
          {children}
        </Button>    
      </span>
    </Tooltip>
  );
}
