// Link to hackathon main page
const LINK_HACKATHON_MAIN_PAGE = "https://jpy.design/";

// Link to how-to-test page
const LINK_HOW_TO_TEST_PAGE = "https://github.com/terrier-lover/JPYCHackathonPrepTest/blob/main/HOW_TO_TEST.md";

// Set network names used in hardhat
const NETWORK_NAMES = {
    MAINNET: "mainnet",
    MATIC: "matic",
    RINKEBY: "rinkeby",
    GETH_LOCALHOST: "geth_localhost",
};

// Set supported chain ids
const CHAIN_IDS = {
    MAINNET: 1,
    RINKEBY: 4,
    MATIC: 137,
    GETH_LOCALHOST: 31337,
}

// Specify which chain corresponds with network name
const CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS: { [chainID: number]: string } = {
    [CHAIN_IDS.MAINNET]: NETWORK_NAMES.MAINNET,
    [CHAIN_IDS.RINKEBY]: NETWORK_NAMES.RINKEBY,
    [CHAIN_IDS.MATIC]: NETWORK_NAMES.MATIC,
    [CHAIN_IDS.GETH_LOCALHOST]: NETWORK_NAMES.GETH_LOCALHOST,
};

const SUPPORTED_CHAIN_IDS_IN_WEB = [
    // CHAIN_IDS.MAINNET, // Comment out when supporting mainnet
    CHAIN_IDS.RINKEBY,
    // CHAIN_IDS.MATIC, // Comment out when supporting matic
    // CHAIN_IDS.GETH_LOCALHOST, // Comment out when testing on geth network.
];

export {
    CHAINS_IDS_AND_NETWORK_NAME_MAPPINGS,
    NETWORK_NAMES,
    CHAIN_IDS,
    SUPPORTED_CHAIN_IDS_IN_WEB,
    LINK_HACKATHON_MAIN_PAGE,
    LINK_HOW_TO_TEST_PAGE,
};