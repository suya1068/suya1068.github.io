import "./inquireNoneListArtist.scss";
import React, { Component, PropTypes } from "react";
import Panel from "./panel/Panel";

export default class InquireNoneListArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="inquire-none-list">
                <div className="wrap-dashed">
                    <div className="exam-title">
                        <span className="required">[예시]</span>
                        <span className="desc">계산된 견적가로 작가에게 문의하기</span>
                    </div>
                    <Panel dummy />
                </div>
            </div>
        );
    }
}
