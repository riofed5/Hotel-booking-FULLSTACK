import React, { Component } from "react";
import "./App.css";
import { Route, Switch, Redirect } from "react-router-dom";
import { RoomContext } from "./context";

import Home from "./pages/Home";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import Error from "./pages/Error";
import AuthPage from "./pages/Authorization";
import Navbar from "./components/Navbar";
import Bookings from "./pages/YourBookings";
import ConfirmationLogin from "./pages/ConfirmationLogin";

export default class App extends Component {
  static contextType = RoomContext;

  render() {
    return (
      <>
        <Navbar />
        <Switch>
          {this.context.token && <Redirect from="/auth" to="/rooms" exact />}
          {!this.context.token && <Route path="/auth" component={AuthPage} />}
          <Route exact path="/" component={Home} />
          <Route exact path="/rooms" component={Rooms} />
          <Route exact path="/rooms/:slug" component={SingleRoom} />
          <Route exact path="/confirm" component={ConfirmationLogin} />
          {this.context.token && (
            <Route exact path="/bookings" component={Bookings} />
          )}
          <Route component={Error} />
          {!this.context.token && <Redirect from="/" to="/auth" exact />}
        </Switch>
      </>
    );
  }
}
