import React, { Component } from "react"
import { CardElement, injectStripe } from "react-stripe-elements"
import { requestPushPermission, subscribeToPush } from "../utils/push.js"
class Checkout extends Component {
  constructor(props){
    super(props)
    this.submit = this.submit.bind(this)
    this.state = {
      status: "input",
      errorMessage: ""
    }
  }
  async submit(ev) {
    this.setState({status: "pending"})
    let genToken = await this.props.stripe.createToken({name: this.props.customerName})
    console.log('code after gen Token: ' + typeof genToken)
    console.dir(genToken)
    if (genToken.error) {
      this.setState({status: "failed", errorMessage: genToken.error.message})
      return false
    }
    let response = await fetch("/charge", {
      method: "POST",
      headers: {"Accept": "application/json", "Content-Type": "application/json"},
      body: JSON.stringify({
        "id": genToken.token.id,
        "customerName": this.props.customerName,
        "total": this.props.total || 5,
        "order": this.props.order
      })
    })
    let parsed = await response.json()
    if (parsed.status === "succeeded") {
      this.setState({status: "paid"})
      console.log('charge succeeded, request push access checkout:35')
      this.requestPushPermissionAndSubscribe(parsed.orderId)
      navigator.serviceWorker.controller.postMessage({name: this.props.customerName, order: this.props.order})
    } else this.setState({status: "failed", errorMessage: "The charge was not succesful."})
  }
  requestPushPermissionAndSubscribe(orderId) {
    console.log('request push from checkout')
    return requestPushPermission()
    .then(permissionResult => {
      if (permissionResult === 'granted') {
        console.log('permission granted, subscribing order id: ' + orderId)
        return subscribeToPush(orderId).then(done => {
          console.log('returned from subscribe call:')
          console.dir(done)
        })
      }
    })
  }
  render() {
    return (
      <div>
        <p>Checkout</p>
        {this.state.status !== "paid" ? (
          <div className="checkout">
            <div className="checkoutParent">
              <CardElement style={{base: {}}} onReady={(el) => this.props.cardReady(el)} />
            </div>
            <button
              className="itemButton"
              onClick={this.submit}
              style={{minWidth: "100px"}}
            >
              {this.state.status === "pending" ? "Processing..." : "Pay Now"}
            </button>
          </div>) : (
          <h3>Success! Your order will be up shortly</h3>
        )}
        {this.state.status === "failed" && (
          <>
            <h4>Order failed.</h4>
            <h6>Message: {this.state.errorMessage}</h6>
          </>
        )}
        {process.env.REACT_APP_DEMO && (
          <small style={{top: '5em', fontSize: '60%', position: 'relative'}}>
            This app is in demo mode.<br />
            You can use 4242424242424242 with any date and cvc to simulate a payment.
          </small>
        )}
      </div>
    )
  }
}
export default injectStripe(Checkout)
