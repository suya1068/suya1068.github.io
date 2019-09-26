import "./landingSection.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";

export default class LandingSection extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    onLandingMain(pos) {
        const label = pos === "top" ? "포스냅 견적가 확인하러가기 상단" : "포스냅 견적가 확인하러가기 하단";
        utils.ad.gaEvent("M_광고", "촬영비 소재 광고", label);
        location.href = "/products?category=PRODUCT&landing=1";
    }

    render() {
        return (
            <div className="landing__content">
                <div className="landing__content__section">
                    <div className="landing__content__bg first">
                        <div className="bg__first">
                            <img src={`${__SERVER__.img}/landing/20190726/mobile/first_bg.png`} alt="3번째배경" />
                            <div className="first__inner">
                                <div className="landing__content__logo">
                                    <img src={`${__SERVER__.img}/landing/20190726/mobile/logo_2x.png`} alt="포스냅로고" />
                                </div>
                                <p className="section__title jalnan-font bigger">촬영비 가지고 장난치지 않습니다.</p>
                                <p className="section__desc">
                                    상품촬영을 위해 가격 알아보고 계시나요?<br />
                                    스튜디오마다 가격이 너무 다양해서 고민이시죠?
                                </p>
                                <div className="landing__content__btn">
                                    <button className="landing__button first jalnan-font" onClick={() => this.onLandingMain("top")}>포스냅 견적가 확인하러가기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="landing__content__section second-bg">
                    <div className="landing__content__head">
                        <div className="landing__content__logo">
                            <img src={`${__SERVER__.img}/landing/20190726/mobile/logo_2x.png`} alt="포스냅로고" />
                        </div>
                        <div className="landing__content__star">
                            <img src={`${__SERVER__.img}/landing/20190726/mobile/star_2x.png`} alt="별" />
                        </div>
                        <p className="section__title jalnan-font" style={{ marginBottom: 30 }}>
                            포스냅에서<br />
                            촬영비에 대한 고민을 해결해 드리겠습니다.
                        </p>
                    </div>
                    <div className="landing__content__count">
                        <div className="count__content camera">
                            <div className="counting jalnan-font count-1" />
                            <div className="landing-icon camera">
                                <img src={`${__SERVER__.img}/landing/20190726/mobile/icon-camera_2x.png`} alt="카메라아이콘" />
                            </div>
                        </div>
                        <div className="count__content__desc">
                            <p className="count__desc">광고 촬영에 관한 모든 가격을 오픈했습니다.</p>
                        </div>
                    </div>
                    <div className="landing__content__count">
                        <div className="count__content _1156">
                            <div className="counting jalnan-font count-2" />
                            <div className="landing-icon _1156">
                                <img src={`${__SERVER__.img}/landing/20190726/mobile/icon_1156_2x.png`} alt="1156아이콘" />
                            </div>
                        </div>
                        <div className="count__content__desc">
                            <p className="count__desc">매달 1156명이 촬영비를 확인 하고 계십니다.</p>
                        </div>
                    </div>
                    <div className="landing__content__count">
                        <div className="count__content won">
                            <div className="counting jalnan-font count-3" />
                            <div className="landing-icon won">
                                <img src={`${__SERVER__.img}/landing/20190726/mobile/icon_won_2x.png`} alt="원아이콘" />
                            </div>
                        </div>
                        <div className="count__content__desc">
                            <p className="count__desc">포스냅에 방문하셔서 오픈된 포스냅 가격을 확인해보세요.</p>
                        </div>
                    </div>
                </div>
                <div className="landing__content__section">
                    <div className="landing__content__bg">
                        <div className="bg__third">
                            <img src={`${__SERVER__.img}/landing/20190726/mobile/third_bg.png`} alt="3번째배경" />
                            <div className="third__inner">
                                <div className="landing__content__logo">
                                    <img src={`${__SERVER__.img}/landing/20190726/mobile/logo_2x.png`} alt="포스냅로고" />
                                </div>
                                <p className="section__title jalnan-font" style={{ textAlign: "center" }}>촬영가격<br />확인하는 법</p>
                                <div className="third__content">
                                    <div className="third__content__box">
                                        <div className="third__content__box__inner jalnan-font">
                                            <div className="content_row">
                                                <p className="step">01</p>
                                                <p className="desc">아래 포스냅 견적가 확인하러가기 를 클릭하여 포스냅에 방문한다.</p>
                                            </div>
                                            <div className="hr" />
                                            <div className="content_row">
                                                <p className="step">02</p>
                                                <p className="desc">촬영하고자 하는 카테고리를 클릭한다.</p>
                                            </div>
                                            <div className="hr" />
                                            <div className="content_row">
                                                <p className="step">03</p>
                                                <p className="desc">사이트 중간에 있는 견적알아보기에서 원하는 설정을 선택한다.</p>
                                            </div>
                                            <div className="hr" />
                                            <div className="content_row">
                                                <p className="step">04</p>
                                                <p className="desc">촬영비를 확인한다.</p>
                                            </div>
                                            <div className="hr" style={{ marginBottom: 30 }} />
                                        </div>
                                    </div>
                                </div>
                                <div className="landing__content__btn">
                                    <button className="landing__button third jalnan-font" onClick={() => this.onLandingMain("bottom")}>포스냅 견적가 확인하러가기</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
