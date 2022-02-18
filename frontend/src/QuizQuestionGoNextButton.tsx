import QuizActionButton from "./QuizActionButton";
import { useQuizDetailsContext } from "./QuizDetailsContextProvider";
import { useQuizStateContext } from "./QuizStateContextProvider";
import useQuizPreviousAndNextClick from "./useQuizPreviousAndNextClick";

export default function QuizQuestionGoNextButton() {
    const { 
        onNextClick, 
    } = useQuizPreviousAndNextClick();  
    const { currentQuestionID } = useQuizStateContext();
    const { answers } = useQuizDetailsContext();    

    const targetAnswerSelectionID = (answers.find(
        answer => answer.questionID === currentQuestionID
    ) ?? null)?.selectionID;
    const notSelected = targetAnswerSelectionID == null;

    return (
        <QuizActionButton 
            isButtonDisabled={notSelected}
            tooltipLabel="回答してください"
            buttonLabel="次へ"
            onButtonClick={onNextClick}
        />
    );
}