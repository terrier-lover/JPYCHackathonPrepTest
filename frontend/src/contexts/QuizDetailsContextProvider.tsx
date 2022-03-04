import nullthrows from "nullthrows";
import {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode,
} from "react";
import QuizState from "../utils/QuizState";
import { useQuizStateContext } from "./QuizStateContextProvider";

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

interface QuizDetailsContextDataType {
    questions: QuestionType[],
    questionSize: number,
    answers: AnswerType[],
    isSolved: boolean,
    setAnswer: (newAnswer: AnswerType) => void,
};

const quizDetailsContextDefaultValue
    : QuizDetailsContextDataType | null = null;

const QuizDetailsContext =
    createContext<QuizDetailsContextDataType | null>(
        quizDetailsContextDefaultValue,
    );

function QuizDetailsContextProvider({
    children,
    emptyAnswers,
    questions,
    isUserPassed,
}: {
    children: ReactNode,
    emptyAnswers: AnswerType[],
    questions: QuestionType[],
    isUserPassed: boolean,
}) {
    const { currentQuizState } = useQuizStateContext();
    const [answers, setAnswers] = useState(emptyAnswers);

    const isSolved = isUserPassed || currentQuizState === QuizState.COMPLETED;

    const setAnswer = useCallback((newAnswer: AnswerType) => {
        setAnswers(answers => {
            if (answers == null) {
                return answers;
            }

            return answers.map(answer => {
                if (answer.questionID === newAnswer.questionID) {
                    return newAnswer;
                }
                return answer;
            });
        });
    }, []);

    return (
        <QuizDetailsContext.Provider value={{
            questions,
            questionSize: questions.length,
            answers,
            isSolved,
            setAnswer,
        }}>
            {children}
        </QuizDetailsContext.Provider>
    );
}

function useQuizDetailsContext() {
    const quizDataNullable = useContext(QuizDetailsContext);

    return nullthrows(
        quizDataNullable,
        "Context should not be used outside context provider",
    );
}

export {
    QuizDetailsContextProvider,
    QuizDetailsContext,
    useQuizDetailsContext,
};