import React, { Component, PropTypes } from "react";

export default class PortFolio extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    render() {
        return (
            <div className="estimate-portfolio-page">
                {this.props.children}
            </div>
        );
    }
}
