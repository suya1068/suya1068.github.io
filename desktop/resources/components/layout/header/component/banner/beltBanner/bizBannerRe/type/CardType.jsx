import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";

export default class CardType extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.gaEvent("노출");
    }

    onConsult() {
        const { CODE } = this.props;
        this.gaEvent("클릭");
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(`pd_a_${CODE.toLowerCase()}`);
        }
    }

    gaEvent(type) {
        const { NAME, external } = this.props;
        let label = `${type}_${NAME}`;

        if (external) {
            label = `N쇼핑${type}_${NAME}`;
        }


        utils.ad.gaEvent("기업_상세", "상세배너A", label);
    }

    render() {
        const { NAME, TITLE, DESC, ICON, mascote } = this.props;
        return (
            <div className="biz_banner_type card_type">
                <div className="card_type__content">
                    <div className="left-box">
                        <div className="left-box__icon">
                            <img role="presentation" src={`${__SERVER__.img}${ICON}`} style={{ width: 130, height: 88 }} />
                        </div>
                        <div className="left-box__content">
                            <p className="head">{`${NAME}촬영`}</p>
                            <p className="title">{TITLE}</p>
                            <p className="desc">{DESC}</p>
                        </div>
                    </div>
                    <div className="right-box">
                        <div className="right-box__button" onClick={this.onConsult}>
                            <i className="_icon _icon__yellow_face_mascote" />
                            간편견적 신청하기
                        </div>
                        <div className="right-box__mascote">
                            <img role="presentation" src={`${__SERVER__.img}${mascote}`} style={{ width: 50, height: 60 }} />
                            {/*<i className="_icon _icon__heart_mascote" />*/}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
