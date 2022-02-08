import { expect } from "chai";
import { ethers } from "hardhat";
import { Quiz__factory as QuizFactory } from "../typechain";

describe("Quiz", function () {
  it("Test main flow", async function () {
    // TODO: update following test to handle upgradeability

    // const [owner, maintainer1, maintainer2] = await ethers.getSigners();
    // const quizFactory = new QuizFactory(owner);
    // const quiz = await quizFactory.deploy();
    // const tx = await quiz.addQuizEventAndQuestionsSkelton(
    //   "test",
    //   ["Question 1", "Question 2"],
    //   2, // _minNumOfPasses
    // );
    // await tx.wait();

    // const allQuizEvents = await quiz.getAllQuizEvents();
    // console.log({allQuizEvents});

    // const quizEventID = 0;

    // const numOfQuestions = allQuizEvents.numOfQuestions;
    // const targetEventNumOfQuestions = numOfQuestions[quizEventID].toNumber();
    
    // expect(targetEventNumOfQuestions).to.equals(2);

    // const questionSelections = [
    //   {
    //     selectionLabels: [
    //       "First selection1",
    //       "First selection2",
    //     ],
    //     selectionIDs: [
    //       "1123",
    //       "1943"
    //     ],
    //     solutionHash: getSha256Hash("1123")
    //   }, 
    //   {
    //     selectionLabels: [
    //       "Second selection1",
    //       "Second selection2",
    //     ],
    //     selectionIDs: [
    //       "19283",
    //       "99784"
    //     ],
    //     solutionHash: getSha256Hash("99784")    
    //   },
    // ];

    // const setQuestions = questionSelections.map(
    //   async (selection, index) => {
    //     const tx = await quiz.setQuestionInfo(
    //       quizEventID,
    //       index,
    //       selection.selectionLabels,
    //       selection.selectionIDs,
    //       selection.solutionHash
    //     );
    //     tx.wait();
    //   }
    // );
    // await Promise.all(setQuestions);

    // const quizEvent = await quiz.getSingleQuizEvent(quizEventID);
    // console.log({quizEvent});

    // const questionInfo1 = await quiz.getQuestionInfo(
    //   quizEventID, quizEvent.questionIDs[0].toNumber()
    // );
    // console.log({questionInfo1});

    // const questionInfo2 = await quiz.getQuestionInfo(
    //   quizEventID, quizEvent.questionIDs[1].toNumber()
    // );
    // console.log({questionInfo2}); 

    // const answerHashes = [
    //   getSha256Hash(questionInfo1.selectionIDs[0]),
    //   getSha256Hash(questionInfo2.selectionIDs[1]),
    // ];
    // await expect(quiz.setUserAnswerHashes(quizEventID, answerHashes))
    //   .to.emit(quiz, 'LogUserAnswer')
    //   .withArgs(owner.address, quizEventID, true);
    
    
  });
});

function getSha256Hash(str: string) {
  return ethers.utils.sha256(
    ethers.utils.formatBytes32String(str)
  );
}
