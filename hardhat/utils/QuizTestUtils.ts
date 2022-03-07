import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";
import type {
    Signer,
    ContractTransaction as ContractTransactionType
} from "ethers";

import { expect } from "chai";
import { QuizStatus } from "./QuizUtils";
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

    const mintedTokenID = (
        await JPYCQuizRewardNFT.getTokenIDFromMinter(quizTakerAddress)
    ).toNumber();
    expect(mintedTokenID).to.equals(nextTokenID);

    const actualQuizTakerAddress = await JPYCQuizRewardNFT.ownerOf(nextTokenID);
    expect(actualQuizTakerAddress).to.equals(quizTakerAddress);

    const rawTokenURIReturn = await JPYCQuizRewardNFT.tokenURI(nextTokenID);
    const tokenURIObject = JSON.parse(atob(rawTokenURIReturn.split(",")[1]));
    const generatedSVG = atob(tokenURIObject.image.split(",")[1]);
    expect(tokenURIObject.name).to.equals(`${TOKEN_NAME} #${nextTokenID}`);
    expect(detectSVG(generatedSVG)).to.equals(true);
}

async function testGetQuizEligiblity(options: {
    JPYCQuiz: JPYCQuizType,
    quizTaker: Signer,
    expectedIsEligible: boolean,
    expectedQuizStatus: QuizStatus,
}) {
    const {JPYCQuiz, quizTaker, expectedIsEligible, expectedQuizStatus} = options;

    const eligibilityInfo = await JPYCQuiz.connect(quizTaker).getQuizEligiblity();
    expect(eligibilityInfo[0]).to.equals(expectedIsEligible);
    expect(eligibilityInfo[1]).to.equals(expectedQuizStatus);
}

export { testGetNFT, testGetQuizEligiblity };