import nullthrows from "nullthrows";
import {
    createContext,
    useContext,
    useState,
    useCallback,
} from "react";
import QuizComponent from "./QuizComponent";
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

interface QuizContextDataType {
    currentQuestionID: number,
    currentQuizState: QuizState,
    questions: QuestionType[],
    answers: AnswerType[],
    isSolved: boolean,
    setAnswer: (newAnswer: AnswerType) => void,
    setCurrentQuestionID: (newQuestionID: number) => void,
    setCurrentQuizState: (newQuizState: QuizState) => void,
};

const quizContextDefaultValue
    : QuizContextDataType | null = null;

const QuizContext =
    createContext<QuizContextDataType | null>(
        quizContextDefaultValue,
    );

function QuizContextProvider({
    questions,
    answers: rawAnswers,
    isSolved: rawIsSolved,
}: {
    questions: QuestionType[],
    answers: AnswerType[],
    isSolved: boolean,
}) {
    const [answers, setAnswers] = useState(rawAnswers);
    const [currentQuestionID, rawSetCurrentQuestionID] = useState<number>(0);
    const [currentQuizState, rawSetCurrentQuizState] = useState(QuizState.TOP);

    const isSolved = rawIsSolved || currentQuizState === QuizState.COMPLETED;

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

    const setCurrentQuestionID = useCallback((newQuestionID: number) => {
        rawSetCurrentQuestionID(newQuestionID);
    }, []);

    const setCurrentQuizState = useCallback((newQuizState: QuizState) => {
        rawSetCurrentQuizState(newQuizState);
    }, []);

    return (
        <QuizContext.Provider value={{
            questions,
            currentQuizState,
            answers,
            currentQuestionID,
            isSolved,
            setAnswer,
            setCurrentQuestionID,
            setCurrentQuizState,
        }}>
            <QuizComponent />
        </QuizContext.Provider>
    );
}

function useQuizContext() {
    const quizDataNullable = useContext(QuizContext);

    return nullthrows(
        quizDataNullable,
        "Context should not be used outside context provider",
    );
}

export {
    QuizContextProvider,
    QuizContext,
    useQuizContext,
};