import * as dotenv from "dotenv";

const PATH_TO_HARDHAT_ENV = `${__dirname}/.env`;
const PATH_TO_QUIZ_INFO_JSON = `${__dirname}/quizInfo.json`;

dotenv.config({ path: PATH_TO_HARDHAT_ENV })

const ENV = process.env;

export { PATH_TO_HARDHAT_ENV, PATH_TO_QUIZ_INFO_JSON, ENV };