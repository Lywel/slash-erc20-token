import React, { Component } from "react"
import {
  Button,
  Table,
  Card, CardTitle,
  Row, Col,
  FormGroup, Label, Input
} from 'reactstrap'

class Wallet extends Component {
  state = {
    balance: 0,
    txAmount: 0,
    txFrom: this.props.address,
    txTo: '0x0000000000000000000000000000000000000000',
  }

  componentDidMount = async () => {
    const { slh, address, web3 } = this.props
    const balance = web3.utils.fromWei(await slh.balanceOf(address), 'ether')
    this.setState({ balance })
  }

  submitTx = async () => {
    const { slh, address, web3 } = this.props
    const { txFrom, txTo, txAmount } = this.state
    const weiAmount = web3.utils.toWei(txAmount)

    await slh.transfer(txTo, weiAmount, { from: address })
  }

  handleFormChange = target => evt => {
    this.setState({ [target]: evt.target.value })
  }


  render() {
    const { lastStamp, balance, stampPrice } = this.state
    const { address } = this.props

    return (
      <Card body inverse style={{ backgroundColor: '#333', borderColor: '#333' }}>
        <Row className='mb-md-4'>
          <Col md="4">
            <CardTitle className='mb-md-5'>Account</CardTitle>
            <Table>
              <tbody>
                <tr>
                  <th>Balance</th>
                  <td>SLH { this.state.balance }</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md="8">
            <CardTitle className='mb-md-4'>Send tokens</CardTitle>
            <FormGroup>
              <Label for="txFrom">Origin address: <small>(Allowances are not implemented yet)</small></Label>
              <Input
                type="text"
                disabled readOnly
                value={ this.state.txFrom } />
            </FormGroup>
            <FormGroup>
              <Label for="txTo">Destination address:</Label>
              <Input
                type="text"
                value={ this.state.txTo }
                name='txTo'
                onChange={ this.handleFormChange('txTo') }/>
            </FormGroup>
            <Label for="txAmount">Amount: <small>(SLH)</small></Label>
            <br />
            <FormGroup inline check>
              <Input
                type='text'
                name='txAmount'
                value={ this.state.txAmount }
                onChange={ this.handleFormChange('txAmount') }/>
              <Button
                color='warning'
                className='ml-md-3'
                onClick={ this.submitTx }>Submit transaction</Button>
            </FormGroup>
          </Col>
        </Row>
        <small>Wallet ({ address })</small>
      </Card>
    )
  }
}

export default Wallet
