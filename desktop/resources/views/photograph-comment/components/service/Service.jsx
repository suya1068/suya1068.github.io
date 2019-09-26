import "./Service.scss";
import React, { Component } from "react";

import Heart from "desktop/resources/components/form/Heart";

class Service extends Component {
    constructor(props) {
        super(props);

        this.state = {
            /**
             * 친절
             * @number
             */
            kind: 5,
            /**
             * 품질
             * @number
             */
            quality: 5,
            /**
             * 서비스
             * @number
             */
            service: 5,
            /**
             * 가격
             * @number
             */
            price: 5,
            /**
             * 소통
             * @number
             */
            talk: 5,
            /**
             * 신뢰
             * @number
             */
            trust: 5
        };

        this.setService = this.setService.bind(this);
        this.createParameters = this.createParameters.bind(this);
    }

    /**
     * 점수를 셋한다.
     * @public
     * @param {string} name
     * @param {string} value
     */
    setService(name, value) {
        this.setState({ [name]: value });
    }

    /**
     * 등록을 위한 데이터를 생성한다.
     * @returns {{kind: (number|*), quality: (number|*), service: (number|*), price: (number|*), talk: (number|*), trust: (number|*)}}
     */
    createParameters() {
        const {
            kind,
            quality,
            service,
            price,
            talk,
            trust
        } = this.state;

        return { kind, quality, service, price, talk, trust };
    }

    render() {
        const {
            kind,
            quality,
            service,
            price,
            talk,
            trust
        } = this.state;

        return (
            <section className="photograph-comment-card" style={{ height: "510px" }}>
                <div className="photograph-comment-card__header">
                    <h5 className="photograph-comment-card-title is-require">
                        <span className="photograph-comment-badge is-require">[필수]</span>서비스 평가
                    </h5>
                </div>
                <div className="photograph-comment-card__body">
                    <div className="photograph-comment-service">
                        <div className="photograph-comment-service__content">
                            <div className="photograph-comment-service-title">친절</div>
                            <div className="form-text">작가님과 대화 중 불편하셨나요?</div>
                        </div>
                        <div className="photograph-comment-service__aside">
                            <Heart count={kind} visibleContent={false} resultFunc={value => this.setService("kind", value)} />
                        </div>
                    </div>
                    <div className="photograph-comment-service">
                        <div className="photograph-comment-service__content">
                            <div className="photograph-comment-service-title">품질</div>
                            <div className="form-text">받아보신 사진은 만족하시나요?</div>
                        </div>
                        <div className="photograph-comment-service__aside">
                            <Heart count={quality} visibleContent={false} resultFunc={value => this.setService("quality", value)} />
                        </div>
                    </div>
                    <div className="photograph-comment-service">
                        <div className="photograph-comment-service__content">
                            <div className="photograph-comment-service-title">서비스</div>
                            <div className="form-text">촬영 시 서비스에 만족하시나요?</div>
                        </div>
                        <div className="photograph-comment-service__aside">
                            <Heart count={service} visibleContent={false} resultFunc={value => this.setService("service", value)} />
                        </div>
                    </div>
                    <div className="photograph-comment-service">
                        <div className="photograph-comment-service__content">
                            <div className="photograph-comment-service-title">가격</div>
                            <div className="form-text">가격은 만족하시나요?</div>
                        </div>
                        <div className="photograph-comment-service__aside">
                            <Heart count={price} visibleContent={false} resultFunc={value => this.setService("price", value)} />
                        </div>
                    </div>
                    <div className="photograph-comment-service">
                        <div className="photograph-comment-service__content">
                            <div className="photograph-comment-service-title">소통</div>
                            <div className="form-text">작가님과의 소통은 만족하시나요?</div>
                        </div>
                        <div className="photograph-comment-service__aside">
                            <Heart count={talk} visibleContent={false} resultFunc={value => this.setService("talk", value)} />
                        </div>
                    </div>
                    <div className="photograph-comment-service">
                        <div className="photograph-comment-service__content">
                            <div className="photograph-comment-service-title">신뢰</div>
                            <div className="form-text">재구매 의향이 있으신가요?</div>
                        </div>
                        <div className="photograph-comment-service__aside">
                            <Heart count={trust} visibleContent={false} resultFunc={value => this.setService("trust", value)} />
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Service;
