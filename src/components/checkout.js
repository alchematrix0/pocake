import React, { Component } from "react"
import { CardElement, injectStripe } from "react-stripe-elements"
class Checkout extends Component {
  constructor(props){
    super(props)
    this.submit = this.submit.bind(this)
    this.postOrderToServer = props.postOrderToServer.bind(this)
    this.state = {
      status: props.status,
      errorMessage: ""
    }
  }
  async submit (ev) {
    this.setState({status: "pending"})
    let genToken = await this.props.stripe.createToken({name: this.props.customerName})
    if (genToken.error) {
      this.setState({status: "failed", errorMessage: genToken.error.message})
      return false
    } else {
      this.postOrderToServer(genToken.token.id)
    }
  }
  render() {
    return (
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
      </div>
    )
  }
}
export default injectStripe(Checkout)
