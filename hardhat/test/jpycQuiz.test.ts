import { expect } from "chai";
import type {
  JPYCQuiz as JPYCQuizType,
  JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";
import type {
  SignerWithAddress as SignerWithAddressType
} from "@nomiclabs/hardhat-ethers/signers";

import { ethers, upgrades } from "hardhat";
import {
  JPYCQuiz__factory as JPYCQuizFactory,
  JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
} from '../typechain';
import { getSha256Hash } from '../utils/QuizUtils';

describe("JPYCQuiz", function () {
  let JPYCQuiz: JPYCQuizType;
  let JPYCQuizRewardNFT: JPYCQuizRewardNFTType;
  let owner: SignerWithAddressType;
  let quizTaker1: SignerWithAddressType;

  beforeEach(async () => {
    [owner, quizTaker1] = await ethers.getSigners();
    JPYCQuizRewardNFT = await (
      new JPYCQuizRewardNFTFactory(owner).deploy(
        "JPYC Hackathon NFT",
        "JPYCHACK",
        ethers.constants.AddressZero
      )
    );
    await JPYCQuizRewardNFT.deployed();

    JPYCQuiz = (
      await upgrades.deployProxy(
          new JPYCQuizFactory(owner),
          [JPYCQuizRewardNFT.address],
          { initializer: 'initialize(address)' }
      )
    ) as JPYCQuizType;
    await JPYCQuiz.deployed();
  });

  describe("Admin sets correct value", function () {  
    beforeEach(async () => {
      const txSetMintRewardCaller = await JPYCQuizRewardNFT.setMintRewardCaller(
        JPYCQuiz.address,
      );
      await txSetMintRewardCaller.wait();
    });

    it("Correct flow", async () => {
      const txSetQuizEvent = await JPYCQuiz.setQuizEventAndQuestionsSkelton(
        "テスト",
        ["質問1", "質問2"],
        2, // _minNumOfPasses
      );
      await txSetQuizEvent.wait();
      const currentQuizEvent = await JPYCQuiz.getQuizEvent();    
      expect(currentQuizEvent.numOfQuestions.toNumber()).to.equals(2);
      // expect(currentQuizEvent.minNumOfPasses.toNumber()).to.equals(2);
      expect(currentQuizEvent.quizName).to.equals("テスト");

      const questionSelections = [
        {
          selectionLabels: [
            "First selection1",
            "First selection2",
          ],
          selectionIDs: [
            "1123",
            "1943"
          ],
          solutionHash: getSha256Hash("1123")
        }, 
        {
          selectionLabels: [
            "Second selection1",
            "Second selection2",
          ],
          selectionIDs: [
            "19283",
            "99784"
          ],
          solutionHash: getSha256Hash("99784")    
        },
      ];

      const setQuestions = questionSelections.map(
        async (selection, index) => {
          const tx = await JPYCQuiz.setQuestionInfo(
            index + 1,
            selection.selectionLabels,
            selection.selectionIDs,
            selection.solutionHash
          );
          await tx.wait();
        }
      );
      await Promise.all(setQuestions);

      const questionInfo1 = await JPYCQuiz.connect(quizTaker1).getQuestionInfo(1);
      const questionInfo2 = await JPYCQuiz.connect(quizTaker1).getQuestionInfo(2);

      const answerHashes = [
        getSha256Hash(questionInfo1.selectionIDs[0]),
        getSha256Hash(questionInfo2.selectionIDs[1]),
      ];
      await expect(JPYCQuiz.connect(quizTaker1).setUserAnswerHashes(answerHashes))
        .to.emit(JPYCQuiz, 'LogUserAnswer')
        .withArgs(quizTaker1.address, true);

      const mintedTokenID = (
        await JPYCQuizRewardNFT.getTokenIDFromMinter(quizTaker1.address)
      ).toNumber();

      expect(mintedTokenID).to.equals(1);
      const actualQuizTakerAddress = await JPYCQuizRewardNFT.ownerOf(mintedTokenID);
      expect(actualQuizTakerAddress).to.equals(quizTaker1.address);
    });
  });
});