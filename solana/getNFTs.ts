import { Connection, PublicKey, Keypair,clusterApiUrl } from "@solana/web3.js";
import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import * as fs from "fs";


export const getWalletNFTs = async ( conn: Connection, walletAddress: PublicKey ) => {
    const metaplex = new Metaplex(conn);
    return  await metaplex.nfts().findAllByOwner({owner: walletAddress});
}