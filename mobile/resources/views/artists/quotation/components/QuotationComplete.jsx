import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import ResponseJS, { STATE as RES_STATE } from "shared/components/quotation/response/QuotationResponse";
import RequestJS, { STATE as REQ_STATE } from "shared/components/quotation/request/QuotationRequest";

class QuotationComplete extends Component {
    componentDidMount() {
        window.scroll(0, 0);
    }

    render() {
        const isMobile = utils.agent.isMobile();
        const orderNo = RequestJS.getState(REQ_STATE.ORDER_NO);
        const userId = RequestJS.getState(REQ_STATE.USER_ID);
        const offerNo = ResponseJS.getState(RES_STATE.OFFER_NO);
        const user = auth.getUser();

        if (!user) {
            return null;
        }

        return (
            <div className="quotation__complete">
                <div className="complete__status">
                    <div className="title">
                        견적서 작성이 완료되었습니다.
                    </div>
                    <div className="content content__caption">
                        작성하신 견적서는 촬영요청 리스트의 나의 견적서 보기에서 수정 가능하며, 고객님의 견적서 선택 완료 후에는 수정이 되지 않습니다.
                    </div>
                </div>
                <div className="content__column">
                    <div className="content__column__body">
                        <div className="column__row">
                            <a className="button button-block button__theme__yellow" href={`/artists/chat${isMobile ? `?user_id=${userId}offer_no=${offerNo}` : `/${userId}/offer/${offerNo}`}`}>고객대화방 바로가기</a>
                        </div>
                        <div className="column__row">
                            <a className="button button-block button__default" href={`/artists/estimate/${orderNo}/offer/${offerNo}`}>내 견적서 바로가기</a>
                        </div>
                        <div className="column__row">
                            <a className="button button-block button__theme__dark" href="/artists/estimate/list">촬영요청리스트가기</a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

// <div className="column__box inline__box">
//     <a className="column__row" href={isMobile ? "/artists/chat?user_id=help" : "/artists/chat/help"}>
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
