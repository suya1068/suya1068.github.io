import React, { Component, PropTypes } from "react";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import VirtualEstimateView from "../component/VirtualEstimateView";
import VirtualEstimateTotalView from "../component/VirtualEstimateTotalView";
import {
    PROPERTYS,
    HAS_PROPERTY,
    PROXY_DIRECTING_PROPERTY,
    DIRECTING_PROPERTY,
    SHOT_KIND_PROPERTY
} from "../virtual_estimate.const";
import * as helper from "../virtualEstimateHelper";
import utils from "forsnap-utils";

export default class VirtualBeauty extends Component {
    constructor(props) {
        super(props);
        const data = props.data;
        this.state = {
            data,
            list: data.LIST,
            form: {
                shot_kind: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                // 제품 갯수
                [PROPERTYS.NUMBER.CODE]: "",
                // 누끼 갯수
                [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: "",
                // 연출 갯수
                [PROPERTYS.DIRECTING_NUMBER.CODE]: "",
                // 촬영 대행 시간
                [PROPERTYS.PROXY_TIME.CODE]: "",
                [PROPERTYS.PROXY_DIRECTING_KIND.CODE]: ""
            },
            price_info: {
                // 제품 갯수
                [PROPERTYS.NUMBER.CODE]: 0,
                // 누끼 갯수
                [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: 0,
                // 연출 갯수
                [PROPERTYS.DIRECTING_NUMBER.CODE]: 0,
                // 촬영 대행 시간
                [PROPERTYS.PROXY_TIME.CODE]: 0,
                // 촬영 대행 단가
                proxy_time_price: 100000,
                // 컷당 연출 단가들
                directing_price: 70000,
                nukki_price: 40000
            },
            alphas: {
                [PROPERTYS.NUMBER.CODE]: false,
                [PROPERTYS.PROXY_TIME.CODE]: false,
                [PROPERTYS.DIRECTING_NUMBER.CODE]: false
            },
            numbers: {
                [PROPERTYS.NUMBER.CODE]: [{ value: "", name: "상품 개수를 선택해주세요." }],
                [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: [{ value: "", name: "필요 누끼 컷수 선택해주세요." }],
                [PROPERTYS.DIRECTING_NUMBER.CODE]: [{ value: "", name: "필요 연출 컷수를 선택해주세요." }],
                [PROPERTYS.PROXY_TIME.CODE]: [{ value: "", name: "촬영 대행 시간을 선택해주세요." }]
            },
            error: {
                [PROPERTYS.NUMBER.CODE]: { show: false, content: "제품수를 선택해주세요." },
                [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: { show: false, content: "필요 컷수를 선택해주세요." },
                [PROPERTYS.DIRECTING_NUMBER.CODE]: { show: false, content: "필요 컷수를 선택해주세요." },
                [PROPERTYS.PROXY_TIME.CODE]: { show: false, content: "시간을 선택해주세요." }
            },
            activeButtonKey: [
                PROPERTYS.SHOT_KIND.CODE,
                PROPERTYS.DIRECTING_KIND.CODE,
                PROPERTYS.PROXY_DIRECTING_KIND.CODE
            ],
            priceInfoKey: [
                PROPERTYS.NUMBER.CODE,
                PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                PROPERTYS.DIRECTING_NUMBER.CODE,
                PROPERTYS.PROXY_TIME.CODE
            ],
            total_price: "",
            prev_total_price: 0
        };
        this.onActive = this.onActive.bind(this);
        this.onChange = this.onChange.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.testSetEstimate = this.testSetEstimate.bind(this);
    }

    componentWillMount() {
        const { numbers } = this.state;
        for (let i = 0; i < 19; i += 1) {
            numbers.number.push({ value: `${i + 1}`, name: `${i + 1}개` });
            if (i < 9) {
                numbers.p_p_nukki_number.push({ value: `${i + 1}`, name: `${i + 1}컷` });
                numbers.directing_number.push({ value: `${i + 1}`, name: `${i + 1}컷` });
                numbers.proxy_time.push({ value: `${i + 1}`, name: `${i + 1}시간` });
            }
        }
        numbers.number.push({ value: "20+a", name: "20개 이상" });
        numbers.p_p_nukki_number.push({ value: "10+a", name: "10컷 이상" });
        numbers.directing_number.push({ value: "10+a", name: "10컷 이상" });
        numbers.proxy_time.push({ value: "10+a", name: "10시간 이상" });
    }

    componentWillReceiveProps(np) {
        if (JSON.stringify(this.props.receiveEstimate) !== JSON.stringify(np.receiveEstimate)) {
            if (np.receiveEstimate) {
                this.setReceiveData(np.receiveEstimate)
                    .then(data => {
                        this.combineReceiveData(data);
                    });
            }
        }
    }

    componentDidMount() {
        this.testSetEstimate();
        this.onActive(null, "shot_kind", "nukki_shot");
    }

    combineReceiveData(data) {
        const _data = Object.assign({}, data);
        delete _data.total_price;
        const { form } = this.state;
        const isStringPriceType = typeof data.total_price === "string";
        let price = "";
        if (isStringPriceType) {
            price = data.total_price.substr(0, data.total_price.indexOf("+a"));
        }
        this.setState({
            form: { ...form, ..._data },
            total_price: price || data.total_price,
            isAlphas: !!price,
            error: this.errorInfoAllFalse(),
            price_info: this.setPriceInfo(_data)
        }, () => {
            if (typeof this.props.receiveTotalPrice === "function") {
                this.props.receiveTotalPrice(this.state.total_price);
            }
        });
    }
    /**
     * 모든 에러 문구 노출 안됨
     * @returns {{}}
     */
    errorInfoAllFalse() {
        const { error } = this.state;
        const _error = Object.assign({}, error);
        const arr = Object.keys(_error);

        return arr.reduce((result, obj) => {
            result[obj] = { ..._error[obj], show: false };
            return result;
        }, {});
    }

    testSetEstimate() {
        const { resData, category } = this.props;
        if (!utils.type.isEmpty(resData) && resData.category === category) {
            this.setReceiveData(JSON.parse(resData.extra_info))
                .then(data => {
                    this.combineReceiveData(data);
                });
        }
    }
    setPriceInfo(data) {
        const { price_info, priceInfoKey } = this.state;

        const changePriceInfo = {};

        priceInfoKey.map(obj => {
            if (data[obj]) {
                let value = data[obj];

                if (value.indexOf("+a") !== -1) {
                    value = value.substr(0, value.indexOf("+a"));
                }

                changePriceInfo[obj] = value;
            }

            return null;
        });

        const _price_info = Object.assign(price_info, changePriceInfo);
        return { ..._price_info };
    }

    /**
     * 견적 정보를 세팅한다.
     * @param data
     * @returns {Promise<*>}
     */
    async setReceiveData(data) {
        const { activeButtonKey } = this.state;
        await this.onActive(null, "shot_kind", data.shot_kind);

        activeButtonKey.map(obj => {
            if (data[obj]) {
                this.onActive(null, obj, data[obj]);
            }
            return null;
        });

        return data;
    }

    /**
     * 알파 체크
     * @returns {boolean}
     */
    hasAlpha() {
        const { alphas } = this.state;
        return Object.keys(alphas).some(key => alphas[key]);
    }

    composeActiveList(list, p_code, c_code) {
        const needless = HAS_PROPERTY.NEEDLESS.CODE;
        const need = HAS_PROPERTY.NEED.CODE;

        return list.reduce((result, obj) => {
            obj.reduce((r, o) => {
                // 활성화 변경 로직
                if (o.CODE === p_code) {
                    helper.columnDefaultListRender(o.PROP, c_code);
                }

                // disabled 변경 로직
                if (c_code === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
                    helper.changeProp([
                        PROPERTYS.NUMBER.CODE,
                        PROPERTYS.P_P_NUKKI_NUMBER.CODE
                    ], o, false);
                    helper.changeProp([
                        PROPERTYS.DIRECTING_KIND.CODE,
                        PROPERTYS.DIRECTING_NUMBER.CODE,
                        PROPERTYS.PROXY_DIRECTING_KIND.CODE,
                        PROPERTYS.PROXY_TIME.CODE
                    ], o, true);
                    if (o.CODE === PROPERTYS.DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([need, needless], ob, false, "DEFAULT"), o);
                    }
                    if (o.CODE === PROPERTYS.DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([DIRECTING_PROPERTY.BASIC.CODE, DIRECTING_PROPERTY.PROXY.CODE], ob, false, "DEFAULT"), o);
                    }
                    if (o.CODE === PROPERTYS.PROXY_DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE, PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE], ob, false, "DEFAULT"), o);
                    }
                } else if (c_code === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
                    helper.changeProp([
                        PROPERTYS.NUMBER.CODE,
                        PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                        PROPERTYS.PROXY_DIRECTING_KIND.CODE,
                        PROPERTYS.PROXY_TIME.CODE
                    ], o, true);
                    helper.changeProp([
                        PROPERTYS.DIRECTING_KIND.CODE,
                        PROPERTYS.DIRECTING_NUMBER.CODE
                    ], o, false);

                    if (o.CODE === PROPERTYS.DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([DIRECTING_PROPERTY.BASIC.CODE, DIRECTING_PROPERTY.PROXY.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([DIRECTING_PROPERTY.BASIC.CODE], ob, true, "DEFAULT"), o);
                    }

                    if (o.CODE === PROPERTYS.PROXY_DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE, PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE], ob, false, "DEFAULT"), o);
                    }
                } else if (c_code === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
                    helper.changeProp([
                        PROPERTYS.NUMBER.CODE,
                        PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                        PROPERTYS.DIRECTING_KIND.CODE,
                        PROPERTYS.DIRECTING_NUMBER.CODE
                    ], o, false);

                    helper.changeProp([
                        PROPERTYS.PROXY_DIRECTING_KIND.CODE,
                        PROPERTYS.PROXY_TIME.CODE
                    ], o, true);

                    if (o.CODE === PROPERTYS.DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([need, needless], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([needless], ob, true, "DEFAULT"), o);
                    }

                    if (o.CODE === PROPERTYS.DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([DIRECTING_PROPERTY.BASIC.CODE, DIRECTING_PROPERTY.PROXY.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([DIRECTING_PROPERTY.BASIC.CODE], ob, true, "DEFAULT"), o);
                    }

                    if (o.CODE === PROPERTYS.PROXY_DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE, PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE], ob, false, "DEFAULT"), o);
                    }
                }

                if (p_code === PROPERTYS.DIRECTING_KIND.CODE && c_code === DIRECTING_PROPERTY.PROXY.CODE) {
                    helper.changeProp([
                        PROPERTYS.PROXY_DIRECTING_KIND.CODE,
                        PROPERTYS.PROXY_TIME.CODE
                    ], o, false);

                    helper.changeProp([
                        PROPERTYS.DIRECTING_NUMBER.CODE
                    ], o, true);

                    if (o.CODE === PROPERTYS.PROXY_DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE, PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE], ob, true, "DEFAULT"), o);
                    }
                }

                if (p_code === PROPERTYS.DIRECTING_KIND.CODE && c_code === DIRECTING_PROPERTY.BASIC.CODE) {
                    helper.changeProp([
                        PROPERTYS.PROXY_DIRECTING_KIND.CODE,
                        PROPERTYS.PROXY_TIME.CODE
                    ], o, true);

                    helper.changeProp([
                        PROPERTYS.DIRECTING_NUMBER.CODE
                    ], o, false);

                    if (o.CODE === PROPERTYS.PROXY_DIRECTING_KIND.CODE) {
                        helper.targetReduce(ob => helper.changeProp([PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE, PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE], ob, false, "DEFAULT"), o);
                    }
                }

                r.push(o);
                return r;
            }, []);
            result.push(obj);
            return result;
        }, []);
    }

    /**
     * init propertys
     * @param form
     * @param alphas
     * @param price_info
     * @param error
     */
    initPropertys({ form, alphas, price_info, error }) {
        form[PROPERTYS.NUMBER.CODE] = "";
        form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] = "";
        form[PROPERTYS.PROXY_TIME.CODE] = "";
        form[PROPERTYS.DIRECTING_NUMBER.CODE] = "";
        price_info[PROPERTYS.NUMBER.CODE] = 0;
        price_info[PROPERTYS.P_P_NUKKI_NUMBER.CODE] = 0;
        price_info[PROPERTYS.PROXY_TIME.CODE] = 0;
        price_info[PROPERTYS.DIRECTING_NUMBER.CODE] = 0;
        // end ./ counting
        alphas.number = false;
        alphas.p_p_nukki_number = false;
        alphas.directing_number = false;
        alphas.proxy_time = false;
        // error init
        error[PROPERTYS.NUMBER.CODE].show = false;
        error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = false;
        error[PROPERTYS.DIRECTING_NUMBER.CODE].show = false;
        error[PROPERTYS.PROXY_TIME.CODE].show = false;
    }

    /**
     * init activate
     * @param c_code
     * @param form
     * @param price_info
     * @param alphas
     * @param error
     */
    initShotKindActivity(c_code, { form, price_info, alphas, error }) {
        this.initPropertys({ form, price_info, alphas, error });

        if (c_code === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
            form[PROPERTYS.DIRECTING_KIND.CODE] = "";
        }

        if (c_code === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
            form[PROPERTYS.DIRECTING_KIND.CODE] = DIRECTING_PROPERTY.BASIC.CODE;
        }

        if (c_code === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
            form[PROPERTYS.DIRECTING_KIND.CODE] = DIRECTING_PROPERTY.BASIC.CODE;
            form[PROPERTYS.PROXY_DIRECTING_KIND.CODE] = "";
        }
    }

    /**
     * 버튼 선택 액션
     * @param e
     * @param p_code
     * @param c_code
     */
    onActive(e, p_code, c_code) {
        const { list, price_info, form, alphas, error } = this.state;
        const _list = this.composeActiveList(list, p_code, c_code);
        // 촬영 종류 클릭 시 모든 값 초기화
        if (p_code === "shot_kind") {
            if (typeof this.props.onChangeShotKind === "function") {
                this.props.onChangeShotKind();
            }
            this.initShotKindActivity(c_code, { form, price_info, alphas, error });
        }

        if (p_code === PROPERTYS.DIRECTING_KIND.CODE) {
            if (c_code === DIRECTING_PROPERTY.PROXY.CODE) {
                form[PROPERTYS.DIRECTING_NUMBER.CODE] = "";
                price_info[PROPERTYS.DIRECTING_NUMBER.CODE] = 0;
            }
            if (c_code === DIRECTING_PROPERTY.BASIC.CODE) {
                form[PROPERTYS.PROXY_TIME.CODE] = "";
                price_info[PROPERTYS.PROXY_TIME.CODE] = 0;
            }
        }

        /**
         *  ===== 에러값 설정 =====
         */
        // 에러값 촬영 종류 : 누끼 촬영
        // if (c_code === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
        // }

        // 에러값 촬영 종류 : 연출 촬영
        if (c_code === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
            if (p_code === PROPERTYS.DIRECTING_KIND.CODE === (c_code === DIRECTING_PROPERTY.BASIC.CODE || c_code === DIRECTING_PROPERTY.PROXY.CODE)) {
                error[PROPERTYS.DIRECTING_NUMBER.CODE].show = (!form[PROPERTYS.NUMBER.CODE]) || false;
            }
        }

        // 에러값 촬영 종류 : 누끼+연출
        if (c_code === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
            error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = (form[PROPERTYS.NUMBER.CODE] && !form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;
        }

        // 에러값 촬영 종류 : 연출 촬영
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
            if (p_code === PROPERTYS.DIRECTING_KIND.CODE) {
                if (c_code === DIRECTING_PROPERTY.BASIC.CODE) {
                    error[PROPERTYS.PROXY_TIME.CODE].show = false;
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = true;
                }

                if (c_code === DIRECTING_PROPERTY.PROXY.CODE) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = false;
                    error[PROPERTYS.PROXY_TIME.CODE].show = true;
                }
            }
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
            if (p_code === PROPERTYS.DIRECTING_KIND.CODE) {
                error[PROPERTYS.NUMBER.CODE].show = (!form[PROPERTYS.NUMBER.CODE]) || false;
                if (c_code === DIRECTING_PROPERTY.BASIC.CODE) {
                    error[PROPERTYS.PROXY_TIME.CODE].show = false;
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show =
                        (
                            form[PROPERTYS.NUMBER.CODE] &&
                            form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] &&
                            !form[PROPERTYS.DIRECTING_NUMBER.CODE]) || false;
                }

                if (c_code === DIRECTING_PROPERTY.PROXY.CODE) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = false;
                    error[PROPERTYS.PROXY_TIME.CODE].show =
                        (
                            form[PROPERTYS.NUMBER.CODE] &&
                            form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] &&
                            !form[PROPERTYS.PROXY_TIME.CODE]) || false;
                }
            }
        }

        // ===== 끝 ./ 에러값 설정 =====

        this.setState({
            form: { ...form, [p_code]: c_code },
            list: _list,
            price_info: { ...price_info },
            alphas,
            error
        }, () => {
            this.calculatePrice();
        });
    }

    /**
     * 가격을 계산한다.
     */
    calculatePrice() {
        const { price_info, form } = this.state;
        let total_price = "";
        let resultFlag = true;

        if (form.shot_kind === "nukki_shot" && form[PROPERTYS.NUMBER.CODE] && form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) {
            total_price = price_info.number * (price_info.p_p_nukki_number || 1) * price_info.nukki_price;
        }

        if (form.shot_kind === "directing_shot") {
            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE) {
                total_price += price_info[PROPERTYS.DIRECTING_NUMBER.CODE] * price_info.directing_price;
                total_price *= 1;
            }

            if (form.proxy_time) {
                let add_price = 100000;
                if (form[PROPERTYS.PROXY_DIRECTING_KIND.CODE] === PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE) {
                    add_price = 200000;
                }
                total_price += price_info.proxy_time * add_price;
            }
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE && form[PROPERTYS.NUMBER.CODE] && form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) {
            total_price = price_info.number * (price_info.p_p_nukki_number || 1) * price_info.nukki_price;

            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE && form[PROPERTYS.DIRECTING_NUMBER.CODE]) {
                total_price += price_info[PROPERTYS.DIRECTING_NUMBER.CODE] * price_info.directing_price;
                total_price *= 1;
            } else if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE && !form[PROPERTYS.DIRECTING_NUMBER.CODE]) {
                resultFlag = false;
            }

            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE && form[PROPERTYS.PROXY_TIME.CODE]) {
                let add_price = 100000;
                if (form[PROPERTYS.PROXY_DIRECTING_KIND.CODE] === PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE) {
                    add_price = 200000;
                }
                total_price += price_info.proxy_time * add_price;
            } else if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE && !form[PROPERTYS.PROXY_TIME.CODE]) {
                resultFlag = false;
            }
        }

        if (!resultFlag) {
            total_price = "";
        }

        if (typeof this.props.onConsultEstimate === "function") {
            this.props.onConsultEstimate(form, total_price, this.hasAlpha());
        }

        if (total_price) {
            if (typeof this.props.gaEvent === "function") {
                this.props.gaEvent("견적산출");
            }
        }
        this.setState({
            total_price,
            prev_total_price: this.state.total_price || 0,
            isAlphas: false
        });
    }

    /**
     * 드롭박스 변경 시
     */
    onChange(value, code) {
        const { form, price_info, alphas, error } = this.state;
        let _value = value;
        if (isNaN(value)) {
            alphas[code] = true;
            _value = _value.substr(0, 2);
        } else {
            alphas[code] = false;
        }

        if (code === PROPERTYS.NUMBER.CODE) {
            error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = !form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] || false;
            error[PROPERTYS.NUMBER.CODE].show = !value || false;
        }

        if (code === PROPERTYS.P_P_NUKKI_NUMBER.CODE) {
            error[PROPERTYS.NUMBER.CODE].show = !form[PROPERTYS.NUMBER.CODE] || false;
            if (form[PROPERTYS.NUMBER.CODE]) {
                error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = (!value && form[PROPERTYS.NUMBER.CODE]) || false;
            }
        }

        // 촬영종류가 연출일때
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE && code === PROPERTYS.DIRECTING_NUMBER.CODE) {
                error[PROPERTYS.DIRECTING_NUMBER.CODE].show = !value || false;
            }

            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE && code === PROPERTYS.PROXY_TIME.CODE) {
                error[PROPERTYS.PROXY_TIME.CODE].show = !value || false;
            }
        }

        // 촬영종류가 누끼+연출일때
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
            if (code === PROPERTYS.NUMBER.CODE) {
                error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = (value && !form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;

                if (form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = (value && !form[PROPERTYS.DIRECTING_NUMBER.CODE]) || false;
                }

                if (form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
                    error[PROPERTYS.PROXY_TIME.CODE].show = (value && !form[PROPERTYS.PROXY_TIME.CODE]) || false;
                }
            }

            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE && code === PROPERTYS.DIRECTING_NUMBER.CODE) {
                error[PROPERTYS.DIRECTING_NUMBER.CODE].show = !value || false;
            }

            if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE && code === PROPERTYS.PROXY_TIME.CODE) {
                error[PROPERTYS.PROXY_TIME.CODE].show = !value || false;
            }

            if (code === PROPERTYS.P_P_NUKKI_NUMBER.CODE) {
                const isDirectingBasic = form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE;
                const isDirectingProxy = form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE;

                if (form[PROPERTYS.NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = (value && !form[PROPERTYS.DIRECTING_NUMBER.CODE]) || false;
                }
                if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
                    error[PROPERTYS.PROXY_TIME.CODE].show = (value && !form[PROPERTYS.PROXY_TIME.CODE]) || false;
                }

                if (form[PROPERTYS.NUMBER.CODE] && isDirectingBasic) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = (value && !form[PROPERTYS.DIRECTING_NUMBER.CODE]) || false;
                }

                if (form[PROPERTYS.NUMBER.CODE] && isDirectingProxy) {
                    error[PROPERTYS.PROXY_TIME.CODE].show = (value && !form[PROPERTYS.PROXY_TIME.CODE]) || false;
                }
            }

            // 필요 연출 총 컷수를 선택했을때
            if (code === PROPERTYS.DIRECTING_NUMBER.CODE) {
                // 제품개수가 선택이 안되었다면 제품개수 오류를 출력한다.
                error[PROPERTYS.NUMBER.CODE].show = (value && !form[PROPERTYS.NUMBER.CODE]) || false;
                // 제품 당 필요 누끼 컷수 선택이 안되어 있다면 해당 오류를 출력한다.
                error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = (value && form[PROPERTYS.NUMBER.CODE] && !form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;
            }
        }

        this.setState({
            form: { ...form, [code]: value },
            price_info: { ...price_info, [code]: _value },
            alphas: { ...alphas },
            error
        }, () => {
            this.calculatePrice();
        });
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    /**
     * 작가에게 직접 상담신청
     */
    onConsultSearchArtist() {
        if (typeof this.props.onConsultSearchArtist === "function") {
            this.props.onConsultSearchArtist();
        }
    }

    /**
     * 포스냅에게 상담신청하기
     * @param hasAlpha
     */
    onConsultForsnap() {
        if (typeof this.props.onConsultForsnap === "function") {
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_B.CODE);
        }
    }

    render() {
        const { list, total_price, prev_total_price, form, info, error, alphas, numbers, isAlphas } = this.state;
        const { estimateFlags } = this.props;
        const props = {
            ...estimateFlags
        };

        return (
            <div>
                <VirtualEstimateView {...props} list={list} info={info} form={form} error={error} numbers={numbers} onActive={this.onActive} onChange={this.onChange} />
                <VirtualEstimateTotalView
                    {...props}
                    total_price={total_price}
                    isAlphas={isAlphas}
                    prev_total_price={prev_total_price}
                    alphas={alphas}
                    onConsultSearchArtist={this.onConsultSearchArtist}
                    onConsultForsnap={this.onConsultForsnap}
                    gaEvent={this.gaEvent}
                />
            </div>
        );
    }
}

