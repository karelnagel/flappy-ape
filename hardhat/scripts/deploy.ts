// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";

async function main() {
  const Coin = await ethers.getContractFactory("FlappyApeCoin");
  const coin = await Coin.deploy();
  await coin.deployed();

  // Deploying nft
  const NFT = await ethers.getContractFactory("FlappyApeNFT");
  const nft = await NFT.deploy(coin.address);
  await nft.deployed();

  await coin.transferOwnership(nft.address);

  const owner = (await ethers.getSigners())[0];
  console.log(`NFT address: ${nft.address}`);
  console.log(`COIN address: ${coin.address}`);
  console.log(`Owner: ${owner.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
