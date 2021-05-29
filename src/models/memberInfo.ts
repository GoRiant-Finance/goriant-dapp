import { TokenAmount, PublicKey } from "@solana/web3.js";

export interface MemberInfo {
  stakeAmount: TokenAmount
  rewardDebt: number
  metaData: PublicKey
}
