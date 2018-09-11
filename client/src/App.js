import React, { Component } from "react";
import { Button, Card, CardTitle, CardText, Row, Col, Container } from 'reactstrap';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./utils/getWeb3";
import truffleContract from "truffle-contract";

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const Contract = truffleContract(SimpleStorageContract);
      Contract.setProvider(web3.currentProvider);
      const instance = await Contract.deployed();

      this.setState({ web3, accounts, contract: instance }, this.getBalances);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.log(error);
    }
  };

  getBalances = async () => {
    const { accounts, contract } = this.state;
    //await contract.set(5, { from: accounts[0] });
    //const response = await contract.get();
    //this.setState({ storageValue: response.toNumber() });

    const balances = await Promise.all(accounts.map(this.computeBalance))
    this.setState({ balances: balances })
  };

  computeBalance = async (address) => {
    const { web3 } = this.state;
    const weiBalance = await web3.eth.getBalance(address)
    return web3.utils.fromWei(`${weiBalance}`, 'ether');
  }

  render() {
    if (!this.state.balances) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <Container>
          <h1>Slash coins</h1>
          <Row>
            <Col lg="3">
              <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
                <CardTitle>Your wallet</CardTitle>
                <CardText>
                  <small>Balance: {this.state.balances[0]}</small>
                </CardText>
                <CardText>
                  <small className="text-muted">{this.state.accounts[0]}</small>
                </CardText>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default App;
