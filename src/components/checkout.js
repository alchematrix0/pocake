import React, { Component } from "react"
import { CardElement, injectStripe } from "react-stripe-elements"

class Checkout extends Component {
  constructor(props){
    super(props)
    this.submit = this.submit.bind(this)
    this.state = {
      status: "input"
    }
  }
  async submit(ev) {
    this.setState({status: "pending"})
    let genToken = await this.props.stripe.createToken({name: this.props.customerName})
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
    console.dir(parsed)
    if (parsed.status === "succeeded") this.setState({status: "paid"})
    else this.setState({status: "failed"})
  }

  render() {
    return (
      <div>
        <p>Checkout</p>
        {this.state.status !== "paid" ? (<div className="checkout">
          <div className="checkoutParent">
            <CardElement style={{base: {}}} />
          </div>
          <button
            className="itemButton"
            onClick={this.submit}
            style={{minWidth: "100px"}}
          >
            {this.state.status === "input" ? "Pay Now" : "Processing..."}
          </button>
        </div>) : (
          <h3>Success! Your order will be up shortly</h3>
        )}
        {this.state.status === "failed" && (<h3>Order failed... give it another go</h3>)}
      </div>
    )
  }
}
export default injectStripe(Checkout)
