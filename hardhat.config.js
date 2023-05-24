/** @type import('hardhat/config').HardhatUserConfig */
require('dotenv').config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;

module.exports = {
  defaultNetwork: 'hardhat',
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
    },
    hardhat: {
      chainId: 31337,
      forking: {
        url: MAINNET_RPC_URL,
      },
    },
  },
  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
  },
  solidity: {
    compilers: [{ version: '0.8.18' }, { version: '0.4.19' }],
  },
};
