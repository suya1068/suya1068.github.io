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
    SHOT_KIND_PROPERTY
} from "../virtual_estimate.const";
import * as helper from "../virtualEstimateHelper";
import utils from "forsnap-utils";

export default class VirtualInterior extends Component {
    constructor(props) {
        super(props);
        const data = props.data;
        this.state = {
            data,
            list: data.LIST,
            form: {
                [PROPERTYS.NEED_NUMBER.CODE]: "",
                [PROPERTYS.EXTERIOR_NUMBER.CODE]: "",
                [PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]: "",
                is_exterior: "needless",
                inside_cut_compose: "needless",
                place: "seoul"
            },
            price_info: {
                // 컷 갯수
                [PROPERTYS.NEED_NUMBER.CODE]: 0,
                [PROPERTYS.EXTERIOR_NUMBER.CODE]: 0,
                [PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]: 0,
                // 컷당 단가
                cut_p_price: 20000,
                // 지역 단가
                place_price: 50000,
                // 익스테리어 단가
                exterior_price: 50000,
                // 내부컷 합성 단가
                compose_p_cut: 40000
            },
            alphas: {
                number: false,
                place: true
            },
            numbers: {
                [PROPERTYS.NEED_NUMBER.CODE]: [{ value: "", name: "필요 컷수를 선택해주세요." }],
                [PROPERTYS.EXTERIOR_NUMBER.CODE]: [{ value: "", name: "필요 컷수를 선택해주세요." }],
                [PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]: [{ value: "", name: "필요 컷수를 선택해주세요." }]
            },
            error: {
                [PROPERTYS.NEED_NUMBER.CODE]: { show: false, content: "컷수를 선택해 주세요." },
                [PROPERTYS.EXTERIOR_NUMBER.CODE]: { show: false, content: "컷수를 선택해 주세요." },
                [PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]: { show: false, content: "컷수를 선택해 주세요." }
            },
            activeButtonKey: [
                PROPERTYS.PLACE.CODE,
                PROPERTYS.IS_EXTERIOR.CODE,
                PROPERTYS.INSIDE_CUT_COMPOSE.CODE
            ],
            priceInfoKey: [
                PROPERTYS.NEED_NUMBER.CODE,
                PROPERTYS.EXTERIOR_NUMBER.CODE,
                PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE
            ],
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
        for (let i = 0; i < 20; i += 1) {
            numbers[PROPERTYS.NEED_NUMBER.CODE].push({ value: `${i + 10}`, name: `${i + 10}컷` });
            if (i < 9) {
                numbers[PROPERTYS.EXTERIOR_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
                numbers[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
            }
            if (i + 1 === 10) {
                numbers[PROPERTYS.EXTERIOR_NUMBER.CODE].push({ value: "10+a", name: "10컷 이상" });
                numbers[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].push({ value: "10+a", name: "10컷 이상" });
            }
        }
        numbers[PROPERTYS.NEED_NUMBER.CODE].push({ value: "30+a", name: "30컷 이상" });

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
        this.onActive(null, "init", "");
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
     * 알파 값을 가졌는지 체크
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
            if (obj.CODE === p_code) {
                obj.PROP.reduce((re, ob) => {
                    ob.DEFAULT = c_code === ob.CODE || false;
                    re.push(ob);
                    return re;
                }, []);
            }

            // 익스테리어 필요 컷수 활성화 여부
            if (p_code === PROPERTYS.IS_EXTERIOR.CODE && c_code === HAS_PROPERTY.NEED.CODE) {
                helper.changeProp([PROPERTYS.EXTERIOR_NUMBER.CODE], obj, false);
            } else if (p_code === PROPERTYS.IS_EXTERIOR.CODE && c_code === HAS_PROPERTY.NEEDLESS.CODE) {
                helper.changeProp([PROPERTYS.EXTERIOR_NUMBER.CODE], obj, true);
            }

            // 내부 합성 필요 컷수 활성화 여부
            if (p_code === PROPERTYS.INSIDE_CUT_COMPOSE.CODE && c_code === HAS_PROPERTY.NEED.CODE) {
                helper.changeProp([PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE], obj, false);
            } else if (p_code === PROPERTYS.INSIDE_CUT_COMPOSE.CODE && c_code === HAS_PROPERTY.NEEDLESS.CODE) {
                helper.changeProp([PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE], obj, true);
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
        const { list, price_info, form, alphas, error, total_price } = this.state;
        const _list = this.composeActiveList(list, p_code, c_code);

        const need = HAS_PROPERTY.NEED.CODE;
        const needless = HAS_PROPERTY.NEEDLESS.CODE;
        // ===== 액션에 따라 값 설정 =====
        if (p_code === "init") {    // 상품 상세에서 견적계산 모달 창 닫히면 진입
            form[PROPERTYS.NEED_NUMBER.CODE] = "";
            form[PROPERTYS.EXTERIOR_NUMBER.CODE] = "";
            form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] = "";
        }

        if (p_code === PROPERTYS.IS_EXTERIOR.CODE) {            // 익스테리어를
            if (c_code === HAS_PROPERTY.NEEDLESS.CODE) {        // 불필요 선택하면
                form[PROPERTYS.EXTERIOR_NUMBER.CODE] = "";      // 익스테리어 필요컷수를 초기화한다.
                price_info[PROPERTYS.EXTERIOR_NUMBER.CODE] = 0;
            }
        }

        if (p_code === PROPERTYS.INSIDE_CUT_COMPOSE.CODE) {         // 내부 컷 합성을
            if (c_code === HAS_PROPERTY.NEEDLESS.CODE) {            // 불필요 선택하면
                form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] = "";    // 내부 합성 필요 컷수를 초기화한다.
                price_info[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] = 0;
            }
        }
        // ===== 끝./ 액션에 따라 값 설정

        // ===== 알파값 설정 =====
        if (p_code === "place") {
            alphas[p_code] = (c_code !== PLACE_PROPERTY.GYEONGGI.CODE) || false;
        }
        // ===== 끝./ 알파값 설정 =====

        // ===== 에러값 설정 =====
        if (p_code === PROPERTYS.PLACE.CODE || p_code === PROPERTYS.IS_EXTERIOR.CODE || p_code === PROPERTYS.INSIDE_CUT_COMPOSE.CODE) {
            error[PROPERTYS.NEED_NUMBER.CODE].show = !form[PROPERTYS.NEED_NUMBER.CODE] || false;
        }

        // // 익스테리어 불필요 선택시 익스테리어 필요 컷수 에러 문구 제거
        if (p_code === PROPERTYS.IS_EXTERIOR.CODE) {
            if (c_code === need) {
                error[PROPERTYS.EXTERIOR_NUMBER.CODE].show = (form[PROPERTYS.NEED_NUMBER.CODE] && !form[PROPERTYS.EXTERIOR_NUMBER.CODE]) || false;
                error[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].show = false;
            }
            if (c_code === needless) {
                error[PROPERTYS.EXTERIOR_NUMBER.CODE].show = false;
                error[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].show = form[PROPERTYS.NEED_NUMBER.CODE] && form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === need && !form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE];
            }
        }

        //
        // // 내부 컷 합성 불필요 선택시 내부 합성 필요 컷수 에러 문구 제거
        if (p_code === PROPERTYS.INSIDE_CUT_COMPOSE.CODE) {
            if (c_code === need) {
                error[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].show = (form[PROPERTYS.NEED_NUMBER.CODE] && (
                    (form[PROPERTYS.IS_EXTERIOR.CODE] === need && form[PROPERTYS.EXTERIOR_NUMBER.CODE]) || form[PROPERTYS.IS_EXTERIOR.CODE] === needless) &&
                    (!form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE])) || false;
            }
            if (c_code === needless) {
                error[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].show = false;
            }
        }

        let p = null;

        if (p_code !== "init") {
            p = { [p_code]: c_code };
        }

        this.setState({
            form: { ...form, ...p },
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
        const { form, price_info } = this.state;
        const need = HAS_PROPERTY.NEED.CODE;
        const needless = HAS_PROPERTY.NEEDLESS.CODE;
        let total_price = "";
        let resultFlag = true;

        if (form.need_number) {
            total_price += price_info[PROPERTYS.NEED_NUMBER.CODE] * price_info.cut_p_price;
            total_price *= 1;

            if (form.place !== PLACE_PROPERTY.SEOUL.CODE) {
                total_price += price_info.place_price;
                total_price *= 1;
            }

            if (form[PROPERTYS.IS_EXTERIOR.CODE] === need) {
                if (form[PROPERTYS.EXTERIOR_NUMBER.CODE]) {
                    total_price += price_info[PROPERTYS.EXTERIOR_NUMBER.CODE] * price_info.exterior_price;
                    total_price *= 1;
                } else {
                    resultFlag = false;
                }
            }

            if (form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === need) {
                if (form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]) {
                    total_price += price_info[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE] * price_info.compose_p_cut;
                    total_price *= 1;
                } else {
                    resultFlag = false;
                }
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

        if (code === PROPERTYS.NEED_NUMBER.CODE) {
            error[PROPERTYS.NEED_NUMBER.CODE].show = !value || false;
            error[PROPERTYS.EXTERIOR_NUMBER.CODE].show = (value && form[PROPERTYS.IS_EXTERIOR.CODE] === need && !form[PROPERTYS.EXTERIOR_NUMBER.CODE]) || false;

            error[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].show = (value && (
                    (form[PROPERTYS.IS_EXTERIOR.CODE] === need && form[PROPERTYS.EXTERIOR_NUMBER.CODE]) || form[PROPERTYS.IS_EXTERIOR.CODE] === needless) &&
                (form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === need && !form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE])
            ) || false;
        }

        if (code === PROPERTYS.EXTERIOR_NUMBER.CODE) {
            error[PROPERTYS.EXTERIOR_NUMBER.CODE].show = (!value && form[PROPERTYS.NEED_NUMBER.CODE]) || false;

            error[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].show = (value && form[PROPERTYS.NEED_NUMBER.CODE] && form[PROPERTYS.IS_EXTERIOR.CODE] === need && (
                    (form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === need && !form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE]))
            ) || false;
        }

        if (code === PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE) {
            error[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE].show = (!value && form[PROPERTYS.NEED_NUMBER.CODE] && (
                    (form[PROPERTYS.IS_EXTERIOR.CODE] === need && form[PROPERTYS.EXTERIOR_NUMBER.CODE]) || form[PROPERTYS.IS_EXTERIOR.CODE] === needless) &&
                (form[PROPERTYS.INSIDE_CUT_COMPOSE.CODE] === need && !form[PROPERTYS.INSIDE_COMPOSE_NUMBER.CODE])
            ) || false;
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
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_I.CODE);
        }
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    render() {
        const { list, total_price, prev_total_price, form, alphas, error, numbers, isAlphas } = this.state;
        const { detailPage, renewDetail, mainTest } = this.props.estimateFlags;
        const flags = {
            detailPage,
            renewDetail,
            mainTest
        };

        return (
            <div className={detailPage ? "detailPage-content-box" : ""}>
                <VirtualEstimateView {...flags} list={list} form={form} error={error} numbers={numbers} onActive={this.onActive} onChange={this.onChange} />
                <VirtualEstimateTotalView
                    {...flags}
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

