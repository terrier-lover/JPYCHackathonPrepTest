import { AnswerType, QuestionType, QuizDetailsContextProvider, useQuizDetailsContext } from "./QuizDetailsContextProvider";

import CommonAlert from "./CommonAlert";
import { Center, Spinner } from "@chakra-ui/react";
import { useWalletContext } from "./WalletContextProvider";
import nullthrows from "nullthrows";
import { useQueries } from "react-query";
import { getContracts, QUERY_KEY_GET_QUIZ_EVENT, DEFAULT_RETRY, QUERY_KEY_GET_IS_USER_PASSED, QUERY_KEY_GET_QUESTION_INFO, notEmpty } from "./QuizContractsUtils";
import { ReactNode, useMemo, useRef } from "react";

export default function QuizContainer({ children }: { children: ReactNode }) {
    // Check the state of quiz
    // 1. Not connected to wallet -> show top page
    // 2. Connected to wallet 
    //    2.1 not solved the question yet -> show button to start quiz
    //    2.2 solved the question -> if user clicks begins test, go to final page

    const { currentAddress } = useWalletContext();
    if (currentAddress == null) {
        return <>{children}</>;
    }

    return <QuizDetailsContainer>{children}</QuizDetailsContainer>;
}

function QuizDetailsContainer({ children }: { children: ReactNode }) {
    const { signer: signerNullable } = useWalletContext();
    const signer = nullthrows(signerNullable);

    const { jpycQuiz } = getContracts(signer);
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
    const isFirstStale = firstResults.some(result => result.isStale);
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
            enabled:
                numOfQuestions != null
                && isUserPassed === false
                && isFirstSuccess,
            refetchOnWindowFocus: false,
        };
    });

    const secondResults = useQueries(secondQueries);

    const isSecondLoading = secondResults.some(result => result.isLoading);
    const isSecondStale = secondResults.some(result => result.isStale);
    const isSecondError = secondResults.some(result => result.isError);
    const isSecondSuccess = secondResults.every(result => result.isSuccess);

    const questions: QuestionType[] = useMemo(() => {
        return secondResults.map(result => {
            const { data } = result;
            if (data == null) {
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

    if (isFirstLoading || isSecondLoading) {
        if (isFirstLoading && isFirstStale) {
            return <QuizSpinner />;
        }

        if (isSecondLoading && isSecondStale) {
            return <QuizSpinner />;
        }

        return <QuizSpinner />;
    }

    if (
        isFirstError
        || !isFirstSuccess
        || isSecondError
        || !isSecondSuccess
    ) {
        return (
            <CommonAlert
                title="Error"
                description="Something went wrong. Please visit this page again."
            />
        );
    }

    if (questions.length === 0 || emptyAnswers.length === 0) {
        return <>no quiz information exist state</>;
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