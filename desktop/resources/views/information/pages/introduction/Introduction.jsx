import React, { Component, PropTypes } from "react";

import { Header, Banner, MainNavigation, Panel, Footer } from "../../components";
import { strongPoint } from "../../information.const";
import classNames from "classnames";
import Buttons from "desktop/resources/components/button/Buttons";
import API from "forsnap-api";

export default class Introduction extends Component {
    constructor(props) {
        super(props);
        document.title = "포스냅 소개";
        this.state = {
            slideImages: [
                { no: "01", src: "/introduce/20180419/int_img_02-1.png", alt: "작가와 직접소통" },
                { no: "02", src: "/introduce/20180419/int_img_02-2.png", alt: "상담요청" },
                { no: "03", src: "/introduce/20180419/int_img_02-3.png", alt: "촬영문의" }
            ],
            activeIndex: 0,
            artist_count: 0,
            portfolio_count: 0
        };
        this.activeIndex = this.activeIndex.bind(this);
        this.isActiveIndex = this.isActiveIndex.bind(this);
    }

    componentDidMount() {
        this.getIntroduceData();
    }

    componentWillUnmount() {

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

    /**
     * 해당 인덱스에 "active" 클래스를 추가한다.
     * @param index
     * @returns {boolean}
     */
    isActiveIndex(index) {
        return this.state.activeIndex === index;
    }

    /**
     * 에스크로 창을 띄운다.
     */
    onEscrow() {
        const windowClone = window;
        windowClone.name = "forsnap";
        windowClone.open("https://mark.inicis.com/mark/escrow_popup.php?mid=MOIforsnap", "escrow", "top=200, left=200, width=500, height=650");
    }

    render() {
        const { slideImages, artist_count, portfolio_count } = this.state;
        return (
            <section>
                <Header
                    image={{ src: "/introduce/20180419/int_top_img.jpg" }}
                    counting={{ artists: { min: artist_count - 200 < 0 ? 0 : artist_count - 200, max: artist_count }, products: { min: portfolio_count - 200 < 0 ? 0 : portfolio_count - 200, max: portfolio_count } }}
                >
                    <h1 className="information-heading">왜 포스냅인가요?</h1>
                    <p className="information-description">{`${artist_count || 600}명의 작가와 ${portfolio_count || 1500}개의 포트폴리오로`}<br />
                        언제 어디서든 모든 촬영이 가능합니다.</p>
                </Header>
                <MainNavigation />
                <Panel image={{ src: "/introduce/20180419/int_img_01.png", alt: "간편한 예약방법" }}>
                    <h2 className="information-heading">
                        <span className="information-order">01</span> 간편한 예약방법
                    </h2>
                    <p className="information-description">
                        나에게 맞는 촬영을 손쉽게 찾고 간편하게 예약할 수 있습니다.
                    </p>
                </Panel>
                <Panel
                    image={{ src: "/introduce/20180419/int_img_02.png", alt: "다양한 상품검색" }}
                    onActiveIndex={this.activeIndex}
                    slide
                    slideImages={slideImages}
                    transform={{ y: -123 }}
                >
                    <h2 className="information-heading">
                        <span className="information-order">02</span> 다양한 상품검색
                    </h2>
                    <p className="information-description">
                        원하는 방법으로 상품을 검색하고 예약할 수 있습니다.
                    </p>
                    <div className="information-slide-text">
                        <div className={classNames("box", { "active": this.isActiveIndex(0) })}>
                            <p className="number-badge">01</p>
                            <div className="text-box">
                                <h3 className="information-slide-text-heading">작가와 직접소통</h3>
                                <p className="information-slide-text-description">
                                    작가님과 1:1로 직접 소통 가능합니다. 일정, 컨셉, 등 궁금한점을 바로 문의하세요!
                                </p>
                            </div>
                        </div>
                        <div className={classNames("box", { "active": this.isActiveIndex(1) })}>
                            <p className="number-badge">02</p>
                            <div className="text-box">
                                <h3 className="information-slide-text-heading">상담요청</h3>
                                <p className="information-slide-text-description">
                                    포스냅 담당자가 세부적으로 체크하여 최적의 작가를 빠르게 안내해드립니다.
                                </p>
                            </div>
                        </div>
                        <div className={classNames("box", { "active": this.isActiveIndex(2) })}>
                            <p className="number-badge">03</p>
                            <div className="text-box">
                                <h3 className="information-slide-text-heading">촬영문의</h3>
                                <p className="information-slide-text-description">
                                    촬영내용을 등록해주시면 원하는 작가님을 찾을때까지 견적을 받아볼 수 있습니다.
                                </p>
                            </div>
                        </div>
                    </div>
                </Panel>
                <Panel image={{ src: "/introduce/20180419/int_img_03.png", alt: "안심예약제" }}>
                    <h2 className="information-heading">
                        <span className="information-order">03</span> 안심예약제
                    </h2>
                    <p className="information-description">
                        작가나 스튜디오 사정으로 일방적인 예약취소 발생 시, 단순 환불처리만 하는 것이<br />
                        아니라 포스냅이 직접 앞장서 고객 불편을 해결해드리는 제도 입니다.<br />
                        포스냅에선 갑작스러운 예약취소 걱정없이 안심하고 예약하세요.
                    </p>
                </Panel>
                <Panel
                    image={{ src: "/introduce/20180419/int_img_04.png", alt: "안전한 거래 시스템" }}
                    floatImg={{ src: "/introduce/20180419/int_img_04-1.png", className: "inner-image-float", position: { x: "-210%", y: "-105%" } }}
                >
                    <h2 className="information-heading">
                        <span className="information-order">04</span> 안전한 거래 시스템
                    </h2>
                    <p className="information-description">
                        포스냅은 (주) 이니시스의 결제대금 예치서비스인 이니페이 에스크로의 이용사용자로<br />
                        등록하여 에스크로 서비스를 제공하고 있으며, 귀하의 결제 정보의 보안이 최상의<br />
                        상태로 유지되고 있습니다.
                    </p>
                    <div className="information-button">
                        <Buttons
                            buttonStyle={{ width: "w276", shape: "round", theme: "fill-dark" }}
                            inline={{ onClick: () => this.onEscrow() }}
                        >에스크로가입사실 확인하기</Buttons>
                    </div>
                </Panel>
                <Footer>
                    <h1 className="information-heading">작가로 활동하는 방법이 궁금하신가요?</h1>
                    <div className="information-description">
                        <a href={strongPoint.url}>작가로 활동하기 페이지 가기</a>
                    </div>
                </Footer>
            </section>
        );
    }
}
