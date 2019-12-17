import React, { Component } from 'react';
import { Helmet } from "react-helmet";
class Dialog extends React.Component {
    createTable = () => {
        let table = []

        // Outer loop to create parent
        let soliloquyRB = this.props.soliloquyRB.peekN(this.props.soliloquyRB.size());
        for (let i = this.props.soliloquyRB.size() - 1; i >= 0; i--) {
            let children = []
            children.push(<td>{`${soliloquyRB[i]}`}</td>)
            table.push(<tr>{children}</tr>)
        }
        return table
    }

    render() {
        return (
            <table>
                {this.createTable()}
            </table>
        )
    }
}

export default class Signin extends Component {
  constructor(props){
    super(props);

    var RingBuffer = require('ringbufferjs');

    this.state = {
        tick: 0,
        brightness: 0, 
        soliloquyRB: new RingBuffer(6),
    };
  }

  tick(){
    let tick = this.state.tick;
    let soliloquyRB = this.state.soliloquyRB;

    if (tick === 1) {
      soliloquyRB.enq("Eyes are tired.");
    }
    else if (tick === 3) {
      soliloquyRB.enq("Screen is dim.");
    }
    else if (tick === 7) {
      soliloquyRB.enq("Can't see.");
    }

    this.setState({
      tick: tick,
      soliloquyRB: soliloquyRB,
    })
  }

  render() {
    const { handleSignIn } = this.props;
    let soliloquyRB = this.state.soliloquyRB;

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
