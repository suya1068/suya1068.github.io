import React, { Component, PropTypes } from "react";

import { Header, Banner, MainNavigation, Panel, Footer } from "../../components";
import { servicePolicy } from "../../information.const";
// import Buttons from "desktop/resources/components/button/Buttons";
// import PopModal from "shared/components/modal/PopModal";
// import ApplyConsulting from "shared/components/consulting/register/ApplyConsulting";
// import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
// import cookie from "forsnap-cookie";

class ServiceGuide extends Component {
// const ServiceGuide = props => {
    constructor(props) {
        document.title = "이용 안내";

        super(props);
        this.state = {
            slideImages: [
                { no: "01", src: "/service_guide/20180419/gui_img_03-1.png", alt: "예약상품1" },
                { no: "02", src: "/service_guide/20180419/gui_img_03-2.png", alt: "예약상품2" }
            ]
        };
    }

    /**
     * 상담신청하기 팝업
     */
    // onConsult() {
        // const is_enter = cookie.getCookies("ENTER") && sessionStorage.getItem("ENTER");
        // const modal_name = "personal_consult";
        // const options = {
        //     className: "personal-consult"
        // };
        // const consult_component = <PersonalConsult device_type="pc" access_type="information" />;
        // if (is_enter) {
        //     consult_component = <ApplyConsulting name={modal_name} deviceType="pc" accessType="information" />;
        //     options.className = modal_name;
        //     options.modal_close = false;
        // }
        // PopModal.createModal(modal_name, consult_component, options);
        // PopModal.show(modal_name);
    // }

    render() {
        const { slideImages } = this.state;
        return (
            <section>
                <Header image={{ src: "/service_guide/20180419/gui_top_img.jpg" }}>
                    <h1 className="information-heading">포스냅은 처음이신가요?</h1>
                    <p className="information-description">포스냅은 안전하고 편리한 촬영예약시스템을 제공합니다.</p>
                </Header>
                <MainNavigation />
                <Panel image={{ src: "/service_guide/20180419/gui_img_01.png", alt: "1초 회원가입" }}>
                    <h2 className="information-heading">
                        <span className="information-order">01</span> 1초 회원가입
                    </h2>
                    <p className="information-description" style={{ fontSize: "15px" }}>
                        별도의 회원가입 없이 네이버, 페이스북, 카카오톡으로 로그인 가능합니다.
                    </p>
                </Panel>
                <Panel image={{ src: "/service_guide/20180419/gui_img_02.png", alt: "간편한 예약과정" }}>
                    <h2 className="information-heading">
                        <span className="information-order">02</span> 간편한 예약과정
                    </h2>
                    <p className="information-description">
                        1. 상담요청, 견적요청, 1:1문의 등을 통해 예약조율<br />
                        2. 상품상세 혹은 대화하기 내의 결제버튼을 통해 예약확정<br />
                        3. 촬영 완료 후 결과물 전달, 전문가 평가
                    </p>
                </Panel>
                <Panel
                    image={{ src: "/service_guide/20180419/gui_img_03.png", alt: "고객님의 높은 만족도" }}
                    slide
                    slideImages={slideImages}
                    transform={{ y: -148 }}
                >
                    <h2 className="information-heading">
                        <span className="information-order">03</span> 고객님의 높은 만족도
                    </h2>
                    <p className="information-description">
                        포스냅의 회원이라면 누구나 작가 등록하기 후 상품 업로드가 가능합니다.<br />
                        단, 마켓의 성격에 맞지 않거나 부적절한 콘텐츠가 상품에 포함되어 있을 경우<br />
                        상품 노출이 반려되며, 노출 거절 사유는 작가페이지의 대화하기 화면에서 확인이 가능합니다.<br />
                        포스냅의 상품등록 양식에 맞춰 상품을 수정할 경우 상품 재노출을 요청할 수 있습니다.
                    </p>
                </Panel>
                {/*<Panel*/}
                {/*image={{ src: "/service_guide/20180419/gui_img_04.png", alt: "포스냅 담당자의 상담을 받기" }}*/}
                {/*floatImg={{ src: "/service_guide/20180419/gui_img_04-1.png", className: "inner-image-float", position: { x: "25px", y: "-85px" } }}*/}
                {/*>*/}
                {/*<h2 className="information-heading">*/}
                {/*<span className="information-order">04</span> 포스냅 담당자의 상담을 받기*/}
                {/*</h2>*/}
                {/*<p className="information-description">*/}
                {/*촬영이 처음이시거나, 작가님을 추천받고 싶은신 경우<br />*/}
                {/*포스냅 담당자의 상담을 받으실 수 있습니다.<br />*/}
                {/*친절한 담당장님의 목소리가 궁금하시다면!*/}
                {/*</p>*/}
                {/*<div className="information-button">*/}
                {/*<Buttons*/}
                {/*buttonStyle={{ width: "w179", shape: "round", theme: "fill-dark" }}*/}
                {/*inline={{ onClick: () => this.onConsult() }}*/}
                {/*>상담요청하기</Buttons>*/}
                {/*</div>*/}
                {/*</Panel>*/}
                <Footer>
                    <h1 className="information-heading">서비스 정책에 대해 궁금하신가요?</h1>
                    <div className="information-description">
                        <a href={servicePolicy.url}>서비스 정책 페이지 가기</a>
                    </div>
                </Footer>
            </section>
        );
    }
}

export default ServiceGuide;
