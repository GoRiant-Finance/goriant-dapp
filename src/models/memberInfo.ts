import { TokenAmount, PublicKey } from "@solana/web3.js";

export interface MemberInfo {
  stakeAmount: any
  rewardDebt: number
  metaData: PublicKey
}
