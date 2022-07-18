const hre = require("hardhat");
const ABI = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json")

async function getBalance(provider,address) {
    const balance = await provider.getBalance(address)
    return hre.ethers.utils.formatEther(balance)
}

async function main() {
    const contractAddress = "0xD95ea200FbF977876c3fe00AE72A8dE59f06762F"
    const contractABI = ABI.abi
    const provider = new hre.ethers.providers.AlchemyProvider('goerli',process.env.Alchemy_API_Url)
    const signer = new hre.ethers.Wallet(process.env.Goerli_Private_Key,provider)
    const buyMeACoffee = new hre.ethers.Contract(contractAddress,contractABI,signer)
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
    console.log("current balance of contract: ", await getBalance(provider, buyMeACoffee.address), "ETH");
    const contractBalance = await getBalance(provider, buyMeACoffee.address);
    if(contractBalance !== "0.0"){
        console.log("withdrawing funds...")
        const tnx = await buyMeACoffee.withdawFunds()
        await tnx.wait()
    }
    else {
        console.log("no funds to withdraw...");
    }
    console.log("current balance of owner: ", await getBalance(provider, signer.address), "ETH");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });