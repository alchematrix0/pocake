import React, { Component } from "react";
import { Elements, StripeProvider } from "react-stripe-elements"
import logo from "./saltStrawLogo.png";
import "./App.css";
import OK from "./components/OK.js"
import Order from "./components/order.js"
import Checkout from "./components/checkout.js"
import {vessels, menu, blankItem} from "./menu.js"
const humanNames = {icecream: "ice cream", sundae: "sundae", milkshake: "milk shake"}

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      customerName: "Friend",
      order: [],
      currentItem: blankItem,
      total: 0,
      base: 0
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
    }, () => scrollto ? this.scroll(false, scrollto) : false)
  }
  chooseType = (e) => this.setState({currentItem: Object.assign({}, this.state.currentItem, {type: e.target.dataset.name})}, () => this.calculateCost("flavor"))
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
  scroll = (e, t, delay = 600) => {
    let target = document.getElementById(e.target ? e.target.dataset.scrollto : t)
    setTimeout(function () {
      if (!target) {
        console.log('no target')
        console.dir(target)
      }
      target.scrollIntoView({behavior: "smooth"})
    }, delay)
  }
  checkout = () => {
    let order = this.state.order
    order.push(this.state.currentItem)
    this.setState({order, currentItem: blankItem}, () => this.scroll(false, "checkout"))
  }
  checkIfEnter = (e) => e.key === "Enter" ? this.scroll(false, e.target.dataset.next) : false;
  render() {
    let scoopsQuantity = Number(this.state.currentItem.scoops)
    return (
      <div className="App">
        <section className="question hero">
          <img src={logo} className="logo" alt="logo" />
          <p>We're so glad you're here</p>
          <OK
            text="Ice Cream!"
            target="welcome"
            scroll={this.scroll}
            hideEnter={true}
            style={{maxWidth: '100%', fontSize: '2rem'}}
          />
        </section>
        {/* WELCOME */}
        <section id="welcome" className="question">
          <p>
            Let's start with your name
            <br style={{marginBottom: "20px"}} />
            <input className="customerName" name="customerName" data-next="type" onKeyUp={this.checkIfEnter} onChange={this.setCustomerName} />
          </p>
          <OK
            show={this.state.customerName !== 'Friend' && this.state.customerName.length > 0}
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
          )
          : (
            <p>
              Hi {this.state.customerName} 👋
              <br />
              What can we get for you today?
            </p>
          )}
          <p className="itemGroup">
            <button onClick={this.chooseType} data-next="flavor" data-name="icecream" className={`itemButton ${this.state.currentItem.type === "icecream" && "selected"}`}>Ice Cream!</button>
            <button onClick={this.chooseType} data-next="flavor" data-name="sundae" className={`itemButton ${this.state.currentItem.type === "sundae" && "selected"}`}>A Sundae</button>
            <button onClick={this.chooseType} data-next="flavor" data-name="milkshake" className={`itemButton ${this.state.currentItem.type === "milkshake" && "selected"}`}>Milk Shake :)</button>
            {this.state.order.length > 0 && <button onClick={this.checkout} data-next="checkout" className="itemButton" data-name="checkout">Nevermind, ready to pay</button>}
          </p>
        </section>

        {/* FLAVOUR */}
        <section className="question" id="flavor">
          <p>OK! Which flavour of {humanNames[this.state.currentItem.type] || "____"} would you like?</p>
          <div className="gridWrapper">
            {menu.filter(i => i.type === this.state.currentItem.type).map((i, index) => (
              <div key={`flavor_${index}`} className="flavorWrapper">
                <img
                  className={`imageOption ${this.state.currentItem.flavor === i.name && "selected"}`}
                  onClick={this.assignFlavor}
                  data-flavor={i.name}
                  key={i.name}
                  alt={i.name}
                  src={i.image}
                />
              </div>
              ))}
          </div>
        </section>

        {/* VESSEL */}
        {this.state.currentItem.type === "icecream" && (
          <section className="question" id="vessel">
            <p>Great choice! Choose a vessel:</p>
            <p>
              {vessels.map((i, index) => (
                <img
                  onClick={this.assignVessel}
                  data-vessel={i.name}
                  key={i.name + index}
                  className={`imageVessel imageOption ${this.state.currentItem.vessel === i.name && "selected"}`}
                  alt={i.name}
                  src={i.image}
                />))}
            </p>
          </section>
        )}

        {/* SCOOPS */}
        {this.state.currentItem.type === "icecream" && (
          <section className="question" id="scoops">
            <p>
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
          <StripeProvider apiKey="pk_test_ue0Gv5z8wVTjsCDUxRGlRiS1">
            <div className="example">
              <Elements>
                <Checkout
                  customerName={this.state.customerName}
                  order={this.state.order.length > 0 ? this.state.order : [this.state.currentItem]}
                  total={this.state.total}
                />
              </Elements>
            </div>
          </StripeProvider>
        </section>
      </div>
    );
  }
}

export default App;
