import React, { Component } from "react";
import { config } from "./config.js";
import { menu } from "./menu.js";
import logo from "./img/nemesis/logo.jpg";
import stay from "./img/nemesis/stay.jpg";
import togo from "./img/nemesis/togo.jpg";
import OK from "./components/OK.js";
import Cart from "./components/Cart.js";
import MenuOption from "./components/MenuOption.js";
import ChoiceOption from "./components/ChoiceOption.js";
import SquarePaymentForm from "./components/squarePaymentForm.js";
import "./App.css";
import "./Bulma.css";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stripe: null,
      welcomeStyle: "question welcome",
      customerName: "Friend",
      orderType: "togo",
      order: [],
      activeFilter: "drink",
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
  setOrderType = (e) => this.setState({orderType: e.target.dataset.value}, this.scroll(false, "welcome"))
  toggleCartCollapsed = () => this.setState({collapseCart: !this.state.collapseCart}, () => this.setCartHeight())
  cardReady = (el) => this.setState({stripeCardElement: el, isCheckout: true})
  checkIfEnter = (e) => e.key === "Enter" ? this.scroll(false, e.target.dataset.next) : false;
  setFilter = (e) => this.setState({ activeFilter: e.target.dataset.filter })

  applyMenuFilter = (item, index) => {
    let orderTypeFilter = this.state.orderType === "togo" ? item.toGo : this.state.orderType === "here" ? item.forHere : true
    let itemTypeFilter = item.subtype === this.state.activeFilter || item.type === this.state.activeFilter
    return orderTypeFilter && itemTypeFilter
  }

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
    this.setState({order}, () => this.calculateCost(false, false))
  }

  handleOptionSelect = (e) => {
    let targetItem = this.state.order.find(i => i.name === e.target.dataset.item)
    this.setState({order: this.state.order.map(item => {
      return item.name === e.target.dataset.item ? Object.assign({}, item, {
        cost: (targetItem.options.find(o => o.name === e.target.value).cost || 0) + item.cost,
        activeOption: e.target.value
      }) : item
    })}, () => this.calculateCost(false, true))
  }

  calculateCost = (scrollto, getTotal) => {
    this.setState({
      total: this.state.order
        .map(o => Number(o.cost) * Number(o.quantity))
        .reduce((a, b) => a + b, 0)
    }, () => scrollto ? this.scroll(false, scrollto, 600, scrollto === "flavor-target", scrollto) : false)
  }

  scroll = (e, t, delay = 600, toTop = true, targetName) => {
    console.log('calling scroll')
    let target = document.getElementById(e.target ? e.target.dataset.scrollto : t)
    setTimeout(() => {
      target.scrollIntoView({behavior: "smooth", block: toTop ? "start" : "center"})
      if (target.id === "welcome" && window.innerWidth > 540) { setTimeout(function () {
        document.getElementById("customerName").focus()
      }, delay) }
      if (target.id === "checkout" && this.state.isCheckout) { setTimeout(() => { this.state.stripeCardElement.focus() }, delay) }
    }, delay)
  }

  handleInputFocus = (e) => window.innerWidth < 540 ? this.setState({welcomeStyle: "question welcome nameHasFocus"}) : null
  handleInputBlur = (e) => window.innerWidth < 540 ? this.setState({welcomeStyle: "question welcome"}) : null

  checkout = () => {
    this.calculateCost(false, false)
    this.scroll(false, "checkout")
  }

  render() {
    return (
      <div className="App" style={{ backgroundColor: config.colors.background}}>
        <section className="question hero">
          <div className="columns is-multiline is-mobile is-centered">
            <div className="logoAndText column is-4-desktop is-4-tablet is-12-mobile">
              <img style={{borderRadius: '50%', marginTop: '1em'}} src={logo} className="logo" alt="logo" />
              <h4 className="title is-4 is-spaced logoText">Welcome to Nemesis</h4>
              <p className="subtitle logoText">Thanks for being here!<br/> Ready to place an order?</p>
            </div>
            <ChoiceOption
              key={1}
              onSelect={this.setOrderType}
              text="For here"
              value="here"
              img={stay}
            />
            <ChoiceOption
              key={2}
              onSelect={this.setOrderType}
              text="To go"
              value="togo"
              img={togo}
            />
          </div>
        </section>
        {/* WELCOME */}
        <section id="welcome" className={this.state.welcomeStyle}>
          <p className="spaced">
            Let's start with your name
          </p>
          <input
            id="customerName"
            className="customerName"
            name="customerName"
            data-next="type"
            onFocus={this.handleInputFocus}
            // onBlur={this.handleInputBlur}
            onKeyUp={this.checkIfEnter}
            onChange={this.setCustomerName}
          />
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
          <div className="tabs">
            <ul className="noBorder">
              <li className={this.state.activeFilter === "drink" ? "is-active" : ""}><span data-filter="drink" onClick={this.setFilter}>Drinks</span></li>
              <li className={this.state.activeFilter === "savoury" ? "is-active" : ""}><span data-filter="savoury" onClick={this.setFilter}>Savoury</span></li>
              <li className={this.state.activeFilter === "brunch" ? "is-active" : ""}><span data-filter="brunch" onClick={this.setFilter}>Brunch</span></li>
              <li className={this.state.activeFilter === "sweet" ? "is-active" : ""}><span data-filter="sweet" onClick={this.setFilter}>Sweets</span></li>
            </ul>
          </div>
          <div className="gridWrapper columns">
            {menu.filter(this.applyMenuFilter).map((i, index) => (
              <MenuOption
                key={index}
                item={i}
                addItemToOrder={this.addItemToOrder}
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
          handleOptionSelect={this.handleOptionSelect}
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
