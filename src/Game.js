import React, { Component } from 'react';
import { Helmet } from "react-helmet";

function Action(props) {
    return (
        <button type="button" className="action" hidden={props.hidden} disabled={props.disabled} onClick={props.onClick}>
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
            // if(this.props.hidden[transitions[i]] !== true) {
                // Inner loop to create children
                children.push(<td>
                    <Action
                        actionText={transitions[i]}
                        onClick={() => this.props.onTransition(transitions[i])}
                        hidden={this.props.hidden[transitions[i]] ? "true" : ""}
                        disabled={this.props.disabled[transitions[i]] ? "true" : ""}
                    /></td>)
                //Create the parent and add the children
                table.push(<tr>{children}</tr>)
            }
        // }
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


export default class Game extends Component {
    constructor(props){
        super(props);
        var RingBuffer = require('ringbufferjs');
        var StateMachine = require('javascript-state-machine');

        this.state = {
            tick: 0,
            endTick: 0,
            lastActionTick: 0,
            brightness: 30, 
            dimRate: -0.3, 
            soliloquyRB: new RingBuffer(6),
            hidden: {'team':true, 'a simple search engine':true, 'a humble book store':true, 'a tiny social network':true},
            disabled: {},
            engineers: {'frontend':0, 'backend':0, 'optimization':0},
            loan: {'amount': 0, 'interestPct': 30},

            codeXP: 0,
            money: 0,
            users: 0,
            adoptionRate: 1,
            tippingPoint: false,

            fsm: new StateMachine({
                init: 'home',
                transitions: [
                    /* Transitions */
                    { name: 'a quiet room', from: 'home', to: 'quiet' },
                    { name: 'inventory', from: 'home', to: 'inventory' },
                    { name: 'work', from: 'home', to: 'work'},
                    { name: 'team', from: 'home', to: 'team' },
                    { name: "code a simple search engine", from: 'work', to: 'work'},
                    { name: "a simple search engine", from: 'work', to: 'search'},
                    // { name: "code a humble book store", from: 'work', to: 'work'},
                    { name: "a humble book store", from: 'work', to: 'book'},
                    // { name: "code a tiny social network", from: 'work', to: 'work'},
                    { name: "a tiny social network", from: 'work', to: 'social'},
                    { name: "code for some BS temp job", from: 'work', to: 'bs' },
                    /* Going back */
                    { name: 'back', from: ['quiet','inventory','work','search','book', 'social', 'team', 'bs'], to: 'home' },
                    /* Actions, implemented as state transitions to self */
                    { name: 'brighten', from: 'home', to: 'home' },
                    { name: 'code', from: 'quiet', to: 'quiet' },
                    { name: 'fix legacy code', from: 'bs', to: () => {this.handleBSWork(); return 'bs'}},
                    { name: 'write more lolcode', from: 'bs', to: () => {this.handleBSWork(); return 'bs'}},
                    { name: 'compile', from: 'bs', to: () => {this.handleBSWork(); return 'bs'}},
                    { name: 'add another layer of abstraction', from: 'bs', to: () => {this.handleBSWork(); return 'bs'}},
                    { name: 'hire a frontend engineer', from: 'team', to: 'team' },
                    { name: 'hire a backend engineer', from: 'team', to: 'team' },
                    { name: 'hire an optimization engineer', from: 'team', to: 'team' },
                    { name: 'create a simple, modern frontend', from: 'search', to: 'search' },
                    { name: 'create a robust backend', from: 'search', to: 'search' },
                    { name: 'optimization!', from: 'search', to: 'search' },
                ],
                methods: {
                    onBrighten: () => this.handleBrightness(20),
                    onCode: () => this.handleCode(),
                    onEnterInventory: () => this.handleInventory(),
                    "onHire a frontend engineer": () => this.handleHire("frontend"),
                    "onHire a backend engineer": () => this.handleHire("backend"),
                    "onHire an optimization engineer": () => this.handleHire("optimization"),
                    "onCode a simple search engine": () => this.handleWork('search'),
                    "onCode a humble book store": () => this.handleWork('book'),
                    "onCode a tiny social network": () => this.handleWork('social'),
                    "onCreate a simple, modern frontend": () => this.handleSearchWork('frontend'),
                    "onCreate a robust backend": () => this.handleSearchWork('backend'),
                    "onOptimization!": () => this.handleSearchWork('optimization'),
                }
            }),
        }

        this.tick = this.tick.bind(this);
        this.intervalHandle = setInterval(this.tick, 1000);

        // Uncomment me for vizualization! Then execute dot -Tps derp.dot -o graph.ps 
        // var visualize = require('javascript-state-machine/lib/visualize');
        // console.log(visualize(this.state.fsm));
    }

    handleBSWork(){
        this.setState(
        {
            money: this.state.money + 5
        });
    }

    handleHire(position){
        let soliloquyRB = this.state.soliloquyRB;
        let money = this.state.money;
        let engineers = this.state.engineers;
        let cost = 100;

        if(money >=  cost)
        {
            switch(position){
                case "frontend": 
                {
                    soliloquyRB.enq("Frontend Engineer hired at rate of $108/hr!");
                    engineers[position] += 1;
                    break;
                }
                case "backend": 
                {
                    soliloquyRB.enq("Backend Engineer hired at rate of $108/hr!");
                    engineers[position] += 1;
                    break;
                }
                case "optimization": 
                {
                    soliloquyRB.enq("Optimization Engineer hired at rate of $108/hr!");
                    engineers[position] += 1;
                    break;
                }

                default:
                {
                    soliloquyRB.enq("Not hiring at the moment!");
                }
            }
        }
        else{
            soliloquyRB.enq("Too poor to hire. Need $" + (cost - money)+". Consider a temp job.");
        }

        this.setState({
            soliloquyRB: soliloquyRB,
            engineers: engineers,
            money: money,
        });
    }

    handleSearchWork(position) {
        let engineer = this.state.engineers[position];
        let money = this.state.money;
        let optimizationLevel = this.state.optimizationLevel;
        let soliloquyRB = this.state.soliloquyRB;
        let disabled = this.state.disabled;
        let requirement = 1;

        if (engineer >= requirement) {
            switch(position){
                case 'backend':
                {
                    disabled['create a robust backend'] = true;
                    soliloquyRB.enq("This thing is built like a tank, ready for war. Now how are we going to pay for all this...?")
                    break;
                }
                case 'frontend':
                {
                    disabled['create a simple, modern frontend'] = true;
                    soliloquyRB.enq("NOICE. A simple, modern frontend has been built. Soon we'll need a marketing team...")
                    break;
                }
                case 'optimization':
                {
                    let optimizeCost = -10;

                    if(money >= optimizeCost){
                        soliloquyRB.enq("$: " + optimizeCost);
                        soliloquyRB.enq("Throw money and an engineer at the problem. That'll fix it.")
                        money += optimizeCost;
                        optimizationLevel += 1;
                    }
                    else{
                        soliloquyRB.enq("Need more money! $" + (optimizeCost - money) + " to be exact.");
                    }
                    break;
                }
                default:
                {
                    soliloquyRB.enq("Oops. There's no work for the " + position + " position...");
                    break;
                }
            }
        }
        else {
            soliloquyRB.enq("Need " + (requirement - engineer) + " " + position + " engineers on your team!");
        }

        this.setState({
            disabled: disabled,
            soliloquyRB: soliloquyRB,
            money: money,
            optimizationLevel: optimizationLevel,
        });
    }

    tick(){
        // If this is anything like an embedded system...shouldn't run code in an interrupt handler. 
        // However, I've found that using the tick value isn't "thread safe" unless I update logic
        let soliloquyRB= this.state.soliloquyRB;
        let tick = this.state.tick;
        let endTick = this.state.endTick;
        let userRequirement = (this.state.engineers['frontend'] > 3);
        let money = this.state.money;
        let users = this.state.users;
        let brightness = this.state.brightness;
        let dimRate = this.state.dimRate;
        let adoptionRate = this.state.adoptionRate;
        let tippingPoint = this.state.tippingPoint;
        let disabled = this.state.disabled;
        let engineers = this.state.engineers;
        let loan = this.state.loan;

        if(tick === 1){
            soliloquyRB.enq("Can't see.");
        }
        else if(tick === 3) {
            soliloquyRB.enq("Screen is dim.");
        }
        else if(tick === 7) {
            soliloquyRB.enq("Eyes are tired.");
        }

        for (const [position, count] of Object.entries(engineers)) {
            const ongoingCost = -0.3;
            if(count !== 0){
                if(money > ongoingCost){
                    money += (ongoingCost * count);
                }
                else{
                    if(!tippingPoint){
                        loan.amount += 1000;
                        soliloquyRB.enq("Ran out of money.");
                        soliloquyRB.enq("Took a loan for " + loan.amount + " @ " + loan.interestPct + "% to make payroll for " + position +  "...will pay interest.");
                        soliloquyRB.enq("Need to start making money...the pressure is immense!");
                        money += loan.amount;
                    }
                    else{
                        money = 0;
                    }
                }
            }
        }

        if(loan.amount > 0){
            let annualCost = ((loan.amount) * (loan.interestPct)) / 100; // interest-only payments
            let ongoingCost = annualCost / (52 * 40);
            money -= ongoingCost;
        }

        if(userRequirement) {
            users += adoptionRate;
            adoptionRate += 1;
        }

        if(users > 1000){
            if(!tippingPoint)
            {
                soliloquyRB.enq("Reached the tipping point for number of users! We can't fail now.");
            }
            tippingPoint = true;
        }

        if(tippingPoint){
            adoptionRate -= 3;
            if(users <= 0){
                users = 0;
            }

            if((money <= 0) && (endTick === 0)){
                endTick = tick;
                disabled['brighten'] = true;
            }

            if (tick === (endTick + 3)) {
                soliloquyRB.enq("Can’t pay employees...");
            }
            else if (tick === (endTick + 5)) {
                soliloquyRB.enq("...the bank owns everything.");
            }
            else if (tick === (endTick + 7)) {
                soliloquyRB.enq("Won't give us any more money.");
            }
            else if (tick === (endTick + 10)) {
                soliloquyRB.enq("Lost the trust of the users.");
            }
            else if (tick === (endTick + 13)) {
                soliloquyRB.enq("Took advantage of them.");
            }
            else if (tick === (endTick + 16)) {
                soliloquyRB.enq("Can’t even afford my electricity bill...");
                dimRate += -3;
            }
        }

        brightness += dimRate;
        if(brightness <= 0){
            brightness = 0;
        }

        this.setState({
           tick: this.state.tick + 1,
           endTick: endTick,
           lastActionTick: this.state.lastActionTick + 1,
           dimRate: dimRate,
           brightness: brightness,
           users: users,
           adoptionRate: adoptionRate,
           tippingPoint: tippingPoint,
           money: money,
        });
    }

    handleInventory(){
        let soliloquyRB = this.state.soliloquyRB;
        let users = this.state.users;

        if((users > 0) || this.state.tippingPoint) soliloquyRB.enq("users: " + this.state.users);
        soliloquyRB.enq("lines of code: " + this.state.codeXP);
        soliloquyRB.enq("$: " + this.state.money);
        //TODO: Only show as earned...
        // soliloquyRB.enq("backend engineers: " + this.state.codeXP);

        this.setState({
            soliloquyRB: soliloquyRB,
        })
    }

    handleBookstore(){
    }

    handleSocialNetwork(){
    }

    handleWork(selectWork){
        let soliloquyRB = this.state.soliloquyRB;
        let codeXP = this.state.codeXP;
        let money = this.state.money;
        let hidden = this.state.hidden;

        const reqLOC = 30;
        const reward = 5;

        if(this.state.codeXP >= reqLOC){
            switch(selectWork){
                case 'book':
                {
                    soliloquyRB.enq("All things start from humble beginnings. Bookstore built!");
                    delete hidden['a humble book store'];
                    hidden['code a humble book store'] = true;
                    break;
                }
                case 'social':
                {
                    soliloquyRB.enq("Have we reached the tipping point yet? Tiny social network built!");
                    delete hidden['a tiny social network'];
                    hidden['code a tiny social network'] = true;
                    break;
                }
                case 'search':
                {
                    soliloquyRB.enq("Simplicity at its finest. The `query` function. Simple search engine built!");
                    delete hidden['a simple search engine'];
                    hidden['code a simple search engine'] = true;
                    break;
                }
                default:
                {
                    soliloquyRB.enq(selectWork + " built!");
                    break;
                }
            }
            soliloquyRB.enq("$: +" + reward);
            soliloquyRB.enq("...can we make it better?");
            codeXP -= reward;
            money += reward;
            delete hidden['team'];
        }
        else {
            soliloquyRB.enq("Not enough code..."); 
            soliloquyRB.enq("Need " + (reqLOC - codeXP) + " LOC.");
        }

        this.setState({
            codeXP: codeXP,
            money: money,
            soliloquyRB: soliloquyRB,
            hidden: hidden,
        })
    }


    handleSimpleSearchEngine(selectWork){
        let soliloquyRB = this.state.soliloquyRB;
        let codeXP = this.state.codeXP;
        let money = this.state.money;
        let hidden = this.state.hidden;

        const searchEngineLOC = 30;
        const reward = 5;
        console.log("handleSimpleSearchEngine!");

        if(this.state.codeXP >= searchEngineLOC){
            soliloquyRB.enq(selectWork + " built!");
            soliloquyRB.enq("$: +" + reward);
            soliloquyRB.enq("...can we make it better?");
            codeXP -= reward;
            money += reward;
            delete hidden['team'];
            delete hidden['a simple search engine'];
            hidden['code a simple search engine'] = true; // hide code a simple search, replace with a simple search
        }
        else {
            soliloquyRB.enq("Not enough code..."); 
            soliloquyRB.enq("Need " + (searchEngineLOC - codeXP) + " LOC.");
        }

        this.setState({
            codeXP: codeXP,
            money: money,
            soliloquyRB: soliloquyRB,
            hidden: hidden,
        })
    }

    handleCode(){
        // should be its own class perhaps, seems to need state to control refresh rate?
        const status= "lines of code: +5";
        let soliloquyRB = this.state.soliloquyRB;
        soliloquyRB.enq(status);
        this.setState({
            codeXP: this.state.codeXP + 5,
            soliloquyRB: soliloquyRB,
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
        const soliloquyRB= this.state.soliloquyRB;

        return (
            <div className="game-area">
                <div className="actions">
                    <Actionz
                        transitions={this.state.fsm.transitions()}
                        hidden={this.state.hidden}
                        disabled={this.state.disabled}
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
                         soliloquyRB={soliloquyRB}
                     />
                </div>
            </div>
        );
    }
}

