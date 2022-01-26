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

const UPGRADE_TO_LEVEL_1 = 30;
const LEVEL_0_BONUS = 1;
const LEVEL_1_BONUS = 2;
const UPGRADE_TO_LEVEL_2 = 90;

describe("Level bonus", function () {
  it("called by investor", async function () {
    await expect(
      nft.connect(investor).levelBonus(UPGRADE_TO_LEVEL_1, investor.address, 0)
    ).to.be.revertedWith("caller is not the owner");

    const balance = await coin.balanceOf(investor.address);
    expect(balance).to.equal(0);
  });

  it("with wrong nft id ", async function () {
    await expect(
      nft.levelBonus(UPGRADE_TO_LEVEL_1, investor.address, 2)
    ).to.be.revertedWith("User doesn't own this NFT");

    const balance = await coin.balanceOf(investor.address);
    expect(balance).to.equal(0);
  });

  it("called by owner", async function () {
    await nft.levelBonus(
      UPGRADE_TO_LEVEL_1 / LEVEL_0_BONUS,
      investor.address,
      0
    );
    const balance = await coin.balanceOf(investor.address);
    expect(balance).to.equal(
      ethers.utils.parseEther(UPGRADE_TO_LEVEL_1.toString())
    );
  });
});

describe("Upgrade", function () {
  it("to level 1", async function () {
    await coin
      .connect(investor)
      .increaseAllowance(
        nft.address,
        ethers.utils.parseEther(UPGRADE_TO_LEVEL_1.toString())
      );
    await nft.connect(investor).setApprovalForAll(nft.address, true);

    await nft.connect(investor).upgrade(0);
    expect(await nft.balanceOf(investor.address, 0)).to.equal("0");
    expect(await nft.balanceOf(investor.address, 1)).to.equal("1");
    expect(await coin.balanceOf(investor.address)).to.equal("0");
  });

  it("user doesn't have nft", async function () {
    await expect(nft.connect(investor).upgrade(3)).to.be.revertedWith(
      "User doesn't own this NFT"
    );
  });

  it("user doesn't have enough coins", async function () {
    await expect(nft.connect(investor).upgrade(1)).to.be.revertedWith(
      "User doesn't have enough Flappy Ape Coin"
    );
  });
});

describe("To level 2", function () {
  it("user plays the game again and gets 45 points", async function () {
    await nft.levelBonus(
      UPGRADE_TO_LEVEL_2 / LEVEL_1_BONUS,
      investor.address,
      1
    );
    const balance = await coin.balanceOf(investor.address);
    expect(balance).to.equal(
      ethers.utils.parseEther(UPGRADE_TO_LEVEL_2.toString())
    );
  });

  it("upgrades to level 2", async function () {
    await coin
      .connect(investor)
      .increaseAllowance(
        nft.address,
        ethers.utils.parseEther(UPGRADE_TO_LEVEL_2.toString())
      );
    await nft.connect(investor).setApprovalForAll(nft.address, true);

    await nft.connect(investor).upgrade(1);
    expect(await nft.balanceOf(investor.address, 0)).to.equal("0");
    expect(await nft.balanceOf(investor.address, 1)).to.equal("0");
    expect(await nft.balanceOf(investor.address, 2)).to.equal("1");
    expect(await coin.balanceOf(investor.address)).to.equal("0");
  });
});
