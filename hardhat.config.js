require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers")
require("dotenv").config()

const Alchemy_API_Url = process.env.Alchemy_API_Url
const Goerli_Private_Key = process.env.Goerli_Private_Key

module.exports = {
  solidity: "0.8.4",
  networks: {
    goerli: {
      url: Alchemy_API_Url,
      accounts: [Goerli_Private_Key]
    }
  }
};
