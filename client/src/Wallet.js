import React, { Component } from "react"
import {
  Button,
  Table,
  Card, CardTitle,
  Row, Col,
  FormGroup, Label, Input
} from 'reactstrap'

Date.daysBetween = (date1, date2) => {
  const one_day = 1000 * 60 * 60 * 24

  const date1_ms = date1.getTime()
  const date2_ms = date2.getTime()

  const difference_ms = date2_ms - date1_ms
  return Math.round(difference_ms / one_day)
}

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
    const { slh, address, web3 } = this.props
    const lastStamp = (await slh.getLastStamp()).toNumber() * 1000
    const balance = web3.utils.fromWei(await slh.balanceOf(address), 'ether')
    this.setState({ balance, lastStamp })
  }

  stamp = async () => {
    const { slh, address } = this.props
    this.setState({ stampStatus: 'pending' })
    try {
      console.log(address)
      const stampStatus = await slh.stamp({ from: address })
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
    const { lastStamp, balance } = this.state
    const { address } = this.props

    const lastStampDate = new Date(lastStamp)
    const nextStampDate = new Date(lastStampDate)
      nextStampDate.setDate(nextStampDate.getDate() + 30)

    const nextStampInter = Date.daysBetween(new Date(), nextStampDate)

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
                    lastStamp
                      ? lastStampDate.toLocaleString('en-GB', { timeZone: 'UTC' })
                      : 'Never' }
                  </td>
                </tr>
                <tr>
                  <th>Next stamp</th>
                  <td>{
                    lastStamp
                      ? `in ${nextStampInter} day${Math.abs(nextStampInter > 1) ? 's' : ''}`
                      : 'free initial stamp'
                    }
                  </td>
                </tr>
                <tr>
                  <th>Stamp <small>({ Math.round(balance * 0.01) }SLH)</small></th>
                  <td>
                    <Button
                      color='info'
                      onClick={ this.stamp }
                      disabled={ nextStampInter > 0 } >
                    { nextStampInter > 0
                      ? 'Stamp up to date'
                      : 'Get a stamp'
                    }
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
        <small>Wallet ({ address })</small>
      </Card>
    )
  }
}

export default Wallet
