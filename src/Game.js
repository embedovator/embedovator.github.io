import React, { Component } from 'react';
import { Helmet } from "react-helmet";

function Action(props) {
    if(props.brightness < 40){
        return(
            <br/>
        )
    }
    else{
        return (
            <button type="button" className="action" onClick={props.onClick}>
                {props.actionText}
            </button>
        )
    }
}

class Dialog extends React.Component {
    createTable = () => {
        let table = []

        // Outer loop to create parent
        let soliloquy = this.props.soliloquy.peekN(this.props.soliloquy.size());
        for (let i = this.props.soliloquy.size() - 1; i >= 0; i--) {
            let children = []
            // Inner loop to create children
            // for (let j = 0; j < 5; j++) {
            children.push(<td>{`${soliloquy[i]}`}</td>)
            // }
            //Create the parent and add the children
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

export default class Game extends Component {
    constructor(props){
        super(props);
        var RingBuffer = require('ringbufferjs');

        this.state = {
            tick: 0,
            lastActionTick: 0,
            brightness: 30, 
            soliloquyRB: new RingBuffer(5),
        }
        this.tick = this.tick.bind(this);
        this.intervalHandle = setInterval(this.tick, 1000);
    }

    handleAction() {
        alert("ACTION!")
    }

    tick(){
        // This is probably such a horrible newbie way to tick...but here it is!
        this.setState({
           tick: this.state.tick + 1,
           lastActionTick: this.state.lastActionTick + 1,
           brightness: this.state.brightness - 0.2,
        });
    }

    handleBrightness(brightness) {
        if((this.state.brightness + brightness) <= 0){
            this.setState({
                brightness: 0,
            });
        }
        else {
            this.setState({
                brightness: this.state.brightness + brightness,
            });
        }
    }

    render() {
        let soliloquy= this.state.soliloquyRB;
        if(this.state.tick === 1){
            soliloquy.enq("Can't see.");
        }
        else if(this.state.tick === 3) {
            soliloquy.enq("Screen is dim.");
        }
        else if(this.state.tick === 7) {
            soliloquy.enq("Eyes are tired.");
        }
        else if(this.state.tick === 10) {
            soliloquy.enq("...productivity falling.");
        }
        else{
        }

        return (
            <div className="game-area">
                <div className="actions">
                    <Action
                        onClick={this.handleAction}
                        actionText="actionText"
                        brightness={this.state.brightness}
                    />
                </div>
                <div className="brightness">
                    <Action
                        // onClick={() => this.props.onSave()} // eventually handle saving
                        onClick={() => this.handleBrightness(20)}
                        actionText="brighten"
                    />
                </div>
                <div className="soliloquy">
                    <Helmet>
                        <style>{`
                            :root {
                                --primary-lightness: ${this.state.brightness}%;
                                }
                            `}
                        </style>
                    </Helmet>
                     <Dialog 
                         soliloquy={soliloquy}
                     />
                </div>
            </div>
        );
    }
}