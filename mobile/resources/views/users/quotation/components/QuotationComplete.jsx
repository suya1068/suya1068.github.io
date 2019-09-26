import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import RequestJS, { STATE } from "shared/components/quotation/request/QuotationRequest";

class QuotationComplete extends Component {
    constructor(props) {
        super(props);
        this.state = {
            orderNo: RequestJS.getState(STATE.ORDER_NO),
            category: RequestJS.getState("reserve").category,
            isMobile: utils.agent.isMobile()
        };
    }

    componentDidMount() {
        window.scroll(0, 0);
        // this.wcsEvent();
        //utils.ad.wcsEvent("4");
    }

    gaEvent() {
        const { isMobile, orderNo } = this.state;
        // const isMobileStr = isMobile ? "모바일" : "데스크탑";

        const eCategory = "요청서완료페이지카테고리버튼";
        const eAction = "";
        const eLabel = `요청서번호: ${orderNo}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    render() {
        // const isMobile = utils.agent.isMobile();
        // const orderNo = ReqeustJS.getState(STATE.ORDER_NO);
        // const reserve = ReqeustJS.getState("reserve");
        const { orderNo, category } = this.state;
        const categoryName = utils.format.categoryCodeToName(category);
        const categoryCode = category.toLowerCase();
        return (
            <div className="quotation__complete">
                <div className="complete__status">
                    <div className="title">
                        {categoryName}촬영의 견적요청이 완료되었습니다.
                    </div>
                    <div className="content content__caption">
                        {utils.linebreak("작가님들의 견적서가 등록되면 SMS로 알려드려요!\n꼼꼼하게 살펴보시고 원하는 견적서를 선택해 주세요.")}
                    </div>
                    <a className="content content__caption" role="button" onClick={() => this.gaEvent()} href={`/products?category=${category}`}>
                        <i className={`m-icon m-icon-category_${categoryCode}`} />
                        <p className="wrap-likeLink"><span className="likeLink">{categoryName}촬영 포트폴리오 보러가기 &gt;</span></p>
                    </a>
                </div>
                <div className="content__column">
                    <div className="content__column__body">
                        <div className="column__row">
                            <a className="button button-block button__theme__yellow" href="/">메인페이지가기</a>
                        </div>
                        <div className="column__row">
                            <a className="button button-block button__default" href={`/users/estimate/${orderNo}/content`}>나의견적요청 바로가기</a>
                        </div>
                        <div className="column__row">
                            <a className="button button-block button__theme__dark" href="/users/estimate">나의견적요청 리스트 보기</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// <div className="column__box inline__box">
//     <a className="column__row" href={isMobile ? "/users/chat?user_id=help" : "/users/chat/help"}>
//         <div className="row__content direction__row">
//             <span className="m-icon m-icon-doubletalk" /><span className="title">1:1 채팅 문의</span>
//         </div>
//     </a>
//     <div className="column__row hr" />
//     <a className="column__row" href="tel:07050773488">
//         <div className="row__content">
//             <div>
//                 <span className="title yellow">070) 5088-3488</span>
//                 <span className="title">고객센터 연결</span>
//             </div>
//             <span className="content__caption">평일 10:00 ~ 17:00  주말, 공휴일 휴무</span>
//         </div>
//     </a>
//     <div className="column__row hr" />
//     <a className="column__row" href={isMobile ? "kakaoplus://plusfriend/friend/@forsnap" : "https://goto.kakao.com/@forsnap"}>
//         <div className="row__content direction__row">
//             <span className="m-icon m-icon-kakao" /><span className="title">카카오톡 플러스친구</span>
//         </div>
//     </a>
// </div>

export default QuotationComplete;
