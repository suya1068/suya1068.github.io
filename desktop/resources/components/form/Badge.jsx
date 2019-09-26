import "./form.scss";
import React, { Component, PropTypes, createElement } from "react";
import classNames from "classnames";

class Badge extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            inline: props.inline
        };
    }

    componentWillMount() {

    }

    componentWillReceiveProps(nextProps) {
        const props = {};

        if (JSON.stringify(nextProps.data) !== JSON.stringify(this.state.data)) {
            props.data = nextProps.data;
        }

        if (JSON.stringify(nextProps.inline) !== JSON.stringify(this.state.inline)) {
            props.inline = nextProps.inline;
        }

        if (Object.keys(props).length > 0) {
            this.setState(props);
        }
    }

    render() {
        const child = [];
        const data = this.state.data;
        const inline = this.state.inline;
        const badgeHide = data.count < 1;
        const inlineClass = inline.className !== undefined ? inline.className : "";

        delete inline.className;

        const props = Object.assign({
            className: classNames("badge-box", badgeHide ? "badge-hide" : "", inlineClass)
        }, inline);

        child.push(<span className="badge" key="badge">{data.count}</span>);
        child.push(this.props.children);

        return createElement("div", props, child);
    }
}

Badge.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    inline: PropTypes.shape([PropTypes.node]),
    children: PropTypes.node
};

Badge.defaultProps = {
    data: {
        count: 0
    },
    inline: {}
};

export default Badge;
