/* eslint-disable no-console */
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Wallet } from '@project-serum/anchor/src/provider'
import { Program, Provider, setProvider, web3 } from '@project-serum/anchor'
import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import config from './staking-config.json'
import Utils from './utils'
import { StakingPoolInfo } from '../models/stakingPool'
import { MemberInfo } from '../models/memberInfo'

const STAKING_PROGRAM_ID = config.program['staking.programId']

let provider: Provider
let program: Program

export default class StakingClient {
  public static async getBalance(connection: Connection, wallet: PublicKey) {
    const balance = await connection.getBalance(wallet)
    if (balance && balance > 0) return balance / LAMPORTS_PER_SOL
    return 0
  }

  public static async createMember(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)

    const state = (await program.state()) as any
    const statePubKey = state.address()
    const member = await program.account.member.associatedAddress(provider.wallet.publicKey)

    console.log('member: ', member.toString())

    const [memberImprint, memberNonce] = await web3.PublicKey.findProgramAddress(
      [statePubKey.toBuffer(), member.toBuffer()],
      program.programId
    )
    const res = await Utils.createBalanceSandbox(provider, state, memberImprint)
    const { tx, balances } = res

    const txSigns = await provider.send(tx.tx, tx.signers)

    console.log('create balance sandbox tx: ', txSigns)
    console.log('balances.spt: ', balances.spt.toString())
    console.log('balances.vaultStake: ', balances.vaultStake.toString())
    console.log('balances.vaultPw: ', balances.vaultPw.toString())

    try {
      const tx = await program.rpc.createMember(memberNonce, {
        accounts: {
          stakingPool: statePubKey,
          member,
          authority: provider.wallet.publicKey,
          balances,
          memberImprint,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId
        }
      })
      console.log('tx: ', tx)
      const memberAccount = await program.account.member.associated(provider.wallet.publicKey)
      console.log('memberAccount.owner: ', memberAccount.authority.toString())
      console.log('memberAccount.metadata: ', memberAccount.metadata.toString())
      console.log('memberAccount.rewardsCursor: ', memberAccount.rewardsCursor.toString())
      console.log('memberAccount.lastStakeTs: ', memberAccount.lastStakeTs.toString())
      console.log('memberAccount.nonce: ', memberAccount.nonce.toString())
    } catch (e) {
      console.log('Create member Error: ', e)
    }
  }

  public static async deposit(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)

    const god = new web3.PublicKey(config.program.vault)
    const state = (await program.state()) as any
    const statePubKey = state.address()

    const member = await program.account.member.associatedAddress(provider.wallet.publicKey)
    const memberAccount = await program.account.member.associated(provider.wallet.publicKey)
    const { balances } = memberAccount
    const [memberImprint, memberNonce] = await web3.PublicKey.findProgramAddress(
      [statePubKey.toBuffer(), member.toBuffer()],
      program.programId
    )
    const depositAmount = new BN(100000)
    try {
      const tx = await program.rpc.depositAndState(depositAmount, {
        accounts: {
          stakingPool: statePubKey,
          poolMint: state.poolMint,
          imprint: state.imprint,
          member,
          authority: provider.wallet.publicKey,
          balances,
          memberImprint,
          depositor: god,
          depositorAuthority: provider.wallet.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: web3.SYSVAR_CLOCK_PUBKEY,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId
        }
      })
      console.log('tx: ', tx)

      console.log('memberAccount.owner: ', memberAccount.authority.toString())
      console.log('memberAccount.metadata: ', memberAccount.metadata.toString())
      console.log('memberAccount.rewardsCursor: ', memberAccount.rewardsCursor.toString())
      console.log('memberAccount.lastStakeTs: ', memberAccount.lastStakeTs.toString())
      console.log('memberAccount.nonce: ', memberAccount.nonce.toString())

    } catch (e) {
      console.log('Stake Error: ', e)
    }
  }

  public static async withdraw(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)

    const tokenAccount = new web3.PublicKey(config.program.vault)
    const state = (await program.state()) as any
    const statePubKey = state.address()

    const member = await program.account.member.associatedAddress(provider.wallet.publicKey)
    const memberAccount = await program.account.member.associated(provider.wallet.publicKey)
    const { balances } = memberAccount
    const [memberImprint, memberNonce] = await web3.PublicKey.findProgramAddress(
      [statePubKey.toBuffer(), member.toBuffer()],
      program.programId
    )

    const withdrawAmount = new BN(99)
    try {
      const tx = await program.rpc.withdraw(withdrawAmount, {
        accounts: {
          stakingPool: statePubKey,
          poolMint: state.poolMint,
          imprint: state.imprint,
          member,
          authority: provider.wallet.publicKey,
          balances,
          memberImprint,
          beneficial: tokenAccount,
          beneficialAuthority: provider.wallet.publicKey,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: web3.SYSVAR_CLOCK_PUBKEY,
          rent: web3.SYSVAR_RENT_PUBKEY
        }
      })
      console.log('tx: ', tx)
      console.log('token account: ', tokenAccount.toString(), ' - amount: ', await Utils.tokenBalance(connection, tokenAccount))

      console.log('memberAccount.owner: ', memberAccount.authority.toString())
      console.log('memberAccount.metadata: ', memberAccount.metadata.toString())
      console.log('memberAccount.rewardsCursor: ', memberAccount.rewardsCursor.toString())
      console.log('memberAccount.lastStakeTs: ', memberAccount.lastStakeTs.toString())
      console.log('memberAccount.nonce: ', memberAccount.nonce.toString())

      const memberBalances = memberAccount.balances

      console.log('memberAccount.balances')
      console.log('spt: ', memberBalances.spt.toString(), ' - amount: ', await Utils.tokenBalance(connection, memberBalances.spt))
      console.log(
        'vaultStake: ',
        memberBalances.vaultStake.toString(),
        ' - amount: ',
        await Utils.tokenBalance(connection, memberBalances.vaultStake)
      )
      console.log(
        'vaultPw: ',
        memberBalances.vaultPw.toString(),
        ' - amount: ',
        await Utils.tokenBalance(connection, memberBalances.vaultPw)
      )
    } catch (e) {
      console.log('Stake Error: ', e)
    }
  }

  public static async getStakingPoolInfo(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)

    const state = (await program.state()) as any
    const poolMint = await provider.connection.getTokenSupply(state.poolMint)
    const totalStaked = poolMint.value
    const stakingPool: StakingPoolInfo = {
      totalStaked: totalStaked.uiAmount,
      accumulateTokenRewardPerShare: state.accTokenPerShare,
      lastUpdateBlock: state.lastRewardBlock,
      rewardPerBlock: state.rewardPerBlock,
      precisionFactor: state.precisionFactor
    }
    return stakingPool
  }

  public static async getMemberInfo(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)
    const memberAssociatedAccount = await program.account.member.associated(wallet.publicKey)
    const vaultStakePubKey = memberAssociatedAccount.balances.vaultStake
    const stakeAmount = (await provider.connection.getTokenAccountBalance(vaultStakePubKey)).value
    const memberInfo: MemberInfo = {
      stakeAmount,
      rewardDebt: memberAssociatedAccount.rewardDebt,
      metaData: memberAssociatedAccount.metaData
    }
    return memberInfo
  }
}

function loadProgram(connection: Connection, wallet: Wallet) {
  provider = new Provider(connection, wallet, Provider.defaultOptions())
  setProvider(provider)

  const programId = new web3.PublicKey(STAKING_PROGRAM_ID)
  program = new Program(JSON.parse(JSON.stringify(config.idl)), programId)
}
