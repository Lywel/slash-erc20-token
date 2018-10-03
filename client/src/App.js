import React, { Component } from "react"
import {
  Alert,
  Container,
} from 'reactstrap'
import SlashCoin from "./contracts/SlashToken.json"
import getWeb3 from "./utils/getWeb3"
import truffleContract from "truffle-contract"

import "./App.css"

import Wallet from './Wallet.js'

class App extends Component {
  state = { web3: null, accounts: null, contract: null }

  componentDidMount = async () => {
    try {
      const web3 = await getWeb3()
      const accounts = await web3.eth.getAccounts()

      const Contract = truffleContract(SlashCoin)
      Contract.setProvider(web3.currentProvider)
      const instance = await Contract.deployed()

      this.setState({ web3, accounts, contract: instance }, this.getBalances)
    } catch (error) {
      this.setState({ error: error.toString() })
      console.error(error)
    }
  }

  render() {
    const error = (this.state.error
      ? (<Alert color="danger" hidden={ !this.state.error }>
            { this.state.error }
         </Alert>)
      : null)

    if (!this.state.accounts && !error) {
      return (
        <Container>
          <Alert color="info" style={{ marginTop: 15 }}>
            Connecting to the private network...
          </Alert>
          <img src="//alwahda-mall.com/images/loading.gif" alt='loading...'
             className="rounded mx-auto d-block" />
        </Container>
      )
    }

    return (
      <div className="App">
        <Container>
          <h1>Slash tokens <small>(SLH)</small></h1>
          { !!error && error }
          { !!this.state.accounts && <Wallet
            web3={ this.state.web3 }
            address={ this.state.accounts[0] }
            slh={ this.state.contract } />
          }
        </Container>
      </div>
    )
  }
}

export default App
