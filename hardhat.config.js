require("@nomicfoundation/hardhat-toolbox");
require("@chainlink/env-enc").config();
// require('dotenv').config();
require("./tasks");
require("hardhat-deploy");
require("@nomicfoundation/hardhat-ethers");
require("hardhat-deploy-ethers");
const { ProxyAgent, setGlobalDispatcher } = require("undici")
const proxyAgent = new ProxyAgent("http://127.0.0.1:7890") // change to yours
setGlobalDispatcher(proxyAgent)
const SEPOLIA_URL = process.env.SEPOLIA_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY;
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1;
/** @type import('hardhat/config').HardhatUserConfig 2:30:*/
module.exports = {
  solidity: "0.8.27",
  defaultNetwork:"hardhat",
  mocha:{
    timeout:300000
  },
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY, PRIVATE_KEY_1],
      chainId: 11155111,
    },
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_APIKEY,
    },
  },
  namedAccounts: {
    firstAccount: {
      default: 0,
    },
    secondAccount: {
      default: 1,
    },
  },
};
