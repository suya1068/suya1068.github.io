import React, { Component, PropTypes } from "react";

import Auth from "forsnap-authentication";
import redirect from "forsnap-redirect";

import Buttons from "desktop/resources/components/button/Buttons";
import { Header, Banner, MainNavigation, Panel, Footer } from "../../components";
import { introduction, registerArtist } from "../../information.const";
import PopModal from "shared/components/modal/PopModal";
import PopupCalculatePrice from "shared/components/popup/PopupCalculatePrice";

class StrongPoint extends Component {
    constructor(props) {
        super(props);

        document.title = "작가로 활동하기";
        const session = Auth.getUser();

        this.state = {
            isLogin: session && session.apiToken,
            isArtist: session && session.data.is_artist
        };

        this.onClickToRedirect = this.onClickToRedirect.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
    }

    onClickToRedirect() {
        redirect.registArtist();
    }

    onCalculate() {
        const modalName = "popup-calculate";
        PopModal.createModal(modalName, <PopupCalculatePrice />, { className: "popup__calculate__price", modal_close: false });
        PopModal.show(modalName);
    }

    onMouseEnter(e) {
        const target = this.extraInformation;
        target.style.visibility = "visible";
        target.style.transition = "visibility 0.2s ease";
    }

    onMouseLeave(e) {
        const target = this.extraInformation;
        target.style.visibility = "hidden";
    }

    render() {
        const { isArtist } = this.state;

        return (
            <section>
                <Header image={{ src: "/strong_point/20180419/str_top_img.jpg" }}>
                    <h1 className="information-heading">작가님들의 성공에<br />포스냅이 함께 합니다.</h1>
                    <p className="information-description">새로운 가능성으로 초대합니다.</p>
                    {
                        !isArtist &&
                            <Buttons
                                buttonStyle={{ width: "w179", shape: "circle", theme: "fill-emphasis" }}
                                inline={{ onClick: this.onClickToRedirect }}
                            >작가 등록하기</Buttons>
                    }
                </Header>
                <MainNavigation />
                <Panel image={{ src: "/strong_point/20180419/str_img_01.png", alt: "작가등록 및 이용비용 무료" }}>
                    <h2 className="information-heading">
                        <span className="information-order">01</span> 작가등록 및 이용비용 무료
                    </h2>
                    <p className="information-description">
                        상품등록, 촬영 예약, 스케쥴관리, 사진전달까지<br />
                        촬영에 필요한 모든 시스템 이용비용이 무료입니다.
                    </p>
                </Panel>
                <Panel image={{ src: "/strong_point/20180419/str_img_02.png", alt: "마케팅 대행 서비스" }}>
                    <h2 className="information-heading">
                        <span className="information-order">02</span> 마케팅 대행 서비스
                    </h2>
                    <p className="information-description">
                        포스냅에 상품을 등록하시면 네이버 쇼핑, 다음 쇼핑에 자동등록되며<br />
                        베스트 상품의 경우 보도자료, 페이스북, 인스타그램 등에 소개됩니다.
                    </p>
                </Panel>
                <Panel image={{ src: "/strong_point/20180419/str_img_03.png", alt: "합리적인 수수료" }}>
                    <h2 className="information-heading">
                        <span className="information-order">03</span> 촬영수수료 0%
                    </h2>
                    <p className="information-description">
                        고객과 작가님 모두의 행복한 촬영을 위해<br />
                        포스냅에서는 촬영 수수료가 0%입니다.
                        {/*판매 가격에 따른 수수료 <span className="question" onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>?</span><br />*/}
                        {/*20% : 판매금액 50만원 이하 (≤ 50만원)<br />*/}
                        {/*10% : 판매금액 50만원 초과~100만원 이하 (≤100만원)<br />*/}
                        {/*5% : 판매금액 100만원 초과 (&gt; 100만원)*/}
                        {/*<span className="extra-information" ref={ref => (this.extraInformation = ref)}>*/}
                        {/*<span className="left-arrow" />*/}
                        {/*수수료 예시)판매금액이 80만원인 경우 작가정산금액은 67만원입니다.<br />*/}
                        {/*50만원에 대한 수수료 20% ⇒ 작가정산금액 40만원<br />*/}
                        {/*30만원에 대한 수수료 10% ⇒ 작가정산금액 27만원*/}
                        {/*</span>*/}
                    </p>
                    {/*<div className="information-button">*/}
                    {/*<Buttons*/}
                    {/*buttonStyle={{ width: "w179", shape: "round", theme: "fill-dark" }}*/}
                    {/*inline={{ onClick: () => this.onCalculate() }}*/}
                    {/*>수수료 계산기</Buttons>*/}
                    {/*</div>*/}
                </Panel>
                <Footer>
                    <h1 className="information-heading">포스냅에 대해 궁금하신가요?</h1>
                    <div className="information-description">
                        <a href={introduction.url}>포스냅 소개 페이지 가기</a>
                    </div>
                </Footer>
            </section>
        );
    }
}

export default StrongPoint;
