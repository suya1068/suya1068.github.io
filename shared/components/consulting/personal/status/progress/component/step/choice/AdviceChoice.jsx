import "./advice_choice.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
// import PopModal from "shared/components/modal/PopModal";
// import { PERSONAL_MAIN } from "shared/constant/main.const";
// import Img from "shared/components/image/Img";

export default class AdviceChoice extends Component {
    constructor(props) {
        super(props);
        this.state = {
            advice_type: "",
            kakao_img_path: "/common/counsel/choice/icon-kakako.png",
            fors_symbol_path: "/common/counsel/choice/forsnap-symbol.png",
            step: props.step,
            test_flag: false,
            kakao_href: props.kakao_href
        };
        this.onAdviceChoice = this.onAdviceChoice.bind(this);
        this.onPreNext = this.onPreNext.bind(this);
        this.onPrev = this.onPrev.bind(this);
        // this.onKaKao = this.onKaKao.bind(this);
    }

    componentDidMount() {
        this.setKakaoFlag();
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ kakao_href: nextProps.kakao_href });
    }

    /**
     * 카카오톡 상담가능 상태 세팅
     */
    setKakaoFlag() {
        // const { kakao_href } = this.props;
        const { kakao_href } = this.state;
        if (kakao_href) {
            this.state.test_flag = true;
        }
    }

    /**
     * 상담가능상태값을 불러온다.
     * @returns {boolean}
     */
    getTestFlag() {
        return this.state.test_flag;
    }

    getCurrentState() {
        return "advice_choice";
    }

    /**
     * 다음단계 진행 전 처리
     * @param e
     */
    onPreNext(e) {
        e.preventDefault();
        const { advice_type, kakao_href } = this.state;
        const { onKaKao, onNext, advice_order_no } = this.props;

        // 선택한 상담방법이 전화 혹은 sms 상담받기라면
        if (advice_type === "tel_or_sms") {
            // 다음단계 진행 메서드를 호출

            if (typeof onNext === "function") {
                onNext(5);
            }
        }

        // 선택한 상담방법이 카카오톡 상담이고 카카오톡 API 주소가 세팅되어 있다면
        if (advice_type === "kakao" && kakao_href) {
            // 새창으로 띄운다.
            const t_window = window.open("_blank");
            t_window.location.href = kakao_href;

            // 이후 완료 API 메서드를 호출한다.
            if (typeof onKaKao === "function") {
                onKaKao(advice_order_no);
            }
        }
    }

    /**
     * 이전단계로 이동한다.
     * @param e
     */
    onPrev(e) {
        if (typeof this.props.onPrev === "function") {
            this.props.onPrev(3);
        }
    }

    // /**
    //  * 카카오톡 상담 진행
    //  * @param e
    //  */
    // onKaKao(e) {
    //     const { onKaKao, advice_order_no } = this.props;
    //     const { kakao_href } = this.state;
    //
    //     // 카카오톡 API 주소가 세팅되어 있다면
    //     if (kakao_href) {
    //         const t_window = window.open("_blank");
    //         t_window.location.href = kakao_href;
    //
    //         // 이후 완료 API 메서드를 호출한다.
    //         if (typeof onKaKao === "function") {
    //             onKaKao(advice_order_no);
    //         }
    //     } else {
    //         PopModal.alert("값이 잘못되었습니다.");
    //     }
    // }

    /**
     * 상담방법 선택
     * @param e
     * @param type
     */
    onAdviceChoice(type) {
        const { advice_type } = this.state;
        // const { onKaKao } = this.props;
        this.setState({
            advice_type: advice_type === type ? "" : type
        }, () => {
            // 카카오 상담 패널을 선택하고 카카오 API 주소가 없을 때
            // if (type === "kakao" && !kakao_href) {
            //     // 카카오 API 주소를 받아온 후
            //     if (typeof onKaKao === "function") {
            //         onKaKao();
            //         // 카카오톡 상담진행 가능하다는 값을 셋
            //         this.state.test_flag = true;
            //     }
            //     // 카카오톡 상담을 진행할 것인지 묻는다.
            //     PopModal.confirm("카카오톡 상담을 진행하시겠습니까?", this.onKaKao, null);
            // }
        });
    }

    render() {
        const { advice_type, kakao_img_path, fors_symbol_path } = this.state;
        return (
            <div className="consult_progress__step-advice__choice">
                <div className="consult_progress__step-category">
                    <p className="consult_progress__step-category-name">상담방법선택</p>
                </div>
                <div className="step-content" ref={node => { this.choice = node; }}>
                    <div
                        className={classNames("step-content__choice kakao", { "select": advice_type === "kakao" })}
                        onClick={e => this.onAdviceChoice("kakao")}
                    >
                        <div className="choice-content">
                            <div className="choice-content__image">
                                <img src={`${__SERVER__.img}${kakao_img_path}`} role="presentation" />
                            </div>
                            <div className="choice-content__content">
                                <p className="choice-content__content-title">카카오톡 상담으로 상담받기</p>
                                <p className="choice-content__content-desc">개인정보 입력없이 카카오톡으로 상담이 가능합니다.</p>
                                <button className={classNames("button_advice", { "select": advice_type === "kakao" })}>상담받기</button>
                            </div>
                        </div>
                    </div>
                    <div
                        className={classNames("step-content__choice tel_or_sms", { "select": advice_type === "tel_or_sms" })}
                        onClick={e => this.onAdviceChoice("tel_or_sms")}
                    >
                        <div className="choice-content">
                            <div className="choice-content__image">
                                <img src={`${__SERVER__.img}${fors_symbol_path}`} role="presentation" />
                            </div>
                            <div className="choice-content__content">
                                <p className="choice-content__content-title">전화 or SMS로 상담받기</p>
                                <button className={classNames("button_advice", { "select": advice_type === "tel_or_sms" })}>상담받기</button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="consult_progress__step-button">
                    <div className="button-box two-button">
                        <button className="theme_black" style={{ width: "calc(50% - 5px)" }} onClick={this.onPrev}>이전</button>
                        <button
                            className="theme_black"
                            style={{ width: "calc(50% - 5px)" }}
                            //disabled={is_disabled && "disabled"}
                            ref={node => { this.button = node; }}
                            onClick={this.onPreNext}
                        >다음단계로 진행</button>
                    </div>
                </div>
            </div>
        );
    }
}

AdviceChoice.propTypes = {
    onNext: PropTypes.func.isRequired,
    onPrev: PropTypes.func.isRequired,
    onKaKao: PropTypes.func.isRequired,
    step: PropTypes.number.isRequired,
    advice_order_no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    kakao_href: PropTypes.string
};

AdviceChoice.defaultProps = {
    kakao_href: ""
};
