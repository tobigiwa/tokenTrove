"use client"

import React, { FC, ReactNode, useMemo } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import {SolflareWalletAdapter,PhantomWalletAdapter} from '@solana/wallet-adapter-wallets';

import '@solana/wallet-adapter-react-ui/styles.css';



export const Wallet: FC<{ children: ReactNode; }> = ( { children } ) =>
{
    const network = WalletAdapterNetwork.Devnet;

    const endpoint = useMemo( () => clusterApiUrl( network ), [ network ] );

    const wallets = useMemo(
        () => [
            new SolflareWalletAdapter(),
            new PhantomWalletAdapter(),
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [ network ]
    );

    return (
        <ConnectionProvider endpoint={ endpoint }>
            <WalletProvider wallets={ wallets } autoConnect>
                <WalletModalProvider>
                     <WalletMultiButton />
                    { children }
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider >
    );
};