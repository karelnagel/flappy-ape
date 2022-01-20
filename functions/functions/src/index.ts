import * as functions from "firebase-functions";
import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
const iface = new Interface([
    "function levelBonus(uint256 amount, uint256 nftId, address account)",
]);

const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const RPC_URL = "http://127.0.0.1:8545/"
const NFT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"
// const COIN_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"

export const helloWorld = functions.https.onRequest(async (request, response) => {
    console.log(request.query["asd"])

    const amount = request.query["amount"];
    const account = request.query["account"]
    const nft = request.query["nft"]
    if (!amount || !account || !nft) {
        response.json({ success: false, error: "Query missing", amount, account, nft }).status(400);
        return
    }

    const provider = new ethers.providers.JsonRpcProvider(RPC_URL, 31337)
    const signer = new ethers.Wallet(PRIVATE_KEY!, provider);
    const contract = new ethers.Contract(NFT_ADDRESS!, iface, signer)

    functions.logger.info(`Trying to send ${amount} coins to ${account} with nft ${nft}`, { structuredData: true });

    //verify somehow that user acctually deserves these coins
    try {
        await contract.levelBonus(amount, nft, account)
        response.json({ success: true });
    }
    catch (e) {
        console.log(e)
        response.json({ success: false, error: e }).status(500);
    }

});
