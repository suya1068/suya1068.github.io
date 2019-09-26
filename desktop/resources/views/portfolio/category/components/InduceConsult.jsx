import "./induceConsult.scss";
import React, { Component, PropTypes } from "react";
import Icon from "desktop/resources/components/icon/Icon";
import classNames from "classnames";

export default class InduceConsult extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onCloseInduceConsult = this.onCloseInduceConsult.bind(this);
    }

    onCloseInduceConsult(way = "") {
        if (typeof this.props.onCloseInduceConsult === "function") {
            this.props.onCloseInduceConsult(way);
        }
    }

    render() {
        return (
            <div className={classNames("portfolio__induce__consult__full")}>
                <div className="induce__consult__full__container">
                    <div className="induce__consult__header">
                        <p className="induce__consult__header__title">
                            도움이 필요하신가요?
                        </p>
                        <p className="induce__consult__header__desc">
                            빠른견적신청을 통해 이름과 연락처만 남겨주세요.
                        </p>
                    </div>
                    <div className="induce__consult__content">
                        <div className="induce__consult__content__box">
                            <p className="box_title">견적을<br />받아보고싶어요!</p>
                            <div className="content_icon">
                                <Icon name="estimate_camera" />
                            </div>
                            <p className="box_desc">
                                촬영 견적을 빠르고 상세하게<br />알려드립니다.
                            </p>
                        </div>
                        <div className="induce__consult__content__box">
                            <p className="box_title">촬영에 대한 상담을<br />받아보고싶어요!</p>
                            <div className="content_icon">
                                <Icon name="consult_schedule" />
                            </div>
                            <p className="box_desc">
                                촬영 진행 과정과 예산에 대해<br />꼼꼼하게 상담해 드립니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
