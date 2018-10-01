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
    lastStamp: null,
    stampStatus: null
  }

  componentDidMount = async () => {
    const { slh, account } = this.props
    const lastStamp = await slh.getLastStamp()
    const balance = (await slh.balanceOf(account)).toNumber()
    this.setState({ balance, lastStamp })
  }

  stamp = async () => {
    const { slh, account } = this.props
    this.setState({ stampStatus: 'pending' })
    try {
      const stampStatus = await slh.stamp()
      this.setState({ stampStatus: stampStatus })
    } catch (err) {
      console.log(err)
    }
  }

  sendAmount = async () => {
  }

  handleFormChange = target => evt => {
    this.setState({ [target]: evt.target.value })
  }


  render() {
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
                <tr>
                  <th>Last stamp</th>
                  <td>{
                    this.state.lastStamp
                      ? (new Date(this.state.lastStamp)).toLocaleString('en-GB',
                        { timeZone: 'UTC' })
                      : 'NEVER' }
                  </td>
                </tr>
                <tr>
                  <th>Get a stamp</th>
                  <td>
                    <Button color='info' onClick={ this.stamp }>
                      Get a stamp
                    </Button></td>
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
              <Button color='warning' className='ml-md-3'>Submit transaction</Button>
            </FormGroup>
          </Col>
        </Row>
        <small>Wallet ({ this.props.address })</small>
      </Card>
    )
  }
}

export default Wallet
