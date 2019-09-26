import "./virtuaestimateContainer.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import VirtualEstimateSteps from "./step/VirtualEstimateSteps";
import VirtualEstimateProgressBar from "./progress/VirtualEstimateProgressBar";
import VirtualEstimateResult from "./result/VirtualEstimateResult";
import PopReceiveEmail from "../../views/products/components/open/components/pop/email/PopReceiveEmail";
import { STEP_KEY } from "./helper/const/base.const";
import * as virtualEstimateHelper from "../../views/products/components/open/components/virtual_estimate/virtualEstimateHelper";
import { ADVICE_EXTRA_TEXT, PROPERTYS } from "../../views/products/components/open/components/virtual_estimate/virtual_estimate.const";
import VirtualEstimateHelper from "./helper/VirtualEstimateHelper";
// import VirtualEstimateSteps from "./step/VirtualEstimateStepsContainer";

export default class VirtualEstimateContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            step: STEP_KEY.FIRST,
            data: {},
            form: {},
            priceInfo: {},
            hasAlphas: false,
            totalPrice: 0,
            lastStep: null,
            device_type: "pc",
            agent: cookie.getCookies("FORSNAP_UUID"),
            access_type: props.access_type,
            flag: false,
            isFirst: true,
            isAbleMoveStep: false
        };

        // 오픈견적 헬퍼 인스턴스 셋
        this.VirtualHelper = new VirtualEstimateHelper({ category: props.category });
        // 오픈견적 데이터 초기화
        this.onInit = this.onInit.bind(this);
        this.onChangeStep = this.onChangeStep.bind(this);
        this.onChangeForm = this.onChangeForm.bind(this);
        this.onChangeStepData = this.onChangeStepData.bind(this);
        this.calculatePrice = this.calculatePrice.bind(this);
        this.createRecommendArtistParams = this.createRecommendArtistParams.bind(this);
        this.exchangeCodeToText = this.exchangeCodeToText.bind(this);
        this.onReceiveEmail = this.onReceiveEmail.bind(this);
        this.receiveEmail = this.receiveEmail.bind(this);
        this.exchangeResultText = this.exchangeResultText.bind(this);
        this.onCheckMoveFlag = this.onCheckMoveFlag.bind(this);
    }

    componentWillMount() {
        const { category } = this.props;
        this.setVirtualData(category);
    }

    componentDidMount() {
    }

    /**
     * 오픈견적 데이터 초기화
     */
    onInit() {
        this.gaEvent("다시계산하기");
        this.setState({
            step: STEP_KEY.FIRST,
            totalPrice: 0,
            priceInfo: this.VirtualHelper.getPriceInfo(),
            form: this.setForm(this.VirtualHelper.getStepProcess().VIRTUAL_PROP),
            data: this.initActive(this.state.data)
        }, () => {
            this.Steps.receiveInitFlag(true);
            if (this.VirtualHelper.getUtils().isLastFlag()) {
                this.VirtualHelper.getUtils().changeLastFlag(false);
            }
            this.props.receiveTotalPrice(0);
        });
    }

    /**
     * 활성화 플래그 값 초기화
     * @param data
     * @returns {*}
     */
    initActive(data) {
        const arrKeys = Object.keys(data);
        arrKeys.map(key => { data[key].ACTIVE = false; return null; });

        return data;
    }

    /**
     * 오픈견적 데이터 셋
     */
    setVirtualData() {
        const step = this.VirtualHelper.getStepProcess();
        this.setState({
            data: step.STEP,
            form: this.setForm(step.VIRTUAL_PROP),
            priceInfo: this.VirtualHelper.getPriceInfo(),
            lastStep: this.VirtualHelper.getTotalStep()
        });
    }

    /**
     * 카테고리별 폼 데이터 세팅
     * @param data
     * @returns {{}}
     */
    setForm(data) {
        return Object.assign({}, Object.keys(data).reduce((r, o) => {
            r[o] = data[o].VALUE;
            return r;
        }, {}));
    }


    /**
     * 계산하기
     * @param form
     */
    calculatePrice(form) {
        const { data, priceInfo } = this.state;
        let hasAlphas = false;

        const stepKeyArr = Object.keys(data);
        const ableCalculateFlag = stepKeyArr.every(key => data[key].ACTIVE);

        let totalPrice = 0;

        if (ableCalculateFlag) {
            // 계산하기 함수 불러오기
            const result = this.VirtualHelper.getUtils().calculatePrice(form, priceInfo);
            totalPrice = result.totalPrice;
            hasAlphas = result.hasAlphas;
        } else {
            totalPrice = 0;
        }

        if (totalPrice) {
            this.onConsultEstimate(totalPrice, hasAlphas);
        }

        this.setState({ totalPrice, hasAlphas }, () => {
            if (typeof this.props.receiveTotalPrice === "function") {
                this.props.receiveTotalPrice(totalPrice);
            }
        });
    }

    /**
     * 산출된 견적을 등록한다.
     * @param totalPrice
     * @param hasAlphas
     * @returns {*}
     */
    onConsultEstimate(totalPrice, hasAlphas) {
        const { device_type, access_type, form, agent, category } = this.state;
        // form 데이터를 복사한다.

        if (totalPrice) {
            form.total_price = hasAlphas ? `${totalPrice}+a` : totalPrice;
        }

        // 견적산출 파라미터 설정
        const params = {
            extra_info: JSON.stringify({ ...form }),
            agent,
            category,
            device_type,
            access_type
        };

        if (auth.getUser()) {
            params.user_id = auth.getUser().id;
        }

        if (totalPrice) {
            // total_price 값이 존재하면 견적산출 api를 호출한다.
            this.callAPIInsertOrderEstimate(params, { form, totalPrice, agent, hasAlphas });
        }
    }

    /**
     * 견적산출 api를 호출합니다.
     * @param params
     * @param form
     * @param totalPrice
     * @param hasAlphas
     * @param agent
     */
    callAPIInsertOrderEstimate(params, { form, totalPrice, agent, hasAlphas }) {
        // PopModal.progress();
        virtualEstimateHelper.apiInsertOrderEstimate(params)
            .then(response => {
                const data = response.data;
                // 작가상담용 객체 키, 밸류 값을 치환합니다. (extra_text)
                const recommendParams = this.createRecommendArtistParams({ form, total_price: totalPrice, hasAlphas, agent });
                recommendParams.estimate_no = response.data.estimate_no;
                //EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, recommendParams);
                this.gaEvent("견적산출");
                this.setState({
                    estimate_no: data.estimate_no,
                    recommendParams,
                    receiveEstimate: null
                }, () => {
                    this.Steps.receiveFlag(true);
                });
            })
            .catch(error => {
                // PopModal.closeProgress();
                PopModal.alert(error.data ? error.data : "견적을 산출하는데 오류가 발생했습니다.\n문제가 지속될 경우 고객센터에 문의해 주세요.");
            });
    }

    /**
     * 추천작가용 파라미터를 생성합니다.
     * @param form
     * @param total_price
     * @param hasAlphas
     * @param agent
     * @returns {{agent: *, category: string, extra_info: string, extra_text: string}}
     */
    createRecommendArtistParams({ form, total_price, hasAlphas, agent }) {
        const { category } = this.state;
        const user = auth.getUser();

        if (total_price) {
            form.total_price = hasAlphas ? `${total_price}+a` : total_price;
        }

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

            if (value) {
                // key가 video_length 이면 텍스트를 치환한다.
                if (key === PROPERTYS.VIDEO_LENGTH.CODE) {
                    switch (value) {
                        case "1": value = "1분미만"; break;
                        case "2": value = "1분~3분"; break;
                        case "3": value = "3분~5분"; break;
                        case "4+a": value = "5분이상"; break;
                        default: value = form[key]; break;
                    }
                } else if (key === PROPERTYS.DIRECTING_NUMBER.CODE ||
                    key === PROPERTYS.EXTERIOR_NUMBER.CODE ||
                    key === PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE ||
                    key === PROPERTYS.DIRECTING_NEED_ALL_CUT.CODE ||
                    key === PROPERTYS.NUKKI_NEED_ALL_CUT.CODE ||
                    key === PROPERTYS.NEED_NUMBER.CODE ||
                    key === PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE ||
                    key === PROPERTYS.DETAIL_NUMBER.CODE ||
                    key === PROPERTYS.RETOUCH_NUMBER.CODE ||
                    key === PROPERTYS.N_CLOTHES_P_NUMBER.CODE ||
                    key === PROPERTYS.P_P_NUKKI_NUMBER.CODE ||
                    key === PROPERTYS.PROXY_NUMBER.CODE ||
                    key === PROPERTYS.ALL_CUT_NUMBER.CODE) {
                    value += "컷";
                } else if (key === PROPERTYS.PERSON_NUMBER.CODE ||
                    key === PROPERTYS.INTERVIEW_PERSON.CODE) {
                    value += "명";
                } else if (key === PROPERTYS.TOTAL_TIME.CODE ||
                    key === PROPERTYS.PROXY_TIME.CODE ||
                    key === PROPERTYS.VIDEO_DIRECTING_TIME.CODE) {
                    value += "시간";
                } else if (key === PROPERTYS.NUMBER.CODE ||
                    key === PROPERTYS.MODEL_CLOTHES_NUMBER.CODE ||
                    key === PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE ||
                    key === PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE ||
                    key === PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE) {
                    value += "개";
                } else if (key === PROPERTYS.MODEL_TIME.CODE) {
                    switch (value) {
                        case "shot": value = "숏데이(2시간)"; break;
                        case "half": value = "하프데이(4시간)"; break;
                        case "full": value = "풀데이(8시간)"; break;
                        default: value = form[key]; break;
                    }
                } else {
                    value += "";
                }
            }

            return Object.assign(result, { [PROPERTYS[keyUpperCase].NAME]: value });
        }, {});
    }

    /**
     * 스텝 전환
     * @param step(변경할 스텝)
     */
    onChangeStep(step) {
        const { data, lastStep } = this.state;
        const Steps = this.Steps;
        const isNextReady = Steps.getReadyStepActive();

        let number = 1;

        switch (step) {
            case "FIRST": number = 1; break;
            case "SECOND": number = 2; break;
            case "THIRD": number = 3; break;
            default:
        }

        let ableNext = false;

        if (isNextReady) {
            if (number === 2 || number < 2) {
                ableNext = true;
            } else if (number === 3 && data.SECOND.ACTIVE) {
                ableNext = true;
            } else if (data.SECOND.ACTIVE) {
                ableNext = true;
            }
        }

        if (number === 1) {
            ableNext = true;
        }

        if (number === lastStep - 1) {
            if (this.props.category === "BEAUTY") {
                ableNext = true;
            }
        }

        if (lastStep > 2) {
            if (data.FIRST.ACTIVE && data.SECOND.ACTIVE) {
                ableNext = true;
            }

            if (this.props.category === "FOOD" && data.FIRST.ACTIVE) {
                if (number === 1) {
                    ableNext = true;
                } else if (number === 3 && data.SECOND.ACTIVE) {
                    ableNext = true;
                }
            }
        }

        // // 테스트 코드
        // ableNext = true;

        if (ableNext) {
            this.gaEvent(`${number}단계`);
            if (this.state.isFirst && number === 2) {
                this.gaEvent("1단계");
            }

            if (this.state.isAbleMoveStep) {
                this.setState({
                    step,
                    isFirst: false
                });
            }
        }
    }

    onChangeForm(form) {
        this.setState({ form }, () => {
            this.calculatePrice(form);
        });
    }

    onChangeStepData(data) {
        this.setState({
            isAbleMoveStep: true,
            data
        });
    }

    onCheckMoveFlag(flag = false) {
        this.setState({ isAbleMoveStep: flag });
    }

    /**
     * 이메일을 전달한다.
     */
    onReceiveEmail() {
        const { totalPrice, form } = this.state;
        PopModal.progress();

        if (totalPrice) {
            PopModal.closeProgress();
            const modal_name = "pop-receive-email";
            // 파라미터 조합
            PopModal.createModal(modal_name,
                <PopReceiveEmail
                    onConsult={this.receiveEmail}
                    onClose={() => PopModal.close(modal_name)}
                />,
                { modal_close: false }
            );

            PopModal.show(modal_name);
        } else if (!totalPrice && form) {
            PopModal.closeProgress();
            PopModal.alert("견적을 다시 계산 후 이용해주세요.");
        } else if (!totalPrice && !form) {
            PopModal.closeProgress();
            PopModal.alert("견적 계산 후 이용해주세요.");
        } else {
            PopModal.closeProgress();
            PopModal.alert("견적 계산 후 이용해주세요.");
        }
    }

    /**
     * 이메일 전달
     */
    receiveEmail(params) {
        const { estimate_no, recommendParams, totalPrice, currentCategory, hasAlphas } = this.state;

        const extraText = recommendParams.extra_text;
        let combineParams;

        if (extraText) {
            const parseInfo = JSON.parse(extraText);
            const changeArrInfo = Object.entries(parseInfo);

            combineParams = changeArrInfo.reduce((result, obj) => {
                if (obj[1] && obj[0] !== "총가격") {
                    result.push({ key: obj[0], value: obj[1] });
                }
                return result;
            }, []);
        }

        params.extra_info = JSON.stringify({
            estimate: combineParams,
            estimateNo: estimate_no,
            category: currentCategory,
            salePrice: hasAlphas ? `${utils.format.price(totalPrice)} + a ` : utils.format.price(totalPrice),
            price: utils.format.price(Number(totalPrice) * 1.3)
        });

        virtualEstimateHelper.apiInsertSendEmail(estimate_no, params)
            .then(response => {
                this.gaEvent("이메일로 견적발송");
                PopModal.closeProgress();
                this.sendEmailLastPhase(params.email);
            })
            .catch(error => {
                PopModal.closeProgress();
                PopModal.alert(error.data);
            });
    }

    /**
     * 이메일 전달 마지막 단계
     */
    sendEmailLastPhase(email) {
        PopModal.close("pop-receive-email");
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <div>
                    <div className="container">
                        <div style={{ color: "#fff", textAlign: "center" }}>
                            <p style={{ fontSize: 28, marginBottom: 10 }}>{email}</p>
                            <p style={{ fontSize: 18 }}>입력해주신 이메일로 견적발송이 완료되었습니다.</p>
                        </div>
                    </div>
                </div>
            )
        });

        setTimeout(() => {
            Modal.close();
        }, 2000);
    }

    /**
     * ga이벤트
     * @param label
     */
    gaEvent(label) {
        const { category } = this.props;
        let action = "";
        switch (category) {
            case "PRODUCT": action = "오픈견적_제품"; break;
            case "BEAUTY": action = "오픈견적_코스메틱"; break;
            case "EVENT": action = "오픈견적_행사"; break;
            case "INTERIOR": action = "오픈견적_인테리어"; break;
            case "FOOD": action = "오픈견적_음식"; break;
            case "FASHION": action = "오픈견적_패션"; break;
            case "PROFILE_BIZ": action = "오픈견적_기업프로필"; break;
            case "VIDEO_BIZ": action = "오픈견적_기업영상"; break;
            default:
        }

        utils.ad.gaEvent("기업_리스트", action, label);
    }

    exchangeResultText(key, form, priceInfo) {
        return this.VirtualHelper.getUtils().exchangeResultText(key, form, priceInfo);
    }

    render() {
        const { category } = this.props;
        const { step, form, data, totalPrice, lastStep, hasAlphas, priceInfo } = this.state;
        return (
            <div className="virtual-estimate__container">
                <h2 className="section__title">정직한 촬영비용, 포스냅 예상견적으로 확인해 보세요!</h2>
                <div className="virtual-estimate__content">
                    <div className="container">
                        <div className="virtual-estimate__box">
                            <VirtualEstimateProgressBar
                                totalStep={lastStep}
                                step={step}
                                data={data}
                                onChangeStep={this.onChangeStep}
                            />
                            <VirtualEstimateSteps
                                step={step}
                                form={form}
                                data={data}
                                totalPrice={totalPrice}
                                totalStep={lastStep}
                                category={category}
                                onChangeForm={this.onChangeForm}
                                onChangeStepData={this.onChangeStepData}
                                onChangeStep={this.onChangeStep}
                                onCheckMoveFlag={this.onCheckMoveFlag}
                                estimateUtils={this.VirtualHelper.getUtils()}
                                ref={instance => (this.Steps = instance)}
                            />
                            <VirtualEstimateResult
                                step={step}
                                form={form}
                                data={data}
                                priceInfo={priceInfo}
                                totalPrice={totalPrice}
                                hasAlphas={hasAlphas}
                                exchangeResultText={this.exchangeResultText}
                            />
                            <div className="virtual-estimate__button">
                                <button className="estimate-btn active" onClick={this.onInit}>다시 계산하기</button>
                                <button className={classNames("estimate-btn", { "active": totalPrice })} onClick={this.onReceiveEmail}>이메일로 견적 발송</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
