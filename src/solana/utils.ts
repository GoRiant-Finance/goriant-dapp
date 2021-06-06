import { createTokenAccountInstrs } from '@project-serum/common'
import { Provider, web3 } from '@project-serum/anchor'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import { TokenInstructions } from '@project-serum/serum'

const FAILED_TO_FIND_ACCOUNT = 'Failed to find account'
const INVALID_ACCOUNT_OWNER = 'Invalid account owner'

export default class Utils {
  public static async createBalanceSandbox(provider: Provider, programState: any, registrySigner: PublicKey) {
    const spt = new web3.Account()
    const vaultStake = new web3.Account()

    const lamports = await provider.connection.getMinimumBalanceForRentExemption(165)

    const createSptIx = await createTokenAccountInstrs(provider, spt.publicKey, programState.poolMint, registrySigner, lamports)
    const createVaultStakeIx = await createTokenAccountInstrs(provider, vaultStake.publicKey, programState.mint, registrySigner, lamports)
    const tx0 = new web3.Transaction()
    tx0.add(...createSptIx, ...createVaultStakeIx)
    const signers0 = [spt, vaultStake]
    const tx = { tx: tx0, signers: signers0 }
    const balances = {
      spt: spt.publicKey,
      vaultStake: vaultStake.publicKey
    }

    const r: Result = { tx, balances }
    return r
  }

  public static async tokenBalance(connection: Connection, wallet: PublicKey) {
    return (await connection.getTokenAccountBalance(wallet)).value
  }

  public static getMultiplier(from: BN, to: BN, bonusEndBlock: BN) {
    if (to <= bonusEndBlock) {
      return to.sub(from)
    }
    if (from >= bonusEndBlock) {
      return 0
    }
    return bonusEndBlock.sub(from)
  }

  public static async createAssociatedTokenAccountInternal(
    provider: Provider,
    mint: PublicKey,
    owner: PublicKey,
    associatedAddress: PublicKey
  ) {
    const tx = new Transaction().add(
      Token.createAssociatedTokenAccountInstruction(
        ASSOCIATED_TOKEN_PROGRAM_ID,
        TokenInstructions.TOKEN_PROGRAM_ID,
        mint,
        associatedAddress,
        owner,
        owner
      )
    )
    await provider.send(tx, undefined, { skipPreflight: false })
    return associatedAddress
  }

  public static async getOrCreateAssociatedAccountInfo(provider: Provider, mint: PublicKey, owner: PublicKey) {
    const associatedAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TokenInstructions.TOKEN_PROGRAM_ID,
      mint,
      owner
    )
    const account = await provider.connection.getAccountInfo(associatedAddress)
    if (account === null) await Utils.createAssociatedTokenAccountInternal(provider, mint, owner, associatedAddress)
    return associatedAddress
  }
}

type Result = {
  tx: {
    tx: Transaction
    signers: web3.Account[]
  }
  balances: {
    spt: PublicKey
    vaultStake: PublicKey
  }
}
