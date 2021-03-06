/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IJPYCQuizRewardNFTSource,
  IJPYCQuizRewardNFTSourceInterface,
} from "../IJPYCQuizRewardNFTSource";

const _abi = [
  {
    inputs: [],
    name: "getQuizEligiblity",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "enum IJPYCQuizEligibility.QuizStatus",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name_",
        type: "string",
      },
      {
        internalType: "address",
        name: "originalMinter_",
        type: "address",
      },
    ],
    name: "getTokenURIJson",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export class IJPYCQuizRewardNFTSource__factory {
  static readonly abi = _abi;
  static createInterface(): IJPYCQuizRewardNFTSourceInterface {
    return new utils.Interface(_abi) as IJPYCQuizRewardNFTSourceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IJPYCQuizRewardNFTSource {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IJPYCQuizRewardNFTSource;
  }
}
