// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./FlappyApeCoin.sol";
import "./FlappyApeNFT.sol";

contract FlappyApeNFT is ERC1155, Ownable, ERC1155Burnable {
    FlappyApeCoin private coin;

    constructor(address coinAddress)
        ERC1155("https://flappyape.io/tokens/{id}")
    {
        coin = FlappyApeCoin(coinAddress);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function calcPrice(uint256 nftId) public pure returns (uint256) {
        return (3**nftId) * 10 ether;
    }

    function calcBonus(uint256 nftId) public pure returns (uint256) {
        return 2**nftId;
    }

    modifier checkNFT(uint256 nftId, address account) {
        require(
            nftId == 0 || balanceOf(account, nftId) > 0,
            "User doesn't own this NFT"
        );
        _;
    }

    function upgrade(uint256 nftId) public checkNFT(nftId, msg.sender) {
        uint256 newNftId = nftId + 1;
        uint256 price = calcPrice(newNftId);
        require(
            coin.balanceOf(msg.sender) >= price,
            "User doesn't have enough Flappy Ape Coin"
        );
        coin.burnFrom(msg.sender, price); // Todo maybe send coins to contract

        if (nftId!=0)_burn(msg.sender, nftId, 1);
        _mint(msg.sender, newNftId, 1, "");
    }

    function levelBonus(
        uint256 points,
        address account,
        uint256 nftId
    ) public onlyOwner checkNFT(nftId, account) {
        uint256 amount = points * calcBonus(nftId) * 1 ether;
        coin.mint(account, amount);
    }
}
