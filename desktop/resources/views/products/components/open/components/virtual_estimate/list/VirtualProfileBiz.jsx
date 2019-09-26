import React, { Component, PropTypes } from "react";
import VirtualEstimateView from "../component/VirtualEstimateView";
import VirtualEstimateTotalView from "../component/VirtualEstimateTotalView";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import {
    PLACE_PROPERTY,
    PROPERTYS,
    HAS_PROPERTY
} from "../virtual_estimate.const";
import * as helper from "../virtualEstimateHelper";
import utils from "forsnap-utils";

export default class VirtualProfileBiz extends Component {
    constructor(props) {
        super(props);
        const data = props.data;
        this.state = {
            data,
            list: data.LIST,
            form: {
                [PROPERTYS.PERSON_NUMBER.CODE]: "",
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: "",
                place: "studio",
                is_all_shot: "needless"
            },
            price_info: {
                // 인원 수
                [PROPERTYS.PERSON_NUMBER.CODE]: 0,
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: 0,
                // 컷당 단가
                person_p_price: 25000,
                // 기본 단가
                base_price: 300000,
                // 지역 단가
                place_price: 100000,
                // 단체 단가
                all_shot_price: 50000
            },
            alphas: {
                [PROPERTYS.PERSON_NUMBER.CODE]: false,
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: false,
                place: false,
                is_all_shot: false
            },
            numbers: {
                [PROPERTYS.PERSON_NUMBER.CODE]: [{ value: "", name: "인원 수를 선택해주세요." }],
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: [{ value: "", name: "필요 컷수를 선택해주세요." }]
            },
            error: {
                [PROPERTYS.PERSON_NUMBER.CODE]: { show: false, content: "인원을 선택해 주세요." },
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: { show: false, content: "필요 컷수를 선택해주세요." }
            },
            activeButtonKey: [
                PROPERTYS.PLACE.CODE,
                PROPERTYS.IS_ALL_SHOT.CODE
            ],
            priceInfoKey: [
                PROPERTYS.PERSON_NUMBER.CODE,
                PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE
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
        for (let i = 0; i < 10; i += 1) {
            numbers[PROPERTYS.PERSON_NUMBER.CODE].push({ value: `${i + 10}`, name: `${i + 10}명` });
            numbers[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
        }

        numbers[PROPERTYS.PERSON_NUMBER.CODE].push({ value: "20+a", name: "20명 이상" });

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

    /**
     * 버튼 액션 로직
     * @param list
     * @param p_code
     * @param c_code
     * @returns {*}
     */
    composeActiveList(list, p_code, c_code) {
        return list.reduce((result, obj) => {
            obj.reduce((r, o) => {
                // 활성화 변경 로직 =============
                if (o.CODE === p_code) {
                    helper.columnDefaultListRender(o.PROP, c_code);
                }
                // 활성화 변경 로직 끝 ============

                // disabled 변경 로직
                if (p_code === "init") {
                    if (o.CODE === "is_all_shot") {
                        helper.targetReduce(ob => helper.changeProp(["needless"], ob, true, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp(["need"], ob, false, "DEFAULT"), o);
                    }

                    if (o.CODE === "place") {
                        helper.targetReduce(ob => helper.changeProp(["studio"], ob, true, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp(["outside_s"], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp(["outside_e"], ob, false, "DEFAULT"), o);
                    }
                }

                if (p_code === PROPERTYS.IS_ALL_SHOT.CODE && c_code === HAS_PROPERTY.NEED.CODE) {
                    helper.changeProp([PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE], o, false);
                } else if (p_code === PROPERTYS.IS_ALL_SHOT.CODE && c_code === HAS_PROPERTY.NEEDLESS.CODE) {
                    helper.changeProp([PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE], o, true);
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
        const { list, price_info, form, alphas, total_price, error } = this.state;
        const test = this.composeActiveList(list, p_code, c_code);

        if (p_code === "init") {
            form[PROPERTYS.PERSON_NUMBER.CODE] = "";
        }

        if (p_code === PROPERTYS.IS_ALL_SHOT.CODE) {                 // 단체촬영을
            if (c_code === HAS_PROPERTY.NEEDLESS.CODE) {             // 불필요 선택하면
                form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = "";      // 단체사진 필요컷수를 초기화한다.
                price_info[PROPERTYS.EXTERIOR_NUMBER.CODE] = 0;
            }
        }

        // ===== 알파값 설정 =====
        if (p_code === PROPERTYS.PLACE.CODE) {
            alphas[p_code] = c_code === PLACE_PROPERTY.OUTSIDE_E.CODE || false;
        }

        // ===== 끝./ 알파값 설정 =====

        // ===== 에러값 설정 =====
        // error[PROPERTYS.PERSON_NUMBER.CODE].show = !form[PROPERTYS.PERSON_NUMBER.CODE] || false;
        if (p_code === PROPERTYS.PLACE.CODE || p_code === PROPERTYS.IS_ALL_SHOT.CODE || p_code === PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE) {
            error[PROPERTYS.PERSON_NUMBER.CODE].show = !form[PROPERTYS.PERSON_NUMBER.CODE] || false;
        }

        if (form[PROPERTYS.PERSON_NUMBER.CODE] && p_code === PROPERTYS.IS_ALL_SHOT.CODE && c_code === HAS_PROPERTY.NEED.CODE) {
            error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = !form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] || false;
        }

        if (p_code === PROPERTYS.IS_ALL_SHOT.CODE) {
            if (c_code === HAS_PROPERTY.NEEDLESS.CODE) {
                error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = false;
            }
        }
        // ===== 끝./ 에러값 설정 =====

        let p = null;

        if (p_code !== "init") {
            p = { [p_code]: c_code };
        }

        this.setState({
            form: { ...form, ...p },
            list: test,
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
        let total_price = "";
        let resultFlag = true;

        if (form.person_number) {
            total_price = price_info.base_price + ((price_info.person_number - 10) * price_info.person_p_price);

            if (form.place && form.place !== "studio") {
                total_price += price_info.place_price;
            }

            if (form[PROPERTYS.IS_ALL_SHOT.CODE] === need) {
                if (form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) {
                    total_price += price_info[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] * price_info.all_shot_price;
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

        if (code === PROPERTYS.PERSON_NUMBER.CODE) {
            error[PROPERTYS.PERSON_NUMBER.CODE].show = value === "" || false;
        }

        if (code === PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE) {
            error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = !value || false;
        }

        if (code === PROPERTYS.PERSON_NUMBER.CODE) {
            if (form[PROPERTYS.IS_ALL_SHOT.CODE] === HAS_PROPERTY.NEED.CODE) {
                error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = (!form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] && value) || false;
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
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_PB.CODE);
        }
    }

    render() {
        const { list, total_price, prev_total_price, form, alphas, error, numbers, isAlphas } = this.state;
        const { estimateFlags } = this.props;
        const props = {
            ...estimateFlags
        };

        return (
            <div>
                <VirtualEstimateView {...props} list={list} form={form} error={error} numbers={numbers} onActive={this.onActive} onChange={this.onChange} />
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

