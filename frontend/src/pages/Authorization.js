import React, { Component } from "react";
import { RoomContext } from "../context";
import { API_URL } from "../helpers/apiLinks";

class AuthPage extends Component {
  state = {
    isLoginForm: true,
    isUserExist: true,
    isUserActive: true,
  };

  static contextType = RoomContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.confPasswordEl = React.createRef();
  }

  switchModeHandler = () => {
    this.setState((prevState) => {
      return { isLoginForm: !prevState.isLoginForm };
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    this.setState({ isUserExist: true, isUserActive: true });
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (
      !this.state.isLoginForm &&
      this.confPasswordEl.current.value !== password
    ) {
      alert("Confirmed password is NOT valid");
      return;
    }

    if (email.trim().length === 0 || password.trim().length < 8) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            status
            userId
            token
            tokenExpiration
          }
        }
      `,
    };

    if (!this.state.isLoginForm) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `,
      };
    }

    fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed!");
        }
        return res.json();
      })
      .then((resData) => {
        const { errors } = resData;
        if (errors) {
          const { message } = errors[0];
          switch (message) {
            case "User does not exist!":
              this.setState({ isUserExist: false });
              break;
            case "Password is not correct!":
              this.setState({ isUserExist: false });
              break;
            case "Account is pending!":
              this.setState({ isUserActive: false });
              break;
            default:
              this.setState({ isUserExist: false });
          }
        } else {
          if (!this.state.isLoginForm) {
            alert("Register succesfully!");
            this.setState({ isLoginForm: true });
          }
          if (resData.data.login) {
            const { token } = resData.data.login;
            console.log("token");
            if (token) {
              this.context.login(
                resData.data.login.token,
                resData.data.login.userId,
                resData.data.login.tokenExpiration
              );
            }
          }
        }
      })
      .catch((err) => {
        if (this.state.isLoginForm) {
          console.log("err: ", err);
        }
      });
  };

  render() {
    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h1>{this.state.isLoginForm ? "Login" : "Register"}</h1>
        <div className="textbox">
          <i className="fa fa-user" aria-hidden="true"></i>
          <input
            type="email"
            placeholder="Email"
            id="email"
            ref={this.emailEl}
          />
        </div>
        <div className="textbox">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input
            type="password"
            placeholder="Password"
            id="password"
            ref={this.passwordEl}
          />
        </div>
        {!this.state.isLoginForm && (
          <div className="textbox">
            <i className="fa fa-check-circle" aria-hidden="true"></i>
            <input
              type="password"
              placeholder="Confirmed password"
              id="password"
              ref={this.confPasswordEl}
            />
          </div>
        )}
        <div className="form-actions">
          <button className="submit" type="submit">
            {this.state.isLoginForm ? "Login" : "Register"}
          </button>
          <button
            className="mode"
            type="button"
            onClick={this.switchModeHandler}
          >
            {this.state.isLoginForm
              ? "You do NOT have account?"
              : "Switch To Login"}
          </button>
          {this.state.isUserExist ? null : (
            <button className="mode" type="button" disabled={false}>
              <p style={{ color: "red" }}>
                Error while log in! Check your account username and password!
              </p>
            </button>
          )}
          {this.state.isUserActive ? null : (
            <button className="mode" type="button" disabled={false}>
              <p style={{ color: "red" }}>
                Account is pending! Confirm account to log in!
              </p>
            </button>
          )}
        </div>
      </form>
    );
  }
}

export default AuthPage;
