import "./listBox.scss";
import React, { Component, PropTypes } from "react";

export default class ListBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: 95,
            line: props.line
        };
        this.onScroll = this.onScroll.bind(this);
    }

    onScroll(e) {
        const current = e.target;
        const scrollTop = Math.round(current.scrollTop || 0);
        const scrollHeight = current.scrollHeight;
        const height = current.offsetHeight;

        if (scrollTop === (scrollHeight - height)) {
            if (typeof this.props.onMoreScroll === "function") {
                this.props.onMoreScroll(true);
            }
        } else {
            this.props.onMoreScroll(false);
        }
    }

    render() {
        const { height } = this.state;
        const { line } = this.props;
        const exc_height = line === 1 ? 125 : height * line;
        return (
            <div className="photo-list-box-component" style={{ height: exc_height }} onScroll={this.onScroll}>
                {this.props.children}
            </div>
        );
    }
}

ListBox.propTypes = {
    line: PropTypes.number,
    children: PropTypes.node,
    onMoreScroll: PropTypes.func
};

ListBox.defaultProps = {
    line: 1,
    children: undefined,
    onMoreScroll: {}
};

/**
 * properties
 * line - number : 리스트 라인 설정
 */
