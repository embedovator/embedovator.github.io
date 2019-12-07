import React, { Component } from 'react';

function Action(props) {
    return (
        <button className="action" onClick={props.onClick}>
            {props.actionText}
        </button>
    )
}

export default class Game extends Component {
    handleAction() {
        alert("ACTION!")
    }

    render() {
        return (
            <div>
                <Action
                    onClick={this.handleAction}
                    actionText="actionText"
                />

                <Action
                    onClick={() => this.props.onSave()}
                    actionText="Save game?"
                />
            </div>
        );
    }
}