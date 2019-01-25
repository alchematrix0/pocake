import React, { Component } from "react"
import { CardElement, injectStripe } from "react-stripe-elements"
class Checkout extends Component {
  constructor(props){
    super(props)
    this.submit = this.submit.bind(this)
    this.postOrderToServer = props.postOrderToServer.bind(this)
    this.state = {
      status: "input",
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
      // .then(serverResponse => {
      //   if (serverResponse.status === "succeeded") {
      //     this.setState({status: "paid"})
      //     // At this point, we have created the charge and will request push for when the order is called out
      //     pushMethods.requestPushPermissionAndSubscribe(serverResponse.orderId)
      //     // triggerOrderReady = Artificial implementation of order being called after 5 seconds for demo purposes
      //     pushMethods.triggerOrderReady(serverResponse.orderId)
      //   } else this.setState({status: "failed", errorMessage: "The charge was not succesful."})
      // })
    }
  }
  render() {
    return (
      // <div>
      //   <p>Checkout</p>
      //   {this.state.status !== "paid" ? (
          <div className="checkout">
            <div className="checkoutParent">
              <CardElement style={{base: {}}} onReady={(el) => this.props.cardReady(el)} />
            </div>
            <button
              className="itemButton"
              onClick={this.submit}
              style={{minWidth: "100px"}}
            >
              {this.props.status === "pending" ? "Processing..." : "Pay Now"}
            </button>
            {this.state.status === "failed" && (<p>{this.state.errorMessage}</p>)}
          </div>
        )
        //  : (
        //   <h3>Success! Your order will be up shortly</h3>
        // )}
        // {this.state.status === "failed" && (
        //   <>
        //     <h4>Order failed.</h4>
        //     <h6>Message: {this.state.errorMessage}</h6>
        //   </>
        // )}
        // {process.env.REACT_APP_DEMO && (
        //   <small style={{top: '5em', fontSize: '60%', position: 'relative'}}>
        //     This app is in demo mode.<br />
        //     You can use 4242424242424242 with any date and cvc to simulate a payment.
        //   </small>
        // )}
  }
}
export default injectStripe(Checkout)
