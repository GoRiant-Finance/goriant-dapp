import {Connection, LAMPORTS_PER_SOL, PublicKey} from '@solana/web3.js'
import config from './staking-config.json'

const STAKING_PROGRAM_ID = config.config['staking.programId']

export default class StakingClient {
  public static async getBalance(connection: Connection, wallet: PublicKey) {
    const balance = await connection.getBalance(wallet)
    if (balance && balance > 0)
      return balance / LAMPORTS_PER_SOL
    return 0
  }
}
