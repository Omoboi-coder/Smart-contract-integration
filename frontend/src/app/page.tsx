'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '@/hooks/useWeb3';
import { Countdown } from '@/components/Countdown';
import { CONTRACT_ADDRESS } from '@/constants';
import { Wallet, Coins, Send, PlusCircle, Info, Timer } from 'lucide-react';

export default function Home() {
  const { account, contract, connectWallet, loading: web3Loading } = useWeb3();
  const [stats, setStats] = useState({
    name: '',
    balance: '0',
    totalSupply: '0',
    maxSupply: '0',
    owner: '',
    cooldown: 0,
    symbol: 'AWT',
    decimals: 0
  });
  const [txLoading, setTxLoading] = useState(false);
  const [transferData, setTransferData] = useState({ to: '', amount: '' });
  const [mintData, setMintData] = useState({ to: '', amount: '' });

  const fetchStats = useCallback(async () => {
    if (!contract || !account) return;
    try {
      const [name, balance, totalSupply, maxSupply, owner, cooldown, symbol, decimals] = await Promise.all([
        contract.name(),
        contract.balanceOf(account),
        contract.totalSupply(),
        contract.MAX_SUPPLY(),
        contract.owner(),
        contract.timeUntilNextRequest(account),
        contract.symbol(),
        contract.decimals()
      ]);

      setStats({
        name,
        balance: ethers.formatEther(balance),
        totalSupply: ethers.formatEther(totalSupply),
        maxSupply: ethers.formatEther(maxSupply),
        owner,
        cooldown: Number(cooldown),
        symbol,
        decimals: Number(decimals)
      });
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  }, [contract, account]);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleRequestTokens = async () => {
    if (!contract) return;
    try {
      setTxLoading(true);
      const tx = await contract.requestToken();
      await tx.wait();
      fetchStats();
      alert("Tokens requested successfully!");
    } catch (err: any) {
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    try {
      setTxLoading(true);
      const tx = await contract.transfer(transferData.to, ethers.parseEther(transferData.amount));
      await tx.wait();
      fetchStats();
      setTransferData({ to: '', amount: '' });
      alert("Transfer successful!");
    } catch (err: any) {
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) return;
    try {
      setTxLoading(true);
      const tx = await contract.mint(mintData.to, ethers.parseEther(mintData.amount));
      await tx.wait();
      fetchStats();
      setMintData({ to: '', amount: '' });
      alert("Minting successful!");
    } catch (err: any) {
      alert(err.reason || err.message || "Transaction failed");
    } finally {
      setTxLoading(false);
    }
  };

  const isOwner = account?.toLowerCase() === stats.owner.toLowerCase();

  if (!account) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="max-w-md w-full text-center space-y-8 bg-slate-800 p-10 rounded-2xl border border-slate-700 shadow-2xl">
          <div className="flex justify-center">
            <div className="bg-blue-500/10 p-4 rounded-full">
              <Coins size={64} className="text-blue-500" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Awesome Token</h1>
          <p className="text-slate-400">Connect your wallet to interact with the AWT ecosystem and claim your daily faucet rewards.</p>
          <button
            onClick={connectWallet}
            disabled={web3Loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Wallet size={20} />
            {web3Loading ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Coins className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">AwesomeToken Dashboard</h1>
              <p className="text-sm text-slate-500 font-mono">{account.slice(0, 6)}...{account.slice(-4)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
              <p className="text-xs text-slate-500 uppercase font-semibold">Your Balance</p>
              <p className="text-xl font-bold text-blue-400">{Number(stats.balance).toLocaleString()} {stats.symbol}</p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-slate-400 mb-2 italic">
                  <Info size={16} />
                  <span>Total Supply</span>
                </div>
                <p className="text-3xl font-bold">{Number(stats.totalSupply).toLocaleString()} <span className="text-sm text-slate-500 font-normal">/ {Number(stats.maxSupply).toLocaleString()}</span></p>
                <div className="w-full bg-slate-800 h-2 mt-4 rounded-full overflow-hidden">
                  <div 
                    className="bg-blue-500 h-full transition-all duration-1000" 
                    style={{ width: `${(Number(stats.totalSupply) / Number(stats.maxSupply)) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-slate-400 mb-2 italic">
                    <Timer size={16} />
                    <span>Faucet Status</span>
                  </div>
                  {stats.cooldown > 0 ? (
                    <div className="text-xl">
                      Next claim in: <Countdown seconds={stats.cooldown} onComplete={fetchStats} />
                    </div>
                  ) : (
                    <p className="text-xl font-bold text-green-400">Faucet Available!</p>
                  )}
                </div>
                <button
                  onClick={handleRequestTokens}
                  disabled={txLoading || stats.cooldown > 0}
                  className="mt-4 w-full bg-green-600 hover:bg-green-700 disabled:bg-slate-800 disabled:text-slate-600 py-3 rounded-xl font-bold transition-all"
                >
                  {txLoading ? 'Processing...' : 'Request 100 AWT'}
                </button>
              </div>
            </div>

            {/* Transfer Section */}
            <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-lg">
              <div className="flex items-center gap-2 mb-6">
                <Send className="text-blue-500" />
                <h2 className="text-xl font-bold">Transfer Tokens</h2>
              </div>
              <form onSubmit={handleTransfer} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 ml-1">Recipient Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={transferData.to}
                      onChange={(e) => setTransferData({ ...transferData, to: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 ml-1">Amount</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={transferData.amount}
                      onChange={(e) => setTransferData({ ...transferData, amount: e.target.value })}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={txLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-4 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/10"
                >
                  {txLoading ? 'Transferring...' : 'Send Tokens'}
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar / Admin Section */}
          <div className="space-y-8">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Contract Info</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500">Contract Address</p>
                  <p className="text-sm font-mono break-all text-slate-300">{CONTRACT_ADDRESS}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Token Name</p>
                  <p className="text-sm font-semibold">Awesome Token (AWT)</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Decimals</p>
                  <p className="text-sm font-semibold">18</p>
                </div>
              </div>
            </div>

            {isOwner && (
              <div className="bg-slate-900 p-8 rounded-2xl border border-blue-500/30 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-400 rounded-bl-lg border-b border-l border-blue-500/30">
                  ADMIN ONLY
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <PlusCircle className="text-blue-400" />
                  <h2 className="text-xl font-bold">Mint Tokens</h2>
                </div>
                <form onSubmit={handleMint} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 ml-1">Mint to Address</label>
                    <input
                      type="text"
                      placeholder="0x..."
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={mintData.to}
                      onChange={(e) => setMintData({ ...mintData, to: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-slate-400 ml-1">Amount</label>
                    <input
                      type="number"
                      placeholder="0.0"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      value={mintData.amount}
                      onChange={(e) => setMintData({ ...mintData, amount: e.target.value })}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={txLoading}
                    className="w-full bg-slate-100 hover:bg-white text-slate-950 py-4 rounded-xl font-bold transition-all"
                  >
                    {txLoading ? 'Minting...' : 'Mint Now'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
