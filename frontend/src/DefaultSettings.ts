import nullthrows from "nullthrows";

const ENV = process.env;

// const NETWORK_NAME_MAINNET = "mainnet";
// const NETWORK_NAME_MATIC = "matic";
const NETWORK_NAME_RINKEBY = "rinkeby";
// const NETWORK_NAME_LOCALHOST = "localhost";

// const MAINNET_CHAIN_ID = ENV.REACT_APP_MAINNET_CHAIN_ID!;
// const RINKEBY_CHAIN_ID = 4;
// const MATIC_CHAIN_ID = ENV.REACT_APP_MATIC_CHAIN_ID!;
// const LOCALHOST_CHAIN_ID = ENV.REACT_APP_LOCALHOST_CHAIN_ID!;

const CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS = {
    //   [MAINNET_CHAIN_ID]: NETWORK_NAME_MAINNET,
    //   [RINKEBY_CHAIN_ID]: NETWORK_NAME_RINKEBY,
    //   [MATIC_CHAIN_ID]: NETWORK_NAME_MATIC,
    //   [LOCALHOST_CHAIN_ID]: NETWORK_NAME_LOCALHOST,
};

function getContractAddress() {
    // const networkNameNullable: string | null =
    //   CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS[currentChainId] ?? null;
    // const networkName = nullthrows(
    //   networkNameNullable, 
    //   "Network name is not defined properly",
    // );

    // const JPYC_QUIZ_ADDRESS
    //   = ENV[`REACT_APP_${networkName.toUpperCase()}_JPYC_QUIZ_ADDRESS`]!;
    // const JPYC_QUIZ_REWARD_NFT_ADDRESS
    //   = ENV[`REACT_APP_${networkName.toUpperCase()}_JPYC_QUIZ_REWARD_NFT_ADDRESS`]!;

    const JPYC_QUIZ_ADDRESS = "0xfd868917afde2219753c3a6a12f0ccbb4624c673";
    const JPYC_QUIZ_REWARD_NFT_ADDRESS = "0x12934aa6d3d92893992533aa88d8150450584c20";

    return { JPYC_QUIZ_ADDRESS, JPYC_QUIZ_REWARD_NFT_ADDRESS };
}

export { getContractAddress };