/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { Wallet } from '@project-serum/anchor/src/provider'
import { Program, Provider, setProvider, web3 } from '@project-serum/anchor'
import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import config from './staking-config.json'
import Utils from './utils'

import { StakingPoolInfo } from '../models/stakingPool'
import { notify } from '../utils/notifications'

const STAKING_PROGRAM_ID = config.program['staking.programId']

let provider: Provider
let program: Program
let poolMintPubKey: PublicKey

function loadProgram(connection: Connection, wallet: Wallet) {
  provider = new Provider(connection, wallet, Provider.defaultOptions())
  setProvider(provider)

  const programId = new web3.PublicKey(STAKING_PROGRAM_ID)
  program = new Program(JSON.parse(JSON.stringify(config.idl)), programId)
}

function loadProgramWithOutWallet(connection: Connection) {
  const dummyWallet: Wallet = {
    signTransaction(tx: Transaction): Promise<Transaction> {
      return new Promise<Transaction>(resolve => resolve(tx))
    },
    signAllTransactions(txs: Transaction[]): Promise<Transaction[]> {
      return new Promise<Transaction[]>(resolve => resolve(txs))
    },
    publicKey: PublicKey.default
  }
  const dummyProvider = new Provider(connection, dummyWallet, Provider.defaultOptions())
  setProvider(dummyProvider)

  const programId = new web3.PublicKey(STAKING_PROGRAM_ID)
  program = new Program(JSON.parse(JSON.stringify(config.idl)), programId)
  return dummyProvider
}

function calculatePendingReward(totalStaked: BN, state: any, memberStaked: BN, memberDebt: BN, time: number) {
  const { precisionFactor, lastRewardBlock, rewardPerBlock, accTokenPerShare, bonusEndBlock } = state

  if (totalStaked.eq(new BN('0'))) {
    return 0
  }

  const multiplier = Utils.getMultiplier(new BN(lastRewardBlock), new BN(time), bonusEndBlock) as BN
  const tokenReward = multiplier.mul(rewardPerBlock)
  const newAccTokenPerShare = accTokenPerShare.add(tokenReward.mul(precisionFactor).div(totalStaked))
  const pendingReward = memberStaked
    .mul(newAccTokenPerShare)
    .div(precisionFactor)
    .sub(memberDebt)

  return pendingReward.toNumber()
}

export default class StakingClient {
  public static async getBalance(connection: Connection, wallet: PublicKey) {
    const balance = await connection.getBalance(wallet)
    if (balance && balance > 0) return balance / LAMPORTS_PER_SOL
    return 0
  }

  public static async createMember(connection: Connection, wallet: Wallet, setUserRiant : any) {
    loadProgram(connection, wallet)

    const state = (await program.state()) as any
    const stateFunction = program.state as any
    const statePubKey = await stateFunction.address()
    const member = await program.account.member.associatedAddress(provider.wallet.publicKey)

    const [memberImprint, memberNonce] = await web3.PublicKey.findProgramAddress(
      [statePubKey.toBuffer(), member.toBuffer()],
      program.programId
    )

    const { tx, balances } = await Utils.createBalanceSandbox(provider, state, memberImprint)

    try {
      const createMemberTx = await program.rpc.createMember(memberNonce, {
        accounts: {
          stakingPool: statePubKey,
          member,
          authority: provider.wallet.publicKey,
          balances,
          memberImprint,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId
        },
        signers: tx.signers,
        instructions: [tx.tx]
      })
      setUserRiant(true)
      notify({
        message: 'Create User',
        description: 'Created user successful '
      })
    } catch (e) {
      setUserRiant(false)
      notify({
        message: 'Create User',
        description: 'Created user fail '
      })
      console.log('Create member Error: ', e)
    }
  }

  public static async checkMemberExist(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)
    try {
      const memberAssociatedAccount = await program.account.member.associated(wallet.publicKey)
      if (memberAssociatedAccount == null || typeof memberAssociatedAccount === 'undefined') {
        return false
      }
    } catch (e) {
      return false
    }
    return true
  }

  public static async deposit(connection: Connection, wallet: Wallet, amount: number) {
    loadProgram(connection, wallet)

    const owner = provider.wallet.publicKey
    const god = new web3.PublicKey(config.program.vault)
    const state = (await program.state()) as any
    const stateFunction = program.state as any
    const statePubKey = await stateFunction.address()

    const member = await program.account.member.associatedAddress(owner)
    const memberAccount = await program.account.member.associated(owner)
    const { balances } = memberAccount
    const [memberImprint, _nonce] = await web3.PublicKey.findProgramAddress([statePubKey.toBuffer(), member.toBuffer()], program.programId)
    const depositAmount = new BN(amount * LAMPORTS_PER_SOL)
    try {
      const tx = await program.rpc.deposit(depositAmount, {
        accounts: {
          stakingPool: statePubKey,
          poolMint: state.poolMint,
          imprint: state.imprint,
          rewardVault: state.rewardVault,
          member,
          authority: owner,
          balances,
          memberImprint,
          depositor: god,
          depositorAuthority: owner,
          tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
          clock: web3.SYSVAR_CLOCK_PUBKEY,
          rent: web3.SYSVAR_RENT_PUBKEY,
          systemProgram: web3.SystemProgram.programId
        }
      })
      console.log('tx: ', tx)
      notify({
        message: 'Deposit Amount',
        description: 'Deposit Amount successful '
      })
    } catch (e) {
      console.log('Stake Error: ', e)
      notify({
        message: 'Deposit Amount',
        description: 'Deposit Amount fail '
      })
    }
  }

  public static async withdraw(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)

    const tokenAccount = new web3.PublicKey(config.program.vault)
    const state = (await program.state()) as any
    const stateFunction = program.state as any
    const statePubKey = await stateFunction.address()

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

  public static async getStakingPoolInfo(connection: Connection, wallet?: Wallet) {
    let dynamicProvider: Provider
    if (wallet == null || typeof wallet === 'undefined') {
      dynamicProvider = loadProgramWithOutWallet(connection)
    } else {
      loadProgram(connection, wallet)
      dynamicProvider = provider
    }

    if (poolMintPubKey == null) {
      const state = (await program.state()) as any
      poolMintPubKey = state.poolMint
    }
    const poolMint = await dynamicProvider.connection.getTokenSupply(poolMintPubKey)
    const totalStaked = poolMint.value
    const stakingPool: StakingPoolInfo = {
      totalStaked: totalStaked.uiAmount,
      accumulateTokenRewardPerShare: 0,
      lastUpdateBlock: 0,
      rewardPerBlock: 0,
      precisionFactor: 0
    }
    return stakingPool
  }

  public static async pendingReward(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)

    const currentTimestamp = Math.floor(Date.now().valueOf() / 1000)
    const state = (await program.state()) as any
    const { precisionFactor, lastRewardBlock, rewardPerBlock, poolMint, accTokenPerShare, bonusEndBlock } = state
    const account = await program.account.member.associated(provider.wallet.publicKey)

    const tokenSupplyOfPoolMint = await provider.connection.getTokenSupply(poolMint)
    const memberTokenBalance = await provider.connection.getTokenAccountBalance(account.balances.vaultStake)
    const stakingToken = new BN(memberTokenBalance.value.amount)

    let totalStaking = new BN(tokenSupplyOfPoolMint.value.amount)
    if (totalStaking.eq(new BN('0'))) totalStaking = new BN(1)

    const multiplier = Utils.getMultiplier(new BN(lastRewardBlock), new BN(currentTimestamp), bonusEndBlock) as BN
    const tokenReward = multiplier.mul(rewardPerBlock)
    const newAccTokenPerShare = accTokenPerShare.add(tokenReward.mul(precisionFactor).div(totalStaking))
    const pendingReward = stakingToken
      .mul(newAccTokenPerShare)
      .div(precisionFactor)
      .sub(account.rewardDebt)

    return pendingReward.toString()
  }

  public static async getMemberRiantBalances(connection: Connection, wallet: Wallet) {
    loadProgram(connection, wallet)
    const currentBlock = Math.floor(Date.now().valueOf() / 1000)
    const state = (await program.state()) as any
    const memberAccount = await program.account.member.associated(provider.wallet.publicKey)
    const totalStaked = new BN((await provider.connection.getTokenSupply(state.poolMint)).value.amount)
    const memberStaked = new BN((await provider.connection.getTokenAccountBalance(memberAccount.balances.vaultStake)).value.amount)
    const pendingRewardAmount = calculatePendingReward(totalStaked, state, memberStaked, memberAccount.rewardDebt, currentBlock)
    return {
      stakedAmount: memberStaked.toNumber() / 1_000_000_000,
      pendingRewardAmount: pendingRewardAmount / 1_000_000_000
    }
  }
}
