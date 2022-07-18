// scripts/deploy.js

const hre = require("hardhat");

async function main() {
  // We get the contract to deploy.
  const buyMeACoffeeContract = await hre.ethers.getContractFactory("BuyMeACoffee");
  const deployedBuyMeACoffeeContract= await buyMeACoffeeContract.deploy();

  await deployedBuyMeACoffeeContract.deployed();

  console.log("BuyMeACoffee Smart Contract deployed at:", deployedBuyMeACoffeeContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

// smart contract address 0xD95ea200FbF977876c3fe00AE72A8dE59f06762F