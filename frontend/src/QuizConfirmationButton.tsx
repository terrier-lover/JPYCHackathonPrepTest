import type { JPYCQuiz } from "./typechain";

import { useCallback, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import QuizActionButton from "./QuizActionButton";
import {
    getSha256Hash,
    MUTTION_KEY_GET_SET_USER_ANSWER_HASHES,
    notEmpty,
    QUERY_KEY_GET_IS_USER_PASSED
} from "./QuizContractsUtils";
import { useQuizDetailsContext } from "./QuizDetailsContextProvider";
import { useToast } from '@chakra-ui/react';
import { DEFAULT_QUESTION_ID, useQuizStateContext } from "./QuizStateContextProvider";
import QuizState from "./QuizState";


export default function QuizConfirmationButton(
    { jpycQuiz } : { jpycQuiz: JPYCQuiz }
) {
    const { setCurrentQuizState, setCurrentQuestionID } = useQuizStateContext();
    const { answers, questionSize } = useQuizDetailsContext();
    const queryClient = useQueryClient();

    const [isTransactionWaiting, setIsTransactionWaiting] = useState(false);
    const toast = useToast();

    const answerHashes = answers.map(
        answer => answer.selectionID == null
            ? null
            : getSha256Hash(answer.selectionID)
    )?.filter(notEmpty);
    const answerHashesLength = answerHashes.length;

    useEffect(() => {
        const eventKey = 'LogUserAnswer';
        const listener = (
            _address: string,
            isSolved: boolean,
        ) => {
            setIsTransactionWaiting(false);
            if (!isSolved) {
                toast({
                    title: '合格点に達していません',
                    description: "再度トライしてください。",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                setCurrentQuestionID(DEFAULT_QUESTION_ID);
                setCurrentQuizState(QuizState.TOP);
                return;
            }

            setCurrentQuizState(QuizState.COMPLETED);
            queryClient.setQueryData(
                QUERY_KEY_GET_IS_USER_PASSED,
                isSolved,
            );
        };
        jpycQuiz.on(eventKey, listener);

        return () => {
            jpycQuiz.removeListener(eventKey, listener);
        };
    }, [jpycQuiz, queryClient, setCurrentQuizState, toast, setCurrentQuestionID]);

    const {
        isLoading: isMutationLoading,
        mutate,
    } = useMutation(
        () => jpycQuiz.setUserAnswerHashes(answerHashes),
        {
            mutationKey: MUTTION_KEY_GET_SET_USER_ANSWER_HASHES,
            onSuccess: (tx) => {
                setIsTransactionWaiting(true);
                toast({
                    title: '送信完了!',
                    description: "回答を送信しました。確認中のためしばしお待ちください",
                    status: 'success',
                    duration: 20000,
                    isClosable: true,
                });

                Promise.resolve(tx.wait())
                    .then(_tx => {
                    }).catch(_error => {
                        toast({
                            title: '送信失敗...',
                            description: "もう一度トライしてください。",
                            status: 'error',
                            duration: 5000,
                            isClosable: true,
                        });
                    }).finally(() => {
                        // For now, no operation is needed here since 
                        // it needs to wait for the event to emit the change.
                    });

            },
            onError: (_error) => {
                toast({
                    title: '送信失敗...',
                    description: "もう一度トライしてください。",
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            },
            retry: 0,
        },
    );

    const onButtonClick = useCallback(() => {
        if (questionSize !== answerHashesLength) {
            toast({
                title: '送信失敗...',
                description: "全問回答してください",
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        mutate();
    }, [mutate, questionSize, answerHashesLength, toast]);

    const hasMissingAnswers = answers.some(answer => answer.selectionID == null);
    const isLoading = isMutationLoading || isTransactionWaiting;

    return (
        <QuizActionButton
            isButtonDisabled={hasMissingAnswers}
            tooltipLabel="全問回答してください"
            buttonLabel="回答を送る"
            onButtonClick={onButtonClick}
            isLoading={isLoading}
        />
    );
}