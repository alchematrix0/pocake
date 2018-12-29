import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

class Checkout extends Component {
  constructor(props){
    super(props)
    this.submit = this.submit.bind(this)
    this.state = {
      status: 'input'
    }
  }
  async submit(ev) {
    this.setState({status: 'pending'})
    let {token} = await this.props.stripe.createToken({name: "Name"})
    let response = await fetch("/charge", {
      method: "POST",
      headers: {"Content-Type": "text/plain"},
      body: token.id
    })
    if (response.ok) this.setState({status: "paid"})
  }

  render() {
    return (
      <div>
        <p>Checkout</p>
        {this.state.status !== 'paid' ? (<div className="checkout">
          <div className="checkoutParent">
            <CardElement style={{base: {}}} />
          </div>
          <button
            className="itemButton"
            onClick={this.submit}
            style={{minWidth: '100px'}}
          >
            {this.state.status === 'input' ? 'Pay Now' : 'Processing...'}
          </button>
        </div>) : (
          <h3>Success! Your order will be up shortly</h3>
          )}
      </div>
    )
  }
}
export default injectStripe(Checkout)
