import "./info_box.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";

export default class InfoBox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            info: props.info,
            is_agree: props.is_agree,
            onChangeHandler: props.onChangeHandler
        };
    }

    render() {
        const { info, is_agree, onChangeHandler } = this.props;
        const agree = is_agree;

        return (
            <div className="contact_res__info-box info-box">
                <div className="info-box__head">
                    {info.AGREE ?
                        <div className={classNames("agree_check", { "agree": is_agree })} onClick={() => onChangeHandler("is_agree", !agree)}>
                            <span className="agree_check__title">안내사항을 확인하였습니다.</span>
                            <div className="agree_check__inner">
                                <div className="check-box" />
                                <span className="agree_check__inner__title">동의합니다.</span>
                            </div>
                        </div> :
                        <p className="agree_check__title" style={{ textAlign: "left" }}>안내사항</p>
                    }
                </div>
                <div className="info-box__content">
                    {info.CONTENT.map((str, idx) => {
                        return (
                            <div className="info-box__content__row" key={`info-box__row__${idx}`}>
                                <p className="info-box__dash">-</p>
                                <p className="info-box__desc">{utils.linebreak(str)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}

InfoBox.propTypes = {
    info: PropTypes.shape([PropTypes.node]).isRequired,
    is_agree: PropTypes.bool,
    onChangeHandler: PropTypes.func.isRequired
};

InfoBox.defaultProps = {
    is_agree: false
};
