import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";
import ConsultModal from "desktop/resources/components/modal/consult/ConsultModal";
import API from "forsnap-api";
import * as EstimateSession from "../../../../views/products/components/open/components/extraInfoSession";
import VirtualEstimate from "desktop/resources/views/products/components/open/components/virtual_estimate/VirtualEstimate";
import PopArtistReview from "desktop/resources/views/products/components/open/components/pop/review/PopArtistReview";
import {
    ADVICE_EXTRA_TEXT,
    PROPERTYS, RECOMMEND_ACCESS_TYPE
} from "../../../../views/products/components/open/components/virtual_estimate/virtual_estimate.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import * as virtualEstimateHelper
    from "../../../../views/products/components/open/components/virtual_estimate/virtualEstimateHelper";
import UserCheck from "shared/helper/UserCheck";
import ProductsQuestion from "../../../../views/products/detail/components/ProductsQuestion";
// import ChargeCount from "shared/helper/charge/ChargeCount";
import ExampleReviewDetail from "desktop/resources/views/products/components/open/components/example_review/ExampleReviewDetail";
import FirstPhase from "./pop/message/FirstPhase";

export default class Information extends Component {
    constructor(props) {
        super(props);
        // this.chargeCount = new ChargeCount();
        this.state = {
            information: props.information,
            active_index: props.active_index,
            category: props.category,
            type: props.type,
            totalPrice: "",
            device_type: "pc",
            phone: "",
            review: null,
            //
            chargeMaxCount: props.chargeMaxCount,
            crc: props.crc,
            gaEvent: props.gaEvent
            // chargeArtistNo: props.chargeArtistNo
        };
        this.onClose = this.onClose.bind(this);
        this.onConsult = this.onConsult.bind(this);
        this.onVirtualEstimate = this.onVirtualEstimate.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        this.onConsultOur = this.onConsultOur.bind(this);
        this.onConsultArtist = this.onConsultArtist.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        //
        this.init = this.init.bind(this);
        this.onQuestion = this.onQuestion.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
        this.checkUser = this.checkUser.bind(this);
        this.insertAdvice = this.insertAdvice.bind(this);
        this.updateAdvice = this.updateAdvice.bind(this);
        this.onShowReview = this.onShowReview.bind(this);
        this.onShowSelfReview = this.onShowSelfReview.bind(this);
        this.receiveTotalPrice = this.receiveTotalPrice.bind(this);
    }

    componentWillMount() {
        // this.chargeCount.init();
        const { information, category } = this.props;
        if (category && utils.checkCategoryForEnter(category)) {
            this.onReceiveArtistReview(information.artist_id, information.product_no);
        }
    }

    componentDidMount() {
        this.getSessionReferer();
    }

    componentWillUnmount() {

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

    init(flag) {
        if (flag) {
            this.setState({
                agent: "",
                estimate_no: "",
                order_no: "",
                // form: {},
                // hasAlphas: false,
                // recommendData: {},
                totalPrice: ""
            });
        }
    }

    onReceiveArtistReview(user_id, product_no) {
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
                PopModal.alert(error.data);
            });
    }
    receiveTotalPrice(price) {
        this.setState({ totalPrice: price });
    }
    /**
     * 견적산출 모달
     */
    onVirtualEstimate() {
        const { category, gaEvent } = this.props;
        if (gaEvent) {
            gaEvent("유료_포폴_견적버튼");
        }
        const modalName = "virtual_estimate_modal";
        // this.gaEvent("견적확인");
        PopModal.createModal(modalName,
            <VirtualEstimate
                onConsultSearchArtist={this.onConsultOur}
                onConsultEstimate={this.onConsultEstimate}
                receiveTotalPrice={this.receiveTotalPrice}
                gaEvent={this.gaEvent}
                init={this.init}
                detailPage
                modalName={modalName}
                category={category}
                onClose={() => PopModal.close(modalName)}
            />,
            { modal_close: false, className: modalName }
        );

        PopModal.show(modalName);
    }

    gaEvent(action) {
        const category = this.props.category;
        const { information } = this.state;

        // const estimateData = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        // const p = { ...estimateData };

        if (action !== "상담먼저") {
            utils.ad.gaEvent("기업_상세", action, `${category}_${information.artist_name}_${information.product_no}`);
        }
    }

    /**
     * 작가에게 상담신청
     * @param form
     * @param access_type
     */
    onConsultOur(form = null, access_type) {
        const { totalPrice } = this.state;
        if (utils.type.isEmpty(totalPrice)) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "총 예상 견적을 먼저 확인해주세요."
            });
        } else {
            Modal.close();
            this.gaEvent("견적확인_작가확인");
            this.onConsult("detail_add");
        }
    }

    /**
     * 견적을 산출한다.
     * @param form
     * @param agent
     * @param category
     * @param hasAlphas
     * @param totalPrice
     */
    onConsultEstimate({ form, agent, category, hasAlphas, totalPrice }) {
        const { device_type, information } = this.state;
        let { fetchArtists } = this.state;
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
            device_type,
            access_type: "detail"
        };

        if (information.product_no) {
            params.product_no = information.product_no;
        }

        if (information.artist_id) {
            params.artist_id = information.artist_id;
        }

        if (totalPrice) {
            // totalPrice 값이 존재하면 견적산출 api를 호출한다.
            this.callAPIInsertOrderEstimate(params, { form: _form, totalPrice, hasAlphas, agent });
        } else {
            fetchArtists = [];
        }

        // 견적정보를 state에 저장한다.
        this.setState({
            form,
            agent,
            // category,
            totalPrice,
            hasAlphas,
            fetchArtists
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
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        virtualEstimateHelper.apiInsertOrderEstimate(params)
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                const data = response.data;
                // 작가상담용 객체 키, 밸류 값을 치환합니다. (extra_text)
                const recommendParams = this.createRecommendArtistParams({ form, totalPrice, hasAlphas, agent });
                recommendParams.estimate_no = data.estimate_no;
                EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, recommendParams);

                this.setState({
                    estimate_no: data.estimate_no,
                    recommendParams
                });
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data ? error.data : "견적을 산출하는데 오류가 발생했습니다.\n문제가 지속될 경우 고객센터에 문의해 주세요."
                });
            });
    }

    /**
     * 추천작가용 파라미터를 생성합니다.
     * @param form
     * @param totalPrice
     * @param hasAlphas
     * @param agent
     * @returns {{agent: *, category: string, extra_info: string, extra_text: string}}
     */
    createRecommendArtistParams({ form, totalPrice, hasAlphas, agent }) {
        const { category } = this.state;
        const user = auth.getUser();

        // 코드에서 한글로 치환
        const exchangeCodeToText = this.exchangeCodeToText(form);

        const params = {
            agent,
            category,
            extra_info: JSON.stringify(form),
            extra_text: JSON.stringify(exchangeCodeToText)
        };

        // 유저가 로그인했다면 아이디를 넘겨준다.
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

    onConsultArtist() {
        const { gaEvent } = this.props;
        /**
         * 1. 리스트: "list",
         * 2. 리스트_추가: "list_add"
         * 3. 견적: "estimate",
         * 4. 견적_추가: "estimate_add",
         * 5. 상세: "detail",
         * 6. 상세_추가: "detail_add"
         */
        // this.gaEvent("연락요청");
        if (gaEvent) {
            gaEvent("유료_포폴_상담버튼");
        }
        this.onConsult("detail");
    }

    onConsult(access_type) {
        const { totalPrice, information, order_no } = this.state;
        const { crc } = this.props;
        const modal_name = "simple__consult";
        const estimateData = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        const p = Object.assign({}, estimateData);
        p.access_type = access_type;
        p.device_type = "pc";
        p.category = this.props.category;

        if (!totalPrice) {
            delete p.extra_info;
            delete p.extra_text;
        }

        if (information.product_no) {
            p.product_no = information.product_no;
        }

        if (information.artist_id) {
            p.artist_id = information.artist_id;
        }

        PopModal.createModal(
            modal_name,
            <ConsultModal
                onConsult={data => {
                    const params = Object.assign({}, data, {
                        ...p
                    });
                    PopModal.progress();
                    this.insertAdvice(params, access_type, modal_name);
                    // if (access_type !== "detail_add") {
                    //     this.insertAdvice(params, access_type, modal_name);
                    // } else {
                    //     this.updateAdvice(params, access_type, modal_name);
                    //     this.updateAdvice(params, access_type, modal_name);
                    // }
                }}
                nickName={information.artist_name}
                requestAbleCount={3 - crc}
                isTypeRecommendArtist
                onClose={() => PopModal.close(modal_name)}
            />,
            {
                modal_close: false
            }
        );
        PopModal.show(modal_name);
    }

    externalEvents() {
        utils.ad.wcsEvent("4");
        utils.ad.gtag_report_conversion(location.href);
        utils.ad.gaEvent("기업고객", "상담전환");
        utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    addRecommendPhase(params, access_type) {
        const { onShowChargeArtist } = this.props;

        // PopModal.close(modal_name);
        if (typeof onShowChargeArtist === "function") {
            let at = "";
            const title = "전달이 완료되었습니다.";
            const desc = "다른작가님에게도 촬영안내를 받아보세요.";

            switch (access_type) {
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

    updateAdvice(params, access_type, modal_name) {
        const { order_no, information, estimate_no } = this.state;
        const _params = Object.assign({}, params);
        const hasProperty = key => {
            return Object.prototype.hasOwnProperty.call(_params, key);
        };
        if (hasProperty("extra_info")) {
            delete _params.extra_info;
        }
        if (hasProperty("access_type")) {
            delete _params.access_type;
        }
        if (hasProperty("user_id")) {
            delete _params.user_id;
        }
        if (hasProperty("category")) {
            delete _params.category;
        }
        if (hasProperty("agent")) {
            delete _params.agent;
        }
        virtualEstimateHelper.apiPutArtistOrder(order_no, Object.assign(_params, { artist_id: information.artist_id, product_no: information.product_no, estimate_no }))
            .then(() => {
                PopModal.closeProgress();
                this.externalEvents();
                this.addRecommendPhase(params, access_type, modal_name);
            });
    }

    /**
     * 작가에게 상담신청
     * @param params
     * @param access_type
     * @param modal_name
     */
    insertAdvice(params, access_type, modal_name) {
        const { chargeMaxCount, crc } = this.props;
        if (chargeMaxCount - crc === 0) {
            PopModal.closeProgress();
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: <p>포스냅에서는 최대 3명의 작가님께 견적 및 상담 신청이 가능합니다.<br />추가문의를 원하시는 경우 포스냅 전문가 상담 혹은 고객센터로 문의내용을 접수해주세요.</p>,
                onSubmit: () => {
                    PopModal.close(modal_name);
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
                    this.externalEvents();
                    PopModal.close(modal_name);

                    PopModal.createModal(phaseModalName, (
                        <FirstPhase
                            onClose={() => PopModal.close(phaseModalName)}
                            consultAbleCount={chargeMaxCount - (Number(crc) + 1)}
                            callBack={() => this.onAnotherRecommend(_params, access_type, modal_name, crc)}
                        />)
                    , { className: phaseModalName, modal_close: false });

                    PopModal.show(phaseModalName);
                })
                .catch(error => {
                    PopModal.closeProgress();
                    if (error && error.date) {
                        PopModal.alert(error.data);
                    }
                });
        }
    }

    onAnotherRecommend(params, access, modalName, crc) {
        this.addRecommendPhase(params, access, modalName, crc);
    }

    onClose(e) {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    /**
     * 유저 정보 체크
     */
    checkUser() {
        const user = auth.getUser();

        if (user) {
            API.users.find(user.id).then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    this.setState({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || ""
                    });
                }
            });
        }
    }

    onQuestion() {
        this.UserCheck = new UserCheck();
        const user = this.UserCheck.isLogin();
        const { category } = this.props;
        const { information, phone } = this.state;
        const { artist_id, product_no, profile_img, artist_name } = information;
        utils.ad.gaEvent("기업_상세", "무료_작가1:1대화", `${category}_${artist_name}_${product_no}`);
        if (user) {
            if (!phone) {
                API.users.find(user.id).then(response => {
                    const data = response.data;
                    this.setState({
                        name: data.name || "",
                        email: data.email || "",
                        phone: data.phone || ""
                    }, () => {
                        if (user.id === information.artist_id) {
                            PopModal.alert("자기 자신에게 메시지를 보낼 수 없습니다.");
                        } else {
                            const modalName = "popup-products-question";
                            PopModal.createModal(
                                modalName,
                                <ProductsQuestion
                                    placeHolder="연락처, 이메일 등을 입력하시면 문의가 전달되지 않습니다."
                                    data={{ user_id: artist_id, product_no, phone: this.state.phone, nick_name: artist_name, profile_img }}
                                />, { callBack: this.state.phone ? null : this.checkUser });
                            PopModal.show(modalName);
                        }
                    });
                });
            } else if (phone) {
                if (user.id === information.artist_id) {
                    PopModal.alert("자기 자신에게 메시지를 보낼 수 없습니다.");
                } else {
                    const modalName = "popup-products-question";
                    PopModal.createModal(
                        modalName,
                        <ProductsQuestion
                            placeHolder="연락처, 이메일 등을 입력하시면 문의가 전달되지 않습니다."
                            data={{ user_id: artist_id, product_no, phone, nick_name: artist_name, profile_img }}
                        />, { callBack: phone ? null : this.checkUser });
                    PopModal.show(modalName);
                }
            }
        }
    }

    onSendMessage(msg) {
        const { information } = this.state;
        const user = auth.getUser();

        if (user) {
            API.talks.send(information.artist_id, information.product_no, "U", "PRODUCT_BOT", msg).then(response => {
                if (response.status === 200) {
                    PopModal.close();
                    PopModal.confirm(
                        "문의가 등록되었습니다.\n답변이 완료되면 sms로 알려드려요!\n지금 메시지를 확인하시겠습니까?",
                        () => {
                            document.location.href = `/users/chat/${information.artist_id}/${information.product_no}`;
                        }
                    );
                }
            }).catch(error => {
                if (error.status === 412) {
                    PopModal.alert(error.data);
                } else if (error.status === 400) { // 작가가 자기자신의 상품에 대화하기를 하였을 경우 에러
                    PopModal.alert(error.data);
                }
            });
        } else {
            PopModal.alert("로그인 후 사용가능합니다.");
        }
    }

    /**
     * 후기 뷰어 보기
     * @param id
     */
    onShowReview(id) {
        const { gaEvent, chargeArtistNo } = this.props;
        const { review, information } = this.state;
        if (gaEvent) {
            gaEvent("유료_포폴_촬영후기");
        }
        // this.gaEvent("후기");

        if (!chargeArtistNo) {
            this.gaEvent("무료_작가후기");
        }

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

    onShowSelfReview() {
        const { category, gaEvent } = this.props;
        const { self_review } = this.state;

        if (gaEvent) {
            gaEvent("유료_포폴_촬영사례");
        }

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <ExampleReviewDetail
                    data={self_review}
                    category={category}
                    onClose={() => Modal.close()}
                />
            ),
            overflow: false
        });
    }

    reviewLength(obj) {
        if (obj) {
            const list = obj.list.concat().filter(chk => {
                return chk.user_type === "U" && !chk.auto_reg_dt;
            });

            return list.length > 0 ? list.length : null;
        }
        return null;
    }

    render() {
        const { information, active_index, category, chargeArtistNo, ext_page } = this.props;
        const { review, self_review } = this.state;
        const is_biz = category && utils.checkCategoryForEnter(category);
        const length = this.reviewLength(review);

        return (
            <div className="forsnap-portfolio__information">
                <div className="information__product">
                    <div className="information__product-artist">
                        <div className="artist-profile">
                            <img src={`${__SERVER__.thumb}/normal/crop/110x110${information.profile_img}`} role="presentation" alt={information.nick_name} />
                        </div>
                        <div className="product-info">
                            <p className="product-info__nick-name">[{information.artist_name}]</p>
                            <p className="product-info__title">{information.title}</p>
                            {is_biz ?
                                <div className="information__review-btn">
                                    {review && review.total_cnt > 0 && length &&
                                    <button onClick={() => this.onShowReview()} className="review-btn">촬영후기보기</button>
                                    }
                                    {self_review ? <button className="review-btn" onClick={this.onShowSelfReview}>촬영사례보기</button> : null}
                                </div> :
                                <div className="information__count">
                                    <span style={{ color: "#fff" }}>포트폴리오</span>
                                    <span style={{ color: "#febf16", marginLeft: 10 }}>{`(${active_index} / ${information.total})`}</span>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="information__etc">
                    {is_biz && chargeArtistNo &&
                    <div style={{ display: "flex" }}>
                        <div className="move-btn" onClick={this.onVirtualEstimate}>
                            <button style={{ color: "#fff", cursor: "pointer" }}>촬영견적 계산하기</button>
                        </div>
                        <div className="move-btn show-box" onClick={this.onConsultArtist}>
                            <button style={{ color: "#fff", cursor: "pointer" }}>작가에게 무료상담신청</button>
                            <div className="arrow-box" />
                            <div className="consult-info">
                                <p className="info-text">
                                    견적이나 촬영에 대한 문의 뿐만아니라,<br />
                                    추가포트폴리오를 요청하거나 촬영에 대한 전반적인 안내도 가능합니다.
                                </p>
                            </div>
                        </div>
                    </div>
                    }
                    {is_biz && !chargeArtistNo &&
                    <div>
                        <div className="move-btn" onClick={this.onQuestion}>
                            <button style={{ color: "#fff", cursor: "pointer" }}>작가에게 메시지발송</button>
                        </div>
                    </div>
                    }
                    {
                        location.pathname.startsWith("/products/") && !ext_page &&
                        <div className="close-button" style={{ color: "#fff" }}>
                            <div className="close" onClick={this.onClose} />
                        </div>
                    }
                </div>
            </div>
        );
    }
}

Information.propTypes = {
    information: PropTypes.shape({
        profile_img: PropTypes.string,
        nick_name: PropTypes.string,
        title: PropTypes.string,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    active_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    category: PropTypes.string,
    onShowChargeArtist: PropTypes.func
};

Information.defaultProps = {
    category: ""
};
