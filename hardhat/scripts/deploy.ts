import type {
  JPYCQuiz as JPYCQuizType,
  JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";

import { ethers, upgrades } from "hardhat";
import {
  JPYCQuiz__factory as JPYCQuizFactory,
  JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
} from '../typechain';
import { getSha256Hash, makeQuestionSelection } from '../utils/QuizUtils';

async function main() {
  const [owner, quizTaker1] = await ethers.getSigners();
  console.log('owner', owner.address);
  console.log('quiz taker', quizTaker1.address);

  const JPYCQuizRewardNFT = await (
    new JPYCQuizRewardNFTFactory(owner).deploy(
      "JPYC Hackathon NFT",
      "JPYCHACK",
      ethers.constants.AddressZero // Intentionally set zero address when the mintRewardCaller is not ready
    )
  );
  await JPYCQuizRewardNFT.deployed();
  console.log('JPYCQuizRewardNFT address', JPYCQuizRewardNFT.address);

  const JPYCQuiz = (
    await upgrades.deployProxy(
      new JPYCQuizFactory(owner),
      [JPYCQuizRewardNFT.address],
      { initializer: 'initialize(address)' }
    )
  ) as JPYCQuizType;
  await JPYCQuiz.deployed();
  console.log('JPYCQuiz address', JPYCQuiz.address);

  const txSetMintRewardCaller = await JPYCQuizRewardNFT.setMintRewardCaller(
    JPYCQuiz.address
  );
  await txSetMintRewardCaller.wait();

  const txSetQuizEvent = await JPYCQuiz.setQuizEventAndQuestionsSkelton(
    "JPYC Hatkachon テスト",
    [
      "はいを選択してください。", // Q1
      "いいえを選択してください。", // Q2
      "[長文の例] 桜木町の駅に降りたのが、かれこれ九時時分だったので、私達は、先ず暗い波止場に行った。はいを選択してください。", // Q3
      "はいを選択してください。", // Q4
      "いいえを選択してください。", // Q5
      "はいを選択してください。", // Q6
      "はいを選択してください。", // Q7
      "はいを選択してください。", // Q8
    ],
    8, // _minNumOfPasses
  );
  await txSetQuizEvent.wait();

  const questionSelections = [
    // Question1
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      0, // solutionIndex
    ),
    // Question2
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      1, // solutionIndex
    ),
    // Question3
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      0, // solutionIndex
    ),
    // Question4
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      0, // solutionIndex
    ),
    // Question5
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      1, // solutionIndex
    ),
    // Question6
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      0, // solutionIndex
    ),
    // Question7
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      0, // solutionIndex
    ),
    // Question8
    makeQuestionSelection(
      [
        "はい",
        "いいえ",
      ],
      0, // solutionIndex
    ),
  ];

  console.log('Setting questions...');
  for (let i = 0; i < questionSelections.length; i++) {
    const selection = questionSelections[i];
    const questionID = i + 1;
    const tx = await JPYCQuiz.setQuestionInfo(
      questionID,
      selection.selectionLabels,
      selection.selectionIDs,
      selection.solutionHash
    );
    await tx.wait();
    console.log(`question=${questionID} is being set`);
  }
  // const setQuestions = questionSelections.map(
  //   async (selection, index) => {
  //     const tx = await JPYCQuiz.setQuestionInfo(
  //       index + 1,
  //       selection.selectionLabels,
  //       selection.selectionIDs,
  //       selection.solutionHash
  //     );
  //     await tx.wait();
  //   }
  // );
  // await Promise.all(setQuestions);

  const answerHashes = questionSelections.map(
    selection => {
      return getSha256Hash(selection.selectionIDs[selection.solutionIndex]);
    }
  );

  // console.log('Mint as owner');
  // const txOwnerMintReward = await JPYCQuiz.ownerMintRewardBypassCheck();
  // await txOwnerMintReward.wait();

  console.log('Answering questions...');
  const txSetUserAnswerHashes = await JPYCQuiz.connect(quizTaker1).setUserAnswerHashes(
    answerHashes
  );
  await txSetUserAnswerHashes.wait();

  const mintedTokenID = (
    await JPYCQuizRewardNFT.getTokenIDFromMinter(quizTaker1.address)
  ).toNumber(); 
  console.log('mintedTokenID', mintedTokenID);

  const uri = await JPYCQuizRewardNFT.tokenURI(mintedTokenID);
  console.log('Generated uri', uri);

  const nftOwner = await JPYCQuizRewardNFT.ownerOf(mintedTokenID);
  console.log('nftOwner', nftOwner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
