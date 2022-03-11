import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";
import type { Wallet } from "ethers";

import {
    Signer,
    ContractTransaction as ContractTransactionType,
    ethers,
} from "ethers";
import { expect } from "chai";
import { deployJPYCQuiz, deployJPYCQuizRewardNFT, deployJPYCQuizRewardNFTSource, makeQuizQuestions, QuizStatus, setMintRewardCaller } from "./QuizUtils";
import { TOKEN_NAME } from "../settings";
const detectSVG = require("detect-svg");

async function testGetNFT(options: {
    JPYCQuiz: JPYCQuizType,
    JPYCQuizRewardNFT: JPYCQuizRewardNFTType,
    quizTaker: Signer,
    nextTokenID: number,
    transaction: Promise<ContractTransactionType>,
}) {
    const {
        JPYCQuiz,
        JPYCQuizRewardNFT,
        quizTaker,
        nextTokenID,
        transaction,
    } = options;

    const quizTakerAddress = await quizTaker.getAddress();

    await expect(transaction)
        .to.emit(JPYCQuiz, 'LogUserAnswer')
        .withArgs(quizTakerAddress, true);
    await expect(transaction)
        .to.emit(JPYCQuiz, 'LogMintReward')
        .withArgs(quizTakerAddress, nextTokenID, false);
    await (await transaction).wait();

    await testTokenMinted({
        JPYCQuizRewardNFT,
        targetAddress: quizTakerAddress,
        currentTokenID: nextTokenID,
    });
}

async function testTokenMinted({
    JPYCQuizRewardNFT,
    targetAddress,
    currentTokenID,
}: {
    JPYCQuizRewardNFT: JPYCQuizRewardNFTType,
    targetAddress: string,
    currentTokenID: number,
}) {
    const mintedTokenID = (
        await JPYCQuizRewardNFT.getTokenIDFromMinter(targetAddress)
    ).toNumber();
    expect(mintedTokenID).to.equals(currentTokenID);

    const actualQuizTakerAddress = await JPYCQuizRewardNFT.ownerOf(currentTokenID);
    expect(actualQuizTakerAddress).to.equals(targetAddress);

    const rawTokenURIReturn = await JPYCQuizRewardNFT.tokenURI(currentTokenID);
    const tokenURIObject = JSON.parse(atob(rawTokenURIReturn.split(",")[1]));
    const generatedSVG = atob(tokenURIObject.image.split(",")[1]);
    expect(tokenURIObject.name).to.equals(`${TOKEN_NAME} #${currentTokenID}`);
    expect(detectSVG(generatedSVG)).to.equals(true);
}

async function testGetQuizEligiblity(options: {
    JPYCQuiz: JPYCQuizType,
    quizTaker: Signer,
    expectedIsEligible: boolean,
    expectedQuizStatus: QuizStatus,
}) {
    const { JPYCQuiz, quizTaker, expectedIsEligible, expectedQuizStatus } = options;

    const eligibilityInfo = await JPYCQuiz.connect(quizTaker).getQuizEligiblity();
    expect(eligibilityInfo[0]).to.equals(expectedIsEligible);
    expect(eligibilityInfo[1]).to.equals(expectedQuizStatus);
}

function quizCreationFixtures(
    walletInfo: {
        ownerWalletIndex: number,
        quizTakerWalletIndex?: number,
        otherPersonWalletIndex?: number,
    },
    quizName: string,
    quizInfo: {
        minNumOfPasses: number,
        numOfQuestions: number,
        questionSelectionsInfo: {
            numOfSelections: number;
            solutionIndex: number;
        }[],
    },
) {
    return async (wallets: Wallet[]) => {
        const owner = wallets[walletInfo.ownerWalletIndex];
        const quizTaker = walletInfo.quizTakerWalletIndex != null
            ? wallets[walletInfo.quizTakerWalletIndex]
            : null;
        const otherPerson = walletInfo.otherPersonWalletIndex != null
            ? wallets[walletInfo.otherPersonWalletIndex]
            : null;

        const JPYCQuizRewardNFTSource = await deployJPYCQuizRewardNFTSource(
            owner,
            ethers.constants.AddressZero
        );

        const JPYCQuizRewardNFT = await deployJPYCQuizRewardNFT(
            owner,
            ethers.constants.AddressZero,
            JPYCQuizRewardNFTSource.address,
        );
        const JPYCQuiz = await deployJPYCQuiz(JPYCQuizRewardNFT.address, owner);
        const setEligibleCallerForNFTSourceTx = await JPYCQuizRewardNFTSource.setEligibleCaller(
            JPYCQuizRewardNFT.address
        );
        await setEligibleCallerForNFTSourceTx.wait();

        const quizQuestions = await makeQuizQuestions({
            JPYCQuiz,
            quizName,
            numOfQuestions: quizInfo.numOfQuestions,
            minNumOfPasses: quizInfo.minNumOfPasses,
            questionSelectionsInfo: quizInfo.questionSelectionsInfo,
        });
        const questionSelections = quizQuestions.questionSelections;

        await setMintRewardCaller(
            JPYCQuiz,
            JPYCQuizRewardNFT,
        );

        return {
            owner,
            questionSelections,
            quizTaker,
            otherPerson,
            JPYCQuizRewardNFT,
            JPYCQuiz
        };
    }
}

export { testGetNFT, testGetQuizEligiblity, quizCreationFixtures, testTokenMinted };