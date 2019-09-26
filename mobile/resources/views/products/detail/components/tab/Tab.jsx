import React, { Component, PropTypes } from "react";
import classNames from "classnames";

export default class Tab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            type: props.type,
            active: props.active
        };
        this.onSelect = this.onSelect.bind(this);
    }

    componentWillMount() {
    }

    onSelect() {
        if (typeof this.props.onSelect === "function") {
            this.props.onSelect(this.props.type, true);
        }
    }

    render() {
        const { active, type } = this.props;
        return (
            <div className={classNames("tab", type, { "active": active })} onClick={this.onSelect}>
                <p className="title">{this.state.title}</p>
            </div>
        );
    }
}
