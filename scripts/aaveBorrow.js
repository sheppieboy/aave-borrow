const { getNamedAccounts, ethers } = require('hardhat');
const { getWeth, AMOUNT } = require('./getWeth');

const main = async () => {
  //aave treats everything like ERC-20 token
  await getWeth();

  const { deployer } = await getNamedAccounts();
  //abi, address to interact with aave protocol
  const lendingPool = await getLendingPool(deployer);
  console.log(lendingPool.address);

  //token to deposit
  const wethTokenAddress = '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5';

  //approve
  await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
  console.log(`Depositing...`);

  //deposit
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log('Deposited!');
};

const getLendingPool = async (account) => {
  const lendingPoolAddressProvider = await ethers.getContractAt(
    'ILendingPoolAddressesProvider',
    '0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5',
    account
  );

  const lendingPoolAddress = await lendingPoolAddressProvider.getLendingPool();
  const lendingPool = await ethers.getContractAt(
    'ILendingPool',
    lendingPoolAddress,
    account
  );
  return lendingPool;
};

const approveERC20 = async (
  erc20Address,
  spenderAddress,
  amountToSpend,
  account
) => {
  const erc20Token = await ethers.getContractAt(
    'IERC20',
    erc20Address,
    account
  );
  const tx = await erc20Token.approve(spenderAddress, amountToSpend);
  await tx.wait(1);
  console.log('Approved!');
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
