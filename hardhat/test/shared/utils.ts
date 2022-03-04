import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../../typechain";
import type {
    Signer,
    ContractTransaction as ContractTransactionType
} from "ethers";

import { expect } from "chai";
import {
    JPYCQuiz__factory as JPYCQuizFactory,
    JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
} from '../../typechain';
import { getSha256Hash } from '../../utils/QuizUtils';

async function setMintRewardCaller(
    JPYCQuiz: JPYCQuizType,
    JPYCQuizRewardNFT: JPYCQuizRewardNFTType
) {
    const txSetMintRewardCaller = await JPYCQuizRewardNFT.setMintRewardCaller(
        JPYCQuiz.address,
    );
    return await txSetMintRewardCaller.wait();
}

async function setQuizEventAndQuestionsSkelton(
    JPYCQuiz: JPYCQuizType,
    quizInfo: {
        quizName: string,
        questions: string[],
        minNumOfPasses: number,
    },
) {
    const tx = await setQuizEventAndQuestionsSkeltonTransaction(
        JPYCQuiz,
        quizInfo
    );
    await tx.wait();
}

function setQuizEventAndQuestionsSkeltonTransaction(
    JPYCQuiz: JPYCQuizType,
    quizInfo: {
        quizName: string,
        questions: string[],
        minNumOfPasses: number,
    },
) {
    const { quizName, questions, minNumOfPasses } = quizInfo;

    return JPYCQuiz.setQuizEventAndQuestionsSkelton(
        quizName,
        questions,
        minNumOfPasses
    );
}

async function setQuestionsInfo(
    JPYCQuiz: JPYCQuizType,
    questionSelections: {
        selectionLabels: string[],
        selectionIDs: string[],
        solutionHash: string,
    }[],
) {
    const setQuestions = questionSelections.map(
        async (selection, index) => {
            const tx = await JPYCQuiz.setQuestionInfo(
                index + 1,
                selection.selectionLabels,
                selection.selectionIDs,
                selection.solutionHash,
            );
            return await tx.wait();
        }
    );
    await Promise.all(setQuestions);
}

async function setQuizQuestions(
    JPYCQuiz: JPYCQuizType,
    quizInfo: {
        quizName: string,
        questions: string[],
        minNumOfPasses: number,
    },
    questionSelections: {
        selectionLabels: string[],
        selectionIDs: string[],
        solutionHash: string,
        useBinarySelections: boolean,
    }[],
) {
    const { quizName, questions, minNumOfPasses } = quizInfo;

    await setQuizEventAndQuestionsSkelton(
        JPYCQuiz,
        {
            quizName,
            questions: questions,
            minNumOfPasses: minNumOfPasses,
        },
    );
    await setQuestionsInfo(JPYCQuiz, questionSelections);
}

async function deployJPYCQuizRewardNFT(
    signer: Signer,
    mintRewardCallerAddress: string,
) {
    const JPYCQuizRewardNFT = await (
        new JPYCQuizRewardNFTFactory(signer).deploy(
            "JPYC Hackathon NFT",
            "JPYCHACK",
            mintRewardCallerAddress
        )
    );
    await JPYCQuizRewardNFT.deployed();

    return JPYCQuizRewardNFT;
}

async function deployJPYCQuiz(
    JPYCQuizRewardNFT: JPYCQuizRewardNFTType,
    signer: Signer,
) {
    const JPYCQuiz = await (
        new JPYCQuizFactory(signer).deploy(
            JPYCQuizRewardNFT.address
        )
    );
    await JPYCQuiz.deployed();

    return JPYCQuiz;
}

async function setUserAnswerHashesTransaction(options: {
    JPYCQuiz: JPYCQuizType,
    connectAs: Signer,
    questionSelectionsInfo: {
        numOfSelections: number,
        solutionIndex: number
    }[],
    numOfCorrectAnswers: number, // depending on this value, user fails the test
}) {
    const {
        JPYCQuiz,
        connectAs,
        questionSelectionsInfo,
        numOfCorrectAnswers,
    } = options;

    let leftOverNumOfCorrectAnswers = numOfCorrectAnswers;

    const asyncAnswerHashes = questionSelectionsInfo.map(
        async (selectionInfo, index) => {
            const questionInfo =
                await JPYCQuiz.connect(connectAs).getQuestionInfo(index + 1);

            let rawSolutionID: string | null = null;
            const correctSolutionID = questionInfo.selectionIDs[
                selectionInfo.solutionIndex
            ];

            if (leftOverNumOfCorrectAnswers > 0) {
                // set correct answer
                rawSolutionID = correctSolutionID;
                leftOverNumOfCorrectAnswers--;
            } else {
                rawSolutionID = questionInfo.selectionIDs.find(
                    selectionID => selectionID !== correctSolutionID
                ) ?? null;
            }

            if (rawSolutionID == null) {
                return null;
            }

            return getSha256Hash(rawSolutionID);
        }
    );

    const answerHashes = (await Promise.all(asyncAnswerHashes)).filter(notEmpty);

    return JPYCQuiz.connect(connectAs).setUserAnswerHashes(answerHashes);
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

async function testGetNFT(options: {
    JPYCQuiz: JPYCQuizType,
    JPYCQuizRewardNFT: JPYCQuizRewardNFTType,
    connectAs: Signer,
    nextTokenID: number,
    transaction: Promise<ContractTransactionType>,
}) {
    const {
        JPYCQuiz,
        JPYCQuizRewardNFT,
        connectAs,
        nextTokenID,
        transaction,
    } = options;

    const connectAsAddress = await connectAs.getAddress();

    await expect(transaction)
        .to.emit(JPYCQuiz, 'LogUserAnswer')
        .withArgs(connectAsAddress, true);
    await expect(transaction)
        .to.emit(JPYCQuiz, 'LogMintReward')
        .withArgs(connectAsAddress, nextTokenID, false);

    const mintedTokenID = (
        await JPYCQuizRewardNFT.connect(connectAs).getTokenIDFromMinter(
            connectAsAddress
        )
    ).toNumber();
    expect(mintedTokenID).to.equals(nextTokenID);

    const actualQuizTakerAddress =
        await JPYCQuizRewardNFT.connect(connectAs).ownerOf(mintedTokenID);
    expect(actualQuizTakerAddress).to.equals(connectAsAddress);
}

export {
    notEmpty,
    setQuizQuestions,
    setMintRewardCaller,
    setQuizEventAndQuestionsSkelton,
    setQuizEventAndQuestionsSkeltonTransaction,
    setQuestionsInfo,
    deployJPYCQuizRewardNFT,
    deployJPYCQuiz,
    setUserAnswerHashesTransaction,
    testGetNFT,
};