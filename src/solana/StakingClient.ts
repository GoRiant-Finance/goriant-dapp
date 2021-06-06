/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { Wallet } from '@project-serum/anchor/src/provider'
import { Program, Provider, setProvider, web3 } from '@project-serum/anchor'
import BN from 'bn.js'
import { TokenInstructions } from '@project-serum/serum'
import { ASSOCIATED_TOKEN_PROGRAM_ID, Token } from '@solana/spl-token'
import config from './solana-config.json'
import Utils from './utils'

import { StakingPoolInfo } from '../models/stakingPool'
import { notify } from '../utils/notifications'

const STAKING_PROGRAM_ID = config.program['staking.programId']
const ICO_PROGRAM_ID = config.program['ico.programId']
const RIANT_TOKEN = config.program.token

let provider: Provider
let stakingProgram: Program
let icoProgram: Program
let poolMintPubKey: PublicKey
let owner: PublicKey

function loadPrograms(connection: Connection, wallet: Wallet) {
  provider = new Provider(connection, wallet, Provider.defaultOptions())
  setProvider(provider)

  owner = provider.wallet.publicKey

  const stakingProgramId = new web3.PublicKey(STAKING_PROGRAM_ID)
  stakingProgram = new Program(JSON.parse(JSON.stringify(config['staking-idl'])), stakingProgramId)

  const icoProgramId = new web3.PublicKey(ICO_PROGRAM_ID)
  icoProgram = new Program(JSON.parse(JSON.stringify(config['ico-idl'])), icoProgramId)
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
  stakingProgram = new Program(JSON.parse(JSON.stringify(config['staking-idl'])), programId)
  return dummyProvider
}

function calculatePendingReward(totalStaked: BN, state: any, memberStaked: BN, memberDebt: BN, time: number) {
  const { precisionFactor, lastRewardBlock, rewardPerBlock, accTokenPerShare, bonusEndBlock } = state

  if (totalStaked.eq(new BN('0'))) {
    return 0
  }

  const multiplier = new BN(Utils.getMultiplier(new BN(lastRewardBlock), new BN(time), bonusEndBlock))
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

  public static async buyRiant(connection: Connection, wallet: Wallet, setAirDropProcessing: any) {
    setAirDropProcessing(true)
    loadPrograms(connection, wallet)

    const { key, beneficiary, icoPool, imprint } = await icoProgram.state()
    const mint = new web3.PublicKey(RIANT_TOKEN)

    const associatedAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TokenInstructions.TOKEN_PROGRAM_ID,
      mint,
      owner
    )
    const account = await provider.connection.getAccountInfo(associatedAddress)

    const buyAccountContext = {
      accounts: {
        icoContract: key,
        icoImprint: imprint,
        icoPool,
        beneficiary,
        buyerSolWallet: owner,
        buyerAuthority: owner,
        buyerTokenWallet: associatedAddress,
        tokenProgram: TokenInstructions.TOKEN_PROGRAM_ID,
        systemProgram: web3.SystemProgram.programId
      }
    }
    let buyContext: {}
    if (account !== null) {
      buyContext = { ...buyAccountContext }
    } else {
      buyContext = {
        ...buyAccountContext,
        instructions: [
          Token.createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TokenInstructions.TOKEN_PROGRAM_ID,
            mint,
            associatedAddress,
            owner,
            owner
          )
        ]
      }
    }

    try {
      const tx = await icoProgram.rpc.buy(new BN(100 * LAMPORTS_PER_SOL), buyContext)
      setAirDropProcessing(false)
      notify({
        message: 'Airdrop',
        description: 'Airdrop successful '
      })
    } catch (e) {
      console.log('Purchase RIANT error due to: ', e)
      notify({
        message: 'Airdrop',
        description: 'Airdrop fail   '
      })
      setAirDropProcessing(false)
    }
  }

  public static async createMember(connection: Connection, wallet: Wallet, setUserRiant: any) {
    loadPrograms(connection, wallet)

    const state = (await stakingProgram.state()) as any
    const stateFunction = stakingProgram.state as any
    const statePubKey = await stateFunction.address()
    const member = await stakingProgram.account.member.associatedAddress(provider.wallet.publicKey)

    const [memberImprint, memberNonce] = await web3.PublicKey.findProgramAddress(
      [statePubKey.toBuffer(), member.toBuffer()],
      stakingProgram.programId
    )

    const { tx, balances } = await Utils.createBalanceSandbox(provider, state, memberImprint)

    const instructions: Array<unknown> = []
    instructions.push(tx.tx)

    const createMemberContext = {
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
      instructions
    }
    const associatedAddress = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TokenInstructions.TOKEN_PROGRAM_ID,
      new web3.PublicKey(RIANT_TOKEN),
      owner
    )
    const account = await provider.connection.getAccountInfo(associatedAddress)
    if (account === null) {
      createMemberContext.instructions.push(
        Token.createAssociatedTokenAccountInstruction(
          ASSOCIATED_TOKEN_PROGRAM_ID,
          TokenInstructions.TOKEN_PROGRAM_ID,
          new web3.PublicKey(RIANT_TOKEN),
          associatedAddress,
          owner,
          owner
        )
      )
    }

    try {
      const createMemberTx = await stakingProgram.rpc.createMember(memberNonce, createMemberContext)
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
    loadPrograms(connection, wallet)
    try {
      const memberAssociatedAccount = await stakingProgram.account.member.associated(wallet.publicKey)
      if (memberAssociatedAccount == null || typeof memberAssociatedAccount === 'undefined') {
        return false
      }
    } catch (e) {
      return false
    }
    return true
  }

  public static async deposit(connection: Connection, wallet: Wallet, amount: number, setRiantProcessing: any) {
    setRiantProcessing(true)

    loadPrograms(connection, wallet)

    const god = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TokenInstructions.TOKEN_PROGRAM_ID,
      new web3.PublicKey(RIANT_TOKEN),
      owner
    )

    const state = (await stakingProgram.state()) as any
    const stateFunction = stakingProgram.state as any
    const statePubKey = await stateFunction.address()

    const member = await stakingProgram.account.member.associatedAddress(owner)
    const memberAccount = await stakingProgram.account.member.associated(owner)
    const { balances } = memberAccount
    const [memberImprint, _nonce] = await web3.PublicKey.findProgramAddress(
      [statePubKey.toBuffer(), member.toBuffer()],
      stakingProgram.programId
    )
    const depositAmount = new BN(amount * LAMPORTS_PER_SOL)
    try {
      const tx = await stakingProgram.rpc.deposit(depositAmount, {
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
      setRiantProcessing(false)
      notify({
        message: 'Deposit Amount',
        description: 'Deposit Amount successful '
      })
    } catch (e) {
      console.log('Stake Error: ', e)
      notify({
        message: 'Deposit Amount',
        description: 'Deposit Amount fail  '
      })
      setRiantProcessing(false)
    }
  }

  public static async withdraw(connection: Connection, wallet: Wallet, amount: number, setRiantProcessing: any) {
    setRiantProcessing(true)
    loadPrograms(connection, wallet)

    const tokenAccount = await Token.getAssociatedTokenAddress(
      ASSOCIATED_TOKEN_PROGRAM_ID,
      TokenInstructions.TOKEN_PROGRAM_ID,
      new web3.PublicKey(RIANT_TOKEN),
      owner
    )
    const state = (await stakingProgram.state()) as any
    const stateFunction = stakingProgram.state as any
    const statePubKey = await stateFunction.address()

    const member = await stakingProgram.account.member.associatedAddress(provider.wallet.publicKey)
    const memberAccount = await stakingProgram.account.member.associated(provider.wallet.publicKey)
    const { balances } = memberAccount
    const [memberImprint, memberNonce] = await web3.PublicKey.findProgramAddress(
      [statePubKey.toBuffer(), member.toBuffer()],
      stakingProgram.programId
    )

    const withdrawAmount = new BN(amount * LAMPORTS_PER_SOL)
    try {
      const tx = await stakingProgram.rpc.withdraw(withdrawAmount, {
        accounts: {
          stakingPool: statePubKey,
          poolMint: state.poolMint,
          imprint: state.imprint,
          rewardVault: state.rewardVault,
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
      notify({
        message: 'Withdraw Amount',
        description: 'Withdraw Amount successful '
      })
      setRiantProcessing(false)
    } catch (e) {
      setRiantProcessing(false)
      notify({
        message: 'Withdraw Amount',
        description: 'Withdraw Amount fail '
      })
      console.log('Stake Error: ', e)
    }
  }

  public static async getStakingPoolInfo(connection: Connection, wallet?: Wallet) {
    let dynamicProvider: Provider
    if (wallet == null || typeof wallet === 'undefined') {
      dynamicProvider = loadProgramWithOutWallet(connection)
    } else {
      loadPrograms(connection, wallet)
      dynamicProvider = provider
    }

    const state = (await stakingProgram.state()) as any
    if (poolMintPubKey == null) {
      poolMintPubKey = state.poolMint
    }
    const poolMint = await dynamicProvider.connection.getTokenSupply(poolMintPubKey)
    const totalStaked = poolMint.value
    const totalReward = state.rewardPerBlock * (state.bonusEndBlock - state.startBlock)
    let apr
    if (totalStaked.uiAmount == null || totalStaked.uiAmount === 0) {
      apr = totalReward / 1
    } else {
      apr = totalReward / (totalStaked.uiAmount * state.precisionFactor)
    }
    const stakingPool: StakingPoolInfo = {
      totalStaked: totalStaked.uiAmount,
      apr: apr * 100
    }
    return stakingPool
  }

  public static async pendingReward(connection: Connection, wallet: Wallet) {
    loadPrograms(connection, wallet)

    const currentTimestamp = Math.floor(Date.now().valueOf() / 1000)
    const state = (await stakingProgram.state()) as any
    const { precisionFactor, lastRewardBlock, rewardPerBlock, poolMint, accTokenPerShare, bonusEndBlock } = state
    const account = await stakingProgram.account.member.associated(provider.wallet.publicKey)

    const tokenSupplyOfPoolMint = await provider.connection.getTokenSupply(poolMint)
    const memberTokenBalance = await provider.connection.getTokenAccountBalance(account.balances.vaultStake)
    const stakingToken = new BN(memberTokenBalance.value.amount)

    let totalStaking = new BN(tokenSupplyOfPoolMint.value.amount)
    if (totalStaking.eq(new BN('0'))) totalStaking = new BN(1)

    const multiplier = new BN(Utils.getMultiplier(new BN(lastRewardBlock), new BN(currentTimestamp), bonusEndBlock))
    const tokenReward = multiplier.mul(rewardPerBlock)
    const newAccTokenPerShare = accTokenPerShare.add(tokenReward.mul(precisionFactor).div(totalStaking))
    const pendingReward = stakingToken
      .mul(newAccTokenPerShare)
      .div(precisionFactor)
      .sub(account.rewardDebt)

    return pendingReward.toString()
  }

  public static async getMemberRiantBalances(connection: Connection, wallet: Wallet) {
    loadPrograms(connection, wallet)
    const currentBlock = Math.floor(Date.now().valueOf() / 1000)
    const state = (await stakingProgram.state()) as any
    const memberAccount = await stakingProgram.account.member.associated(provider.wallet.publicKey)
    const totalStaked = new BN((await provider.connection.getTokenSupply(state.poolMint)).value.amount)
    const memberStaked = new BN((await provider.connection.getTokenAccountBalance(memberAccount.balances.vaultStake)).value.amount)
    const pendingRewardAmount = calculatePendingReward(totalStaked, state, memberStaked, memberAccount.rewardDebt, currentBlock)

    const riantWallet = await Utils.getOrCreateAssociatedAccountInfo(provider, new web3.PublicKey(RIANT_TOKEN), owner)
    let riantBalance = new BN(0)
    if (riantWallet) riantBalance = new BN((await provider.connection.getTokenAccountBalance(riantWallet)).value.amount)

    return {
      riantBalance: riantBalance.toNumber() / LAMPORTS_PER_SOL,
      stakedAmount: memberStaked.toNumber() / LAMPORTS_PER_SOL,
      pendingRewardAmount: pendingRewardAmount / LAMPORTS_PER_SOL
    }
  }
}
