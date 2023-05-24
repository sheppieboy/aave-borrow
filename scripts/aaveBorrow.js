const main = async () => {
  //aave treats everything like ERC-20 token
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
