import React, { Component } from "react";
import logo from "./presta-white.png";
import "./App.css";
import "./Bulma.css";
import OK from "./components/OK.js";
import Cart from "./components/Cart.js";
import MenuOption from "./components/MenuOption.js";
import SquarePaymentForm from "./components/squarePaymentForm.js";
import { menu, blankItem } from "./menu.js";

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
      isCheckout: false,
      collapseCart: false,
      cartHeight: 0
    }
  }

  setCustomerName = (e) => this.setState({customerName: e.target.value})
  setCartHeight = () => this.setState({cartHeight: document.getElementById('cart').offsetHeight + 10})
  addItemToOrder = (e) => {
    let order = this.state.order
    console.dir(order)
    let i = order.findIndex(o => o.name === e.target.dataset.item)
    console.log(i)
    if (i !== -1) {
      order[i].quantity++
    } else {
      order.push(menu.find(i => i.name === e.target.dataset.item))
    }
    this.setState({order, currentItem: blankItem}, this.calculateTotal)
  }

  calculateTotal = () => this.setState({total: this.state.order.map(o => o.cost).reduce((a, b) => a + b, 0)}, () => this.setCartHeight())

  calculateCost = (scrollto) => {
    let currentItem = this.state.currentItem
    let cost = currentItem.cost
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

  scroll = (e, t, delay = 600, toTop = true, targetName) => {
    let target = document.getElementById(e.target ? e.target.dataset.scrollto : t)
    setTimeout(() => {
      target.scrollIntoView({behavior: "smooth", block: toTop ? "start" : "center"})
      if (target.id === "welcome") { setTimeout(function () { document.getElementById("customerName").focus() }, delay) }
      if (target.id === "checkout" && this.state.isCheckout) { setTimeout(() => { this.state.stripeCardElement.focus() }, delay) }
    }, delay)
  }

  toggleCartCollapsed = () => this.setState({collapseCart: !this.state.collapseCart}, () => this.setCartHeight())

  checkout = () => {
    this.calculateTotal()
    this.scroll(false, "checkout")
  }

  cardReady = (el) => this.setState({stripeCardElement: el, isCheckout: true})
  checkIfEnter = (e) => e.key === "Enter" ? this.scroll(false, e.target.dataset.next) : false;
  render() {
    return (
      <div className="App">
        <section className="question hero">
          <img src={logo} className="logo" alt="logo" />
          <p className="spaced">We're so glad you're here</p>
          <OK
            text="Coffee!"
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
          <p className="greeting">
            Hi {this.state.customerName} 👋
            <br />
            What can we get for you today?
            <br/>
          </p>
          <div className="gridWrapper columns">
            {menu.map((i, index) => (
              <MenuOption
                key={index}
                item={i}
                addItemToOrder={this.addItemToOrder}
                currentItem={this.state.currentItem}
              />
            ))}
          </div>
        </section>

        <Cart
          isHidden={this.state.order.length === 0}
          items={this.state.order}
          checkout={this.checkout}
          total={this.state.total}
          collapseCart={this.state.collapseCart}
          toggleCartCollapsed={this.toggleCartCollapsed}
        />

        {/* Checkout */}
        <section className="question" id="checkout">
          <SquarePaymentForm
            order={this.state.order}
            total={this.state.total}
            customerName={this.state.customerName}
            offset={this.state.cartHeight || 20}
            requestCardNonce={this.requestCardNonce}
          />
        </section>
      </div>
    );
  }
}

export default App;
