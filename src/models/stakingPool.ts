import { TokenAmount } from '@solana/web3.js'

export interface StakingPoolInfo {
  totalStaked: TokenAmount
  accumulateTokenRewardPerShare: number
  lastUpdateBlock: number
  rewardPerBlock: number
  precisionFactor: number
}
