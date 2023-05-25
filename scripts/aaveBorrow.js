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
  const wethTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';

  //approve
  await approveERC20(wethTokenAddress, lendingPool.address, AMOUNT, deployer);
  console.log(`Depositing...`);

  //deposit
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer, 0);
  console.log('Deposited!');

  //how much DAI can we borrow based on the ETH we deposited?

  //borrow
  //How much we have borrowed, how much we have in collateral, and how much we can borrow
  await getBorrowUserData(lendingPool, deployer);
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

const getBorrowUserData = async (lendingPool, account) => {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account);
  console.log(`You have ${totalCollateralETH} worth of ETH deposited`);
  console.log(`You have ${totalDebtETH} worth of ETH borrowed`);
  console.log(`You can borrow ${availableBorrowsETH} worth of ETH`);
  return { totalDebtETH, availableBorrowsETH };
};

const getDaiPriceFeed = async () => {
  const daiEthPriceFeed = await ethers.getContractAt(
    'AggregatorV3Interface',
    '0x773616E4d11A78F511299002da57A0a94577F1f4'
  );
  const price = await daiEthPriceFeed.latestRoundData()[1];
  console.log(`The DAI/ETH price is ${price}`);
  return price;
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
