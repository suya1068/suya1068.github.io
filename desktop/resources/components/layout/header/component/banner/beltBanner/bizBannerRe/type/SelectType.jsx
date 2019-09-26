import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";

export default class SelectType extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.gaEvent("노출");
    }

    onConsult(action) {
        const { CODE } = this.props;
        this.gaEvent("클릭", action);
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(`pd_c_${action === "상담" ? "c" : "e"}_${CODE.toLowerCase()}`);
        }
    }

    gaEvent(type, action = "") {
        const { NAME, external, gaEvent } = this.props;
        let label = "";

        if (type === "노출") {
            label = `${type}_상담견적_${NAME}`;

            if (external) {
                label = `N쇼핑${type}_${NAME}`;
            }
        }

        if (action) {
            label = `${type}_${action}_${NAME}`;

            if (external) {
                label = `N쇼핑${type}_${action}_${NAME}`;
            }
        }


        if (typeof gaEvent === "function") {
            gaEvent("상세배너C", label);
        }
    }

    render() {
        const { NAME, TITLE, DESC, ICON, mascote } = this.props;
        return (
            <div className="biz_banner_type select_type">
                <div className="select_type__content">
                    <p className="select_type__name">{NAME}촬영</p>
                    <img role="presentation" src={`${__SERVER__.img}${ICON}`} style={{ width: 130, height: 88 }} />
                    <div className="select_type__text">
                        <p className="title">{TITLE}</p>
                        <p className="desc">{DESC}</p>
                    </div>
                    <div className="select_type__buttons">
                        <div className="button-box" style={{ marginRight: 25 }}>
                            <div className="button-box__inner">
                                <p className="title">{"\"촬영이 처음이에요\""}</p>
                                <p className="desc">상담이 필요합니다.</p>
                                <button className="button-select_type" onClick={() => this.onConsult("상담")}>상담신청</button>
                            </div>
                        </div>
                        <div className="button-box">
                            <div className="button-box__inner">
                                <p className="title">{"\"촬영해봤어요\""}</p>
                                <p className="desc">상세견적이 필요합니다.</p>
                                <button className="button-select_type" onClick={() => this.onConsult("견적")}>견적신청</button>
                            </div>
                        </div>
                        <div className="select_type__mascote">
                            <img role="presentation" src={`${__SERVER__.img}${mascote}`} style={{ width: 50, height: 60 }} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
