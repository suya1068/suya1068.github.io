import React, { Component, PropTypes } from "react";

export default class LikeCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            total_cnt: props.total_cnt
        };
    }
    render() {
        return (
            <div className="users-like__count">
                <p className="like-description">나의관심 작가상품</p>
                <p className="like-count">{this.props.total_cnt}<span>개</span></p>
            </div>
        );
    }
}

LikeCount.propTypes = {
    total_cnt: PropTypes.number.isRequired
};
