import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import classNames from "classnames";
import API from "forsnap-api";
import cookie from "forsnap-cookie";
import auth from "forsnap-authentication";

import Information from "./components/information/Information";
import PortfolioList from "./components/list/PortfolioList";

import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import * as EstimateSession from "mobile/resources/views/products/list/open/extraInfoSession";
import PopModal from "shared/components/modal/PopModal";
import {
    ADVICE_EXTRA_TEXT,
    PROPERTYS,
    RECOMMEND_ACCESS_TYPE
} from "mobile/resources/views/products/list/open/virtual_estimate/virtual_estimate.const";
import * as virtualEstimateHelper from "mobile/resources/views/products/list/open/virtual_estimate/virtualEstimateHelper";
import VirtualEstimate from "mobile/resources/views/products/list/open/virtual_estimate/VirtualEstimate";
import PopArtistReview from "mobile/resources/views/products/list/open/pop/review/PopArtistReview";
import FirstPhase from "../popup/message/FirstPhase";
import PopupSendChat from "../popup/PopupSendChat";
import UserCheck from "shared/helper/UserCheck";

export default class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            videos: props.videos,
            images: props.images,
            information: props.information,
            active_index: props.active_index,
            axis_type: props.axis_type,
            category: props.category,
            ext_page: props.ext_page,
            chargeArtistNo: props.chargeArtistNo,
            // 추천작가 대비 데이터
            device_type: "mobile",
            agent: cookie.getCookies("FORSNAP_UUID"),
            recommendParams: {},
            form: {},
            totalPrice: "",
            hasAlphas: false,
            self_review: null,
            renewDetail: props.renewDetail
        };
        this.UserCheck = new UserCheck();
        this.onClose = this.onClose.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onShowSlider = this.onShowSlider.bind(this);
        // 추천작가 작업
        // interaction
        this.onConsultArtist = this.onConsultArtist.bind(this);
        this.onShowVirtualEstimate = this.onShowVirtualEstimate.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.onShowConsultModal = this.onShowConsultModal.bind(this);
        // this.onConsultOur = this.onConsultOur.bind(this);
        // external event call
        this.externalEventBox = this.externalEventBox.bind(this);
        // api
        this.callAPIInsertArtistOrders = this.callAPIInsertArtistOrders.bind(this);
        this.callAPIInsertOrderEstimate = this.callAPIInsertOrderEstimate.bind(this);
        // etc
        this.init = this.init.bind(this);
        this.onShowReview = this.onShowReview.bind(this);
        this.onReceiveArtistData = this.onReceiveArtistData.bind(this);
        this.checkPhone = this.checkPhone.bind(this);
        this.onChat = this.onChat.bind(this);
        this.receiveTotalPrice = this.receiveTotalPrice.bind(this);
    }

    componentWillMount() {
        const { information, category } = this.props;
        if (category && utils.checkCategoryForEnter(category)) {
            this.onReceiveArtistData(information.artist_id, information.product_no);
        }
    }

    componentDidMount() {
        this.checkPhone();
        this.getSessionReferer();
    }

    componentWillUnmount() {

    }

    /**
     * 로그인 확인
     * @return Object - 유저정보
     */
    isUser(isAlert = true) {
        const user = auth.getUser();

        if (!user) {
            if (isAlert) {
                PopModal.alert("로그인 후 이용해주세요");
            }

            return false;
        }

        return user;
    }

    /**
     * 유저 핸드폰, 이메일 존재여부 체크
     * @param isProgress - bool (프로그래스 표시 여부)
     * @return {Promise.<T>}
     */
    checkPhone() {
        return new Promise((resolve, reject) => {
            const user = this.isUser(false);
            if (user) {
                API.users.find(user.id).then(response => {
                    if (response.status === 200) {
                        const data = response.data;
                        this.setState({
                            name: data.name || "",
                            phone: data.phone || "",
                            email: data.email || ""
                        }, () => {
                            resolve({
                                status: true,
                                phone: data.phone || "",
                                email: data.email || ""
                            });
                        });
                    } else {
                        resolve({ status: false });
                    }
                }).catch(error => {
                    resolve({ status: false, error });
                });
            } else {
                resolve({ status: false });
            }
        });
    }

    getSessionReferer() {
        if (sessionStorage) {
            const referParam = {};
            if (sessionStorage.getItem("referer")) {
                referParam.referer = sessionStorage.getItem("referer");
            }

            if (sessionStorage.getItem("referer_keyword")) {
                referParam.referer_keyword = sessionStorage.getItem("referer_keyword");
            }

            this.setState({
                referParam
            });
        }
    }

    onShowSlider(idx) {
        if (typeof this.props.onShowSlider === "function") {
            this.props.onShowSlider(idx);
        }
    }

    onClose() {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    onReceiveArtistData(user_id, product_no) {
        const params = {
            user_id
        };

        if (product_no) {
            params.product_no = product_no;
        }

        API.artists.getArtistsIntroPublicNew(params)
            .then(response => {
                const data = response.data;
                this.setState({
                    review: data.review,
                    self_review: data.self_review
                });
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });
    }

    receiveTotalPrice(price) {
        this.setState({ totalPrice: price });
    }

    /**
     * 견적산출 컴포넌트 팝업 띄우기
     */
    onShowVirtualEstimate() {
        const { category, chargeArtistNo } = this.props;
        const modalName = "virtual_estimate_modal";
        let action = "견적확인";
        if (chargeArtistNo) {
            action = "유료_포폴_견적버튼";
        }
        this.gaEvent(action);
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <VirtualEstimate
                    gaEvent={this.gaEvent}
                    onConsultSearchArtist={() => this.onConsult(RECOMMEND_ACCESS_TYPE.DETAIL_ADD.CODE)}
                    onConsultEstimate={this.onConsultEstimate}
                    receiveTotalPrice={this.receiveTotalPrice}
                    onClose={() => Modal.close()}
                    init={this.init}
                    detailPage
                    modalName={modalName}
                    category={category}
                />
            )
        });
    }

    init() {
        this.setState({
            //agent: "",
            estimate_no: "",
            // form: {},
            // hasAlphas: false,
            // recommendData: {},
            totalPrice: ""
        });
    }

    /**
     * ga이벤트
     * @param action
     */
    gaEvent(action) {
        const category = this.props.category;
        const { information } = this.state;

        if (action !== "상담먼저") {
            utils.ad.gaEvent("M_기업_상세", action, `${utils.format.categoryCodeToName(category)}_${information.artist_name}_${information.product_no}`);
        }
    }

    /**
     * 견적을 산출한다.
     * @param form
     * @param agent
     * @param category
     * @param hasAlphas
     * @param total_price
     */
    onConsultEstimate({ form, agent, category, hasAlphas, totalPrice }) {
        const { device_type } = this.state;
        // form 데이터를 복사한다.
        const _form = Object.assign({}, form);

        // 복사한 객체에 sub_code가 존재하는지 체크
        if (Object.prototype.hasOwnProperty.call(_form, "sub_code")) {
            // sub_code를 제거한다.
            delete _form.sub_code;
        }

        if (totalPrice) {
            _form.total_price = hasAlphas ? `${totalPrice}+a` : totalPrice;
        }

        // 견적산출 파라미터 설정
        const params = {
            extra_info: JSON.stringify({ ..._form }),
            agent,
            category,
            device_type
        };

        if (totalPrice) {
            // total_price 값이 존재하면 견적산출 api를 호출한다.
            this.callAPIInsertOrderEstimate(params, { form: _form, totalPrice, hasAlphas, agent });
        }

        // 견적정보를 state에 저장한다.
        this.setState({
            form,
            agent,
            totalPrice,
            hasAlphas
        });
    }

    /**
     * 견적산출 api를 호출합니다.
     * @param params
     * @param form
     * @param totalPrice
     * @param hasAlphas
     * @param agent
     */
    callAPIInsertOrderEstimate(params, { form, totalPrice, hasAlphas, agent }) {
        virtualEstimateHelper.apiInsertOrderEstimate(params)
            .then(response => {
                const data = response.data;

                const recommendParams = this.createRecommendArtistParams({ form, totalPrice, hasAlphas, agent });
                recommendParams.estimate_no = response.data.estimate_no;
                EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, recommendParams);

                this.setState({
                    estimate_no: data.estimate_no,
                    recommendParams
                });
            })
            .catch(error => {
                PopModal.alert(error.data ? error.data : "견적을 산출하는데 오류가 발생했습니다.\n문제가 지속될 경우 고객센터에 문의해 주세요.");
            });
    }

    /**
     * 작가상담 파라미터 생성
     * @param form
     * @param total_price
     * @param hasAlphas
     * @returns {{agent: *, category: string, extra_info: string, extra_text: string}}
     */
    createRecommendArtistParams({ form, total_price, hasAlphas }) {
        const { agent } = this.state;
        const category = this.props.category ? this.props.category.toUpperCase() : "";
        const _form = Object.assign({}, form);
        const user = auth.getUser();
        if (total_price) {
            _form.total_price = hasAlphas ? `${total_price}+a` : total_price;
        }

        if (_form.sub_code) {
            delete _form.sub_code;
        }

        // 코드에서 한글로 치환
        const exchangeCodeToText = this.exchangeCodeToText(form);

        const params = {
            agent,
            category,
            extra_info: JSON.stringify(form),
            extra_text: JSON.stringify(exchangeCodeToText)
        };

        if (user) {
            params.user_id = user.id;
        }

        return { ...params };
    }

    /**
     * extra_info 데이터를 한글로 치환합니다.
     * @param form
     * @returns {{}}
     */
    exchangeCodeToText(form) {
        return Object.keys(form).reduce((result, key) => {
            const keyUpperCase = key.toUpperCase();
            const formKeyUpperCase = typeof form[key] === "string" ? form[key].toUpperCase() : form[key];
            let value = Object.prototype.hasOwnProperty.call(ADVICE_EXTRA_TEXT, formKeyUpperCase) ? ADVICE_EXTRA_TEXT[formKeyUpperCase].NAME : form[key];

            // key가 video_length 이면 텍스트를 치환한다.
            if (key === PROPERTYS.VIDEO_LENGTH.CODE) {
                switch (value) {
                    case "1": value = "1분미만"; break;
                    case "2": value = "1분~3분"; break;
                    case "3": value = "3분~5분"; break;
                    case "4+a": value = "5분이상"; break;
                    default: value = form[key]; break;
                }
            }

            return Object.assign(result, { [PROPERTYS[keyUpperCase].NAME]: value });
        }, {});
    }

    /**
     * 작가에게 먼저 상담하기 버튼 클릭
     */
    onConsultArtist() {
        const { category, chargeArtistNo } = this.props;
        let action = "연락요청";
        if (chargeArtistNo) {
            action = "유료_포폴_상담버튼";
        }
        this.gaEvent(action);

        const { device_type, totalPrice, information } = this.state;
        const estimateData = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        const p = {
            access_type: RECOMMEND_ACCESS_TYPE.DETAIL.CODE,
            device_type,
            category,
            ...estimateData
        };

        if (information.product_no) {
            p.product_no = information.product_no;
        }

        if (information.artist_id) {
            p.artist_id = information.artist_id;
        }


        // 견적미산출 시 견적정보 삭제
        if (!totalPrice) {
            delete p.extra_info;
            delete p.extra_text;
        }

        // 상담신청 모달창 띄우기
        this.onShowConsultModal(p);
    }

    /**
     * 외부 이벤트 호출
     */
    externalEventBox() {
        utils.ad.wcsEvent("4");
        utils.ad.gtag_report_conversion(location.href);
        utils.ad.gaEvent("기업고객", "상담전환");
        utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    /**
     * 상담신청 모달창 띄우기
     * @param parameter
     */
    onShowConsultModal(parameter) {
        const { crc } = this.props;
        const { information } = this.state;
        const modalName = "simple__consult";
        Modal.close();

        PopModal.createModal(
            modalName,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({}, data, {
                        ...parameter
                    });
                    PopModal.progress();
                    this.callAPIInsertArtistOrders(params);
                }}
                nickName={information.artist_name}
                requestAbleCount={3 - crc}
                isTypeRecommendArtist
                onClose={() => PopModal.close(modalName)}
            />,
            {
                modal_close: false,
                className: modalName
            }
        );
        PopModal.show(modalName);
    }

    addRecommendPhase(params, modalName) {
        const { onShowChargeArtist } = this.props;
        PopModal.close(modalName);

        if (typeof onShowChargeArtist === "function") {
            let at = "";
            const title = "전달이 완료되었습니다.";
            const desc = "다른작가님에게도 촬영안내를 받아보세요.";

            switch (params.access_type) {
                case "detail":
                    at = "detail_add_consult";
                    break;
                case "detail_add":
                    at = "detail_add_estimate";
                    break;
                default:
                    break;
            }

            onShowChargeArtist(title, desc, Object.assign({}, params, { access_type: at }));
        }
    }

    /**
     * 작가상담 신청 api 호출 및 응답 처리
     * @param params
     * @param modalName
     */
    callAPIInsertArtistOrders(params, modalName) {
        const { chargeMaxCount, crc } = this.props;

        if (chargeMaxCount - crc === 0) {
            PopModal.closeProgress();
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: <p>포스냅에서는 최대 3명의 작가님께<br />견적 및 상담 신청이 가능합니다.<br />추가문의를 원하시는 경우 포스냅 전문가 상담<br />혹은 고객센터로 문의내용을 접수해주세요.</p>,
                onSubmit: () => {
                    PopModal.close(modalName);
                }
            });
        } else {
            const { referParam } = this.state;
            const _params = Object.assign({}, params);
            if (!utils.type.isEmpty(referParam)) {
                Object.assign(_params, referParam);
            }

            virtualEstimateHelper.apiInsertArtistOrder(_params)
                .then(response => {
                    PopModal.closeProgress();
                    // setCRC();
                    const phaseModalName = "phase-modal";

                    if (typeof this.props.setCRC === "function") {
                        this.props.setCRC();
                    }
                    this.externalEventBox();
                    PopModal.close(modalName);

                    PopModal.createModal(phaseModalName, (
                        <FirstPhase
                            onClose={() => PopModal.close(phaseModalName)}
                            consultAbleCount={chargeMaxCount - (Number(crc) + 1)}
                            callBack={() => this.onAnotherRecommend(_params, modalName, crc)}
                        />)
                    , { className: phaseModalName, modal_close: false });

                    PopModal.show(phaseModalName);

                    // this.addRecommendPhase(_params, modalName);
                })
                .catch(error => {
                    PopModal.closeProgress();
                    if (error && error.date) {
                        PopModal.alert(error.data);
                    }
                });
        }
    }

    onAnotherRecommend(params, modalName) {
        this.addRecommendPhase(params, modalName);
    }

    /**
     * 상담신청 팝업 띄우기 및 상담신청
     * @param access_type
     */
    onConsult(access_type) {
        const { category } = this.props;
        const { totalPrice, device_type, information } = this.state;

        if (utils.type.isEmpty(totalPrice)) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "총 예상 견적을 먼저 확인해주세요."
            });
        } else {
            Modal.close();
            this.gaEvent("견적확인_작가확인");
            const estimateData = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
            const p = Object.assign({}, estimateData);
            p.access_type = access_type;
            p.device_type = device_type;
            p.category = category;

            if (information.product_no) {
                p.product_no = information.product_no;
            }

            if (information.artist_id) {
                p.artist_id = information.artist_id;
            }

            // 견적미산출 시 견적정보 삭제
            if (!totalPrice) {
                delete p.extra_info;
                delete p.extra_text;
            }

            // 상담신청 모달창 띄우기
            this.onShowConsultModal(p);
        }
    }

    /**
     * 리뷰 모달 열기
     * @param id
     */
    onShowReview() {
        const { information } = this.props;
        const { review } = this.state;
        // this.gaEvent("후기");
        PopModal.closeProgress();
        const modalName = "pop-review";
        PopModal.createModal(modalName,
            <PopArtistReview
                list={review.list}
                nickName={information.nick_name}
                onClose={() => PopModal.close(modalName)}
            />
            , { modal_close: false, className: modalName });
        PopModal.show(modalName);
    }

    onChat() {
        const { information, phone } = this.state;
        const user = this.UserCheck.isLogin();

        if (user) {
            if (user.id === information.user_id) {
                PopModal.alert("자기 자신에게 메시지를 보낼수 없습니다.");
            } else {
                const modalName = "popup_send_chat";
                const options = {
                    className: modalName
                };
                if (!phone) {
                    options.callBack = () => this.checkPhone();
                }

                const params = {
                    no: information.product_no,
                    title: information.title,
                    user_id: information.artist_id,
                    nick_name: information.artist_name,
                    profile_img: information.profile_img
                };

                PopModal.createModal(modalName, <PopupSendChat data={params} isPhone={!!phone} />, options);
                PopModal.show(modalName);
            }
        }
    }

    render() {
        const { images, renewDetail, list, videos, information, active_index, axis_type, category, ext_page, chargeArtistNo } = this.props;
        const { review, self_review } = this.state;
        const is_biz = category && utils.checkCategoryForEnter(category);
        return (
            <div className="portfolio-mo">
                <div className={classNames("forsnap-portfolio", { "ext_page": ext_page }, { "biz": is_biz && chargeArtistNo && ext_page })}>
                    <Information
                        chargeArtistNo={chargeArtistNo}
                        renewDetail={renewDetail}
                        is_biz={is_biz}
                        information={information}
                        active_index={active_index}
                        category={category}
                        review={review}
                        self_review={self_review}
                        onClose={this.onClose}
                        onShowReview={this.onShowReview}
                        gaEvent={this.gaEvent}
                    />
                    <PortfolioList
                        list={list}
                        images={images}
                        videos={videos}
                        active_index={active_index}
                        axis_type={axis_type}
                        category={category}
                        xhr={false}
                        onShowSlider={this.onShowSlider}
                    />
                    {is_biz && chargeArtistNo &&
                    <div className="estimate-btn-box">
                        <div className="move-btn" style={{ backgroundColor: "#000" }} onClick={this.onShowVirtualEstimate}>
                            <button>촬영견적 계산하기</button>
                        </div>
                        <div className="move-btn" style={{ backgroundColor: "#f5a623" }} onClick={this.onConsultArtist}>
                            <button>작가에게 무료상담신청</button>
                        </div>
                    </div>
                    }
                    {is_biz && !chargeArtistNo &&
                    <div className="estimate-btn-box">
                        <div className="move-btn" style={{ width: "100%", backgroundColor: "#f5a623" }} onClick={this.onChat}>
                            <button style={{ color: "#fff", cursor: "pointer" }}>작가에게 메시지발송</button>
                        </div>
                    </div>
                    }
                </div>
            </div>
        );
    }
}

Portfolio.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    information: PropTypes.shape({
        profile_img: PropTypes.string,
        nick_name: PropTypes.string,
        title: PropTypes.string,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    active_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    axis_type: PropTypes.string.isRequired,
    category: PropTypes.string,
    onShowChargeArtist: PropTypes.func
};

PropTypes.defaultProps = {
    category: ""
};
