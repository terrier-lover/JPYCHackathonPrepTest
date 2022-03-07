import * as dotenv from "dotenv";

/* Change following variables */
const TOKEN_NAME = "JPYC Hackathon NFT";
const TOKEN_SYMBOL = "JPYCHACK";

const PATH_TO_HARDHAT_ENV = `${__dirname}/.env`;
const PATH_TO_QUIZ_INFO_JSON = `${__dirname}/quizInfo.json`;
const PATH_TO_FRONTEND_ENV = `${__dirname}/./../frontend/.env`;

dotenv.config({ path: PATH_TO_HARDHAT_ENV })

const ENV = process.env;

export { 
    PATH_TO_HARDHAT_ENV, 
    PATH_TO_QUIZ_INFO_JSON, 
    ENV,
    PATH_TO_FRONTEND_ENV,
    TOKEN_NAME,
    TOKEN_SYMBOL,
};