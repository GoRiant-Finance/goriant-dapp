import React from 'react'
import styled from '../../utils/styled'
import {shortenAddress} from "../../utils/utils";
import StakingClient from "../../solana/StakingClient";


const OptionButton = styled('div')`
  display: inline-block;
  width: 20px;
  height: 20px;
  margin-left: 30px;
  cursor: pointer;
`
const IconMenu: React.FC = () => (
  <svg height="15px" width="15px" id="Layer_1" version="1.1" viewBox="0 0 32 32">
    <path stroke="white" fill="white"
          d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/>
  </svg>
)

export class CurrentUserBadge extends React.Component<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {
      connection: props.connection,
      wallet: props.wallet
    }
  }

  async componentDidMount() {
    const {connection, wallet} = this.state
    if (wallet && wallet.publicKey) {
      const balance = await StakingClient.getBalance(connection, wallet.publicKey)
      this.setState({balance})
    }
  }

  render() {
    if (!this.state.wallet?.publicKey) {
      return null
    }
    console.log("Current wallet balance : ", this.state.balance)
    return (
      <span style={{fontSize: 19}}>
        {shortenAddress(`${this.state.wallet.publicKey}`)} Balance: {this.state.balance} SOL
        <OptionButton>
          <IconMenu/>
        </OptionButton>
      </span>
    );
  }
};
