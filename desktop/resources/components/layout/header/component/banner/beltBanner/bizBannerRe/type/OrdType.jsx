import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";

export default class OrdType extends Component {
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

    onConsult() {
        const { CODE } = this.props;
        this.gaEvent("클릭");
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(`pd_b_${CODE.toLowerCase()}`);
        }
    }

    gaEvent(type) {
        const { NAME, external } = this.props;
        let label = `${type}_${NAME}`;

        if (external) {
            label = `N쇼핑${type}_${NAME}`;
        }

        utils.ad.gaEvent("기업_상세", "상세배너B", label);
    }

    render() {
        const { NAME, TITLE, DESC, ICON, mascote } = this.props;
        return (
            <div className="biz_banner_type ord_type">
                <div className="ord_type__content">
                    <p className="ord_type__name">{NAME}촬영</p>
                    <img role="presentation" src={`${__SERVER__.img}${ICON}`} style={{ width: 130, height: 88 }} />
                    <div className="ord_type__text">
                        <p className="title">{TITLE}</p>
                        <p className="desc">{DESC}</p>
                    </div>
                    <div className="ord_type__button" onClick={this.onConsult}>
                        <p>간편견적 신청하기</p>
                    </div>
                </div>
                <div className="ord_type__mascote">
                    <img role="presentation" src={`${__SERVER__.img}${mascote}`} style={{ width: 50, height: 60 }} />
                </div>
            </div>
        );
    }
}
