import { Connection, PublicKey, Keypair, Transaction, TransactionMessage, VersionedTransaction, } from "@solana/web3.js";
import { createBurnInstruction, TOKEN_2022_PROGRAM_ID, getAssociatedTokenAddress, getMint, Mint, createTransferInstruction, createAssociatedTokenAccountInstruction, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import * as fs from "fs";

async function transferNFTtoNewOwner ( conn: Connection, tokenTroveNftTokenAccount: PublicKey, nftMintAddress: PublicKey, fractionalTokenMintAddress: PublicKey, signer: Keypair )
{
    const txn = new Transaction();
    const userWalletAddress = signer.publicKey;

    try {
        const fractionalTokenMintInfo = await getMint( conn, fractionalTokenMintAddress );
        const userFractionalTokenAccount = await getAssociatedTokenAddress( fractionalTokenMintAddress, userWalletAddress );
        const userNFTtokenAccount = await getAssociatedTokenAddress( nftMintAddress, userWalletAddress );

        const IxOne = await burnFractionalTokenIx(
            conn,
            userFractionalTokenAccount,
            fractionalTokenMintAddress,
            fractionalTokenMintInfo,
            userWalletAddress
        );

        const IxTwo = createAssociatedTokenAccountInstruction(
            userWalletAddress,
            userNFTtokenAccount,
            userWalletAddress,
            nftMintAddress,
            TOKEN_2022_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );

        const IxThree = createTransferInstruction(
            tokenTroveNftTokenAccount,
            userNFTtokenAccount,
            userWalletAddress,
            1,
            [],
            TOKEN_2022_PROGRAM_ID
        );


        txn.add( IxOne, IxTwo, IxThree );

    } catch ( error ) {
        throw error;
    }

    var txID;
    const blockHash = await conn.getLatestBlockhash( "finalized" );

    try {
        const messageV0 = new TransactionMessage(
            {
                payerKey: userWalletAddress,
                recentBlockhash: blockHash.blockhash,
                instructions: txn.instructions
            } ).compileToV0Message();

        const transaction = new VersionedTransaction( messageV0 );
        transaction.sign( [ signer ] );

        txID = await conn.sendTransaction( transaction, { maxRetries: 3 } );

    } catch ( error ) {
        throw error;
    }

    const confirmation = await conn.confirmTransaction( {
        signature: txID,
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight,
    } );

    if ( confirmation.value.err ) { throw new Error( "transaction not confirmed." ); }
    console.log( 'transaction Succesfully Confirmed!', '\n', `https://explorer.solana.com/tx/${ txID }?cluster=devnet` );
}


async function burnFractionalTokenIx ( conn: Connection, tokenAccount: PublicKey, tokenMintAddress: PublicKey, mintInfo: Mint, userWalletAddress: PublicKey )
{
    const userTokenBalance = await conn.getTokenAccountBalance( tokenAccount );

    if ( userTokenBalance.value.uiAmountString === undefined ) {
        throw TypeError;
    }

    if ( userTokenBalance.value.uiAmountString != mintInfo.supply.toString() ) {
        throw new Error( "not enough token" );
    }

    return createBurnInstruction(
        tokenAccount,
        tokenMintAddress,
        userWalletAddress,
        mintInfo.supply,
        [],
        TOKEN_2022_PROGRAM_ID
    );
}


class TokenTroveAccount
{
    keyPair: Keypair;
    constructor ( solKeygenFilePath: string )
    {
        const fileContent = fs.readFileSync( solKeygenFilePath, { encoding: "utf-8" } );
        const secretKey = JSON.parse( fileContent );
        const secretKeyUint8Array = new Uint8Array( secretKey );
        const keypair = Keypair.fromSecretKey( secretKeyUint8Array );
        this.keyPair = keypair;
    }
}