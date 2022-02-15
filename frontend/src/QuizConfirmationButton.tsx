import { Button, Tooltip } from "@chakra-ui/react";
import { useCallback } from "react";
import { useQuizContext } from "./QuizContextProvider";
import QuizState from "./QuizState";

export default function QuizConfirmationButton() {
    const { answers, setCurrentQuizState } = useQuizContext();
    const hasMissingAnswers = answers.some(answer => answer.selectionID == null);

    const onButtonClick = useCallback(() => {
        setCurrentQuizState(QuizState.COMPLETED);
    }, [setCurrentQuizState]);

    return (
        <Tooltip label="全問回答してください。" isDisabled={!hasMissingAnswers}>
            <span>
                <Button
                    colorScheme="orange"
                    size="lg"
                    disabled={hasMissingAnswers}
                    onClick={onButtonClick}
                >
                    回答を送る
                </Button>
            </span>
        </Tooltip>
    );
}