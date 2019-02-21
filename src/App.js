import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements"
import logo from "./saltStrawLogo.png";
import "./App.css";
import "./Bulma.css";
import OK from "./components/OK.js"
import Order from "./components/order.js"
import FlavorOption from "./components/flavorOption.js"
import VesselOption from "./components/vesselOption.js"
import PaymentForm from "./components/paymentForm.js"
import { vessels, menu, blankItem } from "./menu.js"
const humanNames = { icecream: "ice cream", sundae: "sundae", milkshake: "milk shake" }

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stripe: null,
      customerName: "Friend",
      order: [],
      currentItem: blankItem,
      total: 0,
      base: 0,
      stripeCardElement: 0,
      isCheckout: false
    }
  }
  setCustomerName = (e) => this.setState({customerName: e.target.value})
  calculateCost = (scrollto) => {
    let currentItem = this.state.currentItem
    let cost = 0
    if (currentItem.type === "icecream") {
      cost = currentItem.scoops === 2 ? 7 : currentItem.scoops === 3 ? 9 : 5
      cost += currentItem.vessel === "waffle" ? 0.5 : 0
    } else {
      cost = currentItem.type === "sundae" ? 6 : 10
    }
    this.setState({
      total: this.state.order.length ? this.state.order
        .map(o => Number(o.cost))
        .reduce((a, b) => a + b) + cost
      : cost,
      currentItem: {
        ...this.state.currentItem,
        cost
      }
    }, () => scrollto ? this.scroll(false, scrollto, 600, scrollto === "flavor-target", scrollto) : false)
  }
  chooseType = (e) => this.setState({currentItem: Object.assign({}, this.state.currentItem, {type: e.target.dataset.name})}, () => this.calculateCost("flavor-target"))
  assignFlavor = (e) => {
    this.setState({currentItem: Object.assign({}, this.state.currentItem, {flavor: e.target.dataset.flavor})}, () => this.calculateCost(this.state.currentItem.type === "icecream" ? "vessel" : "addItem"))
  }
  assignVessel = (e) => {
    this.setState({currentItem: Object.assign({}, this.state.currentItem, {vessel: e.target.dataset.vessel})}, () => this.calculateCost("scoops"))
  }
  assignScoops = (e) => {
    this.setState({currentItem: Object.assign({}, this.state.currentItem, {scoops: Number(e.target.dataset.scoops)})}, () => this.calculateCost("addItem"))
  }
  addItemToOrder = (e) => {
    let order = this.state.order
    order.push(this.state.currentItem)
    this.setState({order, currentItem: blankItem}, () => this.scroll(false, "type", 0))
  }
  scroll = (e, t, delay = 600, toTop = false, targetName) => {
    let target = document.getElementById(e.target ? e.target.dataset.scrollto : t)
    setTimeout(() => {
      target.scrollIntoView({behavior: "smooth", block: toTop ? "start" : "center"})
      if (target.id === "welcome") { setTimeout(function () { document.getElementById("customerName").focus() }, delay) }
      if (target.id === "checkout" && this.state.isCheckout) { setTimeout(() => { this.state.stripeCardElement.focus() }, delay) }
    }, delay)
  }
  checkout = () => {
    let order = this.state.order
    order.push(this.state.currentItem)
    this.setState({order, currentItem: blankItem}, () => this.scroll(false, "checkout"))
  }
  cardReady = (el) => this.setState({stripeCardElement: el, isCheckout: true})
  checkIfEnter = (e) => e.key === "Enter" ? this.scroll(false, e.target.dataset.next) : false;
  componentDidMount () {
    if (window.Stripe) { this.setState({stripe: window.Stripe(process.env.REACT_APP_STRIPE_PUB_KEY)})
    } else {
      document.querySelector("#stripe-js").addEventListener("load", () => {
        this.setState({stripe: window.Stripe(process.env.REACT_APP_STRIPE_PUB_KEY)})
      })
    }
  }
  render() {
    let scoopsQuantity = Number(this.state.currentItem.scoops)
    return (
      <div className="App">
        <section className="question hero">
          <img src={logo} className="logo" alt="logo" />
          <p className="spaced">We're so glad you're here</p>
          <OK
            text="Ice Cream!"
            target="welcome"
            scroll={this.scroll}
            hideEnter={true}
            style={{maxWidth: "100%", fontSize: "2rem"}}
          />
        </section>
        {/* WELCOME */}
        <section id="welcome" className="question">
          <p className="spaced">
            Let's start with your name
          </p>
          <input id="customerName" className="customerName" name="customerName" data-next="type" onKeyUp={this.checkIfEnter} onChange={this.setCustomerName} />
          <br />
          <OK
            show={this.state.customerName !== "Friend" && this.state.customerName.length > 0}
            target="type"
            scroll={this.scroll}
          />
        </section>

        {/* TYPE */}
        <section className="question" id="type">
          {this.state.order.length > 0 ? (
            <div>
              <p>Your order so far:</p>
              <Order order={this.state.order} cost={this.state.total}/>
              <p>What can we add to your order?</p>
            </div>
          ) : (
            <p>
              Hi {this.state.customerName} 👋
              <br />
              What can we get for you today?
            </p>
          )}
          <p className="itemGroup">
            <button onClick={this.chooseType} data-next="flavor-target" data-name="icecream" className={`itemButton ${this.state.currentItem.type === "icecream" && "selected"}`}>Ice Cream!</button>
            <button onClick={this.chooseType} data-next="flavor-target" data-name="sundae" className={`itemButton ${this.state.currentItem.type === "sundae" && "selected"}`}>A Sundae</button>
            <button onClick={this.chooseType} data-next="flavor-target" data-name="milkshake" className={`itemButton ${this.state.currentItem.type === "milkshake" && "selected"}`}>Milk Shake :)</button>
            {this.state.order.length > 0 && <button onClick={this.checkout} data-next="checkout" className="itemButton" data-name="checkout">Nevermind, ready to pay</button>}
          </p>
        </section>

        {/* FLAVOUR */}
        <section className="question" id="flavor">
          <p id="flavor-target">OK! Which flavor of {humanNames[this.state.currentItem.type || "icecream"]} would you like?</p>
          <div className="gridWrapper columns">
            {menu.filter(i => i.type === (this.state.currentItem.type || "icecream")).map((i, index) => (
              <FlavorOption
                key={index}
                flavor={i}
                assignFlavor={this.assignFlavor}
                currentItem={this.state.currentItem}
              />
            ))}
          </div>
        </section>

        {/* VESSEL */}
        {(this.state.currentItem.type === "icecream" || this.state.currentItem.type === "") && (
          <section className="question" id="vessel">
            <p className="spaced">Great choice! Choose a vessel:</p>
            <div className="columns gridWrapper">
              {vessels.map((i, index) => (
                <VesselOption
                  key={index}
                  index={index}
                  assignVessel={this.assignVessel}
                  option={i}
                  currentItem={this.state.currentItem}
                />))}
            </div>
          </section>
        )}

        {/* SCOOPS */}
        {this.state.currentItem.type === "icecream" && (
          <section className="question" id="scoops">
            <p style={{marginBottom: '1em'}}>
              And how many scoops?
            </p>
            <p>
              <span className="scoop" onClick={this.assignScoops}>
                <svg viewBox="0 0 64 64" width="100%" height="100%" style={{maxHeight: "64px", maxWidth: "64px"}}>
                  <circle data-scoops="1" className={scoopsQuantity > 0 ? "symbolFill selected" : "symbolFill"} cx="32" cy="32" r="32" fillRule="evenodd"></circle>
                  <path className="symbolOutline" d="M32 61.5c16.292 0 29.5-13.208 29.5-29.5S48.292 2.5 32 2.5 2.5 15.708 2.5 32 15.708 61.5 32 61.5zm0 2.5C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32z" fillRule="nonzero"></path>
                </svg>
              </span>
              <span className="scoop" onClick={this.assignScoops}>
                <svg viewBox="0 0 64 64" width="100%" height="100%" style={{maxHeight: "64px", maxWidth: "64px"}}>
                  <circle data-scoops="2" className={scoopsQuantity > 1 ? "symbolFill selected" : "symbolFill"} cx="32" cy="32" r="32" fillRule="evenodd"></circle>
                  <path className="symbolOutline" d="M32 61.5c16.292 0 29.5-13.208 29.5-29.5S48.292 2.5 32 2.5 2.5 15.708 2.5 32 15.708 61.5 32 61.5zm0 2.5C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32z" fillRule="nonzero"></path>
                </svg>
              </span>
              <span className="scoop" onClick={this.assignScoops}>
                <svg viewBox="0 0 64 64" width="100%" height="100%" style={{maxHeight: "64px", maxWidth: "64px"}}>
                  <circle data-scoops="3" className={scoopsQuantity > 2 ? "symbolFill selected" : "symbolFill"} cx="32" cy="32" r="32" fillRule="evenodd"></circle>
                  <path className="symbolOutline" d="M32 61.5c16.292 0 29.5-13.208 29.5-29.5S48.292 2.5 32 2.5 2.5 15.708 2.5 32 15.708 61.5 32 61.5zm0 2.5C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32 0 17.673-14.327 32-32 32z" fillRule="nonzero"></path>
                </svg>
              </span>
            </p>
          </section>
        )}

        {/* ADD ITEM */}
        <section className="question" id="addItem">
          <p>All set. Your total is ${this.state.total}</p>
          <p>Would you like to add another item to your order?</p>
          <div className="itemGroup">
            <button onClick={this.addItemToOrder} className={`itemButton`}>Yes!</button>
            <button onClick={this.checkout} className={`itemButton`}>Nope, ready to pay</button>
          </div>
        </section>

        {/* ADD ITEM */}
        <section className="question" id="checkout">

          {this.state.stripe ?
            (
              <StripeProvider stripe={this.state.stripe}>
                  <Elements>
                    <PaymentForm
                      customerName={this.state.customerName}
                      order={this.state.order.length > 0 ? this.state.order : [this.state.currentItem]}
                      total={this.state.total}
                      stripe={this.state.stripe}
                      cardReady={this.cardReady}
                    />
                  </Elements>
              </StripeProvider>
            ) : null}
        </section>
      </div>
    );
  }
}

export default App;
