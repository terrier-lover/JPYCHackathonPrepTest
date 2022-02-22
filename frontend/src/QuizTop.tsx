import { Text, Container, HStack, VStack, Button, Tooltip } from "@chakra-ui/react";
import { ReactNode, useCallback } from "react";
import CertificationCard from "./CertificationCard";
import QuizState from "./QuizState";
import { useQuizStateContext, DEFAULT_QUESTION_ID } from "./QuizStateContextProvider";
import { useWalletContext } from "./WalletContextProvider";

export default function QuizTop() {
  return (
    <HStack justify="space-between" marginTop="12px" width="100%">
      <CertificationCard />
      <VStack
        paddingLeft="10px"
        width="400px"
        height="100%"
        justify="space-evenly"
      >
        <Container marginBottom="16px">
          <TestTitleText>
            日本円ハッカソン
          </TestTitleText>
          <TestTitleText>
            事前テスト
          </TestTitleText>
        </Container>
        <Text 
          color="white" 
          fontFamily="sans-serif" 
          fontSize="lg" 
          display="block" 
          textShadow="0 0 5px #0972AF"
        >
          ハッカソン参加のためには合格証が必要になります。テストに合格すると合格証が授与されます。Metamask Wallet をお繋ぎになり、Rinkeby Test Network を選択してください。合格後、お繋ぎ頂いた Wallet 宛に合格証が発行されます。
        </Text>
        <HStack justify="center">
          <StartButton />
        </HStack>
      </VStack>
    </HStack>
  );
}

function StartButton() {
  const { setCurrentQuizState, setCurrentQuestionID } = useQuizStateContext();
  const { currentAddress } = useWalletContext();

  const onStartClick = useCallback(() => {
    setCurrentQuizState(QuizState.QUESTIONS);
    setCurrentQuestionID(DEFAULT_QUESTION_ID + 1);
  }, [ setCurrentQuizState, setCurrentQuestionID ]);

  return (
    <StartButtonBase
      isAddressEmpty={currentAddress == null}
      onStartClick={onStartClick}
    />
  );
}

function StartButtonBase({
  isAddressEmpty,
  onStartClick,
}: {
  isAddressEmpty: boolean
  onStartClick?: () => void,
}) {
  return (
    <Tooltip label="右上のボタンよりWalletに接続してください" isDisabled={!isAddressEmpty}>
      <span>
        <Button
          marginTop="24px"
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
          disabled={isAddressEmpty}
        >
          テストを開始する
        </Button>
      </span>
    </Tooltip>
  );
}

function TestTitleText({ children }: { children: ReactNode }) {
  return (
    <Text
      fontFamily="sans-serif"
      fontWeight="extrabold"
      color="white"
      fontSize="4xl"
      display="block"
      align="center"
      textShadow="0 0 5px #0972AF"
    >    
      {children}
    </Text>
  );
}