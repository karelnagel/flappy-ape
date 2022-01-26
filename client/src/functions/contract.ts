import { ethers } from "ethers"
import FlappyApeNFT from "./../abi/contracts/FlappyApeNFT.sol/FlappyApeNFT.json"
import FlappyApeCoin from "./../abi/contracts/FlappyApeCoin.sol/FlappyApeCoin.json"
import { Web3Provider } from "@ethersproject/providers";
import { BigNumber } from "@ethersproject/bignumber";
//Getting contracts
const nftContract = (provider: Web3Provider | ethers.Signer) => new ethers.Contract(process.env.REACT_APP_NFT_ADDRESS!, FlappyApeNFT.abi, provider);
const coinContract = (provider: Web3Provider | ethers.Signer) => new ethers.Contract(process.env.REACT_APP_COIN_ADDRESS!, FlappyApeCoin.abi, provider);

//NFT functions
const upgrade = async (provider: Web3Provider, nftId: number): Promise<number> => {
    try {
        const signer = provider.getSigner()
        const nft = nftContract(signer);
        const coin = coinContract(signer);
        const cost = await nft.calcPrice( nftId + 1);
        await coin.increaseAllowance(process.env.REACT_APP_NFT_ADDRESS, cost);
        if (!await nft.isApprovedForAll(signer.getAddress(), process.env.REACT_APP_NFT_ADDRESS))
            await nft.setApprovalForAll(process.env.REACT_APP_NFT_ADDRESS, true)
        await nft.upgrade(nftId)
        return 0; //Todo get from event
    } catch (e) {
        console.log(e);
        return -1
    }
}

const getUserLevel = async (provider: Web3Provider): Promise<number> => {
    let accounts = [], nfts = []
    for (let i = 0; i < 20; i++) {
        accounts.push(provider.getSigner().getAddress())
        nfts.push(i)
    }
    try {
        const result = await nftContract(provider).balanceOfBatch(accounts, nfts)
        const level = result.findLastIndex((x: BigNumber) => x.eq(1));
        if (level === -1) return 0
        return level;
    }
    catch (e) {
        console.log(e)
        return 0
    }
}

const getUserCoinBalance = async (provider: Web3Provider): Promise<number> => {
    try {
        const address = provider.getSigner().getAddress()
        return formatEther(await coinContract(provider).balanceOf(address))
    }
    catch (e) {
        console.log(e)
        return 0
    }
}
export function formatEther(ether:BigNumber):number{
    return Number(ethers.utils.formatEther(ether))
}
const getLevelPrice = async (provider: Web3Provider, nftId: number): Promise<number> => {
    try {
        const result = formatEther(await nftContract(provider).calcPrice(nftId))
        return result
    }
    catch (e) {
        console.log(e)
        return 0
    }
}
const getLevelBonus = async (provider: Web3Provider, nftId: number): Promise<number> => {
    try {
        const result = (await nftContract(provider).calcBonus(nftId)).toNumber()
        return result
    }
    catch (e) {
        console.log(e)
        return 0
    }
}

export { upgrade, nftContract, coinContract, getUserCoinBalance, getUserLevel, getLevelBonus, getLevelPrice }