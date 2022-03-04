import { useCallback } from "react";
import { useQuizDetailsContext } from "../contexts/QuizDetailsContextProvider";
import QuizState from "../utils/QuizState";
import { DEFAULT_QUESTION_ID, useQuizStateContext } from "../contexts/QuizStateContextProvider";

export default function useQuizPreviousAndNextClick() {
    const { 
        setCurrentQuizState, 
        currentQuestionID, 
        setCurrentQuestionID 
    } = useQuizStateContext();
    const { questionSize } = useQuizDetailsContext();

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
    }, [currentQuestionID, setCurrentQuestionID, setCurrentQuizState]);

    const onNextClick = useCallback(() => {
        setCurrentQuestionID(currentQuestionID + 1);
    }, [currentQuestionID, setCurrentQuestionID]);
    
    const isNextButtonDisabled = questionSize < currentQuestionID;

    return { progressValue, onPreviousClick, onNextClick, isNextButtonDisabled };
}