// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function getBalance(address) {
  const balance = await hre.waffle.provider.getBalance(address)
  return hre.ethers.utils.formatEther(balance)
}

async function printBalances(addresses) {
  let id =0
  for(const address of addresses) {
    console.log(`Address ${id} - ${address} balance : `, await getBalance(address))
    id++
  }
}

async function printMessages(messages) {
  for(const msg of messages) {
    const timestamp = msg.timestamp
    const name = msg.name
    const sender = msg.sender
    const message = msg.message
    console.log(`At ${timestamp}, ${name} ${sender} sent : ${message}`)
  }
}

async function main() {
  const [owner,sender1,sender2,sender3] = await hre.ethers.getSigners()
  const buyMeACoffeeContract = await hre.ethers.getContractFactory("BuyMeACoffee")
  const deployedBuyMeACoffeeContract= await buyMeACoffeeContract.deploy()
  await deployedBuyMeACoffeeContract.deployed()
  console.log(`Buy Me a Coffee Smart Contract deployed at ${deployedBuyMeACoffeeContract.address}`)
  const addresses = [owner.address,sender1.address,sender2.address,sender3.address,deployedBuyMeACoffeeContract.address]
  console.log("Before buying")
  await printBalances(addresses)
  const cost = {value: hre.ethers.utils.parseEther('1')}
  await deployedBuyMeACoffeeContract.connect(sender1).buyCoffee('virat','nice to meet you sharath',cost)
  await deployedBuyMeACoffeeContract.connect(sender2).buyCoffee('dhoni','definitely not',cost)
  await deployedBuyMeACoffeeContract.connect(sender3).buyCoffee('spiderman','everywhere i see you',cost)
  console.log("After buying")
  await printBalances(addresses)
  await deployedBuyMeACoffeeContract.connect(owner).withdawFunds()
  console.log("After withdrawing funds")
  await printBalances(addresses)
  console.log("Messages")
  const messages = await deployedBuyMeACoffeeContract.getMessages()
  printMessages(messages)
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
