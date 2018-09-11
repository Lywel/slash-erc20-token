import React, { Component } from "react";
import {
  Button,
  Card, CardTitle, CardBody,
  Row, Col, Container,
  Alert,
  FormGroup, Label, Input } from 'reactstrap';
import SlashCoin from "./contracts/SlashCoin.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { web3: null, accounts: null, contract: null,
    mintAmount: 0
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3()
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts()
      // Get the contract instance.
      const Contract = truffleContract(SlashCoin)
      Contract.setProvider(web3.currentProvider)
      const instance = await Contract.deployed()

      this.setState({ web3, accounts, contract: instance }, this.getBalances);
    } catch (error) {
      this.setState({ error:
        `Failed to load web3, accounts, or contract. Check console for details.`
      })
      console.error(error)
    }
  }

  getBalances = async () => {
    const { accounts, contract } = this.state;
    //await contract.set(5, { from: accounts[0] });
    //const response = await contract.get();
    //this.setState({ storageValue: response.toNumber() });

    const balances = await Promise.all(accounts.map(this.computeBalance))
    this.setState({ balances: balances })
  }

  computeBalance = async (address) => {
    const { web3, contract } = this.state;
    //const weiBalance = await web3.eth.getBalance(address)
    //return web3.utils.fromWei(`${weiBalance}`, 'ether');
    return await contract.balances(address)
  }

  mintAmount = async () => {
    const { web3, contract, accounts } = this.state
    await contract.mint(accounts[0], this.state.mintAmount, { from: accounts[0] });
    //const response = await contract.get();
    //this.setState({ storageValue: response.toNumber() });
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
    if (!this.state.balances || !this.state.accounts) {
      return (
        <img src="//alwahda-mall.com/images/loading.gif"
             className="rounded mx-auto d-block" />
      );
    }

    return (
      <div className="App">
        <Container>
          <h1>Slash coins</h1>
          <Alert color="danger" hidden={ !this.state.error }>
            { this.state.error }
          </Alert>
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
                    <Input type="text" name="transferTo" id="transferTo" placeholder="0x0000..." />
                  </FormGroup>
                  <FormGroup>
                    <Label for="transferAmount">Amount:</Label>
                    <Input type="number" name="transferAmount" id="transferAmount" placeholder="0" />
                  </FormGroup>
                  <Button color="success">Send</Button>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <small className="text-muted">Account:  { this.state.accounts[0] }</small>
        </Container>
      </div>
    );
  }
}

export default App;
