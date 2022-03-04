import { AnswerType, QuestionType, QuizDetailsContextProvider } from "../contexts/QuizDetailsContextProvider";

import CommonAlert from "./CommonAlert";
import { Center, Spinner } from "@chakra-ui/react";
import { useWalletContext } from "../contexts/WalletContextProvider";
import nullthrows from "nullthrows";
import { useQueries } from "react-query";
import { 
    getContracts, 
    QUERY_KEY_GET_QUIZ_EVENT,
    DEFAULT_RETRY, 
    QUERY_KEY_GET_IS_USER_PASSED, 
    QUERY_KEY_GET_QUESTION_INFO, 
    notEmpty,
} from "../utils/QuizContractsUtils";
import { ReactNode, useEffect, useMemo, useRef } from "react";
import { useQuizStateContext } from "../contexts/QuizStateContextProvider";
import QuizState from "../utils/QuizState";

export default function QuizContainer({ children }: { children: ReactNode }) {
    const { currentAddress } = useWalletContext();

    if (currentAddress == null) {
        return (
            <QuizDetailsContextProvider
                emptyAnswers={[]}
                questions={[]}
                isUserPassed={false}
            >
                {children}
            </QuizDetailsContextProvider>
        );
    }

    return <QuizDetailsContainer>{children}</QuizDetailsContainer>;
}

function QuizDetailsContainer({ children }: { children: ReactNode }) {
    const { 
        signer: signerNullable,
        currentChainId: currentChainIdNullable,
     } = useWalletContext();
    const signer = nullthrows(signerNullable);
    const currentChainId = nullthrows(currentChainIdNullable);

    const { jpycQuiz } = getContracts(signer, currentChainId);
    const getQuizEvent = jpycQuiz.getQuizEvent();
    const getIsUserPassed = jpycQuiz.getIsUserPassed();

    const firstResults =
        useQueries([
            {
                queryKey: QUERY_KEY_GET_QUIZ_EVENT,
                queryFn: () => getQuizEvent,
                retry: DEFAULT_RETRY,
                refetchOnWindowFocus: false,
            },
            {
                queryKey: QUERY_KEY_GET_IS_USER_PASSED,
                queryFn: () => getIsUserPassed,
                retry: DEFAULT_RETRY,
                refetchOnWindowFocus: false,
            },
        ]);

    const isFirstLoading = firstResults.some(result => result.isLoading);
    const isFirstError = firstResults.some(result => result.isError);
    const isFirstSuccess = firstResults.every(result => result.isSuccess);

    const numOfQuestions = firstResults[0].data?.numOfQuestions?.toNumber() ?? null;
    const isUserPassed = firstResults[1].data;
    const getQuestionInfoCallback = (
        questionID: number,
    ) => {
        return jpycQuiz.getQuestionInfo(questionID)
    };

    const secondQueries = Array.from(
        Array(numOfQuestions).keys()
    ).map(index => {
        const questionID = index + 1;
        const getQuestionInfo = getQuestionInfoCallback(questionID);
        return {
            queryKey: `${QUERY_KEY_GET_QUESTION_INFO}-${questionID}`,
            queryFn: () => getQuestionInfo,
            retry: DEFAULT_RETRY,
            refetchOnWindowFocus: false,
            enabled: numOfQuestions != null && isFirstSuccess,
        };
    });

    const secondResults = useQueries(secondQueries);

    const isSecondLoading = secondResults.some(result => result.isLoading);
    const isSecondError = secondResults.some(result => result.isError);
    const isSecondSuccess = secondResults.every(result => result.isSuccess);

    const questions: QuestionType[] = useMemo(() => {
        return secondResults.map(result => {
            const { data } = result;
            if (data == null) {
                return null;
            }
            if (
                data.questionID == null
                || data.question == null
                || data.selectionLabels == null 
                || data.selectionIDs == null
            ) {
                return null;
            }
            return {
                questionID: data.questionID.toNumber(),
                question: data.question,
                selectionLabels: data.selectionLabels,
                selectionIDs: data.selectionIDs,
            };
        }).filter(notEmpty);
    }, [secondResults]);

    const emptyAnswers: AnswerType[] = useMemo(() => {
        return questions.map(question => ({
            questionID: question.questionID,
            selectionID: null,
        }));
    }, [questions]);

    const memoizedEmptyAnswers = useDeepMemo(emptyAnswers);
    const memoizedQuestions = useDeepMemo(questions);

    const shouldShowLoadingState = isFirstLoading || isSecondLoading;
    const shouldShowErrorState = 
        !shouldShowLoadingState 
        && (
            isFirstError
            || !isFirstSuccess
            || isSecondError
            || (isFirstSuccess && isUserPassed === false && !isSecondSuccess)
        );

    const { currentQuizState, setCurrentQuizState } = useQuizStateContext();  
    useEffect(() => {
        if (shouldShowLoadingState || shouldShowErrorState) {
            return;
        }

        if (isUserPassed) {
            if (currentQuizState === QuizState.TOP) {
                setCurrentQuizState(QuizState.COMPLETED);
            }
        } else {
            if (currentQuizState === QuizState.COMPLETED) {
                setCurrentQuizState(QuizState.TOP);
            }
        }
    }, [
        currentQuizState, 
        shouldShowLoadingState, 
        shouldShowErrorState, 
        isUserPassed,
        setCurrentQuizState,
    ]);
    
    if (shouldShowLoadingState) {
        return <QuizSpinner />;
    }

    if (shouldShowErrorState) {
        return (
            <CommonAlert
                title="エラー"
                description="再度ページを読み込んでください"
            />
        );
    }    

    // Check emptyAnswers and questions are same
    return (
        <QuizDetailsContextProvider
            emptyAnswers={memoizedEmptyAnswers}
            questions={memoizedQuestions}
            isUserPassed={isUserPassed ?? false}
        >
            {children}
        </QuizDetailsContextProvider>
    );
}

function QuizSpinner() {
    return <Center height="100%" width="100%"><Spinner size='sm' /></Center>;
}

function useDeepMemo<TValue>(
    value: TValue,
): TValue {
    const ref = useRef<TValue | null>(null);

    if (ref.current == null || !jsonEqual(value, ref.current)) {
        ref.current = value;
    }

    return ref.current;
}

function jsonEqual<TValue>(first: TValue, second: TValue) {
    return JSON.stringify(first) === JSON.stringify(second);
}