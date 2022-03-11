import { ethers, network } from "hardhat";
import {
  JPYCQuiz__factory as JPYCQuizFactory,
  JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
} from '../typechain';
import {
  getSha256Hash,
  makeQuestionSelection,
  exportJSONString,
  setEnv,
} from '../utils/QuizUtils';
import { PATH_TO_FRONTEND_ENV, PATH_TO_QUIZ_INFO_JSON } from '../settings';
import { deployJPYCQuizRewardNFTSource } from "../utils/QuizUtils";

/***** Change following values based on the specification of your app *****/
const SHOULD_GENERATE_ENV_FILE_FOR_FRONT_END = true; // If true, it recreates .env file for front end
const SHOULD_QUIZ_TAKER_SOLVE_AND_GET_NFT = false; // If false, it deploys contracts only
const SHOULD_OUTPUT_QUIZ_INFO = true; // If true, it outputs quiz info in json format

const JPYC_HACHATHON_NFT_NAME = "JPYC Hackathon Certification Test"; // Name used in ERC-721
const JPYC_HACHATHON_NFT_SYMBOL = "JPYCHACKCERT_TEST"; // Symbol used in ERC-721
const QUIZ_TITLE = "JPYC Hatkachon テスト"; // Title of the quiz stored in the contract
const MINIMUM_NUMBER_OF_PASS = 7; // Minimum number of questions for users to get the reward
const COMMON_SELECTION_LABELS = ["○", "×"];
// The order of QUESTION_SELECTIONS_INFO is the actual order shown to users.
const QUESTION_SELECTIONS_INFO = [
  // Question1
  {
    question: "○ を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      0, // solutionIndex
    ),
  },
  // Question2
  {
    question: "× を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      1, // solutionIndex
    )
  },
  // Question3
  {
    question: "[長文例] 桜木町の駅に降りたのが、かれこれ九時時分だったので、私達は、先ず暗い波止場に行った。 ○ を選択してください。", // Q3,
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      0, // solutionIndex
    )
  },
  // Question4
  {
    question: "○ を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      0, // solutionIndex
    )
  },
  // Question5
  {
    question: "× を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      1, // solutionIndex
    )
  },
  // Question6
  {
    question: "○ を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      0, // solutionIndex
    )
  },
  // Question7
  {
    question: "○ を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      0, // solutionIndex
    )
  },
  // Question8
  {
    question: "○ を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      0, // solutionIndex
    )
  },
  // Question9
  {
    question: "× を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      1, // solutionIndex
    )
  },
  // Question10
  {
    question: "× を選択してください。",
    ...makeQuestionSelection(
      COMMON_SELECTION_LABELS,
      1, // solutionIndex
    )
  },
];
/**************************************************************************/

async function main() {
  if (QUESTION_SELECTIONS_INFO.length <= 0) {
    throw new Error('QUESTION_SELECTIONS_INFO should be more than 0');
  }

  console.log(`##### This script deploys contract to ${network.name} with following settings:`);
  console.log(`JPYC_HACHATHON_NFT_NAME=${JPYC_HACHATHON_NFT_NAME}`);
  console.log(`JPYC_HACHATHON_NFT_SYMBOL=${JPYC_HACHATHON_NFT_SYMBOL}`);
  console.log(`QUIZ_TITLE=${QUIZ_TITLE}`);
  console.log('\n');

  console.log("##### Quiz information in JSON format #####");
  console.log(JSON.stringify(QUESTION_SELECTIONS_INFO));
  console.log("###########################################\n");

  const [owner] = await ethers.getSigners();
  console.log(`The address of contract owner: ${owner.address}`);

  const JPYCQuizRewardNFTSource = await deployJPYCQuizRewardNFTSource(
    owner,
    ethers.constants.AddressZero
  );
  const JPYCQuizRewardNFT = await (
    new JPYCQuizRewardNFTFactory(owner).deploy(
      JPYC_HACHATHON_NFT_NAME,
      JPYC_HACHATHON_NFT_SYMBOL,
      ethers.constants.AddressZero, // Intentionally set zero address when the mintRewardCaller is not ready
      JPYCQuizRewardNFTSource.address,
    )
  );
  await JPYCQuizRewardNFT.deployed();
  console.log(`The address of JPYCQuizRewardNFT contract: ${JPYCQuizRewardNFT.address}`);

  const JPYCQuiz = await (new JPYCQuizFactory(owner).deploy(JPYCQuizRewardNFT.address));
  await JPYCQuiz.deployed();
  console.log(`The address of JPYCQuiz contract: ${JPYCQuiz.address}`);

  const setNftSourceCallerTx = await JPYCQuizRewardNFTSource.setEligibleCaller(
    JPYCQuizRewardNFT.address
  );
  await setNftSourceCallerTx.wait();

  const txSetMintRewardCaller = await JPYCQuizRewardNFT.setEligibleCaller(
    JPYCQuiz.address
  );
  await txSetMintRewardCaller.wait();

  const txSetQuizEvent = await JPYCQuiz.setQuizEventAndQuestionsSkelton(
    QUIZ_TITLE,
    QUESTION_SELECTIONS_INFO.length,
    MINIMUM_NUMBER_OF_PASS,
  );
  await txSetQuizEvent.wait();

  console.log('Setting questions...');
  for (let i = 0; i < QUESTION_SELECTIONS_INFO.length; i++) {
    const selection = QUESTION_SELECTIONS_INFO[i];
    const questionID = i + 1;
    const tx = await JPYCQuiz.setQuestionInfo(
      questionID,
      selection.question,
      selection.selectionLabels,
      selection.selectionIDs,
      selection.solutionHash,
    );
    await tx.wait();
  }

  const answerHashes = QUESTION_SELECTIONS_INFO.map(
    selection => {
      return getSha256Hash(selection.selectionIDs[selection.solutionIndex]);
    }
  );
  if (SHOULD_OUTPUT_QUIZ_INFO) {
    console.log(`Completed setting questions! Outputting quiz info into ${PATH_TO_QUIZ_INFO_JSON}`);
    await exportJSONString(JSON.stringify(QUESTION_SELECTIONS_INFO), PATH_TO_QUIZ_INFO_JSON);
  }

  if (SHOULD_QUIZ_TAKER_SOLVE_AND_GET_NFT) {
    const [_, quizTaker1] = await ethers.getSigners();
    console.log(`The address of quiz taker: ${quizTaker1.address}`);

    console.log('Answering questions...');
    const txSetUserAnswerHashes = await JPYCQuiz.connect(quizTaker1).setUserAnswerHashes(
      answerHashes
    );
    await txSetUserAnswerHashes.wait();

    const mintedTokenID = (
      await JPYCQuizRewardNFT.getTokenIDFromMinter(quizTaker1.address)
    ).toNumber();
    console.log(`tokenID=${mintedTokenID} was minted for ${quizTaker1.address}`);

    const tokenURI = await JPYCQuizRewardNFT.tokenURI(mintedTokenID);
    console.log("##### Following TokenURI is generated #####");
    console.log(tokenURI);
    console.log("###########################################\n");

    const nftOwner = await JPYCQuizRewardNFT.ownerOf(mintedTokenID);
    console.log(`The owner of NFT is ${nftOwner}`);
  }

  if (SHOULD_GENERATE_ENV_FILE_FOR_FRONT_END) {
    const newEnvValues: { [key: string]: string } = {};
    newEnvValues[`REACT_APP_${network.name.toUpperCase()}_JPYC_QUIZ_ADDRESS`]
      = JPYCQuiz.address;
    newEnvValues[`REACT_APP_${network.name.toUpperCase()}_JPYC_QUIZ_REWARD_NFT_ADDRESS`]
      = JPYCQuizRewardNFT.address;
    console.log('Setting new env Values for frontend directory', newEnvValues);
    await setEnv(newEnvValues, PATH_TO_FRONTEND_ENV);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
