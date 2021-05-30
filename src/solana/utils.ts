import { createTokenAccountInstrs } from '@project-serum/common'
import { Provider, web3 } from '@project-serum/anchor'
import { Connection, PublicKey, Transaction } from '@solana/web3.js'

export default class Utils {
  public static async createBalanceSandbox(provider: Provider, programState: any, registrySigner: PublicKey) {
    const spt = new web3.Account()
    const vaultStake = new web3.Account()
    const vaultPw = new web3.Account()

    const lamports = await provider.connection.getMinimumBalanceForRentExemption(165)

    const createSptIx = await createTokenAccountInstrs(provider, spt.publicKey, programState.poolMint, registrySigner, lamports)
    const createVaultStakeIx = await createTokenAccountInstrs(provider, vaultStake.publicKey, programState.mint, registrySigner, lamports)
    const createVaultPwIx = await createTokenAccountInstrs(provider, vaultPw.publicKey, programState.mint, registrySigner, lamports)
    const tx0 = new web3.Transaction()
    tx0.add(...createSptIx, ...createVaultStakeIx, ...createVaultPwIx)
    const signers0 = [spt, vaultStake, vaultPw]
    const tx = { tx: tx0, signers: signers0 }
    const balances = {
      spt: spt.publicKey,
      vaultStake: vaultStake.publicKey,
      vaultPw: vaultPw.publicKey
    }

    const r: Result = { tx, balances }
    return r
  }

  public static async tokenBalance(connection: Connection, wallet: PublicKey) {
    return (await connection.getTokenAccountBalance(wallet)).value
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
    vaultPw: PublicKey
  }
}
