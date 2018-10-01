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
      console.log('Current account address:', accounts[0])

      const Contract = truffleContract(SlashCoin)
      Contract.setProvider(web3.currentProvider)
      const instance = await Contract.deployed()

      this.setState({ web3, accounts, contract: instance }, this.getBalances)
    } catch (error) {
      this.setState({ error: error.toString() })
      console.error(error)
    }
  }

  getBalances = async () => {
    const { accounts } = this.state
    //await contract.set(5, { from: accounts[0] })
    //const response = await contract.get()
    //this.setState({ storageValue: response.toNumber() })

    const balances = await Promise.all(accounts.map(this.computeBalance))
    this.setState({ balances: balances })
  }

  computeBalance = async (address) => {
    const { web3 } = this.state
    const weiBalance = await web3.eth.getBalance(address)
    return web3.utils.fromWei(`${weiBalance}`, 'ether')
  }

  mintAmount = async () => {
    const { contract, accounts } = this.state
    await contract.mint(accounts[0], this.state.mintAmount, { from: accounts[0] })
    //const response = await contract.get()
    //this.setState({ storageValue: response.toNumber() })
  }

  sendAmount = async () => {
    const { web3, contract, accounts } = this.state
    console.log('before', this.state.transferAmount)
    await contract.send(this.state.transferAddress, {
        from: accounts[0],
        value: web3.utils.toWei(`${this.state.transferAmount}`, 'ether')
      })
    console.log('after')
  }

  handleMintAmountChange = (e) => {
    this.setState({ mintAmount: e.target.value })
  }
  handleTransferAmountChange = (e) => {
    this.setState({ transferAmount: e.target.value })
  }
  handleTransferAddressChange = (e) => {
    this.setState({ transferAddress: e.target.value })
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
          { !!this.state.accounts[0] && <Wallet
            address={ this.state.accounts[0] }
            slh={ this.state.contract } />
          }
        </Container>
      </div>
    )
  }
}

export default App
