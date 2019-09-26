import React, { Component, PropTypes } from "react";
import VirtualEstimateView from "../component/VirtualEstimateView";
import VirtualEstimateTotalView from "../component/VirtualEstimateTotalView";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import {
    PROPERTYS,
    HAS_PROPERTY,
    PLACE_PROPERTY,
    SHOT_KIND_PROPERTY
} from "../virtual_estimate.const";
import * as helper from "../virtualEstimateHelper";
import utils from "forsnap-utils";

export default class VirtualFood extends Component {
    constructor(props) {
        super(props);
        const data = props.data;
        this.state = {
            data,
            list: data.LIST,
            form: {
                [PROPERTYS.PLACE.CODE]: "",
                [PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE]: "",
                [PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE]: "",
                [PROPERTYS.SHOT_KIND.CODE]: SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE,
                [PROPERTYS.LOCATION.CODE]: PLACE_PROPERTY.STUDIO.CODE
            },
            price_info: {
                // 누끼 촬영 제품 갯수
                [PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE]: 0,
                // 연출 촬영 제품 개수
                [PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE]: 0,
                // 누끼 단가
                nukki_price: 20000,
                // 연출 단가
                directing_price_studio: 60000,
                directing_price_outside: 50000,
                // 출장 + 가격
                outside_add_price: 100000
            },
            alphas: {
                [PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE]: false,
                [PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE]: false,
                shot_kind: false
            },
            numbers: {
                [PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE]: [{ value: "", name: "제품 수를 선택해주세요." }],
                [PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE]: [{ value: "", name: "제품 수를 선택해주세요." }]
            },
            error: {
                [PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE]: { show: false, content: "제품 수를 선택해주세요." },
                [PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE]: { show: false, content: "제품 수를 선택해주세요." }
            },
            activeButtonKey: [
                PROPERTYS.PLACE.CODE,
                PROPERTYS.LOCATION.CODE
            ],
            priceInfoKey: [
                PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE,
                PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE
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
            numbers[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE].push({ value: `${i + 5}`, name: `${i + 5}개` });
            numbers[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE].push({ value: `${i + 5}`, name: `${i + 5}개` });
        }

        numbers[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE].push({ value: "15+a", name: "15개 이상" });
        numbers[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE].push({ value: "15+a", name: "15개 이상" });

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
     * 플러스알파 체크
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
                if (c_code === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE) {
                    helper.changeProp([PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE], o, false);
                    helper.changeProp([PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE], o, true);
                }

                if (c_code === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE) {
                    helper.changeProp([PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE], o, true);
                    helper.changeProp([PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE], o, false);
                }

                if (c_code === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
                    helper.changeProp([PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE], o, false);
                    helper.changeProp([PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE], o, false);
                }

                if (c_code === PLACE_PROPERTY.STUDIO.CODE) {
                    if (o.CODE === PROPERTYS.PLACE.CODE) {
                        helper.targetReduce(ob => helper.changeProp([PLACE_PROPERTY.SEOUL.CODE, PLACE_PROPERTY.ETC.CODE], ob, false, "DEFAULT"), o);
                    }

                    helper.changeProp([PROPERTYS.PLACE.CODE], o, true);
                }

                if (c_code === PLACE_PROPERTY.OUTSIDE.CODE) {
                    helper.changeProp([PROPERTYS.PLACE.CODE], o, false);
                    if (o.CODE === PROPERTYS.PLACE.CODE) {
                        helper.targetReduce(ob => helper.changeProp([PLACE_PROPERTY.SEOUL.CODE, PLACE_PROPERTY.ETC.CODE], ob, false, "DEFAULT"), o);
                        helper.targetReduce(ob => helper.changeProp([PLACE_PROPERTY.SEOUL.CODE], ob, true, "DEFAULT"), o);
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
        const test = this.composeActiveList(list, p_code, c_code);

        // 촬영종류 선택
        if (p_code === "shot_kind") {
            form[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE] = "";
            form[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE] = "";
            price_info[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE] = 0;
            price_info[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE] = 0;

            if (typeof this.props.onChangeShotKind === "function") {
                this.props.onChangeShotKind();
            }

            error[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE].show = false;
            error[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE].show = false;
        }

        if (p_code === PROPERTYS.LOCATION.CODE) {
            if (c_code === "outside") {
                form[PROPERTYS.PLACE.CODE] = PLACE_PROPERTY.SEOUL.CODE;
                alphas[PROPERTYS.PLACE.CODE] = true;
            }

            if (c_code === "studio") {
                form[PROPERTYS.PLACE.CODE] = "";
                alphas[PROPERTYS.PLACE.CODE] = false;
            }
        }

        // ===== 알파값 설정 =====
        if (p_code === PROPERTYS.PLACE.CODE) {
            alphas[p_code] = true;
        }
        // ===== 끝./ 알파값 설정 =====

        // ===== 에러값 설정 =====
        // 촬영종류가 누끼촬영이면서 촬영장소를 선택했을때
        if ((form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE
            || form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) && p_code === PROPERTYS.LOCATION.CODE) {
            // 누끼촬영 제품 개수가 선택이 안되었다면 에러 문구 출력
            error[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE] || false;
        }
        // 촬영종류가 연출촬영이면서 촬영장소를 선택했을때
        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE && p_code === PROPERTYS.LOCATION.CODE) {
            error[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE].show = !form[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE] || false;
        }
        // ===== 끝./ 에러값 설정 =====

        this.setState({
            form: { ...form, [p_code]: c_code },
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
        let total_price = "";

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.NUKKI_SHOT.CODE && form[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE]) {
            // 누끼촬영은 스튜디오와 출장 단가가 20000원으로 똑같다.
            total_price += price_info.nukki_price * price_info[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE];
            total_price *= 1;

            if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.OUTSIDE.CODE) {
                total_price += price_info.outside_add_price;
            }
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.DIRECTING_SHOT.CODE && form[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE]) {
            // 연출촬영은 스튜디오는 60000원, 출장은 50000원 단가
            const basePrice = form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.STUDIO.CODE ? price_info.directing_price_studio : price_info.directing_price_outside;

            total_price += basePrice * price_info[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE];
            total_price *= 1;

            if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.OUTSIDE.CODE) {
                total_price += price_info.outside_add_price;
            }
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE && form[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE] && form[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE]) {
            const directingBasePrice = form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.STUDIO.CODE ? price_info.directing_price_studio : price_info.directing_price_outside;
            total_price += price_info[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE] * price_info.nukki_price;
            total_price *= 1;

            total_price += price_info[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE] * directingBasePrice;
            total_price *= 1;

            if (form[PROPERTYS.LOCATION.CODE] === PLACE_PROPERTY.OUTSIDE.CODE) {
                total_price += price_info.outside_add_price;
            }
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
     * 갯수 변경 (드롭박스)
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

        if (code === PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE) {
            error[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE].show = !value || false;
        }

        if (code === PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE) {
            error[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE].show = !value || false;
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.N_PLUS_D_SHOT.CODE) {
            if (code === PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE) {
                error[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE].show = !value || false;
                error[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE].show = !form[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE] || false;
            }
            if (code === PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE) {
                error[PROPERTYS.DIRECTING_PRODUCT_NUMBER.CODE].show = !value || false;
                error[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE].show = !form[PROPERTYS.NUKKI_PRODUCT_NUMBER.CODE] || false;
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
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_F.CODE);
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

