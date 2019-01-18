import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Dashboard from './Dashboard';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import * as serviceWorker from './serviceWorker';
// <Route path="/login" component={Dashboard}></Route>
const Application = () => (
  <Router>
    <Switch>
      <Route path="/" component={App} exact></Route>
      <Route path="/orders" component={Dashboard}></Route>
      <Redirect to="/" />
    </Switch>
  </Router>
)
ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.unregister();
serviceWorker.register();
