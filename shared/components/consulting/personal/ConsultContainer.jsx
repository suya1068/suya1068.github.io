import "./consultContainer.scss";
import React, { Component, PropTypes } from "react";
import auth from "forsnap-authentication";
import ProgressPhase from "./status/progress/ProgressPhase";
import CompletePhase from "./status/complete/CompletePhase";
import classNames from "classnames";
import PopModal from "shared/components/modal/PopModal";
import cookie from "forsnap-cookie";
import utils from "forsnap-utils";

export default class ConsultContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser() || null,
            // is_complete: true,       //테스트
            // is_progress: false,      //테스트
            is_complete: false,
            is_progress: true,
            product_no: props.product_no || "",
            referer: "",
            referer_keyword: "",
            category: props.category,
            access_type: props.access_type,
            device_type: props.device_type,
            is_enter: cookie.getCookies("ENTER") && sessionStorage.getItem("ENTER"),
            step: 1
        };

        this.renderPhase = this.renderPhase.bind(this);
        this.onSubmitConsult = this.onSubmitConsult.bind(this);
        this.onClose = this.onClose.bind(this);
        this.onCloseManager = this.onCloseManager.bind(this);
        this.setStep = this.setStep.bind(this);
        this.onExitConsult = this.onExitConsult.bind(this);
        this.setReferrerData = this.setReferrerData.bind(this);
    }

    componentDidMount() {
        this.setReferrerData();
    }

    /**
     * 유입경로 분석에 필요한 데이터를 저장한다.
     */
    setReferrerData() {
        const referrer = document.referrer;
        // const referrer = "https://m.search.naver.com/search.naver?query=%EC%9D%8C%EB%A3%8C%EC%B4%AC%EC%98%81&sm=mtb_hty.top&where=m&oquery=%EC%A0%9C%ED%92%88%EC%B4%AC%EC%98%81&tqi=T3H0%2BlpySDdssaflijRssssssjs-217244";
        let params = {};

        if (referrer) {
            const refData = utils.query.combineConsultToReferrer(referrer);
            params = utils.query.setConsultParams({ ...refData });
            this.setState({ ...params });
        }
    }

    /**
     * 렌더링할 페이지를 선택한다.
     * @returns {*}
     */
    renderPhase() {
        const { is_complete, is_progress, user } = this.state;
        if (is_progress) {
            return this.renderProgressPhase();
        }

        if (is_complete) {
            return this.renderCompletePhase(user);
        }

        return null;
    }

    /**
     * 전체 모달창을 닫는다.
     */
    onClose() {
        const { is_complete } = this.state;
        if (!is_complete) {
            PopModal.close(`advice-order__out-content ${this.state.device_type}`);
        }
        PopModal.close("personal_consult");
        this.removeItems();
    }

    /**
     * 모달창 닫을 시 로컬 삭제
     */
    removeItems() {
        if (localStorage) {
            const temp_user_id = localStorage.getItem("temp_user_id");
            if (temp_user_id) {
                localStorage.removeItem("temp_user_id");
            }
            localStorage.removeItem("advice_order_no");
        }
    }

    /**
     * 진행단계를 저장한다.
     * @param step
     */
    setStep(step) {
        this.setState({ step });
    }

    /**
     * 상담신청 완료후 페이지를 그린다.
     * @param user
     */
    renderCompletePhase(user) {
        return <CompletePhase user={user} onClose={this.onCloseManager} device_type={this.props.device_type} />;
    }

    /**
     * 상담신청 단계 페이지를 그린다.
     */
    renderProgressPhase() {
        const { product_no, access_type, device_type, category } = this.props;
        const { referer, referer_keyword } = this.state;
        const { is_enter } = this.state;
        let exch_referer = referer;
        if (referer && product_no && utils.query.parse(location.search)["NaPm"]) {
            exch_referer = "naver_shopping";
        }
        const data = { product_no, referer: exch_referer, referer_keyword, access_type, device_type, is_enter, category: category || "" };
        return <ProgressPhase ref={instance => { this.progress_phase = instance; }} onSubmitConsult={this.onSubmitConsult} setStep={this.setStep} {...data} />;
    }

    /**
     * 상담신청 창 닫기 관리
     */
    onCloseManager() {
        const { is_progress, is_complete, step } = this.state;
        if (is_progress && step > 1) {
            this.modalClose();
        }
        if (is_complete || step === 1) {
            this.onClose();
        }
    }

    /**
     * 상담신청을 완료한다.
     * @param data
     */
    onSubmitConsult(data) {
        utils.ad.wcsEvent("4");
        this.setState({ is_complete: data.is_complete, is_progress: false, status: data.status });
    }

    /**
     * 상담신청 이탈시 ga 이벤트 호출
     * @param step
     * @param message
     */
    gaEventConsult(step, message) {
        const eCategory = "상담신청 이탈";
        const eAction = "이탈";
        const eLabel = `${step} 단계 / ${message}`;
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    /**
     * 단계별 이탈 시도 시 알림을 띄운다.
     */
    modalClose() {
        const { step, is_complete } = this.state;
        // const state_category = this.progress_phase && this.progress_phase.getCategory();

        const step_4_title = "상담신청 마지막 단계에요!";
        const step_4_message = "연락처만 남겨주시면, SMS혹은 전화로 촬영에 필요한 정보와 견적을 받아볼 수 있어요!";
        const s = 4;

        if (!is_complete) {
            let message = {};

            switch (step) {
                case 2:
                    message = {
                        title: "잠깐, 30초만요!",
                        message: "촬영 견적과 필요한 정보를 알려드릴께요!",
                        ok_message: "받아볼께요!",
                        cancel_message: "괜찮아요.",
                        step: 2
                    };
                    break;
                case 3:
                    message = {
                        title: "다음단계가 마지막이에요!",
                        message: "연락처만 남겨주시면, SMS혹은 전화로 촬영에 필요한 정보와 견적을 받아볼 수 있어요!",
                        ok_message: "받아볼께요!",
                        cancel_message: "괜찮아요.",
                        step: 3
                    };
                    break;
                case 4:
                    // if (utils.checkCategoryForEnter(state_category)) {
                    //     step_4_title = "잠깐, 30초만요!";
                    //     step_4_message = "촬영 견적과 필요한 정보를 알려드릴께요!";
                    //     s = 3.5;
                    // }
                    message = {
                        title: step_4_title,
                        message: step_4_message,
                        ok_message: "받아볼께요!",
                        cancel_message: "괜찮아요.",
                        step: s
                    };
                    break;
                case 5:
                    message = {
                        title: "상담신청 마지막 단계에요!",
                        message: "연락처만 남겨주시면, SMS혹은 전화로 촬영에 필요한 정보와 견적을 받아볼 수 있어요!",
                        ok_message: "받아볼께요!",
                        cancel_message: "괜찮아요.",
                        step: 4
                    };
                    break;
                default: break;
            }
            this.createOutModal(message);
        }
    }

    /**
     * 단계별 이탈 시 레이어 컨텐츠 생성
     * @param message
     */
    createOutModal(message) {
        const modal_name = `advice-order__out-content ${this.state.device_type}`;
        const content = (
            <div className="advice_out_content">
                <div className="advice_out_content-title-box">
                    <p className="advice_out_content-title">{utils.linebreak(message.title)}</p>
                    <div className="advice_out_content-title-box__root" />
                    <div className="box-dots">
                        <div className="box-dot" />
                        <div className="box-dot" />
                    </div>
                </div>
                <div className="advice_out_content-center">
                    <div style={{ display: "inline-block" }}>
                        <img src={`${__SERVER__.img}/common/counsel/logo_symbol_black.png`} alt="forsnap_counsel_symbol" />
                        {/*<Img image={{ src: "/brandguide/bra_img_03.png", type: "image" }} isCrop />*/}
                    </div>
                    <p className="advice_out_content-center-title">{message.message}</p>
                </div>
                <div className="advice_out_content__buttons">
                    <button className="alert-button cancel" onClick={() => { this.onExitConsult(message.cancel_message, message.step); }}>{message.cancel_message}</button>
                    <button className="alert-button ok" onClick={() => { this.onExitConsult(message.ok_message, message.step, modal_name); }}>{message.ok_message}</button>
                </div>
            </div>
        );
        PopModal.createModal(modal_name, content, { className: modal_name, modal_close: false });
        PopModal.show(modal_name);
    }

    /**
     * 상담신청 이탈
     * @param message
     * @param step
     * @param name
     */
    onExitConsult(message, step, name = "") {
        const { access_type } = this.props;
        if (access_type === "main_estimate" || access_type === "main_sample") {
            this.consultBizMainExit(step, message);
        } else {
            this.gaEventConsult(step, message);
        }
        if (name) {
            PopModal.close(name);
        } else {
            this.onClose();
        }
    }

    /**
     * 임시 추가, 기업메인 개선 gaEvent 연동
     * @param step
     * @param message
     */
    consultBizMainExit(step, message) {
        const { access_type } = this.props;
        const action = access_type === "main_estimate" ? "견적신청하기" : "샘플촬영 신청하기";
        utils.ad.gaEvent("기업_메인", action, `${step} 단계 / ${message} `);
    }

    render() {
        const { device_type } = this.state;
        return (
            <div className={classNames("consult_container", device_type)}>
                <h2 className="sr-only">포스냅 상담신청</h2>
                {this.renderPhase()}
                <button className="modal-close" onClick={() => this.onCloseManager()} />
            </div>
        );
    }
}
