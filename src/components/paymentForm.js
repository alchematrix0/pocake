import React, { Component } from "react"
import { PaymentRequestButtonElement, injectStripe } from "react-stripe-elements"
import Checkout from "./checkout.js"
import pushMethods from "../utils/push.js"

class PaymentForm extends Component {
  constructor(props) {
    super(props)
    // For full documentation of the available paymentRequest options, see:
    // https://stripe.com/docs/stripe.js#the-payment-request-object
    const paymentRequest = props.stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: {
        label: `Order for ${props.customerName}`,
        amount: Number(props.order.total || 0),
      },
    })

    paymentRequest.on('token', ({complete, token, ...data}) => {
      console.log('Received Stripe token: ', token)
      console.log('Received customer information: ', data)
      postOrderToServer(token.id)
      complete('success')
    })

    paymentRequest.canMakePayment().then((result) => this.setState({canMakePayment: !!result}))

    const postOrderToServer = async (tokenId) => {
      this.setState({status: "pending"})
      try {
        let postOrder = await fetch("/charge", {
          method: "POST",
          headers: {"Accept": "application/json", "Content-Type": "application/json"},
          body: JSON.stringify({
            "id": tokenId,
            "customerName": this.props.customerName,
            "total": this.props.total || 5,
            "order": this.props.order
          })
        })
        let serverResponse = await postOrder.json()
        console.dir(serverResponse)
        if (serverResponse.status === "succeeded") {
          this.setState({status: "paid"})
          // At this point, we have created the charge and will request push for when the order is called out
          pushMethods.requestPushPermissionAndSubscribe(serverResponse.orderId)
          // triggerOrderReady = Artificial implementation of order being called after 5 seconds for demo purposes
          pushMethods.triggerOrderReady(serverResponse.orderId)
        } else this.setState({status: "failed", errorMessage: "The charge was not succesful."})
      } catch (err) {
        console.error(err)
        this.setState({status: "failed", errorMessage: "The charge was not succesful. Sorry pal."})
      }
    }

    this.postOrderToServer = postOrderToServer.bind(this)

    this.state = {
      canMakePayment: false,
      paymentRequest,
      status: "input",
      errorMessage: ""
    }
  }
  render() {
    let activePaymentForm = this.state.canMakePayment ? (
      <PaymentRequestButtonElement
        paymentRequest={this.state.paymentRequest}
        className="PaymentRequestButton"
        style={{
          // For more details on how to style the Payment Request Button, see:
          // https://stripe.com/docs/elements/payment-request-button#styling-the-element
          paymentRequestButton: {
            theme: 'light',
            height: '64px',
          }
        }}
      />
    ) : (
      <Checkout
        customerName={this.props.customerName}
        order={this.props.order.length > 0 ? this.props.order : [this.props.currentItem]}
        total={this.props.total}
        stripe={this.props.stripe}
        cardReady={this.props.cardReady}
        postOrderToServer={this.postOrderToServer}
        status={this.state.status}
      />
    )
    return (
      <div>
        {this.state.status !== "paid" && (<p>Checkout</p>)}
        {this.state.status === "paid" ? (<h3>Success! Your order will be up shortly</h3>) : activePaymentForm}
        {this.state.status === "failed" && (
          <>
            <h4>Order failed.</h4>
            <h6>Message: {this.state.errorMessage}</h6>
          </>
        )}
        {process.env.REACT_APP_DEMO === "on" && (
          <small style={{top: '5em', fontSize: '60%', position: 'relative'}}>
            This app is in demo mode.<br />
            You can use 4242424242424242 with any date and cvc to simulate a payment.
          </small>
        )}
      </div>
    )
  }
}
export default injectStripe(PaymentForm)
