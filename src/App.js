import React, { Component } from 'react';
import Profile from './Profile.js';
import Signin from './Signin.js';
import Game from './Game.js';
import {
  UserSession,
  AppConfig
} from 'blockstack';

const appConfig = new AppConfig()
const userSession = new UserSession({ appConfig: appConfig })

export default class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      saveGame: false
    }
  }

  handleSave() {
      this.setState({
        saveGame: true,
      });
  }

  handleSignIn(e) {
    e.preventDefault();
    userSession.redirectToSignIn();
  }

  handleSignOut(e) {
    e.preventDefault();
    userSession.signUserOut(window.location.origin);
  }

  render() {
    return (
      <div className="site-wrapper">
        <div className="site-wrapper-inner">
          {this.state.saveGame ? 
            !userSession.isUserSignedIn() ?
              <Signin userSession={userSession} handleSignIn={ this.handleSignIn } />
              : <Profile userSession={userSession} handleSignOut={ this.handleSignOut } />
            : <Game 
                onSave={() => this.handleSave()} 
               />
          }
        </div>
      </div>
    );
  }

  componentDidMount() {
    if (userSession.isSignInPending()) {
      userSession.handlePendingSignIn().then((userData) => {
        window.history.replaceState({}, document.title, "/")
        this.setState({ userData: userData})
      });
    }
  }
}
