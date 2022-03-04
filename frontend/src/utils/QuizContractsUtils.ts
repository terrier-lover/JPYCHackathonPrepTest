import type { JsonRpcSigner } from '@ethersproject/providers';
import type {
    JPYCQuiz as JPYCQuizType,
    JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";

import { getContractAddress } from "./DefaultSettings";
import {
    JPYCQuiz__factory as JPYCQuizFactory,
    JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
} from '../typechain';
import { ethers } from 'ethers';

const QUERY_KEY_GET_QUIZ_EVENT = 'QUERY_KEY_GET_QUIZ_EVENT';
const QUERY_KEY_GET_IS_USER_PASSED = 'QUERY_KEY_GET_IS_USER_PASSED';
const QUERY_KEY_GET_QUESTION_INFO = 'QUERY_KEY_GET_QUESTION_INFO';
const QUERY_KEY_GET_TOKEN_URI_FOR_INTER = 'QUERY_KEY_GET_TOKEN_URI_FOR_INTER';
const MUTTION_KEY_GET_SET_USER_ANSWER_HASHES = 'MUTTION_KEY_GET_SET_USER_ANSWER_HASHES';
const DEFAULT_RETRY: boolean | number = false;

function getContracts(
    signer: JsonRpcSigner,
    currentChainId: number,
): {
    jpycQuiz: JPYCQuizType,
    jpycQuizReward: JPYCQuizRewardNFTType,
} {
    const {
        JPYC_QUIZ_ADDRESS,
        JPYC_QUIZ_REWARD_NFT_ADDRESS,
    } = getContractAddress(currentChainId);

    const jpycQuiz = (new JPYCQuizFactory(signer)).attach(JPYC_QUIZ_ADDRESS);
    const jpycQuizReward = (new JPYCQuizRewardNFTFactory(signer)).attach(
        JPYC_QUIZ_REWARD_NFT_ADDRESS
    );

    return { jpycQuiz, jpycQuizReward };
}

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
    return value !== null && value !== undefined;
}

function getSha256Hash(str: string) {
    return ethers.utils.sha256(
        ethers.utils.formatBytes32String(str)
    );
}

export {
    QUERY_KEY_GET_QUIZ_EVENT,
    QUERY_KEY_GET_IS_USER_PASSED,
    QUERY_KEY_GET_QUESTION_INFO,
    QUERY_KEY_GET_TOKEN_URI_FOR_INTER,
    MUTTION_KEY_GET_SET_USER_ANSWER_HASHES,
    DEFAULT_RETRY,
    getContracts,
    notEmpty,
    getSha256Hash,
};