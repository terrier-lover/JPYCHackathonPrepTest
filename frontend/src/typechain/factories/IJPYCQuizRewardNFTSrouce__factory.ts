/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import { Contract, Signer, utils } from "ethers";
import { Provider } from "@ethersproject/providers";
import type {
  IJPYCQuizRewardNFTSrouce,
  IJPYCQuizRewardNFTSrouceInterface,
} from "../IJPYCQuizRewardNFTSrouce";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "tokenId_",
        type: "uint256",
      },
    ],
    name: "getTokenURIJson",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

export class IJPYCQuizRewardNFTSrouce__factory {
  static readonly abi = _abi;
  static createInterface(): IJPYCQuizRewardNFTSrouceInterface {
    return new utils.Interface(_abi) as IJPYCQuizRewardNFTSrouceInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): IJPYCQuizRewardNFTSrouce {
    return new Contract(
      address,
      _abi,
      signerOrProvider
    ) as IJPYCQuizRewardNFTSrouce;
  }
}
