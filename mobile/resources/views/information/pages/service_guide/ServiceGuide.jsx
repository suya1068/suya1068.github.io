import React, { Component, PropTypes } from "react";
import { Header, Footer, Panel } from "../../components";
import { servicePolicy } from "../../information.const";
import { Link } from "react-router";
// import PopModal from "shared/components/modal/PopModal";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";

export default class ServiceGuide extends Component {
    constructor(props) {
        super(props);
        document.title = "이용안내";
        this.state = {
            slide_images: [
                { no: "01", src: "/service_guide/20180419/gui_img_03-1.png", alt: "예약상품1" },
                { no: "02", src: "/service_guide/20180419/gui_img_03-2.png", alt: "예약상품2" }
            ]
        };
    }

    // onConsult() {
    //     const modal_name = "personal_consult";
    //     const consult_data = {};
    //
    //     PopModal.createModal(modal_name, <PersonalConsult {...consult_data} device_type="mobile" access_type="information" />, { className: modal_name });
    //     PopModal.show(modal_name);
    // }

    render() {
        const { slide_images } = this.state;
        return (
            <section>
                <Header image={{ src: "/mobile/service_guide/gui_top_img.jpg" }}>
                    <h1 className="mobile-information-heading">포스냅은 처음이신가요?</h1>
                    <p className="mobile-information-description">포스냅은 안전하고 편리한 촬영예약시스템을 제공합니다.</p>
                </Header>
                <Panel image={{ src: "/mobile/service_guide/gui_img_01.png" }}>
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">01</p>
                            <p className="mobile-information-panel__heading-desc">1초 회원가입</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            별도의 회원가입 없이 네이버, 페이스북, 카카오톡으로 로그인 가능합니다.
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                <Panel image={{ src: "/mobile/service_guide/gui_img_02.png" }}>
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">02</p>
                            <p className="mobile-information-panel__heading-desc">간편한 예약과정</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            1. 상담요청, 견적요청, 1:1문의등을 통해 예약조율<br />
                            2. 상품상세 혹은 대화하기 내의 결제버튼을 통해 예약확정<br />
                            3. 촬영 완료 후 결과물 전달, 전문가 평가
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                <Panel
                    image={{ src: "/mobile/service_guide/gui_img_03.png" }}
                    slide_images={slide_images}
                >
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">03</p>
                            <p className="mobile-information-panel__heading-desc">고객님의 높은 만족도</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            실제 상품을 구매한 고객만이 남길 수 있는 후기와 별점 시스템이<br />
                            믿을 수 있는 상품을 예약할 수 있게 도와줄거에요.<br />
                            두근두근, 설레는 촬영을 시작하세요!
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                {/*<Panel*/}
                {/*image={{ src: "/mobile/service_guide/gui_img_04.png" }}*/}
                {/*float_img={{ src: "/mobile/service_guide/gui_img_04-1.png", alt: "상담신청버튼아이콘", x: 180, y: 120 }}*/}
                {/*>*/}
                {/*<div className="mobile-information-panel__heading">*/}
                {/*<h2 className="mobile-information-panel__heading-title">*/}
                {/*<p className="mobile-information-panel__heading-no">04</p>*/}
                {/*<p className="mobile-information-panel__heading-desc">포스냅 담당자의 상담을 받기</p>*/}
                {/*</h2>*/}
                {/*<p className="mobile-information-panel__heading-content">*/}
                {/*촬영이 처음이시거나, 작가님을 추천받고 싶으신 경우<br />*/}
                {/*포스냅 담당자의 상담을 받으실 수 있습니다.<br />*/}
                {/*친절한 담당자님의 목소리가 궁금하시다면!*/}
                {/*</p>*/}
                {/*</div>*/}
                {/*<div className="mobile-information-panel__content">*/}
                {/*<button*/}
                {/*style={{ padding: "0.5rem 2rem" }}*/}
                {/*className="button button__theme__dark button__rect"*/}
                {/*onClick={this.onConsult}*/}
                {/*>상담요청 하기</button>*/}
                {/*</div>*/}
                {/*</Panel>*/}
                <Footer>
                    <h1 className="mobile-information-heading">서비스 정책에 대해 궁금하신가요?</h1>
                    <div className="mobile-information-description">
                        <Link to={servicePolicy.url}>서비스 정책 페이지 가기</Link>
                    </div>
                </Footer>
            </section>
        );
    }
}

