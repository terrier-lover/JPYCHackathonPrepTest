import type {
    SignerWithAddress as SignerWithAddressType
  } from "@nomiclabs/hardhat-ethers/signers";
import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";

import { expect } from "chai";
import { makeQuizQuestions } from "./shared/fixtures";
import { setMintRewardCaller, setUserAnswerHashesTransaction } from "./shared/utils";
  
function setQuestionsInfoAndSendAnswers(options: {
    quizName: string,
    minNumOfPasses: number,
    numOfQuestions: number,
    connectAsType: 'owner' | 'quizTaker1' | 'quizTaker2' | 'otherPerson',
    // connectAs: SignerWithAddressType,
    questionSelectionsInfo: {
        numOfSelections: number,
        solutionIndex: number
    }[],
    // JPYCQuiz: JPYCQuizType,
    // JPYCQuizRewardNFT: JPYCQuizRewardNFTType,
}) {

    const {
        quizName,
        minNumOfPasses,
        numOfQuestions,
        questionSelectionsInfo,
        connectAsType,
    } = options;
    console.log('options', options);

    // describe(`test`, function() {
    //     it('returns the total amount of tokens', async function () {
    //         console.log('this.quizName', this.quizName);
    //     });
    // });
    describe(`${numOfQuestions} questions and ${minNumOfPasses} minimum pass threshold`, function() {
        // let quizName: string;
        let JPYCQuiz: JPYCQuizType;
        let JPYCQuizRewardNFT: JPYCQuizRewardNFTType;
        let connectAs: SignerWithAddressType;
      let questions: string[];
      let questionSelections: {
        selectionLabels: string[];
        selectionIDs: string[];
        solutionHash: string;
      }[];

      beforeEach(async function() {
        JPYCQuiz = this.JPYCQuiz;
        JPYCQuizRewardNFT = this.JPYCQuizRewardNFT;
        connectAs = connectAsType === 'quizTaker1' ? this.quizTaker1: null;
        await setMintRewardCaller(this.JPYCQuiz, this.JPYCQuizRewardNFT);

        const quizQuestions = await makeQuizQuestions({
          JPYCQuiz,
          quizName,
          numOfQuestions,
          minNumOfPasses,
          questionSelectionsInfo,
        });
        questions = quizQuestions.questions;
        questionSelections = quizQuestions.questionSelections;
      });

      it("Quiz event is properly set", async function() {
        const currentQuizEvent = await JPYCQuiz.getQuizEvent();
        expect(currentQuizEvent.numOfQuestions.toNumber()).to.equals(minNumOfPasses);
        expect(currentQuizEvent.minNumOfPasses.toNumber()).to.equals(minNumOfPasses);
        expect(currentQuizEvent.quizName).to.equals(quizName);
      });

      it("Questions are properly set", async function() {
        const getQuestionInfoList = questionSelectionsInfo.map(
          async (_selectionInfo, index) => {
            return await JPYCQuiz.getQuestionInfo(index + 1);
          }
        );
        const questionsInfo = await Promise.all(getQuestionInfoList);

        expect(questionsInfo.length).to.equals(numOfQuestions);
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

      it("connectAs user can get NFT if ther score is more than the threshold", async function() {
        const transaction = setUserAnswerHashesTransaction({
          JPYCQuiz,
          connectAs,
          questionSelectionsInfo,
        });
        await expect(transaction)
          .to.emit(JPYCQuiz, 'LogUserAnswer')
          .withArgs(connectAs.address, true);

        const mintedTokenID = (
          await JPYCQuizRewardNFT.connect(connectAs).getTokenIDFromMinter(
            connectAs.address
          )
        ).toNumber();
        expect(mintedTokenID).to.equals(1);

        const actualQuizTakerAddress = 
          await JPYCQuizRewardNFT.connect(connectAs).ownerOf(mintedTokenID);
        expect(actualQuizTakerAddress).to.equals(connectAs.address);
      });

      it("connectAs user cannot try solving quiz after they solved it", async function() {
        const firstTransaction = setUserAnswerHashesTransaction({
          JPYCQuiz,
          connectAs,
          questionSelectionsInfo,
        });
        await expect(firstTransaction)
          .to.emit(JPYCQuiz, 'LogUserAnswer')
          .withArgs(connectAs.address, true);

        const secontTransaction = setUserAnswerHashesTransaction({
          JPYCQuiz,
          connectAs,
          questionSelectionsInfo,
        });
        await expect(secontTransaction).to.be.reverted;
      });
    });    
}

export { setQuestionsInfoAndSendAnswers };