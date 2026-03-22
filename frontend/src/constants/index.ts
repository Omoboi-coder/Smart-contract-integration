export const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export const ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function MAX_SUPPLY() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function owner() view returns (address)",
  "function lastRequestTime(address user) view returns (uint256)",
  "function COOLDOWN_TIME() view returns (uint256)",
  "function requestToken() external",
  "function mint(address to, uint256 amount) external",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function timeUntilNextRequest(address user) view returns (uint256)",
  "event Transfer(address indexed from, address indexed to, uint256 value)",
  "event TokensRequested(address indexed user, uint256 amount)"
];
