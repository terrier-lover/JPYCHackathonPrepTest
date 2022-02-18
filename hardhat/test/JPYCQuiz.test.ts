import type {
  JPYCQuiz as JPYCQuizType,
  JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";
import type {
  SignerWithAddress as SignerWithAddressType
} from "@nomiclabs/hardhat-ethers/signers";
import type { Wallet, Signer } from "ethers";
import type { Fixture } from "ethereum-waffle";

import {
  SignerWithAddress
} from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers, waffle } from "hardhat";

import {
  deployJPYCQuiz,
  deployJPYCQuizRewardNFT,
  setMintRewardCaller,
  setUserAnswerHashesTransaction
} from "./shared/utils";
import { makeQuizQuestions } from "./shared/fixtures";
import { setQuestionsInfoAndSendAnswers } from "./JPYCQuiz.behavior";

const createFixtureLoader = waffle.createFixtureLoader;

const quizName = 'test';

describe("JPYCQuiz", () => {
  let loadFixture: ReturnType<typeof createFixtureLoader>;
  let owner: Wallet;
  let quizTaker1: Wallet;
  let quizTaker2: Wallet;
  let otherPerson: Wallet;

  before(async () => {
    [owner, quizTaker1, quizTaker2, otherPerson] = await (ethers as any).getSigners();
    loadFixture = createFixtureLoader([owner, quizTaker1, quizTaker2, otherPerson]);
  });

  describe('Set quiz fixtures', () => {
    let JPYCQuiz: JPYCQuizType;
    let JPYCQuizRewardNFT: JPYCQuizRewardNFTType;    

    const jpycQuizFixtures = async (wallets: Wallet[]) => {
      const JPYCQuizRewardNFT = await deployJPYCQuizRewardNFT(
        wallets[0],
        ethers.constants.AddressZero
      );
      const JPYCQuiz = await deployJPYCQuiz(
        JPYCQuizRewardNFT,
        wallets[0],
      );

      await setMintRewardCaller(JPYCQuiz, JPYCQuizRewardNFT);

      return { JPYCQuizRewardNFT, JPYCQuiz };
    };

    before('load quiz fixtures', async () => {
      const fixtures = await loadFixture(jpycQuizFixtures);

      JPYCQuiz = fixtures.JPYCQuiz;
      JPYCQuizRewardNFT = fixtures.JPYCQuizRewardNFT;
    });

    for (
      const quizInfo of [
        {
          minNumOfPasses: 2,
          numOfQuestions: 2,
          connectAsWalletIndex: 2, // quizTaker1
          questionSelectionsInfo:
            [{
              numOfSelections: 2,
              solutionIndex: 0,
            }, {
              numOfSelections: 2,
              solutionIndex: 1,
            }],
        }
      ]
    ) {
      describe(
        `Set quiz info: minNumOfPasses=${quizInfo.minNumOfPasses} numOfQuestions=${quizInfo.numOfQuestions}, `,
        () => {
          let questions: string[];
          let questionSelections: {
            selectionLabels: string[];
            selectionIDs: string[];
            solutionHash: string;
          }[];
          let connectAs: Signer;

          const quizQuestionsFixtures = async (wallets: Wallet[]) => {
            const quizQuestions = await makeQuizQuestions({
              JPYCQuiz,
              quizName,
              numOfQuestions: quizInfo.numOfQuestions,
              minNumOfPasses: quizInfo.minNumOfPasses,
              questionSelectionsInfo: quizInfo.questionSelectionsInfo,
            });
            questions = quizQuestions.questions;
            questionSelections = quizQuestions.questionSelections;
            connectAs = wallets[quizInfo.connectAsWalletIndex];

            return { questions, questionSelections, connectAs };
          }

          before('load quiz questions fixtures', async () => {
            const fixtures = await loadFixture(quizQuestionsFixtures);

            questions = fixtures.questions;
            questionSelections = fixtures.questionSelections;
            connectAs = fixtures.connectAs;
          });

          it("Quiz event is properly set", async () => {
            const currentQuizEvent = await JPYCQuiz.getQuizEvent();
            expect(currentQuizEvent.numOfQuestions.toNumber()).to.equals(
              quizInfo.minNumOfPasses,
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

          it("connectAs user can get NFT if ther score is more than the threshold", async () => {
            const transaction = setUserAnswerHashesTransaction({
              JPYCQuiz,
              connectAs,
              questionSelectionsInfo: quizInfo.questionSelectionsInfo,
            });
            const connectAsAddress = await connectAs.getAddress();

            await expect(transaction)
              .to.emit(JPYCQuiz, 'LogUserAnswer')
              .withArgs(connectAsAddress, true);

            const mintedTokenID = (
              await JPYCQuizRewardNFT.connect(connectAs).getTokenIDFromMinter(
                connectAsAddress
              )
            ).toNumber();
            expect(mintedTokenID).to.equals(1);

            const actualQuizTakerAddress =
              await JPYCQuizRewardNFT.connect(connectAs).ownerOf(mintedTokenID);
            expect(actualQuizTakerAddress).to.equals(connectAsAddress);
          });
        }
      );
    }
  });
});

//   // describe("Deploy RewardNFT and Quiz", () => {
//     // let JPYCQuiz: JPYCQuizType;
//     // let JPYCQuizRewardNFT: JPYCQuizRewardNFTType;

//     // beforeEach(async () => {
//     //   console.log('beforeEach');
//     //   JPYCQuizRewardNFT = await deployJPYCQuizRewardNFT(
//     //     owner,
//     //     ethers.constants.AddressZero,
//     //   );

//     //   JPYCQuiz = await deployJPYCQuiz(JPYCQuizRewardNFT, owner);
//     // });

//     // describe(
//     //   "Set questions and minimum pass threshold, and answer as quiz taker",
//     //   () => {
//     //     let singersMap: {[key: string]: SignerWithAddressType};
//     //     // let owner: SignerWithAddressType;
//     //     // let quizTaker1: SignerWithAddressType;
//     //     // let quizTaker2: SignerWithAddressType;
//     //     // let otherPerson: SignerWithAddressType;
//     //     // const [owner, quizTaker1, quizTaker2, otherPerson] = await ethers.getSigners();
//     //     before(async () => {
//     //       const [owner, quizTaker1, quizTaker2, otherPerson] = await ethers.getSigners();
//     //       singersMap['owner'] = owner;
//     //       singersMap['quizTaker1'] = quizTaker1;
//     //       singersMap['quizTaker2'] = quizTaker2;
//     //       singersMap['otherPerson'] = otherPerson;
//     //     });

//     //     const testData = [
//     //       {
//     //         minNumOfPasses: 2,
//     //         numOfQuestions: 2,
//     //         connectAsKey: 'quizTaker1',
//     //         questionSelectionsInfo:
//     //           [{
//     //             numOfSelections: 2,
//     //             solutionIndex: 0,
//     //           }, {
//     //             numOfSelections: 2,
//     //             solutionIndex: 1,
//     //           }],
//     //       }
//     //     ];
//     //     // const testAsyncData = function (dataItem) {
//     //     //     return function () {
//     //     //         console.log(dataItem);
//     //     //         //Here do your test.
//     //     //     };
//     //     // };

//     //   testData.forEach((datum) => {
//     //       it("test title", function (done)  {
//     //         console.log('### this', this);
//     //         console.log('### datum', datum);
//     //         done();
//     //       });
//     //     });
//         // const minNumOfPasses = 2;
//         // const numOfQuestions = 2;

//         // let connectAs: SignerWithAddressType;
//         // let questionSelectionsInfo: {
//         //   numOfSelections: number,
//         //   solutionIndex: number
//         // }[];
//         // let questions: string[];
//         // let questionSelections: {
//         //   selectionLabels: string[];
//         //   selectionIDs: string[];
//         //   solutionHash: string;
//         // }[];

//         // it("test", async () => {
//         //   connectAs = quizTaker1;
//         //   questionSelectionsInfo = [{
//         //     numOfSelections: 2,
//         //     solutionIndex: 0,
//         //   }, {
//         //     numOfSelections: 2,
//         //     solutionIndex: 1,
//         //   }];
//         //   await setMintRewardCaller(JPYCQuiz, JPYCQuizRewardNFT);
//         //   const quizQuestions = await makeQuizQuestions({
//         //     JPYCQuiz,
//         //     quizName,
//         //     numOfQuestions,
//         //     minNumOfPasses,
//         //     questionSelectionsInfo,
//         //   });
//         //   questions = quizQuestions.questions;
//         //   questionSelections = quizQuestions.questionSelections;

//         //   const currentQuizEvent = await JPYCQuiz.getQuizEvent();
//         //   expect(currentQuizEvent.numOfQuestions.toNumber()).to.equals(minNumOfPasses);
//         //   expect(currentQuizEvent.minNumOfPasses.toNumber()).to.equals(minNumOfPasses);
//         //   expect(currentQuizEvent.quizName).to.equals(quizName);

//         //   const getQuestionInfoList = questionSelectionsInfo.map(
//         //     async (_selectionInfo, index) => {
//         //       return await JPYCQuiz.getQuestionInfo(index + 1);
//         //     }
//         //   );
//         //   const questionsInfo = await Promise.all(getQuestionInfoList);

//         //   expect(questionsInfo.length).to.equals(numOfQuestions);
//         //   questionsInfo.map((questionInfo, index) => {
//         //     expect(questionInfo.question).to.equals(questions[index]);
//         //     expect(JSON.stringify(questionInfo.selectionLabels)).to.equal(
//         //       JSON.stringify(questionSelections[index].selectionLabels)
//         //     );
//         //     expect(JSON.stringify(questionInfo.selectionIDs)).to.equals(
//         //       JSON.stringify(questionSelections[index].selectionIDs)
//         //     );
//         //   });

//         //   const firstTransaction = setUserAnswerHashesTransaction({
//         //     JPYCQuiz,
//         //     connectAs,
//         //     questionSelectionsInfo,
//         //   });
//         //   await expect(firstTransaction)
//         //     .to.emit(JPYCQuiz, 'LogUserAnswer')
//         //     .withArgs(connectAs.address, true);

//         //   const secontTransaction = setUserAnswerHashesTransaction({
//         //     JPYCQuiz,
//         //     connectAs,
//         //     questionSelectionsInfo,
//         //   });
//         //   await expect(secontTransaction).to.be.reverted;

//         //   const mintedTokenID = (
//         //     await JPYCQuizRewardNFT.connect(connectAs).getTokenIDFromMinter(
//         //       connectAs.address
//         //     )
//         //   ).toNumber();
//         //   expect(mintedTokenID).to.equals(1);

//         //   const actualQuizTakerAddress =
//         //     await JPYCQuizRewardNFT.connect(connectAs).ownerOf(mintedTokenID);
//         //   expect(actualQuizTakerAddress).to.equals(connectAs.address);
//         // });

//         // beforeEach(async () => {
//         //   connectAs = quizTaker1;
//         //   questionSelectionsInfo = [{
//         //     numOfSelections: 2,
//         //     solutionIndex: 0,
//         //   }, {
//         //     numOfSelections: 2,
//         //     solutionIndex: 1,
//         //   }];
//         //   await setMintRewardCaller(JPYCQuiz, JPYCQuizRewardNFT);
//         //   const quizQuestions = await makeQuizQuestions({
//         //     JPYCQuiz,
//         //     quizName,
//         //     numOfQuestions,
//         //     minNumOfPasses,
//         //     questionSelectionsInfo,
//         //   });
//         //   questions = quizQuestions.questions;
//         //   questionSelections = quizQuestions.questionSelections;
//         // });

//         // it("Quiz event is properly set", async () => {
//         //   const currentQuizEvent = await JPYCQuiz.getQuizEvent();
//         //   expect(currentQuizEvent.numOfQuestions.toNumber()).to.equals(minNumOfPasses);
//         //   expect(currentQuizEvent.minNumOfPasses.toNumber()).to.equals(minNumOfPasses);
//         //   expect(currentQuizEvent.quizName).to.equals(quizName);
//         // });

//         // it("Questions are properly set", async () => {
//         //   const getQuestionInfoList = questionSelectionsInfo.map(
//         //     async (_selectionInfo, index) => {
//         //       return await JPYCQuiz.getQuestionInfo(index + 1);
//         //     }
//         //   );
//         //   const questionsInfo = await Promise.all(getQuestionInfoList);

//         //   expect(questionsInfo.length).to.equals(numOfQuestions);
//         //   questionsInfo.map((questionInfo, index) => {
//         //     expect(questionInfo.question).to.equals(questions[index]);
//         //     expect(JSON.stringify(questionInfo.selectionLabels)).to.equal(
//         //       JSON.stringify(questionSelections[index].selectionLabels)
//         //     );
//         //     expect(JSON.stringify(questionInfo.selectionIDs)).to.equals(
//         //       JSON.stringify(questionSelections[index].selectionIDs)
//         //     );
//         //   });
//         // });

//         // it("connectAs user can get NFT if ther score is more than the threshold", async () => {
//         //   const transaction = setUserAnswerHashesTransaction({
//         //     JPYCQuiz,
//         //     connectAs,
//         //     questionSelectionsInfo,
//         //   });
//         //   await expect(transaction)
//         //     .to.emit(JPYCQuiz, 'LogUserAnswer')
//         //     .withArgs(connectAs.address, true);

//         //   const mintedTokenID = (
//         //     await JPYCQuizRewardNFT.connect(connectAs).getTokenIDFromMinter(
//         //       connectAs.address
//         //     )
//         //   ).toNumber();
//         //   expect(mintedTokenID).to.equals(1);

//         //   const actualQuizTakerAddress =
//         //     await JPYCQuizRewardNFT.connect(connectAs).ownerOf(mintedTokenID);
//         //   expect(actualQuizTakerAddress).to.equals(connectAs.address);
//         // });

//         // it("connectAs user cannot try solving quiz after they solved it", async () => {
//         //   const firstTransaction = setUserAnswerHashesTransaction({
//         //     JPYCQuiz,
//         //     connectAs,
//         //     questionSelectionsInfo,
//         //   });
//         //   await expect(firstTransaction)
//         //     .to.emit(JPYCQuiz, 'LogUserAnswer')
//         //     .withArgs(connectAs.address, true);

//         //   const secontTransaction = setUserAnswerHashesTransaction({
//         //     JPYCQuiz,
//         //     connectAs,
//         //     questionSelectionsInfo,
//         //   });
//         //   await expect(secontTransaction).to.be.reverted;
//         // });
//     //   },
//     // );

//     // describe("Set questions and minimum pass threshold, and answer as quiz taker", function () {
//     //   const minNumOfPasses = 2;
//     //   const numOfQuestions = 2;

//     //   let connectAs: SignerWithAddressType;
//     //   let questionSelectionsInfo: {
//     //     numOfSelections: number,
//     //     solutionIndex: number
//     //   }[];
//     //   let questions: string[];
//     //   let questionSelections: {
//     //     selectionLabels: string[];
//     //     selectionIDs: string[];
//     //     solutionHash: string;
//     //   }[];

//     //   beforeEach(async function() {
//     //     connectAs = quizTaker1;
//     //     questionSelectionsInfo = [{
//     //       numOfSelections: 2,
//     //       solutionIndex: 0,
//     //     }, {
//     //       numOfSelections: 2,
//     //       solutionIndex: 1,
//     //     }];
//     //     await setMintRewardCaller(JPYCQuiz, JPYCQuizRewardNFT);
//     //     const quizQuestions = await makeQuizQuestions({
//     //       JPYCQuiz,
//     //       quizName,
//     //       numOfQuestions,
//     //       minNumOfPasses,
//     //       questionSelectionsInfo,
//     //     });
//     //     questions = quizQuestions.questions;
//     //     questionSelections = quizQuestions.questionSelections;
//     //   });

//     //   it("Quiz event is properly set", async function() {
//     //     const currentQuizEvent = await JPYCQuiz.getQuizEvent();
//     //     expect(currentQuizEvent.numOfQuestions.toNumber()).to.equals(minNumOfPasses);
//     //     expect(currentQuizEvent.minNumOfPasses.toNumber()).to.equals(minNumOfPasses);
//     //     expect(currentQuizEvent.quizName).to.equals(quizName);
//     //   });

//     //   it("Questions are properly set", async () => {
//     //     const getQuestionInfoList = questionSelectionsInfo.map(
//     //       async (_selectionInfo, index) => {
//     //         return await JPYCQuiz.getQuestionInfo(index + 1);
//     //       }
//     //     );
//     //     const questionsInfo = await Promise.all(getQuestionInfoList);

//     //     expect(questionsInfo.length).to.equals(numOfQuestions);
//     //     questionsInfo.map((questionInfo, index) => {
//     //       expect(questionInfo.question).to.equals(questions[index]);
//     //       expect(JSON.stringify(questionInfo.selectionLabels)).to.equal(
//     //         JSON.stringify(questionSelections[index].selectionLabels)
//     //       );
//     //       expect(JSON.stringify(questionInfo.selectionIDs)).to.equals(
//     //         JSON.stringify(questionSelections[index].selectionIDs)
//     //       );
//     //     });
//     //   });

//     //   it("connectAs user can get NFT if ther score is more than the threshold", async () => {
//     //     const transaction = setUserAnswerHashesTransaction({
//     //       JPYCQuiz,
//     //       connectAs,
//     //       questionSelectionsInfo,
//     //     });
//     //     await expect(transaction)
//     //       .to.emit(JPYCQuiz, 'LogUserAnswer')
//     //       .withArgs(connectAs.address, true);

//     //     const mintedTokenID = (
//     //       await JPYCQuizRewardNFT.connect(connectAs).getTokenIDFromMinter(
//     //         connectAs.address
//     //       )
//     //     ).toNumber();
//     //     expect(mintedTokenID).to.equals(1);

//     //     const actualQuizTakerAddress =
//     //       await JPYCQuizRewardNFT.connect(connectAs).ownerOf(mintedTokenID);
//     //     expect(actualQuizTakerAddress).to.equals(connectAs.address);
//     //   });

//     //   it("connectAs user cannot try solving quiz after they solved it", async () => {
//     //     const firstTransaction = setUserAnswerHashesTransaction({
//     //       JPYCQuiz,
//     //       connectAs,
//     //       questionSelectionsInfo,
//     //     });
//     //     await expect(firstTransaction)
//     //       .to.emit(JPYCQuiz, 'LogUserAnswer')
//     //       .withArgs(connectAs.address, true);

//     //     const secontTransaction = setUserAnswerHashesTransaction({
//     //       JPYCQuiz,
//     //       connectAs,
//     //       questionSelectionsInfo,
//     //     });
//     //     await expect(secontTransaction).to.be.reverted;
//     //   });
//     // });
//   // });
