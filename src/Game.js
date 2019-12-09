import React, { Component } from 'react';
import { Helmet } from "react-helmet";

function Action(props) {
    return (
        <button type="button" className="action" onClick={props.onClick}>
            {props.actionText}
        </button>
    )
}

class Screen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            screen: {
              home:
                [<Action
                    onClick={this.props.onQuiet}
                    actionText="A quiet room"
                />, 
                <div className ="brightness">
                    <Action
                        onClick={this.props.onBrighten}
                        actionText="brighten"
                    />
                </div>
                ],
              quiet:
                [<Action
                    onClick={this.props.onBack}
                    actionText="Back"
                />,
                <Action
                    onClick={this.props.onCode}
                    actionText="Code"
                />],
            },
            currentScreen: 0,
            prevScreen: 0,
        }
    };

    render() {
        let screen = this.state.screen[this.props.screenKey];
        return (
            <div>
                {screen}
            </div>
        )
    };
}

class Actionz extends React.Component {
    createTable = () => {
        let table = []

        // Outer loop to create parent
        let transitions = this.props.transitions;
        let actions = this.props.actions;
        for (let i = 0; i < transitions.length; i++){
            let children = []
            // Inner loop to create children
            children.push(<td>
                <Action
                    actionText={transitions[i]}
                    onClick={() => this.props.onTransition(transitions[i])}
                /></td>)
            //Create the parent and add the children
            table.push(<tr>{children}</tr>)
        }
        return table
    }

    render() {
        return (
            <div>
                <span>Hey look, a table!</span>
                <table>
                    {this.createTable()}
                </table>
                <span>Table done.</span>
            </div>
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
        var StateMachine = require('javascript-state-machine');

        this.state = {
            tick: 0,
            lastActionTick: 0,
            brightness: 30, 
            soliloquyRB: new RingBuffer(5),
            screenKey: "home",
            prevScreenKey: "home",
            codeXP: 0,
            fsm: new StateMachine({
                init: 'solid',
                transitions: [
                    { name: 'melt', from: 'solid', to: 'liquid' },
                    { name: 'freeze', from: 'liquid', to: 'solid' },
                    { name: 'vaporize', from: 'liquid', to: 'gas' },
                    { name: 'condense', from: 'gas', to: 'liquid' }
                ],
                methods: {
                    onMelt: function () { console.log('I melted') },
                    onFreeze: function () { console.log('I froze') },
                    onVaporize: function () { console.log('I vaporized') },
                    onCondense: function () { console.log('I condensed') }
                }
            }),
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
           brightness: this.state.brightness - 0.3,
        });

        // If this is anything like an embedded system...shouldn't run code in an interrupt handler. 
        // However, I've found that using the tick value isn't "thread safe" unless I update logic
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
    }

    handleQuietTransition() {
        // okay, we're getting to state transitions. I know there's a better way but we're learning :)
        this.setState({
            screenKey: "quiet"
        });
    }

    handleBack(){
        this.setState({
            screenKey: this.state.prevScreenKey
        })
    }

    handleCode(){
        // should be its own class perhaps, seems to need state to control refresh rate?
        const status= "lines of code: +5";
        let soliloquy = this.state.soliloquyRB;
        soliloquy.enq(status);
        this.setState({
            codeXP: this.state.codeXP + 5,
            soliloquyRB: soliloquy,
        })
    }

    handleTransition(name){
        console.log(name);
        this.state.fsm[`${name}`]();
    }

    handleBrightness(brightness) {
        if((this.state.brightness + brightness) <= 0){
            this.setState({
                brightness: 0,
            });
        }
        else {
            if(this.state.lastActionTick >= 3)
            {
                this.setState({
                    brightness: this.state.brightness + brightness,
                    lastActionTick: 0,
                });
            }
        }
    }

    render() {
        const soliloquy= this.state.soliloquyRB;

        return (
            <div className="game-area">
                <div className="actions">
                    <Actionz
                        transitions={this.state.fsm.transitions()}
                        onTransition={(name) => this.handleTransition(name)}
                    />
                    <Screen
                        onClick={() => this.handleAction()}
                        onQuiet={() => this.handleQuietTransition()}
                        onBrighten={() => this.handleBrightness(20)}
                        onCode={() => this.handleCode()}
                        onBack={() => this.handleBack()}
                        screenKey={this.state.screenKey}
                    />
                </div>
                {/* <div className="brightness">
                    <Action
                        // onClick={() => this.props.onSave()} // eventually handle saving
                        onClick={() => this.handleBrightness(20)}
                        actionText="brighten"
                    />
                </div> */}
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