import React, { Component } from 'react';
import { Helmet } from "react-helmet";

// Global variables...
let gWorkState = "work";

function Action(props) {
    return (
        <button type="button" className="action" onClick={props.onClick}>
            {props.actionText}
        </button>
    )
}

class Actionz extends React.Component {
    createTable = () => {
        let table = []

        // Outer loop to create parent
        let transitions = this.props.transitions;
        for (let i = 0; i < transitions.length; i++){
            let children = []
            // if((this.props.hidden[transitions[i]] == 'null') && (this.props.hidden[transitions[i]] != false)){
            if(this.props.hidden[transitions[i]] !== true) {
                // Inner loop to create children
                children.push(<td>
                    <Action
                        actionText={transitions[i]}
                        onClick={() => this.props.onTransition(transitions[i])}
                    /></td>)
                //Create the parent and add the children
                table.push(<tr>{children}</tr>)
            }
        }
        return table
    }

    render() {
        return (
            <div>
                <table>
                    {this.createTable()}
                </table>
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
            children.push(<td>{`${soliloquy[i]}`}</td>)
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
            hidden: {'team':true},

            codeXP: 0,
            money: 0,

            fsm: new StateMachine({
                init: 'home',
                transitions: [
                    /* Transitions */
                    { name: 'a quiet room', from: 'home', to: 'quiet' },
                    { name: 'inventory', from: 'home', to: 'inventory' },
                    { name: 'work', from: 'home', to: function(){ return gWorkState }},
                    { name: 'team', from: 'home', to: 'team' },
                    { name: "code a simple search engine", from: 'work', to: () => { if(this.handleSimpleSearchEngine('search')) return gWorkState; else return 'work'; } },
                    { name: "code a humble online book store", from: 'work', to: () => { if(this.handleSimpleSearchEngine('book')) return 'home2'; else return 'work'; } },
                    { name: "code a tiny social network", from: 'work', to: () => { if(this.handleSimpleSearchEngine('social')) return gWorkState; else return 'work'; } },
                    /* Going back */
                    { name: 'back', from: ['quiet','inventory','work','search','book', 'social', 'team'], to: 'home' },
                    /* Actions, implemented as state transitions to self */
                    { name: 'brighten', from: 'home', to: 'home' },
                    { name: 'code', from: 'quiet', to: 'quiet' },
                    { name: 'create a stylish frontend', from: 'search', to: 'search' },
                    { name: 'create a stylish frontend', from: 'search', to: 'search' },
                    { name: 'create a robust backend', from: 'search', to: 'search' },
                    { name: 'optimization', from: 'search', to: 'search' },
                ],
                methods: {
                    onBrighten: () => this.handleBrightness(20),
                    onCode: () => this.handleCode(),
                    "onCode a humble online book store": () => this.handleBookstore(),
                    "onCode a tiny social network": () => this.handleSocialNetwork(),
                }
            }),
        }

        this.tick = this.tick.bind(this);
        this.intervalHandle = setInterval(this.tick, 1000);

        // Uncomment me for vizualization! Then execute dot -Tps derp.dot -o graph.ps 
        // var visualize = require('javascript-state-machine/lib/visualize');
        // console.log(visualize(this.state.fsm));
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

    handleInventory(){
        //TODO: Update action area with inventory
    }

    handleBookstore(){
    }

    handleSocialNetwork(){
    }

    handleSimpleSearchEngine(selectWork){
        let soliloquy = this.state.soliloquyRB;
        let codeXP = this.state.codeXP;
        let money = this.state.money;
        let hidden = this.state.hidden;
        let transitionSuccess = false;

        const searchEngineLOC = 30;
        const reward = 5;
        console.log("handleSimpleSearchEngine!");

        if(this.state.codeXP >= searchEngineLOC){
            soliloquy.enq(selectWork + " built!");
            soliloquy.enq("$$$: +" + reward);
            soliloquy.enq("...can we make it better?");
            codeXP -= reward;
            money += reward;
            gWorkState = selectWork;
            delete hidden['team']; // show team!
            transitionSuccess = true;
        }
        else {
            soliloquy.enq("Not enough code..."); 
            soliloquy.enq("Need " + (searchEngineLOC - codeXP) + " LOC.");
        }

        this.setState({
            codeXP: codeXP,
            money: money,
            soliloquyRB: soliloquy,
            hidden: hidden,
        })

        return transitionSuccess;
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
        console.log("Taking transition \"" + name + "\"");
        console.log("this.state.fsm[\"" + name +"\"]");
        console.log(this.state.fsm.allTransitions());
        console.log(this.state.fsm.allStates());
        console.log("current state: "+ this.state.fsm.state);
        let fn_name = "search engine temecula long";
        if (typeof this.state.fsm[`${name}`] === "function")
        {
            console.log(name + " valid!");
            this.state.fsm[`${name}`]();
        }
        else {
            console.log(fn_name  + " invalid!");
        }
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
                        hidden={this.state.hidden}
                        onTransition={(name) => this.handleTransition(name)}
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

