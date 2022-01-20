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
    uint256 public constant UPGRADE_PRICE = 1000;

    constructor(address coinAddress)
        ERC1155("https://flappyape.io/tokens/{id}")
    {
        coin = FlappyApeCoin(coinAddress);
    }

    function setURI(string memory newuri) public onlyOwner {
        _setURI(newuri);
    }

    function start() public payable {
        require(msg.value >= 10, "Not enough ETH sent");
        _mint(msg.sender, 0, 1, "");
    }

    function levelBonus(
        uint256 amount,
        uint256 nftId,
        address account
    ) public onlyOwner {
        require(balanceOf(account, nftId) > 0, "User doesn't own this NFT");
        uint256 amountWithBonus = amount * (1 + (nftId / 10)); // Todo check this calc
        coin.mint(account, amountWithBonus);
    }

    function upgrade(uint256 currentNftId, uint256 upgradeNftId) public {
        require(currentNftId < upgradeNftId, "Upgrade id can't be smaller!");
        require(
            balanceOf(msg.sender, currentNftId) > 0,
            "User doesn't have this nft"
        );
        uint256 upgradeCost = UPGRADE_PRICE * (upgradeNftId - currentNftId); //Todo make better calculation
        require(
            coin.balanceOf(msg.sender) >= upgradeCost,
            "User doesn't have enough Flappy Ape Coin"
        );
        coin.burnFrom(msg.sender, upgradeCost); // Todo maybe send coins to contract

        _burn(msg.sender, currentNftId, 1);
        _mint(msg.sender, upgradeNftId, 1, "");
    }
}
