import { usePrevious } from "@chakra-ui/react";
import nullthrows from "nullthrows";
import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import QuizState from "./QuizState";

export type AnswerType = {
    questionID: number,
    selectionID: string | null,
};

export type QuestionType = {
    questionID: number,
    question: string,
    selectionLabels: string[],
    selectionIDs: string[],
};

interface QuizStateContextDataType {
    currentQuizState: QuizState,
    setCurrentQuizState: (newQuizState: QuizState) => void,
    currentQuestionID: number,
    previousQuestionID: number,
    setCurrentQuestionID: (newQuestionID: number) => void,
};

const QuizStateContextDefaultValue
    : QuizStateContextDataType | null = null;

const QuizStateContext =
    createContext<QuizStateContextDataType | null>(
        QuizStateContextDefaultValue,
    );

const DEFAULT_QUESTION_ID = 0;    

function QuizStateContextProvider({
    children,
}: {
    children: ReactNode,
}) {
    const [currentQuizState, rawSetCurrentQuizState] = useState(QuizState.TOP);
    const [currentQuestionID, rawSetCurrentQuestionID] = useState<number>(
        DEFAULT_QUESTION_ID
    );
    const previousQuestionID = usePrevious(currentQuestionID);

    const setCurrentQuizState = useCallback((newQuizState: QuizState) => {
        rawSetCurrentQuizState(newQuizState);
    }, []);
    const setCurrentQuestionID = useCallback((newQuestionID: number) => {
        rawSetCurrentQuestionID(newQuestionID);
    }, []);

    return (
        <QuizStateContext.Provider value={{
            currentQuizState,
            setCurrentQuizState,
            currentQuestionID,
            previousQuestionID,
            setCurrentQuestionID,            
        }}>
            {children}
        </QuizStateContext.Provider>
    );
}

function useQuizStateContext() {
    const quizDataNullable = useContext(QuizStateContext);

    return nullthrows(
        quizDataNullable,
        "Context should not be used outside context provider",
    );
}

export {
    QuizStateContextProvider,
    QuizStateContext,
    useQuizStateContext,
    DEFAULT_QUESTION_ID,
};