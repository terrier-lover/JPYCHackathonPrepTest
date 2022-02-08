import type {
  JPYCQuiz as JPYCQuizType,
  JPYCQuizRewardNFT as JPYCQuizRewardNFTType,
} from "../typechain";

import { ethers, upgrades } from "hardhat";
import {
  JPYCQuiz__factory as JPYCQuizFactory,
  JPYCQuizRewardNFT__factory as JPYCQuizRewardNFTFactory,
} from '../typechain';

async function main() {
  const [owner] = await ethers.getSigners();
  console.log('operating owner', owner.address);

  const JPYCQuizRewardNFT = (
      await upgrades.deployProxy(
          new JPYCQuizRewardNFTFactory(owner),
          ["JPYC Hackathon NFT", "JPYCHACKNFT"],
          { initializer: 'initialize(string,string)' }
      )
  ) as JPYCQuizRewardNFTType;
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

  const txSetMintRewardCaller = await JPYCQuizRewardNFT.setMintRewardCaller(JPYCQuiz.address);
  await txSetMintRewardCaller.wait();

  const txOwnerMintReward = await JPYCQuiz.ownerMintRewardBypassCheck();
  await txOwnerMintReward.wait();

  const tokenID = 1;
  const uri = await JPYCQuizRewardNFT.tokenURI(tokenID);
  console.log('uri', uri);

  const nftOwner = await JPYCQuizRewardNFT.ownerOf(tokenID);
  console.log('nftOwner', nftOwner);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
