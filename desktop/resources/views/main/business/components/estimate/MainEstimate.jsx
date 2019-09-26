import "./mainEstimate.scss";
import React, { Component, PropTypes } from "react";
import VirtualEstimate from "../../../../products/components/open/components/virtual_estimate/VirtualEstimate";
import VirtualEstimateTab from "./VirtualEstimateTab";
import * as virtualEstimateHelper from "desktop/resources/views/products/components/open/components/virtual_estimate/virtualEstimateHelper";
import * as EstimateSession from "desktop/resources/views/products/components/open/components/extraInfoSession";
import PopModal from "shared/components/modal/PopModal";
import { ADVICE_EXTRA_TEXT, PROPERTYS } from "desktop/resources/views/products/components/open/components/virtual_estimate/virtual_estimate.const";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";

export default class MainEstimate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentCategory: "PRODUCT",
            device_type: "pc",
            access_type: "main"
        };
        this.onSelectTab = this.onSelectTab.bind(this);
        this.onConsultEstimate = this.onConsultEstimate.bind(this);
        this.callAPIInsertOrderEstimate = this.callAPIInsertOrderEstimate.bind(this);
        this.createRecommendArtistParams = this.createRecommendArtistParams.bind(this);
        this.onMoveChargeList = this.onMoveChargeList.bind(this);
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    /**
     * 카테고리 탭 선택
     * @param category
     */
    onSelectTab(category) {
        this.setState({
            currentCategory: category
        });
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
        const { device_type, data, access_type } = this.state;
        // form 데이터를 복사한다.
        const _form = Object.assign({}, form);

        if (totalPrice) {
            _form.total_price = hasAlphas ? `${totalPrice}+a` : totalPrice;
        }

        // 견적산출 파라미터 설정
        const params = {
            extra_info: JSON.stringify({ ..._form }),
            agent,
            category,
            device_type,
            access_type
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
        const { agent, currentCategory } = this.state;
        //const category = this.props.category ? this.props.category.toUpperCase() : "";
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
            category: currentCategory,
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

    gaEvent(action) {
        const { currentCategory } = this.state;
        utils.ad.gaEvent("기업_메인", action, currentCategory);
    }

    onConsultSearchArtist() {
        this.gaEvent("오픈견적");
        this.onMoveChargeList();
    }

    onMoveChargeList() {
        const { currentCategory } = this.state;
        // mcl === move charge list
        window.open(`/products?category=${currentCategory}&mcl=1`);
    }

    render() {
        const { currentCategory } = this.state;
        return (
            <section className="main__estimate">
                <h2 className="main-section__title">정직한 촬영비용, 3초만에 확인해보세요!</h2>
                <div className="main__estimate__box">
                    <div className="container">
                        <VirtualEstimateTab
                            onSelectTab={this.onSelectTab}
                        >
                            <VirtualEstimate
                                gaEvent={this.gaEvent}
                                //receiveEstimate={receiveEstimate}
                                onConsultSearchArtist={this.onConsultSearchArtist}
                                onConsultEstimate={this.onConsultEstimate}
                                category={currentCategory}
                                mainTest
                                //onChangeShotKind={this.onChangeShotKind}
                                //onReceiveEmail={this.onReceiveEmail}
                            />
                        </VirtualEstimateTab>
                    </div>
                </div>
            </section>
        );
    }
}
