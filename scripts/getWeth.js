const { getNamedAccounts } = require('hardhat');

const getWeth = async () => {
  const { deployer } = await getNamedAccounts();

  //call the 'deposit' function on the weth contract
  //need contract address and abi
  //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
};

module.exports = getWeth;
