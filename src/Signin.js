import React, { Component } from 'react';
export default class Signin extends Component {
  render() {
    const { handleSignIn } = this.props;

    return (
      <div>
        <div className="signintop"></div>
        <div className="signin">
            { <button
              className="btn btn-sm"
              id="signin-button"
              onClick={ handleSignIn.bind(this) }
            >
              Sign In with Blockstack
            </button> }
        </div>
      </div>
    );
  }
}
