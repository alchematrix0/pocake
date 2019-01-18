import React, { Component } from "react";

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggingIn: false,
      loginFailed: false,
      company: "",
      password: ""
    }
  }
  handleChange = (e) => this.setState({[e.target.name]: e.target.value})
  handleLogin = async (e) => {
    e.preventDefault()
    console.log('handle login')
    console.dir(this.state)
    let response = await fetch("/login", {
        method: "POST",
      headers: {"Accept": "application/json", "Content-Type": "application/json"},
      body: JSON.stringify({
        "company": this.state.company,
        "password": this.state.password,
      })
    })
    let parsed = await response.json()
    console.dir(parsed)
    if (parsed.user) {
      this.props.setOrders(parsed.user, parsed.orders)
    }
  }
  render() {
    return (
      <section className="section">
        <div className="columns">
          <div className="column is-4 is-offset-3 is-vcentered">
            <form onSubmit={this.handleLogin}>
              <div className="field">
                <p className="control">
                  <input placeholder="Company" className="is-large input" name="company" type="text" onChange={this.handleChange} />
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <input placeholder="Password" className="is-large input" name="password" type="password" onChange={this.handleChange} />
                </p>
              </div>
              <div className="field">
                <p className="control">
                  <button className="button is-success" type="submit">Log In</button>
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

    )
  }
}
