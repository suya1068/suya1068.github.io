import React, { Component, PropTypes } from "react";
import VirtualEstimateView from "../component/VirtualEstimateView";
import VirtualEstimateTotalView from "../component/VirtualEstimateTotalView";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import {
    PROPERTYS,
    HAS_PROPERTY,
    PLACE_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    PROXY_DIRECTING_PROPERTY,
    DIRECTING_PROPERTY,
    NUKKI_KIND_PROPERTY,
    SHOT_KIND_PROPERTY
} from "../virtual_estimate.const";
import * as helper from "../virtualEstimateHelper";
import utils from "forsnap-utils";

export default class VirtualFashion extends Component {
    constructor(props) {
        super(props);
        const data = props.data;
        this.state = {
            data,
            list: data.LIST,
            form: {
                [PROPERTYS.SHOT_KIND.CODE]: SHOT_KIND_PROPERTY.NUKKI.CODE,
                [PROPERTYS.NUKKI_KIND.CODE]: NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE,
                [PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]: "",
                [PROPERTYS.N_CLOTHES_P_NUMBER.CODE]: "",
                [PROPERTYS.RETOUCH_NUMBER.CODE]: "",
                [PROPERTYS.DETAIL_NUMBER.CODE]: "",
                [PROPERTYS.MODEL_CASTING.CODE]: "",
                [PROPERTYS.MODEL_TIME.CODE]: "",
                [PROPERTYS.H_M_CASTING.CODE]: "",
                [PROPERTYS.IS_DETAIL_CUT.CODE]: HAS_PROPERTY.NEEDLESS.CODE,
                [PROPERTYS.IS_RETOUCH_ADD.CODE]: HAS_PROPERTY.NEEDLESS.CODE
                // sub_code: "nukki"
            },
            price_info: {
                // 개수 ==
                // 누끼 의상 개수
                [PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]: 0,
                // 누끼 촬영당 의상 갯수
                [PROPERTYS.N_CLOTHES_P_NUMBER.CODE]: 0,
                // 모델 촬영 시간
                [PROPERTYS.MODEL_TIME.CODE]: 0,
                // 리터치 갯수
                [PROPERTYS.RETOUCH_NUMBER.CODE]: 0,
                // 디테일컷 갯수
                [PROPERTYS.DETAIL_NUMBER.CODE]: 0,
                // 개수 끝 ===
                // 단가 ===
                // 바닥누끼 단가
                floor_nukki_price: 6000,
                // 마네킹 누끼 단가
                mannequin_nukki_price: 9000,
                // 고스트컷 단가
                ghost_cut_price: 10000,
                // 모델촬영시간 숏데이(2시간)
                model_time_price_shot: 300000,
                // 모델촬영시간 하프데이(4시간)
                model_time_price_half: 500000,
                // 모델촬영시간 풀데이(8시간)
                model_time_price_full: 1000000,
                // 모델 의상 수 기초 단가
                model_clothes_base_price: 300000,
                // 모델 의상 수 단가
                model_clothes_price: 30000,
                // 리터치 단가
                retouch_price: 5000,
                // 모델 및 헤메 섭외 단가 (모델 촬영 시간에 따라 다름)
                casting_price_shot: 250000,
                casting_price_half: 300000,
                casting_price_full: 500000,
                // 디테일 컷 단가
                detail_cut_price: 4000
            },
            alphas: {
                [PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]: false,
                [PROPERTYS.N_CLOTHES_P_NUMBER.CODE]: false,
                [PROPERTYS.RETOUCH_NUMBER.CODE]: false,
                [PROPERTYS.DETAIL_NUMBER.CODE]: false
            },
            numbers: {
                [PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]: [{ value: "", name: "누끼촬영 의상 수를 선택해주세요." }],
                [PROPERTYS.N_CLOTHES_P_NUMBER.CODE]: [{ value: "", name: "의상 당 누끼촬영 필요 컷수를 선택해주세요." }],
                [PROPERTYS.MODEL_TIME.CODE]: [{ value: "", name: "모델 촬영 시간을 선택해주세요." }],
                [PROPERTYS.RETOUCH_NUMBER.CODE]: [{ value: "", name: "컷 수를 선택해주세요." }],
                [PROPERTYS.DETAIL_NUMBER.CODE]: [{ value: "", name: "컷 수를 선택해주세요." }]
            },
            error: {
                [PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]: { show: false, content: "의상수를 선택해주세요." },
                [PROPERTYS.N_CLOTHES_P_NUMBER.CODE]: { show: false, content: "필요 컷수를 선택해주세요." },
                [PROPERTYS.MODEL_TIME.CODE]: { show: false, content: "시간을 선택해주세요." },
                [PROPERTYS.RETOUCH_NUMBER.CODE]: { show: false, content: "컷 수를 선택해주세요." },
                [PROPERTYS.DETAIL_NUMBER.CODE]: { show: false, content: "컷 수를 선택해주세요." }
                // [PROPERTYS.IS_DETAIL_CUT.CODE]: { show: false, content: "기본 보정본 (밝기, 색감) 이 제공됩니다. 누끼 작업이 필요할 시 별도 문의 바랍니다." }
            },
            info: {
                [PROPERTYS.MODEL_TIME.CODE]: {
                    shot: { show: false, content: "컨셉 및 포즈가 협의된 경우 약 5~10착장 촬영 가능, 원본+톤보정본 전체 제공 (개별컷 리터칭 없음)" },
                    half: { show: false, content: "컨셉 및 포즈가 협의된 경우 약 15~20착장 촬영 가능, 원본+톤보정본 전체 제공 (개별컷 리터칭 없음)" },
                    full: { show: false, content: "컨셉 및 포즈가 협의된 경우 약 30~40착장 촬영 가능, 원본+톤보정본 전체 제공 (개별컷 리터칭 없음)" }
                },
                [PROPERTYS.IS_DETAIL_CUT.CODE]: {
                    need: { show: false, content: "기본 보정본 (밝기, 색감) 이 제공됩니다. 누끼 작업이 필요할 시 별도 문의 바랍니다." }
                }
            },
            priceInfoKey: [
                PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE,
                PROPERTYS.N_CLOTHES_P_NUMBER.CODE,
                PROPERTYS.MODEL_TIME.CODE,
                PROPERTYS.RETOUCH_NUMBER.CODE,
                PROPERTYS.DETAIL_NUMBER.CODE
            ],
            activeButtonKey: [
                PROPERTYS.SHOT_KIND.CODE,
                PROPERTYS.NUKKI_KIND.CODE,
                PROPERTYS.IS_RETOUCH_ADD.CODE,
                PROPERTYS.IS_DETAIL_CUT.CODE,
                PROPERTYS.MODEL_CASTING.CODE,
                PROPERTYS.H_M_CASTING.CODE
            ],
            send_info: {},
            total_price: "",
            prev_total_price: 0
        };
        this.onActive = this.onActive.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onConsultSearchArtist = this.onConsultSearchArtist.bind(this);
        this.onConsultForsnap = this.onConsultForsnap.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.testSetEstimate = this.testSetEstimate.bind(this);
    }

    componentWillMount() {
        const { numbers } = this.state;
        for (let i = 0; i < 29; i += 1) {
            numbers[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}벌` });
            if (i < 9) {
                numbers[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}개` });
                numbers[PROPERTYS.DETAIL_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
                numbers[PROPERTYS.RETOUCH_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
            }
        }
        numbers[PROPERTYS.MODEL_TIME.CODE].push({ value: "shot", name: "숏데이 (2시간)" });
        numbers[PROPERTYS.MODEL_TIME.CODE].push({ value: "half", name: "하프데이 (4시간)" });
        numbers[PROPERTYS.MODEL_TIME.CODE].push({ value: "full", name: "풀데이 (8시간)" });

        numbers[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].push({ value: "30+a", name: "30벌 이상" });
        numbers[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].push({ value: "10+a", name: "10개 이상" });
        numbers[PROPERTYS.DETAIL_NUMBER.CODE].push({ value: "10+a", name: "10컷 이상" });
        numbers[PROPERTYS.RETOUCH_NUMBER.CODE].push({ value: "10+a", name: "10컷 이상" });

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
        this.onActive(null, "shot_kind", "nukki");
    }
    testSetEstimate() {
        const { resData } = this.props;
        if (!utils.type.isEmpty(resData) && resData.category === this.props.category) {
            this.setReceiveData(JSON.parse(resData.extra_info))
                .then(data => {
                    this.combineReceiveData(data);
                });
        }
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
     * 알파값 체크
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
    composeActiveList(list, p_code, c_code) {
        return list.reduce((result, obj) => {
            // 활성화 변경 로직
            if (obj.CODE === p_code) {
                obj.PROP.reduce((re, ob) => {
                    ob.DEFAULT = c_code === ob.CODE || false;
                    re.push(ob);
                    return re;
                }, []);
            }

            const is_check =
                obj.CODE === PROPERTYS.IS_RETOUCH_ADD.CODE
                || obj.CODE === PROPERTYS.IS_DETAIL_CUT.CODE;

            // disabled 변경 로직
            // // 누끼촬영
            if (c_code === SHOT_KIND_PROPERTY.NUKKI.CODE) {
                helper.changeProp([PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE, PROPERTYS.N_CLOTHES_P_NUMBER.CODE, PROPERTYS.NUKKI_KIND.CODE], obj, false);
                helper.changeProp([PROPERTYS.MODEL_TIME.CODE, PROPERTYS.MODEL_CASTING.CODE, PROPERTYS.H_M_CASTING.CODE], obj, true);

                if (obj.CODE === PROPERTYS.NUKKI_KIND.CODE) {
                    helper.targetReduce(ob => helper.changeProp([NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE], ob, true, "DEFAULT"), obj);
                }

                if (obj.CODE === PROPERTYS.MODEL_CASTING.CODE || obj.CODE === PROPERTYS.H_M_CASTING.CODE) {
                    helper.targetReduce(ob => helper.changeProp([HAS_PROPERTY.NEED.CODE, HAS_PROPERTY.NEEDLESS.CODE], ob, false, "DEFAULT"), obj);
                }
            }
            // // 모델촬영
            if (c_code === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
                helper.changeProp([PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE, PROPERTYS.N_CLOTHES_P_NUMBER.CODE, PROPERTYS.NUKKI_KIND.CODE], obj, true);
                helper.changeProp([PROPERTYS.MODEL_TIME.CODE, PROPERTYS.MODEL_CASTING.CODE, PROPERTYS.H_M_CASTING.CODE], obj, false);

                if (obj.CODE === PROPERTYS.NUKKI_KIND.CODE) {
                    helper.targetReduce(ob => helper.changeProp(["floor_nukki", "mannequin_nukki", "ghost_cut"], ob, false, "DEFAULT"), obj);
                }

                if (obj.CODE === PROPERTYS.MODEL_CASTING.CODE || obj.CODE === PROPERTYS.H_M_CASTING.CODE) {
                    helper.targetReduce(ob => helper.changeProp([HAS_PROPERTY.NEED.CODE], ob, false, "DEFAULT"), obj);
                    helper.targetReduce(ob => helper.changeProp([HAS_PROPERTY.NEEDLESS.CODE], ob, true, "DEFAULT"), obj);
                }
            }

            // // 누끼+모델 촬영
            if (c_code === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
                helper.changeProp(
                    [
                        PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE,
                        PROPERTYS.N_CLOTHES_P_NUMBER.CODE,
                        PROPERTYS.NUKKI_KIND.CODE,
                        PROPERTYS.MODEL_TIME.CODE,
                        PROPERTYS.MODEL_CASTING.CODE,
                        PROPERTYS.H_M_CASTING.CODE
                    ],
                    obj,
                    false
                );

                if (obj.CODE === PROPERTYS.NUKKI_KIND.CODE) {
                    helper.targetReduce(ob => helper.changeProp(["floor_nukki", "mannequin_nukki", "ghost_cut"], ob, false, "DEFAULT"), obj);
                    helper.targetReduce(ob => helper.changeProp(["floor_nukki"], ob, true, "DEFAULT"), obj);
                }

                if (obj.CODE === PROPERTYS.MODEL_CASTING.CODE || obj.CODE === PROPERTYS.H_M_CASTING.CODE) {
                    helper.targetReduce(ob => helper.changeProp([HAS_PROPERTY.NEED.CODE], ob, false, "DEFAULT"), obj);
                    helper.targetReduce(ob => helper.changeProp([HAS_PROPERTY.NEEDLESS.CODE], ob, true, "DEFAULT"), obj);
                }
            }

            if (p_code === PROPERTYS.IS_RETOUCH_ADD.CODE && c_code === HAS_PROPERTY.NEED.CODE) {
                helper.changeProp([PROPERTYS.RETOUCH_NUMBER.CODE], obj, false);
            } else if (p_code === PROPERTYS.IS_RETOUCH_ADD.CODE && c_code === HAS_PROPERTY.NEEDLESS.CODE) {
                helper.changeProp([PROPERTYS.RETOUCH_NUMBER.CODE], obj, true);
            }

            if (p_code === PROPERTYS.IS_DETAIL_CUT.CODE && c_code === HAS_PROPERTY.NEED.CODE) {
                helper.changeProp([PROPERTYS.DETAIL_NUMBER.CODE], obj, false);
            } else if (p_code === PROPERTYS.IS_DETAIL_CUT.CODE && c_code === HAS_PROPERTY.NEEDLESS.CODE) {
                helper.changeProp([PROPERTYS.DETAIL_NUMBER.CODE], obj, true);
            }

            if (p_code === PROPERTYS.SHOT_KIND.CODE) {
                if (is_check) {
                    helper.targetReduce(ob => helper.changeProp(["need"], ob, false, "DEFAULT"), obj);
                    helper.targetReduce(ob => helper.changeProp(["needless"], ob, true, "DEFAULT"), obj);
                }

                helper.changeProp([PROPERTYS.DETAIL_NUMBER.CODE, PROPERTYS.RETOUCH_NUMBER.CODE], obj, true);
            }

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
        let send_info = this.state.send_info;
        const _list = this.composeActiveList(list, p_code, c_code);

        const needless = HAS_PROPERTY.NEEDLESS.CODE;
        const need = HAS_PROPERTY.NEED.CODE;

        /**
         * 데이터 초기화
         */
        // 촬영 종류를 클릭하면 다른 구간의 값을 초기화 한다.
        if (p_code === "shot_kind") {
            form[PROPERTYS.IS_RETOUCH_ADD.CODE] = needless;
            form[PROPERTYS.IS_DETAIL_CUT.CODE] = needless;
            form[PROPERTYS.RETOUCH_NUMBER.CODE] = "";
            form[PROPERTYS.DETAIL_NUMBER.CODE] = "";
            price_info[PROPERTYS.RETOUCH_NUMBER.CODE] = "";
            price_info[PROPERTYS.DETAIL_NUMBER.CODE] = "";
            // error init
            error[PROPERTYS.RETOUCH_NUMBER.CODE].show = false;
            error[PROPERTYS.DETAIL_NUMBER.CODE].show = false;
            error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = false;
            error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = false;
            error[PROPERTYS.MODEL_TIME.CODE].show = false;
            // alphas init
            alphas[PROPERTYS.DETAIL_NUMBER.CODE] = false;
            alphas[PROPERTYS.RETOUCH_NUMBER.CODE] = false;
            alphas[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] = false;
            alphas[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] = false;
            alphas[PROPERTYS.MODEL_TIME.CODE] = false;

            if (typeof this.props.onChangeShotKind === "function") {
                this.props.onChangeShotKind();
            }

            if (c_code === SHOT_KIND_PROPERTY.NUKKI.CODE) {
                form[PROPERTYS.NUKKI_KIND.CODE] = NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE;
                form[PROPERTYS.MODEL_TIME.CODE] = "";
                price_info[PROPERTYS.MODEL_TIME.CODE] = 0;
                //
                form[PROPERTYS.MODEL_CASTING.CODE] = "";
                form[PROPERTYS.H_M_CASTING.CODE] = "";
                alphas[PROPERTYS.MODEL_TIME.CODE] = false;
                send_info = {};
            }
            if (c_code === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
                form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] = "";
                form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] = "";
                form[PROPERTYS.NUKKI_KIND.CODE] = "";
                price_info[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] = 0;
                price_info[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] = 0;
                //
                form[PROPERTYS.MODEL_CASTING.CODE] = needless;
                form[PROPERTYS.H_M_CASTING.CODE] = needless;
                send_info = form[PROPERTYS.MODEL_TIME.CODE] ? send_info : {};
                alphas[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] = false;
                alphas[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] = false;
            }

            if (c_code === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
                form[PROPERTYS.MODEL_CASTING.CODE] = needless;
                form[PROPERTYS.H_M_CASTING.CODE] = needless;
            }
        }

        if (p_code === PROPERTYS.IS_RETOUCH_ADD.CODE && c_code === needless) {
            form[PROPERTYS.RETOUCH_NUMBER.CODE] = "";
            price_info[PROPERTYS.RETOUCH_NUMBER.CODE] = 0;
        }

        if (p_code === PROPERTYS.IS_DETAIL_CUT.CODE && c_code === needless) {
            form[PROPERTYS.DETAIL_NUMBER.CODE] = "";
            price_info[PROPERTYS.DETAIL_NUMBER.CODE] = 0;
        }

        const isRetouchAdd = form[PROPERTYS.IS_RETOUCH_ADD.CODE] === need;
        const isDetailCut = form[PROPERTYS.IS_DETAIL_CUT.CODE] === need;
        const baseDataAllSet = form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE];

        /**
         * 에러 설정
         */
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
            if (!form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]) {
                if (p_code === PROPERTYS.NUKKI_KIND.CODE || p_code === PROPERTYS.IS_RETOUCH_ADD.CODE || p_code === PROPERTYS.IS_DETAIL_CUT.CODE) {
                    error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = true;
                }
            }

            if (p_code === PROPERTYS.IS_RETOUCH_ADD.CODE) {
                if (c_code === need) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (baseDataAllSet && (
                        (isDetailCut && form[PROPERTYS.DETAIL_NUMBER.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) ||
                        (!isDetailCut && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) ||
                        (isDetailCut && !form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER])
                    )) || false;

                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (baseDataAllSet && (
                        (isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER.CODE])
                    )) || false;
                }

                if (c_code === needless) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = false;
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE]) || false;
                }
            }

            if (p_code === PROPERTYS.IS_DETAIL_CUT.CODE) {
                if (c_code === need) {
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (baseDataAllSet && (
                        (isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER.CODE]) ||
                        (!isRetouchAdd && !form[PROPERTYS.DETAIL_NUMBER.CODE]))) || false;
                }
                if (c_code === needless) {
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = false;
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (isRetouchAdd && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                }
            }
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
            if (p_code === PROPERTYS.MODEL_CASTING.CODE ||
                p_code === PROPERTYS.H_M_CASTING.CODE ||
                p_code === PROPERTYS.IS_RETOUCH_ADD.CODE ||
                p_code === PROPERTYS.IS_DETAIL_CUT.CODE
            ) {
                error[PROPERTYS.MODEL_TIME.CODE].show = !form[PROPERTYS.MODEL_TIME.CODE] || false;

                if (form[PROPERTYS.MODEL_TIME.CODE]) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (isRetouchAdd && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd) && isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE]) || false;
                }
            }

            if (p_code === PROPERTYS.IS_RETOUCH_ADD.CODE) {
                if (c_code === need) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (form[PROPERTYS.MODEL_TIME.CODE] && (
                        (isDetailCut && form[PROPERTYS.DETAIL_NUMBER.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) ||
                        (!isDetailCut && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) ||
                        (isDetailCut && !form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER])
                    )) || false;

                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (form[PROPERTYS.MODEL_TIME.CODE] && (
                        (isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER.CODE])
                    )) || false;
                }

                if (c_code === needless) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = false;
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (form[PROPERTYS.MODEL_TIME.CODE] && isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE]) || false;
                }
            }

            if (p_code === PROPERTYS.IS_DETAIL_CUT.CODE) {
                if (c_code === need) {
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (form[PROPERTYS.MODEL_TIME.CODE] && (
                        (isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER.CODE]) ||
                        (!isRetouchAdd && !form[PROPERTYS.DETAIL_NUMBER.CODE]))) || false;
                }
                if (c_code === needless) {
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = false;
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (form[PROPERTYS.MODEL_TIME.CODE] && isRetouchAdd && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                }
            }
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
            if (p_code === PROPERTYS.NUKKI_KIND.CODE ||
                p_code === PROPERTYS.MODEL_CASTING.CODE ||
                p_code === PROPERTYS.H_M_CASTING.CODE ||
                p_code === PROPERTYS.IS_RETOUCH_ADD.CODE ||
                p_code === PROPERTYS.IS_DETAIL_CUT.CODE) {
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] || false;
            }

            if (p_code === PROPERTYS.IS_RETOUCH_ADD.CODE) {
                if (c_code === need) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (baseDataAllSet && form[PROPERTYS.MODEL_TIME.CODE] && (
                        (isDetailCut && form[PROPERTYS.DETAIL_NUMBER.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) ||
                        (!isDetailCut && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) ||
                        (isDetailCut && !form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER])
                    )) || false;

                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (baseDataAllSet && form[PROPERTYS.MODEL_TIME.CODE] && (
                        (isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER.CODE])
                    )) || false;
                }

                if (c_code === needless) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = false;
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (isDetailCut && form[PROPERTYS.MODEL_TIME.CODE] && !form[PROPERTYS.DETAIL_NUMBER.CODE]) || false;
                }
            }

            if (p_code === PROPERTYS.IS_DETAIL_CUT.CODE) {
                if (c_code === need) {
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (baseDataAllSet && form[PROPERTYS.MODEL_TIME.CODE] && (
                        (isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE] && !form[PROPERTYS.DETAIL_NUMBER.CODE]) ||
                        (!isRetouchAdd && !form[PROPERTYS.DETAIL_NUMBER.CODE]))) || false;
                }
                if (c_code === needless) {
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = false;
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (isRetouchAdd && form[PROPERTYS.MODEL_TIME.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                }
            }
        }


        this.setState({
            form: { ...form, [p_code]: c_code },
            list: _list,
            price_info: { ...price_info },
            alphas,
            send_info,
            error
        }, () => {
            this.calculatePrice();
        });
    }

    /**
     * 가격을 계산한다.
     */
    calculatePrice() {
        const { form, price_info } = this.state;
        let total_price = "";
        let resultFlag = true;
        const need = HAS_PROPERTY.NEED.CODE;

        const etcPriceCalc = () => {
            if (form[PROPERTYS.IS_RETOUCH_ADD.CODE] === HAS_PROPERTY.NEED.CODE) {
                if (form[PROPERTYS.RETOUCH_NUMBER.CODE]) {
                    total_price += price_info[PROPERTYS.RETOUCH_NUMBER.CODE] * price_info.retouch_price;
                    total_price *= 1;
                } else {
                    resultFlag = false;
                }
            }

            if (form[PROPERTYS.IS_DETAIL_CUT.CODE] === HAS_PROPERTY.NEED.CODE) {
                if (form[PROPERTYS.DETAIL_NUMBER.CODE]) {
                    total_price += price_info[PROPERTYS.DETAIL_NUMBER.CODE] * price_info.detail_cut_price;
                    total_price *= 1;
                } else {
                    resultFlag = false;
                }
            }
        };

        if (form.shot_kind === "nukki" && form.nukki_clothes_number && form.n_clothes_p_number) {
            const nukki_type = form.nukki_kind;
            let sub_price = "";
            if (nukki_type === NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE) {
                sub_price = price_info.floor_nukki_price;
            }

            if (nukki_type === NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE) {
                sub_price = price_info.mannequin_nukki_price;
            }

            if (nukki_type === NUKKI_KIND_PROPERTY.GHOST_CUT.CODE) {
                sub_price = price_info.ghost_cut_price;
            }
            total_price = price_info.nukki_clothes_number * price_info.n_clothes_p_number * sub_price;
            etcPriceCalc();
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE && form[PROPERTYS.MODEL_TIME.CODE]) {
            const modelTime = form[PROPERTYS.MODEL_TIME.CODE];
            let sub_price = "";
            let casting_price = 0;
            if (modelTime === "shot") {
                if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_shot;
                }
                if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_shot;
                }

                sub_price = price_info.model_time_price_shot + casting_price;
            } else if (modelTime === "half") {
                if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_half;
                }
                if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_half;
                }
                sub_price = price_info.model_time_price_half + casting_price;
            } else if (modelTime === "full") {
                if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_full;
                }
                if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_full;
                }
                sub_price = price_info.model_time_price_full + casting_price;
            }

            total_price += sub_price;
            total_price *= 1;
            etcPriceCalc();
        }
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE && form[PROPERTYS.MODEL_TIME.CODE] && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE]) {
            const modelTime = form[PROPERTYS.MODEL_TIME.CODE];
            const nukki_type = form.nukki_kind;
            let model_sub_price = "";
            let casting_price = 0;

            let nukki_sub_price = "";
            if (nukki_type === NUKKI_KIND_PROPERTY.FLOOR_NUKKI.CODE) {
                nukki_sub_price = price_info.floor_nukki_price;
            }

            if (nukki_type === NUKKI_KIND_PROPERTY.MANNEQUIN_NUKKI.CODE) {
                nukki_sub_price = price_info.mannequin_nukki_price;
            }

            if (nukki_type === NUKKI_KIND_PROPERTY.GHOST_CUT.CODE) {
                nukki_sub_price = price_info.ghost_cut_price;
            }
            total_price = price_info.nukki_clothes_number * price_info.n_clothes_p_number * nukki_sub_price;
            total_price *= 1;

            if (modelTime === "shot") {
                if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_shot;
                }
                if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_shot;
                }

                model_sub_price = price_info.model_time_price_shot + casting_price;
            } else if (modelTime === "half") {
                if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_half;
                }
                if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_half;
                }
                model_sub_price = price_info.model_time_price_half + casting_price;
            } else if (modelTime === "full") {
                if (form[PROPERTYS.MODEL_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_full;
                }
                if (form[PROPERTYS.H_M_CASTING.CODE] === need) {
                    casting_price += price_info.casting_price_full;
                }
                model_sub_price = price_info.model_time_price_full + casting_price;
            }

            total_price += model_sub_price;
            total_price *= 1;

            etcPriceCalc();
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
        const { form, price_info, alphas, error, info, send_info } = this.state;
        let _value = value;

        if (isNaN(value) && code !== "model_time") {
            alphas[code] = true;
            _value = _value.substr(0, 2);
        } else if (code !== "model_time") {
            alphas[code] = false;
        }

        const need = HAS_PROPERTY.NEED.CODE;
        const needless = HAS_PROPERTY.NEEDLESS.CODE;
        const baseDataAllSet = form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE];
        const isRetouchAdd = form[PROPERTYS.IS_RETOUCH_ADD.CODE] === need;
        const isDetailCut = form[PROPERTYS.IS_DETAIL_CUT.CODE] === need;

        // 누끼
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI.CODE) {
            if (code === PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE) {
                error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = (value && !form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE]) || false;
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = (!value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]) || false;

                if (form[PROPERTYS.IS_RETOUCH_ADD.CODE] === need) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (value && form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                }

                if (form[PROPERTYS.IS_DETAIL_CUT.CODE] === need) {
                    error[PROPERTYS.DETAIL_NUMBER.CODE].show = (value &&
                        form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] &&
                        !form[PROPERTYS.DETAIL_NUMBER.CODE] &&
                        ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd)
                    ) || false;
                }
            }

            if (code === PROPERTYS.N_CLOTHES_P_NUMBER.CODE) {
                error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = (!value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]) || false;
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] || false;

                if (form[PROPERTYS.IS_RETOUCH_ADD.CODE] === HAS_PROPERTY.NEED.CODE) {
                    error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                }
            }

            if (code === PROPERTYS.RETOUCH_NUMBER.CODE) {
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (baseDataAllSet && !value) || false;
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (baseDataAllSet && value && isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE]) || false;
            }

            if (code === PROPERTYS.DETAIL_NUMBER.CODE) {
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (baseDataAllSet && !value && (!isRetouchAdd || (isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]))) || false;
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (baseDataAllSet && value && isRetouchAdd && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
            }
        }

        // 모델 촬영
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.MODEL_SHOT.CODE) {
            if (code === PROPERTYS.MODEL_TIME.CODE) {
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (value && isRetouchAdd && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (value && ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd) && isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE]) || false;
            }

            if (code === PROPERTYS.RETOUCH_NUMBER.CODE) {
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (!value && isRetouchAdd && form[PROPERTYS.MODEL_TIME.CODE]) || false;
            }

            if (code === PROPERTYS.DETAIL_NUMBER.CODE) {
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (!value &&
                    form[PROPERTYS.MODEL_TIME.CODE] &&
                    ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd) &&
                    !form[PROPERTYS.DETAIL_NUMBER.CODE]) || false;
            }
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_M_SHOT.CODE) {
            if (code === PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE) {
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = !value || false;
                error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = (value && !form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE]) || false;
                error[PROPERTYS.MODEL_TIME.CODE].show = (value && form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] && !form[PROPERTYS.MODEL_TIME.CODE]) || false;
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (value && form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] && form[PROPERTYS.MODEL_TIME.CODE] && isRetouchAdd) || false;
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (value &&
                    form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE] &&
                    form[PROPERTYS.MODEL_TIME.CODE] &&
                    isDetailCut &&
                    ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd)) || false;
            }

            if (code === PROPERTYS.N_CLOTHES_P_NUMBER.CODE) {
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] || false;
                error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = (!value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE]) || false;
                error[PROPERTYS.MODEL_TIME.CODE].show = (value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && !form[PROPERTYS.MODEL_TIME.CODE]) || false;
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (value && isRetouchAdd && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && form[PROPERTYS.MODEL_TIME.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (value &&
                    form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] &&
                    ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd) &&
                    isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE]
                ) || false;
            }

            if (code === PROPERTYS.MODEL_TIME.CODE) {
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] || false;
                error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = (value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && !form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE]) || false;
                error[PROPERTYS.MODEL_TIME.CODE].show = (!value && baseDataAllSet) || false;
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (value && baseDataAllSet && isRetouchAdd && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (value &&
                    baseDataAllSet &&
                    ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd) &&
                    (isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE])) || false;
            }

            if (code === PROPERTYS.RETOUCH_NUMBER.CODE) {
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] || false;
                error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = (value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && !form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE]) || false;
                error[PROPERTYS.MODEL_TIME.CODE].show = (value && baseDataAllSet && isRetouchAdd && !form[PROPERTYS.MODEL_TIME.CODE]) || false;
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (!value && baseDataAllSet && isRetouchAdd && form[PROPERTYS.MODEL_TIME.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (value &&
                    baseDataAllSet &&
                    form[PROPERTYS.MODEL_TIME.CODE] &&
                    ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd) &&
                    (isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE])) || false;
            }

            if (code === PROPERTYS.DETAIL_NUMBER.CODE) {
                error[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] || false;
                error[PROPERTYS.N_CLOTHES_P_NUMBER.CODE].show = (value && form[PROPERTYS.NUKKI_CLOTHES_NUMBER.CODE] && !form[PROPERTYS.N_CLOTHES_P_NUMBER.CODE]) || false;
                error[PROPERTYS.MODEL_TIME.CODE].show = (value && baseDataAllSet && isRetouchAdd && !form[PROPERTYS.MODEL_TIME.CODE]) || false;
                error[PROPERTYS.RETOUCH_NUMBER.CODE].show = (value && baseDataAllSet && isRetouchAdd && form[PROPERTYS.MODEL_TIME.CODE] && !form[PROPERTYS.RETOUCH_NUMBER.CODE]) || false;
                error[PROPERTYS.DETAIL_NUMBER.CODE].show = (!value &&
                    baseDataAllSet &&
                    form[PROPERTYS.MODEL_TIME.CODE] &&
                    ((isRetouchAdd && form[PROPERTYS.RETOUCH_NUMBER.CODE]) || !isRetouchAdd) &&
                    (isDetailCut && !form[PROPERTYS.DETAIL_NUMBER.CODE])) || false;
            }
        }

        if (code === PROPERTYS.MODEL_TIME.CODE) {
            send_info.code = code;
            send_info.value = value && info[code][value] ? info[code][value].content : "";
        }

        this.setState({
            form: { ...form, [code]: value },
            price_info: { ...price_info, [code]: _value },
            alphas: { ...alphas },
            send_info,
            error
        }, () => {
            this.calculatePrice();
        });
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
     */
    onConsultForsnap() {
        if (typeof this.props.onConsultForsnap === "function") {
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_FS.CODE);
        }
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    render() {
        const { list, total_price, prev_total_price, form, alphas, error, numbers, info, send_info, isAlphas } = this.state;
        const { detailPage, renewDetail, mainTest } = this.props.estimateFlags;
        const flags = {
            detailPage,
            renewDetail,
            mainTest
        };

        return (
            <div className={detailPage ? "detailPage-content-box" : ""}>
                <VirtualEstimateView {...flags} list={list} info={info} sendInfo={send_info} form={form} error={error} numbers={numbers} onActive={this.onActive} onChange={this.onChange} />
                <VirtualEstimateTotalView
                    {...flags}
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

