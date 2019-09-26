import "./intorduction.scss";
import React, { Component, PropTypes } from "react";
import { Header, Footer, Panel } from "../../components";
import CountUp from "react-countup";
import { strongPoint } from "../../information.const";
import { Link } from "react-router";
import classNames from "classnames";
import API from "forsnap-api";

export default class Introduction extends Component {
    constructor(props) {
        super(props);
        document.title = "포스냅 소개";
        this.state = {
            artist_count: 0,
            portfolio_count: 0,
            slide_images: [
                { no: "01", src: "/introduce/20180419/int_img_02-1.png", alt: "작가와 직접소통" },
                { no: "02", src: "/introduce/20180419/int_img_02-2.png", alt: "상담요청" },
                { no: "03", src: "/introduce/20180419/int_img_02-3.png", alt: "촬영문의" }
            ],
            activeIndex: 0
        };
        this.activeIndex = this.activeIndex.bind(this);
        this.checkActiveIndex = this.checkActiveIndex.bind(this);
        this.getIntroduceData = this.getIntroduceData.bind(this);
    }

    componentDidMount() {
        this.getIntroduceData();
    }

    /**
     * 포스냅소개 데이터를 가져온다.
     */
    getIntroduceData() {
        API.status.getIntroduce()
            .then(response => {
                const data = response.data;
                const artist_count = typeof data.artist_count === "string" ? parseInt(data.artist_count, 10) : data.artist_count;
                const portfolio_count = typeof data.portfolio_count === "string" ? parseInt(data.portfolio_count, 10) : data.portfolio_count;
                this.setState({
                    artist_count,
                    portfolio_count
                });
            });
    }

    /**
     * 인덱스를 저장한다.
     * @param index
     */
    activeIndex(index) {
        if (!this._calledComponentWillUnmount) {
            this.setState({ activeIndex: index });
        }
    }

    checkActiveIndex(index) {
        return index === this.state.activeIndex;
    }

    render() {
        const { slide_images, activeIndex, artist_count, portfolio_count } = this.state;
        return (
            <section>
                <Header image={{ src: "/mobile/introduce/int_top_img.jpg" }}>
                    <h2 className="mobile-information-heading">왜 포스냅인가요?</h2>
                    <p className="mobile-information-description">{`${artist_count || 600}명의 작가와 ${portfolio_count || 1500}개의 포트폴리오로`}<br />
                        언제 어디서든 모든 촬영이 가능합니다.</p>
                    <div className="mobile-information-extra">
                        <div className="regist_artists half">
                            <p className="counting">
                                <CountUp start={artist_count - 200 < 0 ? 0 : artist_count - 200} end={artist_count} duration={2} />
                            </p>
                            <p className="description">등록된 작가</p>
                        </div>
                        <div className="regist_products half">
                            <p className="counting">
                                <CountUp start={portfolio_count - 200 < 0 ? 0 : portfolio_count - 200} end={portfolio_count} duration={2} />
                            </p>
                            <p className="description">등록된 포트폴리오</p>
                        </div>
                    </div>
                </Header>
                <Panel image={{ src: "/mobile/introduce/int_img_01.png" }}>
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">01</p>
                            <p className="mobile-information-panel__heading-desc">간편한 예약방법</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">나에게 맞는 촬영을 손쉽게 찾고 간편하게 예약할 수 있습니다.</p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                <Panel
                    image={{ src: "/mobile/introduce/int_img_02.png" }}
                    slide_images={slide_images}
                    onActiveIndex={this.activeIndex}
                >
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">02</p>
                            <p className="mobile-information-panel__heading-desc">다양한 상품검색</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">원하는 방법으로 상품을 검색하고 예약할 수 있습니다.</p>
                    </div>
                    <div className="mobile-information-panel__content">
                        <div className="mobile-information-panel__content-page" style={{ left: `${activeIndex * -100}%` }}>
                            <div className="mobile-information-panel__content-box">
                                <p className="mobile-information-panel__content-title">1. 작가와 직접소통</p>
                                <p className="mobile-information-panel__content-desc">작가님과 1:1로 직접 소통 가능합니다. 일정, 컨셉, 등 궁금한점을 바로 문의하세요!</p>
                            </div>
                            <div className="mobile-information-panel__content-box">
                                <p className="mobile-information-panel__content-title">2. 상담요청</p>
                                <p className="mobile-information-panel__content-desc">포스냅 담당자가 세부적으로 체크하여 최적의 작가를 빠르게 안내해드립니다.</p>
                            </div>
                            <div className="mobile-information-panel__content-box">
                                <p className="mobile-information-panel__content-title">3. 촬영문의</p>
                                <p className="mobile-information-panel__content-desc">촬영내용을 등록해주시면 원하는 작가님을 찾을때까지 견적으로 받아볼 수 있습니다.</p>
                            </div>
                        </div>
                        <div className="information-dots">
                            <span className={classNames("information-dot", { "active": this.checkActiveIndex(0) })} />
                            <span className={classNames("information-dot", { "active": this.checkActiveIndex(1) })} />
                            <span className={classNames("information-dot", { "active": this.checkActiveIndex(2) })} />
                        </div>
                    </div>
                </Panel>
                <Panel image={{ src: "/mobile/introduce/int_img_01.png" }}>
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">03</p>
                            <p className="mobile-information-panel__heading-desc">안심예약제</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            작가나 스튜디오 사정으로 일방적인 예약취소 발생 시, 단순 환불처리만 하는 것이 아니라 포스냅이 직접 앞장서 고객 불편을 해결해드리는 제도 입니다.<br />
                            포스냅에선 갑작스러운 예약취소 걱정없이 안심하고 예약하세요.
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                <Panel
                    image={{ src: "/mobile/introduce/int_img_04.png" }}
                    float_img={{ src: "/mobile/introduce/int_img_04-1.png", width: "70%", height: "70%", x: -35, y: 70, alt: "에스크로아이콘" }}
                >
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">04</p>
                            <p className="mobile-information-panel__heading-desc">안전한 거래 시스템</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            포스냅은 (주)이니시스의 결제대금 예치서비스인 이니페이 에스크로의 이용사용자로 등록하여 에스크로 서비스를 제공하고 있으며, 귀하의 결제정보의 보안이 최상의 상태로 유지되고 있습니다.
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">
                        {}
                    </div>
                </Panel>
                <Footer>
                    <h1 className="mobile-information-heading">작가로 활동하는 방법이 궁금하신가요?</h1>
                    <div className="mobile-information-description">
                        <Link to={strongPoint.url}>작가로 활동하기 페이지 가기</Link>
                    </div>
                </Footer>
            </section>
        );
    }
}

