/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */

import {
  ethers,
  EventFilter,
  Signer,
  BigNumber,
  BigNumberish,
  PopulatedTransaction,
  BaseContract,
  ContractTransaction,
  Overrides,
  CallOverrides,
} from "ethers";
import { BytesLike } from "@ethersproject/bytes";
import { Listener, Provider } from "@ethersproject/providers";
import { FunctionFragment, EventFragment, Result } from "@ethersproject/abi";
import type { TypedEventFilter, TypedEvent, TypedListener } from "./common";

interface JPYCQuizRewardNFTSourceInterface extends ethers.utils.Interface {
  functions: {
    "getQuizEligiblity()": FunctionFragment;
    "getTokenURIJson(uint256,string,address)": FunctionFragment;
    "owner()": FunctionFragment;
    "renounceOwnership()": FunctionFragment;
    "setEligibleCaller(address)": FunctionFragment;
    "setEligibleTarget(address)": FunctionFragment;
    "transferOwnership(address)": FunctionFragment;
  };

  encodeFunctionData(
    functionFragment: "getQuizEligiblity",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "getTokenURIJson",
    values: [BigNumberish, string, string]
  ): string;
  encodeFunctionData(functionFragment: "owner", values?: undefined): string;
  encodeFunctionData(
    functionFragment: "renounceOwnership",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "setEligibleCaller",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "setEligibleTarget",
    values: [string]
  ): string;
  encodeFunctionData(
    functionFragment: "transferOwnership",
    values: [string]
  ): string;

  decodeFunctionResult(
    functionFragment: "getQuizEligiblity",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "getTokenURIJson",
    data: BytesLike
  ): Result;
  decodeFunctionResult(functionFragment: "owner", data: BytesLike): Result;
  decodeFunctionResult(
    functionFragment: "renounceOwnership",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEligibleCaller",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "setEligibleTarget",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "transferOwnership",
    data: BytesLike
  ): Result;

  events: {
    "OwnershipTransferred(address,address)": EventFragment;
    "SetEligibleCaller(address,address)": EventFragment;
    "SetEligibleTarget(address,address)": EventFragment;
  };

  getEvent(nameOrSignatureOrTopic: "OwnershipTransferred"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetEligibleCaller"): EventFragment;
  getEvent(nameOrSignatureOrTopic: "SetEligibleTarget"): EventFragment;
}

export type OwnershipTransferredEvent = TypedEvent<
  [string, string] & { previousOwner: string; newOwner: string }
>;

export type SetEligibleCallerEvent = TypedEvent<
  [string, string] & {
    previousEligibleCaller_: string;
    newEligibleCaller_: string;
  }
>;

export type SetEligibleTargetEvent = TypedEvent<
  [string, string] & {
    previousEligibleTarget_: string;
    newEligibleTarget_: string;
  }
>;

export class JPYCQuizRewardNFTSource extends BaseContract {
  connect(signerOrProvider: Signer | Provider | string): this;
  attach(addressOrName: string): this;
  deployed(): Promise<this>;

  listeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter?: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): Array<TypedListener<EventArgsArray, EventArgsObject>>;
  off<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  on<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  once<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeListener<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>,
    listener: TypedListener<EventArgsArray, EventArgsObject>
  ): this;
  removeAllListeners<EventArgsArray extends Array<any>, EventArgsObject>(
    eventFilter: TypedEventFilter<EventArgsArray, EventArgsObject>
  ): this;

  listeners(eventName?: string): Array<Listener>;
  off(eventName: string, listener: Listener): this;
  on(eventName: string, listener: Listener): this;
  once(eventName: string, listener: Listener): this;
  removeListener(eventName: string, listener: Listener): this;
  removeAllListeners(eventName?: string): this;

  queryFilter<EventArgsArray extends Array<any>, EventArgsObject>(
    event: TypedEventFilter<EventArgsArray, EventArgsObject>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEvent<EventArgsArray & EventArgsObject>>>;

  interface: JPYCQuizRewardNFTSourceInterface;

  functions: {
    getQuizEligiblity(overrides?: CallOverrides): Promise<[boolean, number]>;

    getTokenURIJson(
      tokenId_: BigNumberish,
      name_: string,
      originalMinter_: string,
      overrides?: CallOverrides
    ): Promise<[string]>;

    owner(overrides?: CallOverrides): Promise<[string]>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setEligibleCaller(
      newElilgibleCaller_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    setEligibleTarget(
      newElilgibleTarget_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<ContractTransaction>;
  };

  getQuizEligiblity(overrides?: CallOverrides): Promise<[boolean, number]>;

  getTokenURIJson(
    tokenId_: BigNumberish,
    name_: string,
    originalMinter_: string,
    overrides?: CallOverrides
  ): Promise<string>;

  owner(overrides?: CallOverrides): Promise<string>;

  renounceOwnership(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setEligibleCaller(
    newElilgibleCaller_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  setEligibleTarget(
    newElilgibleTarget_: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  transferOwnership(
    newOwner: string,
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<ContractTransaction>;

  callStatic: {
    getQuizEligiblity(overrides?: CallOverrides): Promise<[boolean, number]>;

    getTokenURIJson(
      tokenId_: BigNumberish,
      name_: string,
      originalMinter_: string,
      overrides?: CallOverrides
    ): Promise<string>;

    owner(overrides?: CallOverrides): Promise<string>;

    renounceOwnership(overrides?: CallOverrides): Promise<void>;

    setEligibleCaller(
      newElilgibleCaller_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    setEligibleTarget(
      newElilgibleTarget_: string,
      overrides?: CallOverrides
    ): Promise<void>;

    transferOwnership(
      newOwner: string,
      overrides?: CallOverrides
    ): Promise<void>;
  };

  filters: {
    "OwnershipTransferred(address,address)"(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    OwnershipTransferred(
      previousOwner?: string | null,
      newOwner?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousOwner: string; newOwner: string }
    >;

    "SetEligibleCaller(address,address)"(
      previousEligibleCaller_?: string | null,
      newEligibleCaller_?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousEligibleCaller_: string; newEligibleCaller_: string }
    >;

    SetEligibleCaller(
      previousEligibleCaller_?: string | null,
      newEligibleCaller_?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousEligibleCaller_: string; newEligibleCaller_: string }
    >;

    "SetEligibleTarget(address,address)"(
      previousEligibleTarget_?: string | null,
      newEligibleTarget_?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousEligibleTarget_: string; newEligibleTarget_: string }
    >;

    SetEligibleTarget(
      previousEligibleTarget_?: string | null,
      newEligibleTarget_?: string | null
    ): TypedEventFilter<
      [string, string],
      { previousEligibleTarget_: string; newEligibleTarget_: string }
    >;
  };

  estimateGas: {
    getQuizEligiblity(overrides?: CallOverrides): Promise<BigNumber>;

    getTokenURIJson(
      tokenId_: BigNumberish,
      name_: string,
      originalMinter_: string,
      overrides?: CallOverrides
    ): Promise<BigNumber>;

    owner(overrides?: CallOverrides): Promise<BigNumber>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setEligibleCaller(
      newElilgibleCaller_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    setEligibleTarget(
      newElilgibleTarget_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<BigNumber>;
  };

  populateTransaction: {
    getQuizEligiblity(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    getTokenURIJson(
      tokenId_: BigNumberish,
      name_: string,
      originalMinter_: string,
      overrides?: CallOverrides
    ): Promise<PopulatedTransaction>;

    owner(overrides?: CallOverrides): Promise<PopulatedTransaction>;

    renounceOwnership(
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setEligibleCaller(
      newElilgibleCaller_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    setEligibleTarget(
      newElilgibleTarget_: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;

    transferOwnership(
      newOwner: string,
      overrides?: Overrides & { from?: string | Promise<string> }
    ): Promise<PopulatedTransaction>;
  };
}
