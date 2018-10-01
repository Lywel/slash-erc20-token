import React, { Component } from "react"
import {
  Button,
  Card, CardTitle, CardBody,
  Row, Col, Container,
  Alert,
  FormGroup, Label, Input } from 'reactstrap'
import SlashCoin from "./contracts/SlashToken.json"
import getWeb3 from "./utils/getWeb3"
import truffleContract from "truffle-contract"

import "./App.css"

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

    const page = ((this.state.balances && this.state.accounts)
      ? (
      <div>
        <Row>
          <Col md="3">
            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
              <CardTitle>Your wallet</CardTitle>
              <CardBody>
                <FormGroup>
                  <Label for="transferAmount">Balance:</Label>
                  <Input type="text" disabled value={ this.state.balances[0] } />
                </FormGroup>
              </CardBody>
            </Card>
          </Col>
          <Col md="4">
            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
              <CardTitle>Mint</CardTitle>
              <CardBody>
                <FormGroup>
                  <Label for="mintAmount">Amount:</Label>
                  <Input type="number" name="mintAmount"
                    value={this.state.mintAmount}
                    onChange={this.handleMintAmountChange} />
                </FormGroup>
                <Button color="success" onClick={this.mintAmount}>Mint</Button>
              </CardBody>
            </Card>
          </Col>
          <Col md="5">
            <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
              <CardTitle>Transfer</CardTitle>
              <CardBody>
                <FormGroup>
                  <Label for="transferTo">Destination:</Label>
                  <Input type="text" name="transferTo"
                    placeholder="0x0000..."
                    value={this.state.transferAddress}
                    onChange={this.handleTransferAddressChange} />
                </FormGroup>
                <FormGroup>
                  <Label for="transferAmount">Amount:</Label>
                  <Input type="number" name="transferAmount"
                    value={this.state.transferAmount}
                    onChange={this.handleTransferAmountChange} />
                </FormGroup>
                <Button color="success" onClick={this.sendAmount}>Send</Button>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <small className="text-muted">Account:  { this.state.accounts[0] }</small>
      </div>
      )
      : null)

    if ((!this.state.balances || !this.state.accounts) && !error) {
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
          <h1>Slash tokens <small>(SLHTK)</small></h1>
          { !!error && error }
          { !!page && page }
        </Container>
      </div>
    )
  }
}

export default App
