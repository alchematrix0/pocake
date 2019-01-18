import React, { Component } from "react";
import { OrderItem } from "./components/dashboard/orderItem.js"
import Login from "./components/dashboard/Login.js"

class Dashboard extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orders: [],
      currentUser: false
    }
  }
  setOrders = (user, orders) => this.setState({orders, currentUser: user})
  render() {
    return this.state.currentUser ? (
      this.state.orders.map(order => (<OrderItem order={order} />))
    ) : (
      <Login setOrders={this.setOrders} />
    )
  }
}
export default Dashboard
