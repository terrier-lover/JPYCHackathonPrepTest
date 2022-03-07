import type { Data } from 'envfile';
import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";
import type {Signer} from "ethers";

import { ethers } from "hardhat";
import { ulid } from 'ulid';
import { promises as fs } from 'fs';
import { parse, stringify } from 'envfile';
import {
    JPYCQuiz__factory as JPYCQuizFactory,
    JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
    JPYCQuizRewardNFTSource__factory as JPYCQuizRewardNFTSourceFactory,
} from '../typechain';
import { TOKEN_NAME, TOKEN_SYMBOL } from '../settings';

async function setEnv(
    keyValueMap: { [key: string]: string },
    path: string,
) {
    let envData: Data = {};
    try {
        const envRawData = await fs.readFile(path, { encoding: 'utf-8' });
        envData = parse(envRawData);
    } catch (error) {
        console.log(error);
    }

    Object.keys(keyValueMap).forEach(key => {
        envData[key] = keyValueMap[key];
    });

    await fs.writeFile(path, stringify(envData));
}

function makeQuestionSelection(
    selectionLabels: string[],
    solutionIndex: number,
) {
    if (selectionLabels.length <= solutionIndex) {
        throw "Index outbound";
    }

    const selectionIDs = selectionLabels.map(_ => ulid());
    const solutionHash = getSha256Hash(selectionIDs[solutionIndex]);

    return {
        selectionLabels,
        selectionIDs,
        solutionHash,
        solutionIndex,
    };
}

function getSha256Hash(str: string) {
    return ethers.utils.sha256(
        ethers.utils.formatBytes32String(str)
    );
}

async function exportJSONString(
    jsonString: string,
    path: string,
) {
    await fs.writeFile(path, jsonString);
}

async function setMintRewardCaller(
    JPYCQuiz: JPYCQuizType,
    JPYCQuizRewardNFT: JPYCQuizRewardNFTType
) {
    const txSetEligibleCaller = await JPYCQuizRewardNFT.setEligibleCaller(
        JPYCQuiz.address,
    );
    return await txSetEligibleCaller.wait();
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
    nftSourceAddress: string,
) {
    const JPYCQuizRewardNFT = await (
        new JPYCQuizRewardNFTFactory(signer).deploy(
            TOKEN_NAME,
            TOKEN_SYMBOL,
            mintRewardCallerAddress,
            nftSourceAddress,
        )
    );
    await JPYCQuizRewardNFT.deployed();

    return JPYCQuizRewardNFT;
}

async function deployJPYCQuizRewardNFTSource(
    signer: Signer,
    mintRewardCallerAddress: string,
    nftSourceAddress?: string,
) {
    const JPYCQuizRewardNFTSource = await (
        new JPYCQuizRewardNFTSourceFactory(signer).deploy(
            mintRewardCallerAddress,
        )
    );
    await JPYCQuizRewardNFTSource.deployed();

    return JPYCQuizRewardNFTSource;
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
    quizTaker: Signer,
    questionSelectionsInfo: {
        numOfSelections: number,
        solutionIndex: number
    }[],
    numOfCorrectAnswers: number, // depending on this value, user fails the test
}) {
    const {
        JPYCQuiz,
        quizTaker,
        questionSelectionsInfo,
        numOfCorrectAnswers,
    } = options;

    let leftOverNumOfCorrectAnswers = numOfCorrectAnswers;

    const asyncAnswerHashes = questionSelectionsInfo.map(
        async (selectionInfo, index) => {
            const questionInfo =
                await JPYCQuiz.connect(quizTaker).getQuestionInfo(index + 1);

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

    return JPYCQuiz.connect(quizTaker).setUserAnswerHashes(answerHashes);
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

function makeQuestions(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => `質問${key}`);
}

function makeSelectionLabels(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => `選択肢${key}`);
}

function makeSelectionIDs(numOfQuestions: number) {
    return Array.from(Array(numOfQuestions).keys()).map(key => {
        // return string which has similar value with ulid
        return `01ARZ3NDEKTSV4RRFFQ69G5FA${key.toString(10)}`;
    });
}

function makeSelectionInfo(numOfQuestions: number) {
    const numOfSelections = 2;

    return Array.from(Array(numOfQuestions).keys()).map(
        key => {
            return {
                numOfSelections,
                solutionIndex: numOfSelections - (key % 2 == 0 ? 1 : 2),
            };
        }
    );
}

async function makeQuizQuestions(options: {
    JPYCQuiz: JPYCQuizType,
    quizName: string,
    numOfQuestions: number,
    minNumOfPasses: number,
    questionSelectionsInfo: {
        numOfSelections: number,
        solutionIndex: number,
    }[],
    useBinarySelections: boolean,
}) {
    const { 
        JPYCQuiz, 
        quizName, 
        numOfQuestions, 
        minNumOfPasses, 
        questionSelectionsInfo,
        useBinarySelections,
    } = options;

    const questions = makeQuestions(numOfQuestions);
    await setQuizEventAndQuestionsSkelton(
        JPYCQuiz,
        {
            quizName,
            questions,
            minNumOfPasses: minNumOfPasses,
        },
    );

    const questionSelections = questionSelectionsInfo.map(
        selectionInfo => {
            const { numOfSelections, solutionIndex } = selectionInfo;
            const selectionIDs = makeSelectionIDs(numOfSelections);

            return {
                selectionLabels: makeSelectionLabels(numOfSelections),
                selectionIDs,
                solutionHash: getSha256Hash(selectionIDs[solutionIndex]),
                useBinarySelections,
            };
        },
    );
    await setQuestionsInfo(JPYCQuiz, questionSelections);

    return { questions, questionSelections }
}

// Sync with QuizStatus enum defined in IJPYCQuizEligibility.sol
enum QuizStatus {
    IS_USER_ELIGIBLE,
    USER_HAS_SOLVED,
    USER_HAS_MINTED,
    QUIZ_NOT_READY, 
    QUIZ_NFT_SOURCE_NOT_READY,
    QUIZ_NFT_NOT_READY,
    INVALID_OPERATION,    
}

export { 
    makeQuestionSelection, 
    getSha256Hash, 
    exportJSONString,
    setEnv,
    notEmpty,
    setQuizQuestions,
    setMintRewardCaller,
    setQuizEventAndQuestionsSkelton,
    setQuizEventAndQuestionsSkeltonTransaction,
    setQuestionsInfo,
    deployJPYCQuizRewardNFT,
    deployJPYCQuiz,
    setUserAnswerHashesTransaction,
    deployJPYCQuizRewardNFTSource,
    makeQuestions, 
    makeQuizQuestions, 
    makeSelectionInfo,
    QuizStatus,
};