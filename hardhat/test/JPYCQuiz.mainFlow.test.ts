import type {
  JPYCQuiz as JPYCQuizType,
  JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";
import type { Wallet, Signer } from "ethers";

import { expect } from "chai";
import { ethers, waffle } from "hardhat";
import {
  deployJPYCQuiz,
  deployJPYCQuizRewardNFT,
  setMintRewardCaller,
  setUserAnswerHashesTransaction,
  testGetNFT
} from "./shared/utils";
import { makeQuizQuestions, makeSelectionInfo } from "./shared/fixtures";
import sinon from "sinon";

const createFixtureLoader = waffle.createFixtureLoader;

const quizName = 'test';

describe("JPYCQuiz.mainFlow.test", () => {
  let loadFixture: ReturnType<typeof createFixtureLoader>;
  let owner: Wallet;
  let quizTaker1: Wallet;
  let quizTaker2: Wallet;
  let otherPerson: Wallet;

  before(async () => {
    [owner, quizTaker1, quizTaker2, otherPerson] = await (ethers as any).getSigners();
    loadFixture = createFixtureLoader([owner, quizTaker1, quizTaker2, otherPerson]);
  });

  for (
    const quizInfo of [
      {
        // Scenario1: number of questions=2, minimum criteria=2 
        // => Users should solve all questions
        minNumOfPasses: 2,
        numOfQuestions: 2,
        connectAsWalletIndex: 2, // wallet=quizTaker1
        questionSelectionsInfo: makeSelectionInfo(2),
        useBinarySelections: true,
      },
      {
        // Scenario2: number of questions=10, minimum criteria=10
        // => Users should solve all questions
        minNumOfPasses: 10,
        numOfQuestions: 10,
        connectAsWalletIndex: 3, // wallet=quizTaker2
        questionSelectionsInfo: makeSelectionInfo(10),
        useBinarySelections: false,
      },
      {
        // Scenario3: number of questions=10, minimum criteria=5
        // => Users need to pass more than 5 questions
        minNumOfPasses: 5,
        numOfQuestions: 10,
        connectAsWalletIndex: 2, // wallet=quizTaker1
        questionSelectionsInfo: makeSelectionInfo(10),
        useBinarySelections: false,
      },
    ]
  ) {
    describe(
      `Set quiz info: minNumOfPasses=${quizInfo.minNumOfPasses} numOfQuestions=${quizInfo.numOfQuestions}`,
      () => {
        let JPYCQuiz: JPYCQuizType;
        let JPYCQuizRewardNFT: JPYCQuizRewardNFTType;
        let questions: string[];
        let questionSelections: {
          selectionLabels: string[];
          selectionIDs: string[];
          solutionHash: string;
        }[];
        let connectAs: Signer;

        const quizFixtures = async (wallets: Wallet[]) => {
          const JPYCQuizRewardNFT = await deployJPYCQuizRewardNFT(
            wallets[0],
            ethers.constants.AddressZero
          );
          const JPYCQuiz = await deployJPYCQuiz(JPYCQuizRewardNFT, wallets[0]);

          const quizQuestions = await makeQuizQuestions({
            JPYCQuiz,
            quizName,
            numOfQuestions: quizInfo.numOfQuestions,
            minNumOfPasses: quizInfo.minNumOfPasses,
            questionSelectionsInfo: quizInfo.questionSelectionsInfo,
            useBinarySelections: quizInfo.useBinarySelections,
          });
          questions = quizQuestions.questions;
          questionSelections = quizQuestions.questionSelections;
          connectAs = wallets[quizInfo.connectAsWalletIndex];

          return {
            questions,
            questionSelections,
            connectAs,
            JPYCQuizRewardNFT,
            JPYCQuiz
          };
        }

        beforeEach('load quiz questions fixtures', async () => {
          const fixtures = await loadFixture(quizFixtures);

          questions = fixtures.questions;
          questionSelections = fixtures.questionSelections;
          connectAs = fixtures.connectAs;
          JPYCQuiz = fixtures.JPYCQuiz;
          JPYCQuizRewardNFT = fixtures.JPYCQuizRewardNFT;

          await setMintRewardCaller(JPYCQuiz, JPYCQuizRewardNFT);
        });

        it("Quiz event is properly set", async () => {
          const currentQuizEvent = await JPYCQuiz.getQuizEvent();
          expect(currentQuizEvent.numOfQuestions.toNumber()).to.equals(
            quizInfo.numOfQuestions,
          );
          expect(currentQuizEvent.minNumOfPasses.toNumber()).to.equals(
            quizInfo.minNumOfPasses,
          );
          expect(currentQuizEvent.quizName).to.equals(quizName);
        });

        it("Questions are properly set", async () => {
          const getQuestionInfoList = quizInfo.questionSelectionsInfo.map(
            async (_selectionInfo, index) => {
              return await JPYCQuiz.getQuestionInfo(index + 1);
            }
          );
          const questionsInfo = await Promise.all(getQuestionInfoList);
          expect(questionsInfo.length).to.equals(quizInfo.numOfQuestions);

          questionsInfo.map((questionInfo, index) => {
            expect(questionInfo.question).to.equals(questions[index]);
            expect(JSON.stringify(questionInfo.selectionLabels)).to.equal(
              JSON.stringify(questionSelections[index].selectionLabels)
            );
            expect(JSON.stringify(questionInfo.selectionIDs)).to.equals(
              JSON.stringify(questionSelections[index].selectionIDs)
            );
          });
        });

        it("get NFT after sending correct answers", async () => {
          const transaction = setUserAnswerHashesTransaction({
            JPYCQuiz,
            connectAs,
            questionSelectionsInfo: quizInfo.questionSelectionsInfo,
            numOfCorrectAnswers: quizInfo.minNumOfPasses,
          });

          await testGetNFT({
            JPYCQuiz,
            JPYCQuizRewardNFT,
            connectAs,
            nextTokenID: 1,
            transaction: transaction,
          });
        });

        it("cannot get NFT after sending wrong answers", async () => {
          const transaction = setUserAnswerHashesTransaction({
            JPYCQuiz,
            connectAs,
            questionSelectionsInfo: quizInfo.questionSelectionsInfo,
            numOfCorrectAnswers: quizInfo.minNumOfPasses - 1,
          });
          const connectAsAddress = await connectAs.getAddress();

          await expect(transaction)
            .to.emit(JPYCQuiz, 'LogUserAnswer')
            .withArgs(connectAsAddress, false);
        });

        for (
          const walletInfo of [
            {
              // Secnario1: Use same wallet -> the second transaction should output error
              firstConnectAsInd: 1, // wallet=quizTaker1
              secondConnectAsInd: 1, // wallet=quizTaker1
              hasSecondTransactionError: true,
            },
            {
              // Secnario2: Use different wallet -> the second transaction should succeed
              firstConnectAsInd: 1, // wallet=quizTaker1
              secondConnectAsInd: 2, // wallet=quizTaker2
              hasSecondTransactionError: false,
            },
          ]
        ) {
          describe(
            `Send answers using ${walletInfo.firstConnectAsInd === walletInfo.secondConnectAsInd ? "same" : "different"} wallet`,
            () => {
              let firstConnectAs: Signer;
              let secondConnectAs: Signer;

              const firstAndSecondTxFixtures = async (wallets: Wallet[]) => {
                const firstConnectAs = wallets[walletInfo.firstConnectAsInd];
                const secondConnectAs = wallets[walletInfo.secondConnectAsInd];

                return { firstConnectAs, secondConnectAs };
              };

              beforeEach('load fixtures', async () => {
                const fixtures = await loadFixture(firstAndSecondTxFixtures);

                firstConnectAs = fixtures.firstConnectAs;
                secondConnectAs = fixtures.secondConnectAs;
              });

              it('send two transactions', async () => {
                const firstTransaction = setUserAnswerHashesTransaction({
                  JPYCQuiz,
                  connectAs: firstConnectAs,
                  questionSelectionsInfo: quizInfo.questionSelectionsInfo,
                  numOfCorrectAnswers: quizInfo.minNumOfPasses,
                });
                await testGetNFT({
                  JPYCQuiz,
                  JPYCQuizRewardNFT,
                  connectAs: firstConnectAs,
                  nextTokenID: 1,
                  transaction: firstTransaction,
                });

                const secondTransaction = setUserAnswerHashesTransaction({
                  JPYCQuiz,
                  connectAs: secondConnectAs,
                  questionSelectionsInfo: quizInfo.questionSelectionsInfo,
                  numOfCorrectAnswers: quizInfo.minNumOfPasses,
                });

                if (walletInfo.hasSecondTransactionError) {
                  await expect(secondTransaction).to.reverted;
                } else {
                  await testGetNFT({
                    JPYCQuiz,
                    JPYCQuizRewardNFT,
                    connectAs: secondConnectAs,
                    nextTokenID: 2, // this is 2nd time, so id becomes 2
                    transaction: secondTransaction,
                  });
                }
              });
            }
          );
        }
      }
    );
  }
});