import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@openzeppelin/hardhat-upgrades";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import "hardhat-contract-sizer";
import { ENV } from './settings';

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.12",
  networks: {
    rinkeby: {
      url: ENV.RINKEBY_URL || "",
      accounts:
        [
          ENV.RINKEBY_PRIVATE_KEY_OWNER == null
            ? null : ENV.RINKEBY_PRIVATE_KEY_OWNER,
            ENV.RINKEBY_PRIVATE_KEY_OTHER1 == null
            ? null : ENV.RINKEBY_PRIVATE_KEY_OTHER1,
        ].filter(notEmpty),
    },
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
  },
};

function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
  return value !== null && value !== undefined;
}

export default config;
