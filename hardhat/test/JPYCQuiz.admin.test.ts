import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";
import type { Signer, Wallet } from "ethers";

import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import {
    makeQuizQuestions,
    makeSelectionInfo,
    getQuestionsInfo,
    makeQuestionSelection,
    makeQuestion
} from "../utils/QuizUtils";
import { quizCreationFixtures, testTokenMinted } from "../utils/QuizTestUtils";

const createFixtureLoader = waffle.createFixtureLoader;
const quizName = 'test';

describe("JPYCQuiz.admin.test", () => {
    let loadFixture: ReturnType<typeof createFixtureLoader>;
    let owner: Wallet;
    let otherPerson: Wallet;
    let testTaker: Wallet;
    const ownerWalletIndex = 0;
    const otherPersonWalletIndex = 1;
    const quizTakerWalletIndex = 2;

    before(async () => {
        [owner, otherPerson, testTaker] = await (ethers as any).getSigners();
        loadFixture = createFixtureLoader([owner, otherPerson, testTaker]);
    });

    describe(
        `Create Reward NFT contract as owner`,
        () => {
            let JPYCQuiz: JPYCQuizType;
            let JPYCQuizRewardNFT: JPYCQuizRewardNFTType;
            let questionSelections: {
                selectionLabels: string[];
                selectionIDs: string[];
                solutionHash: string;
            }[];
            let otherPerson: Signer;
            let quizTaker: Signer;

            const initialNumOfQuestions = 2;
            const initialMinNumOfPasses = 2;

            beforeEach('load quiz contract', async () => {
                const fixtures = await loadFixture(quizCreationFixtures(
                    {
                        ownerWalletIndex,
                        quizTakerWalletIndex,
                        otherPersonWalletIndex,
                    },
                    quizName,
                    {
                        minNumOfPasses: initialMinNumOfPasses,
                        numOfQuestions: initialNumOfQuestions,
                        questionSelectionsInfo: makeSelectionInfo(initialNumOfQuestions)
                    },
                ));
                JPYCQuiz = fixtures.JPYCQuiz;
                JPYCQuizRewardNFT = fixtures.JPYCQuizRewardNFT;
                questionSelections = fixtures.questionSelections;
                otherPerson = fixtures.otherPerson!; // other person should not be null
                quizTaker = fixtures.quizTaker!; // quiz taker should not be null
            });

            it("Replace quiz. The version number increases", async () => {
                expect((await JPYCQuiz.getQuizEvent()).versionID.toNumber()).to.equals(1);
                expect((await getQuestionsInfo({ JPYCQuiz })).length).to.equals(initialNumOfQuestions);

                let newNumOfQuestions = 4;
                let newMinNumOfPasses = 4;
                await makeQuizQuestions({
                    JPYCQuiz,
                    quizName: `${quizName}-part2`,
                    numOfQuestions: newNumOfQuestions,
                    minNumOfPasses: newMinNumOfPasses,
                    questionSelectionsInfo: makeSelectionInfo(newNumOfQuestions),
                });

                expect((await JPYCQuiz.getQuizEvent()).versionID.toNumber()).to.equals(2);
                expect((await getQuestionsInfo({ JPYCQuiz })).length).to.equals(newNumOfQuestions);
            });

            it("Change quiz event name", async () => {
                expect((await JPYCQuiz.getQuizEvent()).quizName).to.equals(quizName);

                const newQuizName = "newQuizName";
                await (await JPYCQuiz.setQuizName(newQuizName)).wait();
                expect((await JPYCQuiz.getQuizEvent()).quizName).to.equals(newQuizName);
            });

            it("Mark quiz event as ended", async () => {
                expect((await JPYCQuiz.getQuizEvent()).quizEnded).to.equals(false);
                await (await JPYCQuiz.setQuizEnd(true)).wait();

                expect((await JPYCQuiz.getQuizEvent()).quizEnded).to.equals(true);
            });

            it("Update question only. The version is not updated", async () => {
                expect((await JPYCQuiz.getQuizEvent()).versionID.toNumber()).to.equals(1);
                const targetQuestionID = initialNumOfQuestions;
                const currentQuestionInfo = await JPYCQuiz.getQuestionInfo(targetQuestionID);

                const questionSelection = makeQuestionSelection(
                    ["selection1", "selection2", "selection3"],
                    1, // solutionIndex
                );
                await (
                    await JPYCQuiz.setQuestionInfo(
                        targetQuestionID,
                        `${makeQuestion(targetQuestionID)}-updated`,
                        questionSelection.selectionLabels,
                        questionSelection.selectionIDs,
                        questionSelection.solutionHash,
                    )
                ).wait();
                const newQuestionInfo = await JPYCQuiz.getQuestionInfo(targetQuestionID);

                expect(currentQuestionInfo.questionID).to.equals(newQuestionInfo.questionID);
                expect(currentQuestionInfo.question).to.not.equals(newQuestionInfo.question);
                expect(currentQuestionInfo.selectionLabels).to.not.equals(newQuestionInfo.selectionLabels);
                expect(currentQuestionInfo.selectionIDs).to.not.equals(newQuestionInfo.selectionIDs);
                expect((await JPYCQuiz.getQuizEvent()).versionID.toNumber()).to.equals(1);
            });

            it("Owner can mint NFT for other person", async () => {
                const quizTakerAddress = await quizTaker.getAddress();

                await expect(JPYCQuiz.ownerMintRewardBypassCheck(quizTakerAddress))
                    .to.emit(JPYCQuiz, 'LogMintReward')
                    .withArgs(quizTakerAddress, 1, true);

                await testTokenMinted({
                    JPYCQuizRewardNFT,
                    targetAddress: quizTakerAddress,
                    currentTokenID: 1,
                });
            });

            it("Non-owner cannot change the quiz info", async () => {
                const JPYCQuizAsOtherPerson = JPYCQuiz.connect(otherPerson);
                await expect(JPYCQuizAsOtherPerson.setQuizName("New Name")).to.be.reverted;
                await expect(JPYCQuizAsOtherPerson.setQuizEnd(true)).to.be.reverted;
                await expect(JPYCQuizAsOtherPerson.setMinNumOfPasses(1)).to.be.reverted;

                const targetQuestionID = initialNumOfQuestions;
                const questionSelection = makeQuestionSelection(
                    ["selection1", "selection2", "selection3"],
                    1, // solutionIndex
                );
                await expect(
                    JPYCQuizAsOtherPerson.setQuestionInfo(
                        targetQuestionID,
                        `${makeQuestion(targetQuestionID)}-updated`,
                        questionSelection.selectionLabels,
                        questionSelection.selectionIDs,
                        questionSelection.solutionHash,
                    )
                ).to.be.reverted;
            });

            it("Non-owner cannot use mint function for owner", async () => {
                const JPYCQuizAsOtherPerson = JPYCQuiz.connect(otherPerson);
                const quizTakerAddress = await quizTaker.getAddress();
                await expect(
                    JPYCQuizAsOtherPerson.ownerMintRewardBypassCheck(quizTakerAddress)
                ).to.be.reverted;
            });
        }
    );
});