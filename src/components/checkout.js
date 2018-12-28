import React, { Component } from 'react'

export default class Checkout extends Component {
  constructor(props){
    super(props)
  }
  componentDidMount () {
    const paymentRequest = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
      requestPayerName: true,
      requestPayerEmail: true,
    });
  }
  render() {
    console.dir(this.props)
    return (
      <div>
       <p>Checkout section</p>
       <div id="payment-request-button"></div>
      </div>
    )
  }
}
