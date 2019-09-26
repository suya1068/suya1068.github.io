import "./estimate.scss";
import React, { Component, PropTypes } from "react";
import { BUSINESS_MAIN } from "shared/constant/main.const";
import Img from "shared/components/image/Img";

export default class Estimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            backgroundColor: props.backgroundColor,
            portfolio: BUSINESS_MAIN.ESTIMATE_PF
        };
    }

    render() {
        const { backgroundColor } = this.props;
        const { portfolio } = this.state;
        return (
            <div className="biz-estimate biz-panel__dist" style={{ backgroundColor }}>
                <div className="container">
                    <p className="biz-panel__sub" style={{ textAlign: "center", color: "#fff" }}>견적은 어떻게 받아볼 수 있나요?</p>
                    <h3 className="biz-panel__title" style={{ marginBottom: 20, color: "#fff" }}>간단한 상담요청을 통해 상세한 견적을 받아볼 수 있어요.</h3>
                    <div className="biz-estimate__box">
                        <p className="biz-estimate__desc">
                            전문가의 상담을 통해 촬영에 필요한 모든 분야의 세부 견적을 제공해드립니다.<br />
                            상세항목 제공 OK, 비교견적 OK, 견적조율 OK
                        </p>
                        <div className="biz-estimate__content">
                            <div className="content_wrap">
                                <div className="example_st">
                                    <p>견적서 예시</p>
                                </div>
                                <div className="biz-estimate__content-inner fake-estimate">
                                    <div className="fake-estimate__head">
                                        <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/logo_estimate.png`} width="180" />
                                    </div>
                                    <div className="fake-estimate__info">
                                        <p className="font-bold">견적정보</p>
                                        <div className="fake-estimate__table">
                                            <div className="table-row table__head-border">
                                                <span className="table-row__c">항목</span>
                                                <span className="table-row__c">단가</span>
                                                <span className="table-row__c">단위</span>
                                                <span className="table-row__c">금액</span>
                                            </div>
                                            <div className="table-row">
                                                <span className="table-row__c">연출컷 촬영</span>
                                                <span className="table-row__c">50,000원</span>
                                                <span className="table-row__c">20</span>
                                                <span className="table-row__c">1,000,000원</span>
                                            </div>
                                            <div className="table-row">
                                                <span className="table-row__c">누끼컷</span>
                                                <span className="table-row__c">10,000원</span>
                                                <span className="table-row__c">10</span>
                                                <span className="table-row__c">100,000원</span>
                                            </div>
                                            <div className="table-row">
                                                <span className="table-row__c">출장비</span>
                                                <span className="table-row__c">100,000원</span>
                                                <span className="table-row__c">1</span>
                                                <span className="table-row__c">100,000원</span>
                                            </div>
                                            <div className="table-row">
                                                <span className="table-row__c">부가세</span>
                                                <span className="table-row__c">120,000원</span>
                                                <span className="table-row__c">1</span>
                                                <span className="table-row__c">120,000원</span>
                                            </div>
                                            <div className="table-row">
                                                <span className="table-row__c">선 예약 할인</span>
                                                <span className="table-row__c">-120,000원</span>
                                                <span className="table-row__c">1</span>
                                                <span className="table-row__c">-120,000원</span>
                                            </div>
                                            <div className="table-row table__total_price">
                                                <span className="table-row__c">총합</span>
                                                <span className="table-row__c">{}</span>
                                                <span className="table-row__c">{}</span>
                                                <span className="table-row__c table__pink-text">1,200,000원</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fake-estimate__detail">
                                        <p className="font-bold">상세정보</p>
                                        <div className="fake-estimate__table">
                                            <div className="description table__head-border">
                                                작가님과 전문 푸드스타일리스트의 협업으로 진행되는 이번 촬영은 고객사의 매장으로 방문하여<br />
                                                준비시간을 포함 약 5시간 정도 진행될 예정입니다.<br />
                                                음식의 경우 고객사에서 준비, 기타 소품은 작가님께서 준비하며<br />
                                                당일 현장에서 피드백을 거쳐 A컷 선정까지 진행됩니다. 이후 편집을 거쳐 일주일 후 최종본을 받아 보실 수 있습니다.<br />
                                                감사합니다.
                                            </div>
                                        </div>
                                    </div>
                                    <div className="fake-estimate__portfolio">
                                        <p className="font-bold">포트폴리오</p>
                                        <div className="fake-estimate__table">
                                            <div className="portfolio table__head-border">
                                                {portfolio.map((image, idx) => {
                                                    return (
                                                        <div className="image-wrap" key={`estimate_portfolio__${idx}`}>
                                                            <Img image={{ src: image.src, type: "image" }} />
                                                            <div className="artist">
                                                                <p style={{ color: image.color, fontSize: 11, opacity: "0.8" }}>{`by ${image.artist}`}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
