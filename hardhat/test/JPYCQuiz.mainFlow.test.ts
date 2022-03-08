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
  deployJPYCQuizRewardNFTSource,
  setMintRewardCaller,
  setUserAnswerHashesTransaction,
  makeQuizQuestions, 
  makeSelectionInfo,
  QuizStatus
} from "../utils/QuizUtils";
import { testGetNFT, testGetQuizEligiblity } from "../utils/QuizTestUtils";

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
        quizTakerIndex: 1, // wallet=quizTaker1
        questionSelectionsInfo: makeSelectionInfo(2),
        useBinarySelections: true,
      },
      // {
      //   // Scenario2: number of questions=10, minimum criteria=10
      //   // => Users should solve all questions
      //   minNumOfPasses: 10,
      //   numOfQuestions: 10,
      //   quizTakerIndex: 2, // wallet=quizTaker2
      //   questionSelectionsInfo: makeSelectionInfo(10),
      //   useBinarySelections: false,
      // },
      // {
      //   // Scenario3: number of questions=10, minimum criteria=5
      //   // => Users need to pass more than 5 questions
      //   minNumOfPasses: 5,
      //   numOfQuestions: 10,
      //   quizTakerIndex: 1, // wallet=quizTaker1
      //   questionSelectionsInfo: makeSelectionInfo(10),
      //   useBinarySelections: false,
      // },
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
        let quizTaker: Signer;

        const quizFixtures = async (wallets: Wallet[]) => {
          const JPYCQuizRewardNFTSource = await deployJPYCQuizRewardNFTSource(
            wallets[0], 
            ethers.constants.AddressZero
          );

          const JPYCQuizRewardNFT = await deployJPYCQuizRewardNFT(
            wallets[0],
            ethers.constants.AddressZero,
            JPYCQuizRewardNFTSource.address,
          );
          const JPYCQuiz = await deployJPYCQuiz(JPYCQuizRewardNFT, wallets[0]);
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
            useBinarySelections: quizInfo.useBinarySelections,
          });
          questions = quizQuestions.questions;
          questionSelections = quizQuestions.questionSelections;
          quizTaker = wallets[quizInfo.quizTakerIndex];

          await setMintRewardCaller(
            JPYCQuiz,
            JPYCQuizRewardNFT,
          );

          return {
            questions,
            questionSelections,
            quizTaker,
            JPYCQuizRewardNFT,
            JPYCQuiz
          };
        }

        beforeEach('load quiz questions fixtures', async () => {
          const fixtures = await loadFixture(quizFixtures);

          questions = fixtures.questions;
          questionSelections = fixtures.questionSelections;
          quizTaker = fixtures.quizTaker;
          JPYCQuiz = fixtures.JPYCQuiz;
          JPYCQuizRewardNFT = fixtures.JPYCQuizRewardNFT;
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

        it("User is eligible to solve question", async () => {
          await testGetQuizEligiblity({ 
            JPYCQuiz, 
            quizTaker,
            expectedIsEligible: true, 
            expectedQuizStatus: QuizStatus.IS_USER_ELIGIBLE 
          });
        }); 
       
        it("get NFT after sending correct answers", async () => {
          const transaction = setUserAnswerHashesTransaction({
            JPYCQuiz,
            quizTaker,
            questionSelectionsInfo: quizInfo.questionSelectionsInfo,
            numOfCorrectAnswers: quizInfo.minNumOfPasses,
          });

          await testGetNFT({
            JPYCQuiz,
            JPYCQuizRewardNFT,
            quizTaker,
            nextTokenID: 1,
            transaction,
          });

          // User is no longer eligible to solve quiz
          await testGetQuizEligiblity({ 
            JPYCQuiz, 
            quizTaker,
            expectedIsEligible: false, 
            expectedQuizStatus: QuizStatus.USER_HAS_SOLVED 
          });
        });

        it("cannot get NFT after sending wrong answers", async () => {
          const transaction = setUserAnswerHashesTransaction({
            JPYCQuiz,
            quizTaker,
            questionSelectionsInfo: quizInfo.questionSelectionsInfo,
            numOfCorrectAnswers: quizInfo.minNumOfPasses - 1,
          });
          const connectAsAddress = await quizTaker.getAddress();

          await expect(transaction)
            .to.emit(JPYCQuiz, 'LogUserAnswer')
            .withArgs(connectAsAddress, false);
        });

        for (
          const walletInfo of [
            {
              // Secnario1: Use same wallet -> the second transaction should output error
              firstQuizTakerInd: 1, // wallet=quizTaker1
              secondQuizTakerInd: 1, // wallet=quizTaker1
              hasSecondTransactionError: true,
            },
            {
              // Secnario2: Use different wallet -> the second transaction should succeed
              firstQuizTakerInd: 1, // wallet=quizTaker1
              secondQuizTakerInd: 2, // wallet=quizTaker2
              hasSecondTransactionError: false,
            },
          ]
        ) {
          describe(
            `Send answers using ${walletInfo.firstQuizTakerInd === walletInfo.secondQuizTakerInd ? "same" : "different"} wallet`,
            () => {
              let firstQuizTaker: Signer;
              let secondQuizTaker: Signer;

              const firstAndSecondTxFixtures = async (wallets: Wallet[]) => {
                const firstQuizTaker = wallets[walletInfo.firstQuizTakerInd];
                const secondQuizTaker = wallets[walletInfo.secondQuizTakerInd];

                return { firstQuizTaker, secondQuizTaker };
              };

              beforeEach('load fixtures', async () => {
                const fixtures = await loadFixture(firstAndSecondTxFixtures);

                firstQuizTaker = fixtures.firstQuizTaker;
                secondQuizTaker = fixtures.secondQuizTaker;
              });

              it('send two transactions', async () => {
                const firstTransaction = setUserAnswerHashesTransaction({
                  JPYCQuiz,
                  quizTaker: firstQuizTaker,
                  questionSelectionsInfo: quizInfo.questionSelectionsInfo,
                  numOfCorrectAnswers: quizInfo.minNumOfPasses,
                });
                await testGetNFT({
                  JPYCQuiz,
                  JPYCQuizRewardNFT,
                  quizTaker: firstQuizTaker,
                  nextTokenID: 1,
                  transaction: firstTransaction,
                });

                const secondTransaction = setUserAnswerHashesTransaction({
                  JPYCQuiz,
                  quizTaker: secondQuizTaker,
                  questionSelectionsInfo: quizInfo.questionSelectionsInfo,
                  numOfCorrectAnswers: quizInfo.minNumOfPasses,
                });

                if (walletInfo.hasSecondTransactionError) {
                  await expect(secondTransaction).to.reverted;
                } else {
                  await testGetNFT({
                    JPYCQuiz,
                    JPYCQuizRewardNFT,
                    quizTaker: secondQuizTaker,
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