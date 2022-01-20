import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { FlappyApeCoin, FlappyApeNFT } from "../typechain";

let owner: SignerWithAddress;
let investor: SignerWithAddress;
let coin: FlappyApeCoin;
let nft: FlappyApeNFT;

before(async function () {
  [owner, investor] = await ethers.getSigners();

  // Deploying coin
  const Coin = await ethers.getContractFactory("FlappyApeCoin");
  coin = await Coin.deploy();
  await coin.deployed();

  // Deploying nft
  const NFT = await ethers.getContractFactory("FlappyApeNFT");
  nft = await NFT.deploy(coin.address);
  await nft.deployed();

  await coin.transferOwnership(nft.address);
});

describe("Start", function () {
  it("Start", async function () {
    await nft.connect(investor).start({ value: 10 });
    const balance = await nft.balanceOf(investor.address, 0);
    expect(balance.toString()).to.equal("1");
  });
});

describe("Level bonus", function () {
  it("called by investor", async function () {
    await expect(
      nft.connect(investor).levelBonus(10, 0, investor.address)
    ).to.be.revertedWith("caller is not the owner");
  });

  it("called by owner", async function () {
    await nft.levelBonus(2000, 0, investor.address);
    const balance = await coin.balanceOf(investor.address);
    expect(balance).to.equal(2000);
  });
});

describe("Upgrade", function () {
  it("successful", async function () {
    await coin.connect(investor).increaseAllowance(nft.address, 2000);
    await nft.connect(investor).upgrade(0, 2);
    expect(await nft.balanceOf(investor.address, 0)).to.equal("0");
    expect(await nft.balanceOf(investor.address, 2)).to.equal("1");
    expect(await coin.balanceOf(investor.address)).to.equal("0");
  });

  it("smaller nft id", async function () {
    await expect(nft.connect(investor).upgrade(2, 1)).revertedWith(
      "Upgrade id can't be smaller!"
    );
  });

  it("user doesn't have nft", async function () {
    await expect(nft.connect(investor).upgrade(3, 5)).to.be.revertedWith(
      "User doesn't have this nft"
    );
  });

  it("user doesn't have enough coins", async function () {
    await coin.connect(investor).increaseAllowance(nft.address, 2000);
    await expect(nft.connect(investor).upgrade(2, 3)).to.be.revertedWith(
      "User doesn't have enough Flappy Ape Coin"
    );
  });
});
