import type { JsonRpcSigner } from '@ethersproject/providers';
import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "./typechain";

import { getContractAddress } from "./DefaultSettings";
import {
    JPYCQuiz__factory as JPYCQuizFactory,
    JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
} from './typechain';

function getContracts(
    signer: JsonRpcSigner,
    // currentChainId: number,
): {
    jpycQuiz: JPYCQuizType,
    jpycQuizReward: JPYCQuizRewardNFTType,
} {
    const {
        JPYC_QUIZ_ADDRESS,
        JPYC_QUIZ_REWARD_NFT_ADDRESS,
    } = getContractAddress();

    const jpycQuiz = (new JPYCQuizFactory(signer)).attach(JPYC_QUIZ_ADDRESS);
    const jpycQuizReward = (new JPYCQuizRewardNFTFactory(signer)).attach(
        JPYC_QUIZ_REWARD_NFT_ADDRESS
    );

    return { jpycQuiz, jpycQuizReward };
}

async function getAllQuestions(jpycQuiz: JPYCQuizType) {
    const quizEvent = await jpycQuiz.getQuizEvent();
    const numOfQuestions = quizEvent.numOfQuestions.toNumber();
    
}

export { getContracts };