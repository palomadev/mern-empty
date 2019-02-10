import React, { Component, Fragment } from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "./redux";
import Auth from "./util/auth";
import Login from "./routes/Login";
// import Dashboard from "./routes/Dashboard";
import NotFound from "./routes/NotFound";
// import User from "./routes/Users/List";
// import EditUser from "./routes/Users/Edit";
// import Profile from "./routes/Users/Profile";

const store = configureStore();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <Fragment>
            <Switch>
              <Route exact path="/login" component={e => Auth.validate(Login, e, store)} />
              {/* <Route exact path="/" component={e => Auth.authorize(Dashboard, e, store, 2)} />
              <Route exact path="/profile" component={e => Auth.authorize(Profile, e, store, 2)} />
              <Route exact path="/user" component={e => Auth.authorize(User, e, store, 1)} />
              <Route exact path="/user/edit/:id" component={e => Auth.authorize(EditUser, e, store, 1)} /> */}
              <Route component={NotFound} />
            </Switch>
          </Fragment>
        </BrowserRouter>
      </Provider>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));