import React, { Component, PropTypes } from "react";
import VirtualEstimateView from "../component/VirtualEstimateView";
import VirtualEstimateTotalView from "../component/VirtualEstimateTotalView";
import utils from "forsnap-utils";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import {
    PROPERTYS,
    HAS_PROPERTY,
    PLACE_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    PROXY_DIRECTING_PROPERTY,
    DIRECTING_PROPERTY,
    SHOT_KIND_PROPERTY
} from "../virtual_estimate.const";
import * as helper from "../virtualEstimateHelper";

export default class VirtualProduct extends Component {
    constructor(props) {
        super(props);
        const data = Object.assign({}, props.data);
        this.state = {
            data,
            list: data.LIST,
            form: {
                [PROPERTYS.SHOT_KIND.CODE]: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                [PROPERTYS.SIZE.CODE]: SIZE_PROPERTY.SMALL.CODE,
                [PROPERTYS.MATERIAL.CODE]: MATERIAL_PROPERTY.GLOSSLESS.CODE,
                [PROPERTYS.DIRECTING_KIND.CODE]: "",
                // 제품 갯수
                [PROPERTYS.NUMBER.CODE]: "",
                // 누끼 갯수
                [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: "",
                // 연출 갯수
                [PROPERTYS.DIRECTING_NUMBER.CODE]: "",
                // 촬영 대행 시간
                [PROPERTYS.PROXY_TIME.CODE]: ""
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
                // 컷당 누끼 단가들
                nukki_price_1: 10000,   // 소형 무광
                nukki_price_2: 12000,   // 대형 무광
                nukki_price_3: 15000,   // 소형 유광
                nukki_price_4: 30000,   // 대형 유광
                // 컷당 연출 단가들
                directing_price_1: 40000,   // 소형 기본
                directing_price_2: 50000,   // 대형 기본
                directing_price_3: 60000,   // 소형 컨셉
                directing_price_4: 70000,   // 대형 컨셉
                directing_price: 40000
            },
            alphas: {
                [PROPERTYS.NUMBER.CODE]: false,
                [PROPERTYS.PROXY_TIME.CODE]: false,
                [PROPERTYS.DIRECTING_NUMBER.CODE]: false,
                [PROPERTYS.P_P_NUKKI_NUMBER.CODE]: false
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
                PROPERTYS.SIZE.CODE,
                PROPERTYS.MATERIAL.CODE,
                PROPERTYS.DIRECTING_KIND.CODE,
                PROPERTYS.PROXY_DIRECTING_KIND.CODE
            ],
            priceInfoKey: [
                PROPERTYS.NUMBER.CODE,
                PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                PROPERTYS.DIRECTING_NUMBER.CODE,
                PROPERTYS.PROXY_TIME.CODE
            ],
            info: {
                [PROPERTYS.PROXY_DIRECTING_KIND.CODE]: {
                    [PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE]: { show: false, content: "고객님께서 기획한 연출 컨셉 및 소품으로 촬영 대행 후, 원본 전체를 전달드립니다." },
                    [PROXY_DIRECTING_PROPERTY.DIRECTING_SHOT_PROXY.CODE]: { show: false, content: "작가가 고객님의 제품에 어울리는 연출 컨셉 및 소품을 준비하여 촬영 진행 후, 원본 전체를 전달드립니다." }
                }
            },
            total_price: "",
            prev_total_price: 0
        };
        this.onActive = this.onActive.bind(this);
        this.onChange = this.onChange.bind(this);
        this.composeActionList = this.composeActionList.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.testSetEstimate = this.testSetEstimate.bind(this);
    }

    componentWillMount() {
        const { numbers } = this.state;
        for (let i = 0; i < 19; i += 1) {
            numbers[PROPERTYS.NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}개` });
            if (i < 9) {
                numbers[PROPERTYS.P_P_NUKKI_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
                numbers[PROPERTYS.DIRECTING_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
                numbers[PROPERTYS.PROXY_TIME.CODE].push({ value: `${i + 1}`, name: `${i + 1}시간` });
            }
        }

        numbers[PROPERTYS.NUMBER.CODE].push({ value: "20+a", name: "20개 이상" });
        numbers[PROPERTYS.P_P_NUKKI_NUMBER.CODE].push({ value: "10+a", name: "10컷 이상" });
        numbers[PROPERTYS.DIRECTING_NUMBER.CODE].push({ value: "10+a", name: "10컷 이상" });
        numbers[PROPERTYS.PROXY_TIME.CODE].push({ value: "10+a", name: "10시간 이상" });

        this.setState({ numbers });
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
        this.onActive(null, PROPERTYS.SHOT_KIND.CODE, SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE);
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

    testSetEstimate() {
        const { resData, category } = this.props;
        if (!utils.type.isEmpty(resData) && resData.category === category) {
            this.setReceiveData(JSON.parse(resData.extra_info))
                .then(data => {
                    this.combineReceiveData(data);
                });
        }
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

    /**
     * 버튼 액션 로직
     * @param list
     * @param p_code
     * @param c_code
     * @returns {*}
     */
    composeActionList(list, p_code, c_code) {
        const need = HAS_PROPERTY.NEED.CODE;
        const needless = HAS_PROPERTY.NEEDLESS.CODE;
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
                        PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                        PROPERTYS.SIZE.CODE,
                        PROPERTYS.MATERIAL.CODE,
                        PROPERTYS.IS_NUKKI_ALL_CUT.CODE
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
                    if (o.CODE === PROPERTYS.SIZE.CODE) {
                        helper.targetReduce(ob => helper.changeProp([SIZE_PROPERTY.SMALL.CODE, SIZE_PROPERTY.LARGE.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([SIZE_PROPERTY.SMALL.CODE], ob, true, "DEFAULT"), o);
                    }
                    if (o.CODE === PROPERTYS.MATERIAL.CODE) {
                        helper.targetReduce(ob => helper.changeProp([MATERIAL_PROPERTY.GLOSSLESS.CODE, MATERIAL_PROPERTY.GLOSS.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([MATERIAL_PROPERTY.GLOSSLESS.CODE], ob, true, "DEFAULT"), o);
                    }
                } else if (c_code === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
                    helper.changeProp([
                        PROPERTYS.NUMBER.CODE,
                        PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                        PROPERTYS.SIZE.CODE,
                        PROPERTYS.MATERIAL.CODE,
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

                    if (o.CODE === PROPERTYS.SIZE.CODE) {
                        helper.targetReduce(ob => helper.changeProp([SIZE_PROPERTY.SMALL.CODE, SIZE_PROPERTY.LARGE.CODE], ob, false, "DEFAULT"), o);
                    }

                    if (o.CODE === PROPERTYS.MATERIAL.CODE) {
                        helper.targetReduce(ob => helper.changeProp([MATERIAL_PROPERTY.GLOSS.CODE, MATERIAL_PROPERTY.GLOSSLESS.CODE], ob, false, "DEFAULT"), o);
                    }
                } else if (c_code === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
                    helper.changeProp([
                        PROPERTYS.NUMBER.CODE,
                        PROPERTYS.P_P_NUKKI_NUMBER.CODE,
                        PROPERTYS.SIZE.CODE,
                        PROPERTYS.MATERIAL.CODE,
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
                    if (o.CODE === PROPERTYS.SIZE.CODE) {
                        helper.targetReduce(ob => helper.changeProp([SIZE_PROPERTY.SMALL.CODE, SIZE_PROPERTY.LARGE.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([SIZE_PROPERTY.SMALL.CODE], ob, true, "DEFAULT"), o);
                    }
                    if (o.CODE === PROPERTYS.MATERIAL.CODE) {
                        helper.targetReduce(ob => helper.changeProp([MATERIAL_PROPERTY.GLOSSLESS.CODE, MATERIAL_PROPERTY.GLOSS.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([MATERIAL_PROPERTY.GLOSSLESS.CODE], ob, true, "DEFAULT"), o);
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
     * 버튼 선택 액션
     * @param e
     * @param p_code
     * @param c_code
     */
    onActive(e, p_code, c_code) {
        const { list, price_info, form, alphas, error } = this.state;
        const _list = this.composeActionList(list, p_code, c_code);
        /**
         * 데이터 초기화
         */
        if (p_code === PROPERTYS.SHOT_KIND.CODE) {
            if (typeof this.props.onChangeShotKind === "function") {
                this.props.onChangeShotKind();
            }

            // counting
            form[PROPERTYS.NUMBER.CODE] = "";
            form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] = "";
            form[PROPERTYS.PROXY_TIME.CODE] = "";
            form[PROPERTYS.DIRECTING_NUMBER.CODE] = "";
            price_info[PROPERTYS.NUMBER.CODE] = 0;
            price_info[PROPERTYS.P_P_NUKKI_NUMBER.CODE] = 0;
            price_info[PROPERTYS.PROXY_TIME.CODE] = 0;
            price_info[PROPERTYS.DIRECTING_NUMBER.CODE] = 0;
            // end ./ counting
            alphas[PROPERTYS.NUMBER.CODE] = false;
            alphas[PROPERTYS.P_P_NUKKI_NUMBER.CODE] = false;
            alphas[PROPERTYS.DIRECTING_NUMBER.CODE] = false;
            alphas[PROPERTYS.PROXY_TIME.CODE] = false;
            // error init
            error[PROPERTYS.NUMBER.CODE].show = false;
            error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = false;
            error[PROPERTYS.PROXY_TIME.CODE].show = false;
            error[PROPERTYS.DIRECTING_NUMBER.CODE].show = false;

            // 촬영 종류 바뀔때 타입에 따른 데이터 초기화
            // // 촬영종류 : 누끼 촬영
            if (c_code === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
                form[PROPERTYS.DIRECTING_KIND.CODE] = "";
                form[PROPERTYS.SIZE.CODE] = SIZE_PROPERTY.SMALL.CODE;
                form[PROPERTYS.MATERIAL.CODE] = MATERIAL_PROPERTY.GLOSSLESS.CODE;
            }

            // // 촬영종류 : 연출 촬영
            if (c_code === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
                form[PROPERTYS.DIRECTING_KIND.CODE] = DIRECTING_PROPERTY.BASIC.CODE;
                form[PROPERTYS.SIZE.CODE] = "";
                form[PROPERTYS.MATERIAL.CODE] = "";
            }

            // // 촬영종류 : 누끼+연출 촬영
            if (c_code === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
                form[PROPERTYS.DIRECTING_KIND.CODE] = DIRECTING_PROPERTY.BASIC.CODE;
                form[PROPERTYS.SIZE.CODE] = SIZE_PROPERTY.SMALL.CODE;
                form[PROPERTYS.MATERIAL.CODE] = MATERIAL_PROPERTY.GLOSSLESS.CODE;
                form[PROPERTYS.PROXY_DIRECTING_KIND.CODE] = "";
            }
        }

        // 연출 종류를 대행연출을 선택했을때
        if (p_code === PROPERTYS.DIRECTING_KIND.CODE) {
            if (c_code === DIRECTING_PROPERTY.PROXY.CODE) {
                form[PROPERTYS.PROXY_DIRECTING_KIND.CODE] = PROXY_DIRECTING_PROPERTY.SHOT_PROXY.CODE;
            } else if (c_code === DIRECTING_PROPERTY.BASIC.CODE) {
                form[PROPERTYS.PROXY_DIRECTING_KIND.CODE] = "";
            }
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
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
            if (p_code === PROPERTYS.MATERIAL.CODE || p_code === PROPERTYS.SIZE.CODE || p_code === PROPERTYS.IS_NUKKI_ALL_CUT.CODE) {
                error[PROPERTYS.NUMBER.CODE].show = !form[PROPERTYS.NUMBER.CODE] || false;
                error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = (form[PROPERTYS.NUMBER.CODE] && !form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;
            }
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

        // 에러값 촬영 종류 : 누끼+연출
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
            if (p_code === PROPERTYS.MATERIAL.CODE || p_code === PROPERTYS.SIZE.CODE || p_code === PROPERTYS.IS_NUKKI_ALL_CUT.CODE || p_code === PROPERTYS.DIRECTING_KIND.CODE) {
                error[PROPERTYS.NUMBER.CODE].show = !form[PROPERTYS.NUMBER.CODE] || false;
                error[PROPERTYS.P_P_NUKKI_NUMBER.CODE].show = (form[PROPERTYS.NUMBER.CODE] && !form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;
            }

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
            let nukki_price = "";
            const size = form.size || "small";
            const material = form.material || "glossless";

            if (size === "small" && material === "glossless") {         // 누끼, 소형 + 무광
                nukki_price = price_info.nukki_price_1;
            } else if (size === "small" && material === "gloss") {      // 누끼, 소형 + 유광
                nukki_price = price_info.nukki_price_3;
            } else if (size === "large" && material === "glossless") {  // 누끼, 대형 + 무광
                nukki_price = price_info.nukki_price_2;
            } else if (size === "large" && material === "gloss") {      // 누끼, 대형 + 유광
                nukki_price = price_info.nukki_price_4;
            }

            total_price = price_info.number * (price_info.p_p_nukki_number || 1) * nukki_price;
            total_price *= 1;
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
            let nukki_price = "";
            const size = form.size || "small";
            const material = form.material || "glossless";

            if (size === "small" && material === "glossless") {         // 누끼, 소형 + 무광
                nukki_price = price_info.nukki_price_1;
            } else if (size === "small" && material === "gloss") {      // 누끼, 소형 + 유광
                nukki_price = price_info.nukki_price_3;
            } else if (size === "large" && material === "glossless") {  // 누끼, 대형 + 무광
                nukki_price = price_info.nukki_price_2;
            } else if (size === "large" && material === "gloss") {      // 누끼, 대형 + 유광
                nukki_price = price_info.nukki_price_4;
            }

            total_price = price_info.number * (price_info.p_p_nukki_number || 1) * nukki_price;
            total_price *= 1;

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

        const need = HAS_PROPERTY.NEED.CODE;
        const needless = HAS_PROPERTY.NEEDLESS.CODE;

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
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = (value && form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] && !form[PROPERTYS.DIRECTING_NUMBER.CODE]) || false;
                }

                if (form[PROPERTYS.P_P_NUKKI_NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
                    error[PROPERTYS.PROXY_TIME.CODE].show = (value && !form[PROPERTYS.PROXY_TIME.CODE]) || false;
                }
            }

            if (code === PROPERTYS.P_P_NUKKI_NUMBER.CODE) {
                const isDirectingBasic = form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE;
                const isDirectingProxy = form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE;

                if (form[PROPERTYS.NUMBER.CODE] && form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = (value && !form[PROPERTYS.DIRECTING_NUMBER.CODE]) || false;
                }
                if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
                    error[PROPERTYS.PROXY_TIME.CODE].show = (value && form[PROPERTYS.NUMBER.CODE] && !form[PROPERTYS.PROXY_TIME.CODE]) || false;
                }

                if (form[PROPERTYS.NUMBER.CODE] && isDirectingBasic) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show = (value && !form[PROPERTYS.DIRECTING_NUMBER.CODE]) || false;
                }

                if (form[PROPERTYS.NUMBER.CODE] && isDirectingProxy) {
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

                if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.PROXY.CODE) {
                    error[PROPERTYS.PROXY_TIME.CODE].show =
                        (!value && form[PROPERTYS.NUMBER.CODE] &&
                            form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;
                }

                if (form[PROPERTYS.DIRECTING_KIND.CODE] === DIRECTING_PROPERTY.BASIC.CODE) {
                    error[PROPERTYS.DIRECTING_NUMBER.CODE].show =
                        (!value && form[PROPERTYS.NUMBER.CODE] &&
                            form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;
                }
            }

            if (code === PROPERTYS.PROXY_TIME.CODE) {
                error[PROPERTYS.PROXY_TIME.CODE].show =
                    (!value && form[PROPERTYS.NUMBER.CODE] &&
                        form[PROPERTYS.P_P_NUKKI_NUMBER.CODE]) || false;
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
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_P.CODE);
        }
    }

    render() {
        const { estimateFlags } = this.props;
        const { list, total_price, prev_total_price, numbers, error, isAlphas, alphas, form, info } = this.state;
        const props = {
            ...estimateFlags
        };

        return (
            <div>
                <VirtualEstimateView {...props} list={list} info={info} form={form} error={error} numbers={numbers} onActive={this.onActive} onChange={this.onChange} />
                <VirtualEstimateTotalView
                    {...props}
                    isAlphas={isAlphas}
                    total_price={total_price}
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

