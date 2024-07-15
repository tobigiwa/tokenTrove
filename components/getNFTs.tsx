import { getWalletNFTs } from "@/solana/getNFTs";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { FC, ReactNode } from "react";
import {Metaplex} from "@metaplex-foundation/js";


export const  AllNFTs: FC<{children: ReactNode;}> = async ({children}) => {
    
    const {connection} = useConnection();
    const {publicKey, sendTransaction} = useWallet();
    if (!publicKey) {
      return
    }

    const assets  = await getWalletNFTs(connection, publicKey);
    
    if (!assets.length) {
        return(
          <div>`No NFTs in this Wallet ${publicKey.toBase58()}`</div>  
        ) 
    }
    const arr = [];
    assets.forEach(async(asset) => {
        const nft = await metaplex.nfts().load({metadata: asset})
        arr.push(nft)
    })

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {children}
        </div>
    )
}