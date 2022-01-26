import { ethers } from "ethers";
import { Interface } from "ethers/lib/utils";
const iface = new Interface([
    "function levelBonus(uint256 points, address account,uint256 nftId)",
]);
//Move this all to a cloud function
export const levelBonus = async (amount: number, account: string, nft: number): Promise<number> => {
    console.log(process.env.REACT_APP_RPC_URL)
    console.log(process.env.REACT_APP_PRIVATE_KEY)
    console.log(process.env.REACT_APP_NFT_ADDRESS)
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL)
    const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY!, provider);
    console.log(signer.getAddress())
    const contract = new ethers.Contract(process.env.REACT_APP_NFT_ADDRESS!, iface, signer)

    //verify somehow that user acctually deserves these coins
    try {
        await contract.levelBonus(amount, account,nft)
        return 0
    }
    catch (e) {
        console.log(e)
        return -1
    }

};
