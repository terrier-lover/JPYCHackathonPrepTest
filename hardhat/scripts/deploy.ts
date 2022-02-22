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

/***** Change following values based on the specification of your app *****/
const JPYC_HACHATHON_NFT_NAME = "JPYC Hackathon Certification Test";
const JPYC_HACHATHON_NFT_SYMBOL = "JPYCHACKCERT_TEST";
const QUIZ_TITLE = "JPYC Hatkachon テスト";
// The order of JPYC_QUIZ_QUESTIONS is the actual order shown to users.
const QUESTIONS = [
  "○ を選択してください。", // Q1
  "× を選択してください。", // Q2
  "[長文例] 桜木町の駅に降りたのが、かれこれ九時時分だったので、私達は、先ず暗い波止場に行った。 ○ を選択してください。", // Q3
  "○ を選択してください。", // Q4
  "× を選択してください。", // Q5
  "○ を選択してください。", // Q6
  "○ を選択してください。", // Q7
  "○ を選択してください。", // Q8
  "× を選択してください。", // Q9
  "× を選択してください。", // Q10
];
const MINIMUM_NUMBER_OF_PASS = 7;
const COMMON_SELECTION_LABELS = ["○", "×"];
const QUESTION_SELECTIONS_INFO = [
  // Question1
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    0, // solutionIndex
  ),
  // Question2
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    1, // solutionIndex
  ),
  // Question3
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    0, // solutionIndex
  ),
  // Question4
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    0, // solutionIndex
  ),
  // Question5
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    1, // solutionIndex
  ),
  // Question6
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    0, // solutionIndex
  ),
  // Question7
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    0, // solutionIndex
  ),
  // Question8
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    0, // solutionIndex
  ),
  // Question9
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    1, // solutionIndex
  ),
  // Question9
  makeQuestionSelection(
    COMMON_SELECTION_LABELS,
    1, // solutionIndex
  ),
];
const SHOULD_GENERATE_ENV_FILE_FOR_FRONT_END = true; // If true, it recreates .env file for front end
const SHOULD_QUIZ_TAKER_SOLVE_AND_GET_NFT = true; // If false, it deploys contracts only
/**************************************************************************/

async function main() {
  if (QUESTIONS.length !== QUESTION_SELECTIONS_INFO.length) {
    throw new Error('QUESTIONS and QUESTION_SELECTIONS_INFO should have same length');
  }

  console.log(`##### This script deploys contract to ${network.name} with following settings:`);
  console.log(`JPYC_HACHATHON_NFT_NAME=${JPYC_HACHATHON_NFT_NAME}`);
  console.log(`JPYC_HACHATHON_NFT_SYMBOL=${JPYC_HACHATHON_NFT_SYMBOL}`);
  console.log(`QUIZ_TITLE=${QUIZ_TITLE}`);
  console.log('\n');

  const generatedQuestions = QUESTIONS.map((question, index) => {
    const questionSelection = QUESTION_SELECTIONS_INFO[index];
    return { question, ...questionSelection };
  });
  console.log("##### Quiz information in JSON #####");
  console.log(JSON.stringify(generatedQuestions));
  console.log("####################################\n");

  const [owner, quizTaker1] = await ethers.getSigners();
  console.log(`The address of contract owner: ${owner.address}`);
  console.log(`The address of example quiz taker: ${quizTaker1.address}`);

  const JPYCQuizRewardNFT = await (
    new JPYCQuizRewardNFTFactory(owner).deploy(
      JPYC_HACHATHON_NFT_NAME,
      JPYC_HACHATHON_NFT_SYMBOL,
      ethers.constants.AddressZero // Intentionally set zero address when the mintRewardCaller is not ready
    )
  );
  await JPYCQuizRewardNFT.deployed();
  console.log(`The address of JPYCQuizRewardNFT contract: ${JPYCQuizRewardNFT.address}`);

  const JPYCQuiz = await (new JPYCQuizFactory(owner).deploy(JPYCQuizRewardNFT.address));
  await JPYCQuiz.deployed();
  console.log(`The address of JPYCQuiz contract: ${JPYCQuiz.address}`);

  const txSetMintRewardCaller = await JPYCQuizRewardNFT.setMintRewardCaller(
    JPYCQuiz.address
  );
  await txSetMintRewardCaller.wait();

  const txSetQuizEvent = await JPYCQuiz.setQuizEventAndQuestionsSkelton(
    QUIZ_TITLE,
    QUESTIONS,
    MINIMUM_NUMBER_OF_PASS,
  );
  await txSetQuizEvent.wait();

  console.log('Setting questions...');
  for (let i = 0; i < QUESTION_SELECTIONS_INFO.length; i++) {
    const selection = QUESTION_SELECTIONS_INFO[i];
    const questionID = i + 1;
    const tx = await JPYCQuiz.setQuestionInfo(
      questionID,
      selection.selectionLabels,
      selection.selectionIDs,
      selection.solutionHash,
      selection.useBinarySelections
    );
    await tx.wait();
  }

  const answerHashes = QUESTION_SELECTIONS_INFO.map(
    selection => {
      return getSha256Hash(selection.selectionIDs[selection.solutionIndex]);
    }
  );
  console.log(`Completed setting questions! Outputting quiz info into ${PATH_TO_QUIZ_INFO_JSON}`);
  await exportJSONString(JSON.stringify(generatedQuestions), PATH_TO_QUIZ_INFO_JSON);

  if (SHOULD_QUIZ_TAKER_SOLVE_AND_GET_NFT) {
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
