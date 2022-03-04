import { Text, Center, SimpleGrid } from "@chakra-ui/react";
import { useQuizDetailsContext } from "../contexts/QuizDetailsContextProvider";
import QuizSelectionButton from "./QuizSelectionButton";
import QuizQuestionConfirmation from "./QuizQuestionConfirmation";
import QuizQuestionBase from "./QuizQuestionBase";
import { useQuizStateContext } from "../contexts/QuizStateContextProvider";
import QuizQuestionGoNextButton from "./QuizQuestionGoNextButton";

function appendQuestionPrefix(question: string, currentQuestionID: number) {
  return `問${currentQuestionID}. ${question}`;
}

export default function QuizQuestion() {
  const { currentQuestionID } = useQuizStateContext();
  const { questionSize } = useQuizDetailsContext();

  if (currentQuestionID > questionSize) {
    return <QuizQuestionConfirmation />;
  }

  return <QuestionInner />;
}

function QuestionInner() {
  const { currentQuestionID } = useQuizStateContext();
  const { questions, answers } = useQuizDetailsContext();

  const targetQuestion = questions.find(
    question => question.questionID === currentQuestionID
  ) ?? null;
  const targetAnswer = answers.find(
    answer => answer.questionID === currentQuestionID
  ) ?? null;
  if (targetQuestion == null || targetAnswer == null) {
    console.error(`targetQuestion should exist for ${currentQuestionID} in this component`);
    return null;
  }

  return (
    <QuizQuestionBase>
      <Text
        width="100%"
        fontWeight="semibold"
        color="white"
        fontSize="3xl"
        display="block"
        paddingTop="36px"
        align="left"
        textShadow="0 0 5px #0972AF"
      >
        {appendQuestionPrefix(targetQuestion.question, currentQuestionID)}
      </Text>
      <Center width="100%" height="100px">
        <SimpleGrid columns={2} spacing={6} width="100%">
          {targetQuestion.selectionIDs.map((selectioinID, index) => {
            const isSelected = targetAnswer.selectionID === selectioinID;
            const label = targetQuestion.selectionLabels[index];
            return (
              <QuizSelectionButton
                key={`selectionButton-${index}`}
                isActive={isSelected}
                selectionID={selectioinID}
                questionID={targetQuestion.questionID}
              >
                {label}
              </QuizSelectionButton>
            );
          })}
        </SimpleGrid>
      </Center>
      <QuizQuestionGoNextButton />
    </QuizQuestionBase>
  );
}