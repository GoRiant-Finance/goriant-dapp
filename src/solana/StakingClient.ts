import {Connection, PublicKey} from '@solana/web3.js'
import config from './staking-config.json'

const STAKING_PROGRAM_ID = config.config['staking.programId']

export default class StakingClient {
  public async balance(connection: Connection, wallet: PublicKey) {
    const balance = await connection.getBalance(wallet)
    console.log('Balance: ', balance)
    return balance
    return 0
  }
}
