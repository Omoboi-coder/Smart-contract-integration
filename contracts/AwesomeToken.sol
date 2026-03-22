// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract AwesomeToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 10_000_000 * 10**18;
    uint256 public constant FAUCET_AMOUNT = 100 * 10**18;
    uint256 public constant COOLDOWN_TIME = 24 hours;

    mapping(address => uint256) public lastRequestTime;

    event TokensRequested(address indexed user, uint256 amount);

    constructor(address initialOwner) ERC20("Awesome Token", "AWT") Ownable(initialOwner) {
    }

    function requestToken() external {
        require(lastRequestTime[msg.sender] + COOLDOWN_TIME <= block.timestamp, "Cooldown period not yet passed");
        require(totalSupply() + FAUCET_AMOUNT <= MAX_SUPPLY, "Exceeds MAX_SUPPLY");

        lastRequestTime[msg.sender] = block.timestamp;
        _mint(msg.sender, FAUCET_AMOUNT);

        emit TokensRequested(msg.sender, FAUCET_AMOUNT);
    }

    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds MAX_SUPPLY");
        _mint(to, amount);
    }

    function timeUntilNextRequest(address user) external view returns (uint256) {
        if (lastRequestTime[user] + COOLDOWN_TIME <= block.timestamp) {
            return 0;
        } else {
            return (lastRequestTime[user] + COOLDOWN_TIME) - block.timestamp;
        }
    }
}
