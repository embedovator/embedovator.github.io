import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
    AwesomeButton,
    AwesomeButtonProgress,
} from 'react-awesome-button';

import AwesomeButtonStyles from 'react-awesome-button/src/styles/styles.scss'

function Action(props) {
    return (
        <button type="button" className="action" hidden={props.hidden} disabled={props.disabled} onClick={props.onClick}>
            {props.actionText}
        </button>
    )
}

class Inventory extends React.Component {
    createTable = () => {
        if(this.props.show){
            let table = []
            let state = this.props.state;

            if(false){
                for (const [key, value] of Object.entries(state)) {
                    let children = []
                    children.push(<td>OHAI</td>)
                    //    {key}: {value}
                    table.push(<tr>{children}</tr>)
                }
            }
            return table
        }
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
                let hidden = this.props.hidden[transitions[i]];
                let actionDelay = this.props.actionDelay[transitions[i]];
                console.log(actionDelay);
                // if(this.props.actionDelay[`${transitions[i]}`] in window){
                // if(transitions[i] === 'brighten'){
                    // actionDelay = this.props.actionDelay[transitions[i]];
                    // console.log(actionDelay);
                // }
                // else{
                    // console.log("INVALID");
                // }

                if(!hidden)
                {
                    if(actionDelay > 0){
                        children.push(<td>
                            <AwesomeButtonProgress
                                type="secondary"
                                size="large"
                                loadingLabel="patience..."
                                resultLabel=""
                                releaseDelay={0}
                                disabled={this.props.disabled[transitions[i]] ? true : false}
                                onPress={(element, next) => {
                                    this.props.onTransition(transitions[i])
                                    setTimeout(() => {
                                        next()
                                    }, actionDelay)
                                }}
                            >
                                {transitions[i]}
                            </AwesomeButtonProgress>
                        </td>)
                        }
                        else{
                            children.push(<td>
                                <AwesomeButton
                                    size="large"
                                    type="primary"
                                    disabled={this.props.disabled[transitions[i]] ? true : false}
                                    onPress={() => { this.props.onTransition(transitions[i]) }}
                                >
                                    {transitions[i]}
                                </AwesomeButton>
                                </td>)
                            }
                }
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
            workEndTick: 0,
            brightnessTick: 0,
            brightness: 30, 
            dimRate: -0.3, 
            soliloquyRB: new RingBuffer(6),
            hidden: {'team':true, 'a simple search engine':true, 'a humble book store':true, 'a tiny social network':true, 'monetize users': true, 'contribute':true},
            actionDelay: {'code':150, 'brighten':2000, 'code a simple search engine':3500, 'blockstack':9000, 'ethereum':10000, 'bitcoin':11000, 'fix legacy code':4000, 'write more lolcode':500, 'compile':2000, 'add another layer of abstraction':600, 'hire a frontend engineer':1000, 'hire a backend engineer':1100, 'hire an optimization engineer':1200, 'create a simple, modern frontend':4000, 'create a robust backend':5000, 'optimization!':6000, 'monetize users':15000},
            disabled: {},
            engineers: {'frontend':0, 'backend':0, 'optimization':0},
            contributors: 0,
            loan: {'amount': 0, 'interestPct': 30},
            lastState: 'home',
            saveEnabled: false,
            contributeEndTick: 0,
            codeXP: 0,
            money: 0,
            users: 0,
            adoptionRate: 1,
            tippingPoint: false,
            worked: false,
            gameData: 0,

            fsm: new StateMachine({
                init: 'home',
                transitions: [
                    /* Transitions */
                    { name: 'a quiet room', from: 'home', to: 'quiet' },
                    { name: 'work', from: 'home', to: 'work'},
                    { name: 'contribute', from: 'home', to: 'contribute'},
                    { name: 'team', from: 'home', to: 'team' },
                    { name: "code a simple search engine", from: 'work', to: 'work'},
                    { name: "a simple search engine", from: 'work', to: 'search'},
                    // { name: "code a humble book store", from: 'work', to: 'work'},
                    { name: "a humble book store", from: 'work', to: 'book'},
                    // { name: "code a tiny social network", from: 'work', to: 'work'},
                    { name: "a tiny social network", from: 'work', to: 'social'},
                    { name: "code for some BS temp job", from: 'work', to: 'bs' },
                    /* Going back */
                    { name: 'back', from: ['quiet','work','search','book', 'social', 'team', 'bs', 'contribute'], to: 'home' },
                    /* Actions, implemented as state transitions to self */
                    { name: 'brighten', from: 'home', to: 'home' },
                    { name: 'code', from: 'quiet', to: 'quiet' },
                    { name: 'blockstack', from: 'contribute', to: 'contribute' },
                    { name: 'ethereum', from: 'contribute', to: 'contribute' },
                    { name: 'bitcoin', from: 'contribute', to: 'contribute' },
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
                    { name: 'monetize users', from: 'search', to: 'search'},
                ],
                methods: {
                    onBrighten: () => this.handleBrightness(20),
                    onCode: () => this.handleCode(),
                    "onHire a frontend engineer": () => this.handleHire("frontend"),
                    "onHire a backend engineer": () => this.handleHire("backend"),
                    "onHire an optimization engineer": () => this.handleHire("optimization"),
                    "onCode a simple search engine": () => this.handleWork('search'),
                    "onCode a humble book store": () => this.handleWork('book'),
                    "onCode a tiny social network": () => this.handleWork('social'),
                    "onCreate a simple, modern frontend": () => this.handleSearchWork('frontend'),
                    "onCreate a robust backend": () => this.handleSearchWork('backend'),
                    "onOptimization!": () => this.handleSearchWork('optimization'),
                    "onMonetize users": () => this.handleMonetization(),
                    onBlockstack: () => this.handleContribute('blockstack'),
                    onEthereum: () => this.handleContribute('ethereum'),
                    onBitcoin: () => this.handleContribute('bitcoin'),
                }
            }),
        }

        this.tick = this.tick.bind(this);
        this.intervalHandle = setInterval(this.tick, 1000);

        // preserve the initial state in a new object
        console.log("SAVED BASE STATE");
        this.baseState = this.state 

        // Uncomment me for vizualization! Then execute dot -Tps derp.dot -o graph.ps 
        // var visualize = require('javascript-state-machine/lib/visualize');
        // console.log(visualize(this.state.fsm));
    }

    handleContribute(project){
        let loc = this.state.codeXP;
        let soliloquyRB = this.state.soliloquyRB;
        let contributors = this.state.contributors;
        let dimRate = this.state.dimRate;
        let contributeEndTick = this.state.contributeEndTick;
        let tick = this.state.tick;
        let disabled = this.state.disabled;

        switch(project){
            case 'blockstack':
            {
                let locRequirement = 500;
                if(loc >= locRequirement){
                    disabled[project] = true;
                    loc -= locRequirement;
                    // soliloquyRB.enq("Built a really bad game on Blockstack...and had fun!");
                    soliloquyRB.enq("*really bad game on Blockstack goes viral*");
                    contributors += 50;
                }
                else{
                    soliloquyRB.enq("Not enough code..."); 
                    soliloquyRB.enq("Need " + (locRequirement - loc) + " LOC.");
                }
                break;
            }
            case 'ethereum':
            {
                let locRequirement = 5000;
                if(loc >= locRequirement){
                    disabled[project] = true;
                    loc -= locRequirement;
                    soliloquyRB.enq("VB: Thanks for everything you’ve done, dad.");
                    contributors += 1000;
                }
                else{
                    soliloquyRB.enq("Not enough code..."); 
                    soliloquyRB.enq("Need " + (locRequirement - loc) + " LOC.");
                }

                break;
            }
            case 'bitcoin':
            {

                let locRequirement = 50000;
                if(loc >= locRequirement){
                    disabled[project] = true;
                    loc -= locRequirement;
                    contributors += 10000;
                    contributeEndTick = tick;
                }
                else{
                    soliloquyRB.enq("Not enough code..."); 
                    soliloquyRB.enq("Need " + (locRequirement - loc) + " LOC.");
                }
                break;
            }

            default:
            {
                break;
            }
        }

        this.setState({
            soliloquyRB: soliloquyRB,
            codeXP: loc,
            contributors: contributors,
            dimRate: dimRate,
            contributeEndTick: contributeEndTick,
            disabled: disabled,
        })
    }

    handleBSWork(){
        let loc = this.state.codeXP;
        let money = this.state.money;
        let soliloquyRB = this.state.soliloquyRB;
        let worked = this.state.worked;

        const reqLOC = 10;
        const reward = 10;

        if(loc >= reqLOC){
            worked = true;
            money += reward;
            loc -= reqLOC;
            soliloquyRB.enq("Unfulfilling work done. Got $" + reward);
        }
        else {
            soliloquyRB.enq("Not enough code..."); 
            soliloquyRB.enq("Need " + (reqLOC - loc) + " LOC.");
        }
 
        this.setState(
        {
            codeXP: loc,
            money: money,
            soliloquyRB: soliloquyRB,
            worked: worked,
        });
    }

    handleMonetization(){
        let money = this.state.money;
        let monetization = (this.state.users * 5);
        let adoptionRate = this.state.adoptionRate;
        let soliloquyRB = this.state.soliloquyRB;
        let users = this.state.users;

        soliloquyRB.enq("Made $" + monetization + " off of " + users  + " users!");

        money += monetization;

        this.setState({
            money:money,
            adoptionRate: adoptionRate - 10,
            soliloquyRB: soliloquyRB,
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
        let workEndTick = this.state.workEndTick;
        let money = this.state.money;
        let users = this.state.users;
        let brightness = this.state.brightness;
        let dimRate = this.state.dimRate;
        let adoptionRate = this.state.adoptionRate;
        let tippingPoint = this.state.tippingPoint;
        let disabled = this.state.disabled;
        let engineers = this.state.engineers;
        let loan = this.state.loan;
        let hidden = this.state.hidden;
        let contributors = this.state.contributors;
        let loc = this.state.codeXP;
        let contributeEndTick = this.state.contributeEndTick;
        let saveEnabled = this.state.saveEnabled;

        if(tick === 1){
            soliloquyRB.enq("Eyes are tired.");
        }
        else if(tick === 3) {
            soliloquyRB.enq("Screen is dim.");
        }
        else if(tick === 7) {
            soliloquyRB.enq("Can't see.");
        }
        else if(tick === 2){
            saveEnabled = true;
        }

        if(contributors > 0){
            loc += (contributors);

            if(contributeEndTick > 0){
                disabled['brighten'] = true;

                if (tick === (contributeEndTick + 2)) {
                    soliloquyRB.enq("SN: I'm not in this for the glory...son.");
                }
                else if (tick === (contributeEndTick + 5)) {
                    soliloquyRB.enq("SN: I'm here to make a difference.");
                }
                else if (tick === (contributeEndTick + 10)) {
                    soliloquyRB.enq("SN: My eyes are tired now, and I must rest...");
                    dimRate += -3;
                }
                else if (tick === (contributeEndTick + 13)) {
                    soliloquyRB.enq("*" + contributors + " contributors continue BUIDLing*");
                }
            }
        }

        if(engineers !== null){
            for (const [position, count] of Object.entries(engineers)) {
                // const ongoingCost = -0.3;
                const ongoingCost = -5;
                if(count !== 0){
                    if(money > ongoingCost){
                        money += (ongoingCost * count);
                        if(adoptionRate < 0){
                            money += adoptionRate;
                        }
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
        }

        if(loan.amount > 0){
            let annualCost = ((loan.amount) * (loan.interestPct)) / 100; // interest-only payments
            let ongoingCost = annualCost / (52 * 40);
            money -= ongoingCost;
        }

        let userRequirement = ((this.state.engineers['frontend'] > 0) && (this.state.engineers['backend'] > 0) && (this.state.engineers['optimization'] > 0));
        if(userRequirement) {
            users += adoptionRate;
            adoptionRate += 1;
        }
        if(users === 1){
            alert("Got our first user! Time to monetize on them...");
            delete hidden['monetize users'];
        }

        if(users > 10000){
            if(!tippingPoint)
            {
                soliloquyRB.enq("Reached the tipping point for number of users! We can't fail now.");
            }
            tippingPoint = true;
        }

        if(tippingPoint){
            if(users <= 0){
                users = 0;
            }

            if((money <= 0) && (workEndTick === 0)){
                workEndTick = tick;
                disabled['brighten'] = true;
            }

            if (tick === (workEndTick + 3)) {
                soliloquyRB.enq("Can’t pay employees...");
            }
            else if (tick === (workEndTick + 5)) {
                soliloquyRB.enq("...the bank owns everything.");
            }
            else if (tick === (workEndTick + 7)) {
                soliloquyRB.enq("Won't give us any more money.");
            }
            else if (tick === (workEndTick + 10)) {
                soliloquyRB.enq("Lost the trust of the users.");
            }
            else if (tick === (workEndTick + 13)) {
                soliloquyRB.enq("Took advantage of them.");
            }
            else if (tick === (workEndTick + 16)) {
                soliloquyRB.enq("Can’t even afford my electricity bill...");
                soliloquyRB.enq("LPT: Reset the game and try again...this time without ever working!");
                dimRate += -3;
            }
        }

        brightness += dimRate;
        if(brightness <= 0){
            brightness = 0;
        }

        this.setState({
           tick: this.state.tick + 1,
           workEndTick: workEndTick,
           brightnessTick: this.state.brightnessTick + 1,
           dimRate: dimRate,
           brightness: brightness,
           users: users,
           adoptionRate: adoptionRate,
           tippingPoint: tippingPoint,
           money: money,
           codeXP: loc,
           saveEnabled: saveEnabled,
        });
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
        let worked = this.state.worked;

        const reqLOC = 30;
        const reward = 25;

        if(this.state.codeXP >= reqLOC){
            worked = true;
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
            soliloquyRB.enq("...can we make it better?");
            soliloquyRB.enq("Got $" + reward);
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
            worked: worked,
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
        let soliloquyRB = this.state.soliloquyRB;
        let worked = this.state.worked;
        let loc = this.state.codeXP;
        let contributors = this.state.contributors;
        let locRequirement = ((contributors + 1) * 100);
        let hidden = this.state.hidden;
        let reward = 5;


        loc += reward;
        const status= "lines of code: +" + reward;
        soliloquyRB.enq(status);

        if(!worked && (loc >= locRequirement))
        {
            if(contributors > 0)
            {
                contributors += 1;
                soliloquyRB.enq("Another contributor joins the team");
            }
            else
            {
                contributors += 1;
                hidden['work'] = true;
                delete hidden['contribute'];
                alert("A contributor joins the team!");
            }
        }

        this.setState({
            codeXP: loc,
            soliloquyRB: soliloquyRB,
            contributors,
        })
    }

    handleTransition(name){
        if (typeof this.state.fsm[`${name}`] === "function")
        {
            this.state.fsm[`${name}`]();
        }
        else {
            console.log("function '" + name + "' is invalid!");
        }
    }

    saveGame() {
        const { userSession } = this.props
        this.setState({
            lastState: this.state.fsm.state,
        })

        let gameData = this.state;
        let backupFSM = this.state.fsm;
        delete gameData.fsm;
        console.log("Writing gameData: " + JSON.stringify(gameData));
        userSession.putFile('a-dark-room.json', JSON.stringify(gameData));
        this.setState({
            fsm: backupFSM,
        })
    }

    restoreGame() {
        const { userSession } = this.props

        console.log("Reading gameData...");

        userSession.getFile('a-dark-room.json')
            .then((file) => {
                var gameData = JSON.parse(file || '[]')
                console.log("Restore: " + file);
                delete gameData.soliloquyRB; // doesn't like to be restored
                this.setState(gameData);
            })
            .finally(() => {
                console.log("Done restoring");
            })
    }

    resetGame(){
        this.setState(this.baseState);
    }

    componentDidMount() {
        this.restoreGame()
    }

    handleBrightness(brightnessChange) {
        let brightness = this.state.brightness;
        let soliloquyRB = this.state.soliloquyRB;
        let brightnessTick = this.state.brightnessTick;
        let saveEnabled = this.state.saveEnabled;

        if((brightness + brightnessChange) <= 0){
            brightness = 0;
        }
        else if((brightness + brightnessChange) > 100){
            brightness = 100;
        }
        else {
            brightness += brightnessChange;
        }
        soliloquyRB.enq("game saved.")

        this.setState({
            brightness: brightness,
            soliloquyRB: soliloquyRB,
        });

        if(saveEnabled){
            this.saveGame();
        }
    }

    displayEngineers(){
        //TODO: Return table of engineers and other data
    }

    render() {
        const soliloquyRB= this.state.soliloquyRB;
        let users = this.state.users;
        let frontend = this.state.engineers['frontend'];
        let backend = this.state.engineers['backend'];
        let optimization = this.state.engineers['optimization'];
        let contributors = this.state.contributors;
        let tippingPoint = this.state.tippingPoint;
        let loan = this.state.loan;

        return (
            <div className="game-area">
                <div className="game">
                    <button
                        className="btn btn-sm"
                        id="signout-button"
                        onClick={this.props.handleSignOut.bind(this)}
                    >
                        logout
                    </button>
                    <button
                        className="btn btn-sm"
                        id="signout-button"
                        onClick={() => this.resetGame()}
                    >
                        reset
                    </button>
                </div>
                <div className="actions">
                    <Actionz
                        transitions={this.state.fsm.transitions()}
                        hidden={this.state.hidden}
                        disabled={this.state.disabled}
                        onTransition={(name) => this.handleTransition(name)}
                        fsmState={this.state.fsm.state}
                        actionDelay={this.state.actionDelay}
                    />
                    <div className="inventory">
                        <h2>Inventory:</h2>
                        $: {this.state.money}
                        <br></br>
                        lines of code: {this.state.codeXP}
                        <br></br>
                        {(contributors > 0) ? "contributors: " + contributors : ""}
                        <br></br>
                        {frontend > 0 ? "frontend engineer: " + frontend : ""}
                        <br></br>
                        {backend > 0 ? "backend engineer: " + backend : ""}
                        <br></br>
                        {optimization > 0 ? "optimization engineer: " + optimization : ""}
                        <br></br>
                        {(users > 0) || tippingPoint  ? "users: " + users : ""}
                        <br></br>
                        {(loan > 0) ? "loan: $" + loan : ""}
                   </div>
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
                         soliloquyRB={soliloquyRB}
                     />
                </div>
           </div>
            
        );
    }
}

