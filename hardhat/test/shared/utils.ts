import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../../typechain";
import type {
    SignerWithAddress as SignerWithAddressType
} from "@nomiclabs/hardhat-ethers/signers";
import type { Wallet, Signer } from "ethers";

import { upgrades } from "hardhat";
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
    await txSetMintRewardCaller.wait();
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
        selectionLabels: string[];
        selectionIDs: string[];
        solutionHash: string;
    }[],
) {
    const setQuestions = questionSelections.map(
        async (selection, index) => {
            const tx = await JPYCQuiz.setQuestionInfo(
                index + 1,
                selection.selectionLabels,
                selection.selectionIDs,
                selection.solutionHash
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
        selectionLabels: string[];
        selectionIDs: string[];
        solutionHash: string;
    }[],        
) {
    const { quizName, questions,  minNumOfPasses } = quizInfo;

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
    const JPYCQuiz = (
        await upgrades.deployProxy(
            new JPYCQuizFactory(signer),
            [JPYCQuizRewardNFT.address],
            { initializer: 'initialize(address)' }
        )
    ) as JPYCQuizType;

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
}) {
    const { JPYCQuiz, connectAs, questionSelectionsInfo } = options;

    const answerHashes = await Promise.all(
        questionSelectionsInfo.map(
            async (selectionInfo, index) => {
            const questionInfo =
                await JPYCQuiz.connect(connectAs).getQuestionInfo(index + 1);
            return getSha256Hash(
                questionInfo.selectionIDs[selectionInfo.solutionIndex],
            );
            }
        )
    );
    
    return JPYCQuiz.connect(connectAs).setUserAnswerHashes(answerHashes);
}

export {
    setQuizQuestions,
    setMintRewardCaller,
    setQuizEventAndQuestionsSkelton,
    setQuizEventAndQuestionsSkeltonTransaction,
    setQuestionsInfo,
    deployJPYCQuizRewardNFT,
    deployJPYCQuiz,
    setUserAnswerHashesTransaction,
};