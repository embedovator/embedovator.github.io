import React, { Component } from 'react';
import { Helmet } from "react-helmet";

function Action(props) {
    return (
        <button type="button" className="action" onClick={props.onClick}>
            {props.actionText}
        </button>
    )
}

class Dialog extends React.Component {
    createTable = () => {
        let table = []

        // Outer loop to create parent
        for (let i = 0; i < 3; i++) {
            let children = []
            // Inner loop to create children
            // for (let j = 0; j < 5; j++) {
                children.push(<td>{`${this.props.dialog[i]}`}</td>)
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

    // return (
    //     <span>{props.dialog}</span>
    //     // for (let i = 0; i < lines.length; i++) {
            
    //     // }
    // )
}

export default class Game extends Component {
    constructor(props){
        super(props);
        this.state = {
            tick: 0,
            lastActionTick: 0,
            brightness: 30, 
            dialog: ["Can't see.", "Screen is dim."],
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
        const dialog = this.state.dialog[this.state.tick];
        // const dialogView = 

        return (
            <div className="game-area">
                <div className="actions">
                    <Action
                        onClick={this.handleAction}
                        actionText="actionText"
                    />

                    <Action
                        // onClick={() => this.props.onSave()} // eventually handle saving
                        onClick={() => this.handleBrightness(20)}
                        actionText="🔆⬆️"
                    />
                    <Action
                        onClick={() => this.handleBrightness(-20)}
                        actionText="🔆🔽"
                    />
                </div>
                <div className="dialog">
                    <Helmet>
                        <style>{`
                            :root {
                                --primary-lightness: ${this.state.brightness}%;
                                }
                            `}
                        </style>
                    </Helmet>
                     <Dialog 
                         dialog={this.state.dialog}
                     />
                </div>
            </div>
        );
    }
}