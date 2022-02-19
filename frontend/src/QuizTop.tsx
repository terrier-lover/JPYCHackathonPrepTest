import { Text, Container, HStack, VStack, Button, Tooltip } from "@chakra-ui/react";
import { useCallback } from "react";
import CertificationCard from "./CertificationCard";
import QuizState from "./QuizState";
import { useQuizStateContext, DEFAULT_QUESTION_ID } from "./QuizStateContextProvider";

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
          <StartButton />
        </HStack>
      </VStack>
    </HStack>
  );
}

function StartButton() {
  const { setCurrentQuizState, setCurrentQuestionID } = useQuizStateContext();

  const onStartClick = useCallback(() => {
    setCurrentQuizState(QuizState.QUESTIONS);
    setCurrentQuestionID(DEFAULT_QUESTION_ID + 1);
  }, [ setCurrentQuizState, setCurrentQuestionID ]);

  return (
    <StartButtonBase
      isAddressEmpty={false}
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
          disabled={isAddressEmpty}
        >
          テストを開始する
        </Button>
      </span>
    </Tooltip>
  );
}
