import { ArrowBackIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { HStack, IconButton, Progress } from "@chakra-ui/react";
import { useCallback } from "react";
import { DEFAULT_QUESTION_ID, useQuizContext } from "./QuizContextProvider";
import QuizState from "./QuizState";

export default function QuizProgressBar() {
    const {
        currentQuestionID,
        questionSize,
        setCurrentQuestionID,
        setCurrentQuizState,
    } = useQuizContext();

    const progressValue = (currentQuestionID - 1) / questionSize * 100;

    const onPreviousClick = useCallback(() => {
        if (DEFAULT_QUESTION_ID === currentQuestionID) {
            return;
        }

        if ((DEFAULT_QUESTION_ID + 1) === currentQuestionID) {
            setCurrentQuizState(QuizState.TOP);
            setCurrentQuestionID(currentQuestionID - 1);
        }

        setCurrentQuestionID(currentQuestionID - 1);
    }, [currentQuestionID]);

    const onNextClick = useCallback(() => {
        setCurrentQuestionID(currentQuestionID + 1);
    }, [currentQuestionID]);

    return (
        <HStack justify="space-between" width="100%" marginBottom="8px">
            <IconButton
                aria-label="previous"
                colorScheme="green"
                icon={<ArrowBackIcon />}
                onClick={onPreviousClick}
            />
            <Progress colorScheme="green" size="sm" value={progressValue} width="100%" />
            <IconButton
                aria-label="next"
                colorScheme="green"
                icon={<ArrowForwardIcon />}
                disabled={questionSize < currentQuestionID}
                onClick={onNextClick}
            />
        </HStack>
    );
}