const ethers = require('ethers');
const FlappyApeNFT = require('./abis/FlappyApeNFT.json')

async function giveCoins(amount, account, nftId) {
    const provider = new ethers.providers.JsonRpcProvider(url, 31337)
    const signer = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(nftAddress, FlappyApeNFT.abi, signer)
    //verify somehow that user acctually deserves these coins
    try {
        await contract.levelBonus(amount, nftId, account)
    }
    catch (e) {
        console.log(e)
    }

}
giveCoins(10, "0x70997970C51812dc3A010C7d01b50e0d17dc79C8", 0)