'use client';

import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, ABI } from '@/constants';

export const useWeb3 = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectWallet = useCallback(async () => {
    if (typeof (window as any).ethereum !== 'undefined') {
      try {
        setLoading(true);
        setError(null);
        const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await browserProvider.send("eth_requestAccounts", []);
        const signer = await browserProvider.getSigner();
        const tokenContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        setAccount(accounts[0]);
        setProvider(browserProvider);
        setContract(tokenContract);
      } catch (err: any) {
        setError(err.message || 'Failed to connect');
      } finally {
        setLoading(false);
      }
    } else {
      setError('Please install MetaMask');
    }
  }, []);

  useEffect(() => {
    if (typeof (window as any).ethereum !== 'undefined') {
      (window as any).ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          setAccount(null);
        }
      });
    }
  }, []);

  return { account, provider, contract, connectWallet, loading, error };
};
