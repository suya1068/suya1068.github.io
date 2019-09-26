import React, { Component, PropTypes } from "react";

import { Header, Banner, MainNavigation, Panel, Footer } from "../../components";
import { introduction } from "../../information.const";


// const ServicePolicy = props => {
class ServicePolicy extends Component {
    constructor(props) {
        document.title = "서비스 정책";

        super(props);
        this.state = {};
    }

    render() {
        return (
            <section>
                <Header image={{ src: "/service_policy/20180419/pol_top_img.jpg" }}>
                    <h1 className="information-heading">포스냅 서비스 정책</h1>
                    <p className="information-description">포스냅은 더 나은 서비스 제공을 위해 항상 노력하고 있습니다.</p>
                </Header>
                <MainNavigation />
                <Panel image={{ src: "/service_policy/20180419/pol_img_01.png", className: ["information-image--float"], alt: "회원가입 정책" }}>
                    <h2 className="information-heading">
                        <span className="information-order">01</span> 회원가입 정책
                    </h2>
                    <p className="information-description">
                        포스냅은 사진작가와 고객간의 신뢰와 안전을 위해<br />
                        본인의 유효한 계정으로 가입되어 있는<br />
                        네이버, 페이스북, 카카오를 통한 로그인을 기본 정책으로 가지고 있습니다.
                    </p>
                </Panel>
                <Panel image={{ src: "/service_policy/20180419/pol_img_02.png", className: ["information-image--float"], alt: "작가등록 정책" }}>
                    <h2 className="information-heading">
                        <span className="information-order">02</span> 작가등록 정책
                    </h2>
                    <p className="information-description">
                        사진에 자신 있으신 분은 누구나 포스냅의 사진작가가 될 수 있습니다.<br />
                        회원가입 후 화면 상단의 작가 등록하기 버튼을 통해 작가로 활동이 가능합니다.<br />
                        작가 등록 시 본인 인증과 세금 관련 정보를 입력해야 합니다.<br />
                        이후 본인이 촬영한 사진으로 상품을 등록 할 수 있습니다.<br />
                        상품 사진은 고객이 상품을 판단할 수 있는 중요한 요소 중 하나이므로<br />
                        상품의 성격에 맞는 자신 있는 사진을 등록하는 것이 좋습니다.
                    </p>
                </Panel>
                <Panel image={{ src: "/service_policy/20180419/pol_img_03.png", alt: "상품관리 정책" }}>
                    <h2 className="information-heading">
                        <span className="information-order">03</span> 상품관리 정책
                    </h2>
                    <p className="information-description">
                        포스냅은 상품 사진이 등록될 때 작가의 작품인지에 대한 여부를 확인하고 있으며,<br />
                        포스냅에 등록된 모든 사진은 사진 작가 본인의 작품입니다.<br />
                        간혹 포스냅에서 예약하고 결제한 상품이 실제 상품과 차이가 나거나<br />
                        촬영에 불만이 사항이 생길 수 있으니,<br />
                        사진작가님과 사전에 충분히 상의할 것을 권해드립니다.<br />
                        만약, 사진작가님과 고객님 사이의 의견이 좁혀지지 않을 경우<br />
                        고객센터로 연락을 주시기 바랍니다.
                    </p>
                </Panel>
                <Panel image={{ src: "/service_policy/20180419/pol_img_04.png", className: ["information-image--middle"], alt: "취소와 환불 정책" }}>
                    <h2 className="information-heading">
                        <span className="information-order">04</span> 취소와 환불 정책
                    </h2>
                    <p className="information-description">
                        부득이하게 예약한 상품의 날짜나 시간을 변경해야 하는 경우,<br />
                        작가님과 고객님이 서로 상의하여 내용을 변경하시거나 예약을 취소하시면 됩니다.<br />
                        하지만, 협의가 무산되거나 한쪽의 일방적인 통보로 인해 예약을 취소해야 하는 경우,<br />
                        회사가 정한 규정에 따라 환불이 진행됩니다.<br />
                        이는 사진작가와 고객을 모두 보호하기 위한 포스냅의 정책입니다.<br />
                        우천을 포함한 천재지변으로 인한 날짜변경은 기존 촬영예약일로부터 2주 이내로 가능하며,<br />
                        작가님과 협의 시에는 협의내용으로 변경 가능합니다.<br />
                        날짜 변경 후 예약 취소의 경우 기존 촬영예약일을 기준으로 환불정책이 적용됩니다.<br /><br />
                        <strong>고객 예약 취소의 경우</strong><br />
                        30일 이전 취소 시 : 전액 환불<br />
                        14일 이전 취소 시 : 50% 환불<br />
                        7일 이전 취소 시 : 20% 환불
                    </p>
                </Panel>
                <Panel image={{ src: "/service_policy/20180419/pol_img_05.png", alt: "상품후기 및 평가정책" }}>
                    <h2 className="information-heading">
                        <span className="information-order">05</span> 상품후기 및 평가정책
                    </h2>
                    <p className="information-description">
                        상품후기는 촬영과 사진 전달을 모두 완료한 경우에만 작성이 가능하며,<br />
                        촬영한 사진 중 마음에 드는 사진을 골라 함께 게시할 수 있습니다.<br />
                        고객은 상품후기와 함께 별점으로 상품의 만족도를 평가할 수 있습니다.<br />
                        다른 고객들이 상품을 선택할 수 있는 소중한 자료가 되므로<br />
                        진실된 내용을 작성해야 합니다.
                    </p>
                </Panel>
                <Panel image={{ src: "/service_policy/20180419/pol_img_06.png", alt: "세금계산서 안내" }}>
                    <h2 className="information-heading">
                        <span className="information-order">06</span> 세금계산서 안내
                    </h2>
                    <p className="information-description">
                        포스냅은 중개업체로 세금계산서는 실제 서비스를 제공한 작가님이 발행합니다.<br />
                        세금계산서를 발행해야 하는 경우 대화하기를 통해 작가님에게 발급 가능여부를<br />
                        확인하여야 합니다.<br />
                        현금영수증은 계좌이체 / 무통장입금을 선택하여 서비스를 구매한 경우에<br />
                        발급받으실 수 있습니다.<br />
                        현금영수증은 &#39;개인소득공제용&#39;으로만 사용하실 수 있으며 발급당시 &#39;지출증빙용&#39;을<br />
                        선택하셨더라도 매입세액공제를 받지 못합니다.
                    </p>
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

export default ServicePolicy;
