import React, {Component} from 'react';
import {RoomContext} from '../context';

class AuthPage extends Component {
  state = {
    isLogin: true
  };

  static contextType = RoomContext;

  constructor(props) {
    super(props);
    this.emailEl = React.createRef();
    this.passwordEl = React.createRef();
    this.confPasswordEl = React.createRef();

  }

  switchModeHandler = () => {
    this.setState(prevState => {
      return {isLogin: !prevState.isLogin};
    });
  };

  submitHandler = event => {

    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (!this.state.isLogin && this.confPasswordEl.current.value !== password){
      alert('Confirmed password is NOT valid');
      return;
    }

    if (email.trim().length === 0 || password.trim().length < 8) {
      return;
    }

    let requestBody = {
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation {
            createUser(userInput: {email: "${email}", password: "${password}"}) {
              _id
              email
            }
          }
        `
      };
    }

    fetch('http://localhost:8000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        if(!this.state.isLogin){
          window.location.reload();
          alert('Register succesfully!');
        }
        if (resData.data.login.token ) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch(err => {
        if (this.state.isLogin){
          alert(`Account NOT exist!`)
        }
      });
  };

  render() {


    return (
      <form className="auth-form" onSubmit={this.submitHandler}>
        <h1>{this.state.isLogin ? 'Login' : 'Register'}</h1>
        <div className="textbox">
          <i className="fa fa-user" aria-hidden="true"></i>
          <input type="email" placeholder="Email" id="email" ref={this.emailEl} />
        </div>
        <div className="textbox">
          <i className="fa fa-lock" aria-hidden="true"></i>
          <input type="password" placeholder="Password" id="password" ref={this.passwordEl} />
        </div>
        {!this.state.isLogin && (
          <div className="textbox">
          <i className="fa fa-check-circle" aria-hidden="true"></i>
          <input type="password" placeholder="Confirmed password" id="password" ref={this.confPasswordEl} />
        </div>
        )}
        <div className="form-actions">
          <button className="submit" type="submit">{this.state.isLogin ? 'Login' : 'Register'}</button>
          <button className="mode" type="button" onClick={this.switchModeHandler}>
            {this.state.isLogin ? 'You do NOT have account?' : 'Switch To Login'}
          </button>
        </div>
      </form>
    );
  }
}

export default AuthPage;