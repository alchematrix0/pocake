import React, { Component } from "react"
import { PaymentRequestButtonElement, injectStripe } from "react-stripe-elements"
import Checkout from "./checkout.js"

class PaymentForm extends Component {
  constructor(props) {
    super(props);

    // For full documentation of the available paymentRequest options, see:
    // https://stripe.com/docs/stripe.js#the-payment-request-object
    const paymentRequest = props.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: 'Demo total',
        amount: 1000,
      },
    });

    paymentRequest.on('token', ({complete, token, ...data}) => {
      console.log('Received Stripe token: ', token);
      console.log('Received customer information: ', data);
      complete('success');
    });

    paymentRequest.canMakePayment().then((result) => {
      this.setState({canMakePayment: !!result});
    });

    this.state = {
      canMakePayment: false,
      paymentRequest,
    };
  }

  render() {
    return (this.state.canMakePayment) ? (
      <PaymentRequestButtonElement
        paymentRequest={this.state.paymentRequest}
        className="PaymentRequestButton"
        style={{
          // For more details on how to style the Payment Request Button, see:
          // https://stripe.com/docs/elements/payment-request-button#styling-the-element
          paymentRequestButton: {
            theme: 'light',
            height: '64px',
          },
        }}
      />
    ) : (
      <Checkout
        customerName={this.props.customerName}
        order={this.props.order.length > 0 ? this.props.order : [this.props.currentItem]}
        total={this.props.total}
        stripe={this.props.stripe}
        cardReady={this.props.cardReady}
      />
    )
  }
}
export default injectStripe(PaymentForm);
