# AwesomeToken dApp

A professional full-stack dApp featuring an ERC20 token with a built-in faucet and administrative controls.

## Features

### Smart Contract (ERC20)
- **Standard ERC20**: Full compatibility with OpenZeppelin's ERC20.
- **MAX_SUPPLY**: Capped at 10,000,000 AWT.
- **requestToken()**: Faucet function allowing users to claim 100 AWT every 24 hours.
- **mint()**: Owner-only function to mint new tokens up to the MAX_SUPPLY.
- **View Functions**: Enhanced with `timeUntilNextRequest` for better UX.

### Frontend (Next.js + TypeScript)
- **Real-time Dashboard**: Displays balance, total supply, and contract info.
- **Faucet with Countdown**: Specific countdown timer for each user based on their last request time.
- **Transfer Portal**: Easy-to-use interface for sending tokens.
- **Admin Panel**: Context-aware minting interface (only visible to contract owner).
- **Responsive Design**: Professional UI built with Tailwind CSS and Lucide icons.

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MetaMask or any Web3 wallet

### 1. Smart Contract Setup
```bash
# Install dependencies
npm install

# Run tests
npx hardhat test

# Start local node
npx hardhat node

# Deploy to local node
npx hardhat ignition deploy ignition/modules/AwesomeToken.ts --network localhost
```

### 2. Frontend Setup
```bash
cd frontend
npm install

# Start development server
npm run dev
```

### 3. Usage
1. Connect MetaMask to `Localhost 8545` (Chain ID: 31337).
2. Import one of the Hardhat accounts into MetaMask using its private key.
3. Interact with the dashboard to request, mint, or transfer tokens.

## Architecture
- **Contract**: Solidity 0.8.20, OpenZeppelin.
- **Frontend**: Next.js 14 (App Router), Ethers.js v6, Tailwind CSS.
- **Hooks**: Custom `useWeb3` hook for streamlined contract interaction.
