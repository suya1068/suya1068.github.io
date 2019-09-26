import React, { Component, PropTypes } from "react";
import VirtualEstimateView from "../component/VirtualEstimateView";
import VirtualEstimateTotalView from "../component/VirtualEstimateTotalView";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import {
    HAS_PROPERTY, PLACE_PROPERTY, PROPERTYS,
    SHOT_KIND_PROPERTY
} from "../virtual_estimate.const";
import utils from "forsnap-utils";

export default class VirtualFood extends Component {
    constructor(props) {
        super(props);
        const data = props.data;
        this.state = {
            data,
            list: data.LIST,
            form: {
                [PROPERTYS.SHOT_KIND.CODE]: SHOT_KIND_PROPERTY.PHOTO_ONLY.CODE,
                // photozone: "needless", == 사용안함
                [PROPERTYS.TOTAL_TIME.CODE]: "",
                [PROPERTYS.IS_ALL_SHOT.CODE]: HAS_PROPERTY.NEEDLESS.CODE,
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: "",
                [PROPERTYS.VIDEO_DIRECTING.CODE]: HAS_PROPERTY.NEEDLESS.CODE,
                [PROPERTYS.VIDEO_DIRECTING_TIME.CODE]: "",
                [PROPERTYS.SUBSCRIBE.CODE]: HAS_PROPERTY.NEEDLESS.CODE,
                // person: "one_person", == 사용안함
                [PROPERTYS.PLACE.CODE]: PLACE_PROPERTY.SEOUL.CODE
            },
            price_info: {
                // 총 촬영시간
                [PROPERTYS.TOTAL_TIME.CODE]: 0,
                // 단체사진 필요 컷수
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: 0,
                // 편집 영상 시간
                [PROPERTYS.VIDEO_DIRECTING_TIME.CODE]: 0,
                // 사진만 찍는 단가 == 기초단가 20만원
                photo_only_base_price: 200000,
                photo_only_add_price: 50000,
                photo_add_price_1: 40000,
                photo_add_price_2: 30000,
                photo_add_price_3: 20000,
                photo_add_price_4: 10000,
                // 영상만 찍는 단가 === 기초단가 20만원
                video_only_base_price: 200000,
                // 영상만 추가 단가
                video_only_add_price: 100000,
                // 편집 영상 기초 단가 70만원
                video_directing_base_price: 700000,
                // 편집 영사 추가 단가
                video_directing_add_price: 300000,
                // 단체사진 컷당 단가 5만원
                all_shot_price: 50000,
                // 자막 단가 10만원
                subscribe_price: 100000,
                // 촬영지역 단가 5만원
                place_price: 50000
            },
            alphas: {
                [PROPERTYS.TOTAL_TIME.CODE]: false,
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: false,
                [PROPERTYS.VIDEO_DIRECTING_TIME.CODE]: false,
                [PROPERTYS.PLACE.CODE]: true
            },
            numbers: {
                [PROPERTYS.TOTAL_TIME.CODE]: [{ value: "", name: "총 촬영시간을 선택해주세요." }],
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: [{ value: "", name: "필요컷수를 선택해주세요." }],
                [PROPERTYS.VIDEO_DIRECTING_TIME.CODE]: [{ value: "", name: "시간을 선택해주세요." }]
            },
            error: {
                [PROPERTYS.TOTAL_TIME.CODE]: { show: false, content: "총 촬영시간을 선택해주세요." },
                [PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]: { show: false, content: "필요컷수를 선택해 주세요." },
                [PROPERTYS.VIDEO_DIRECTING_TIME.CODE]: { show: false, content: "시간을 선택해주세요." }
            },
            warning: {
                show: false, content: "영상촬영만 포함된 기본 가격입니다. 영상 편집이 필요한 경우 추가금액이 발생할 수 있습니다."
            },
            activeButtonKey: [
                PROPERTYS.SHOT_KIND.CODE,
                PROPERTYS.IS_ALL_SHOT.CODE,
                PROPERTYS.VIDEO_DIRECTING.CODE,
                PROPERTYS.SUBSCRIBE.CODE,
                PROPERTYS.PLACE.CODE
            ],
            priceInfoKey: [
                PROPERTYS.TOTAL_TIME.CODE,
                PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE,
                PROPERTYS.VIDEO_DIRECTING_TIME.CODE
            ],
            total_price: "",
            prev_total_price: 0,
            isAlphas: false
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
        numbers[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].push({ value: "1", name: "1분미만" });
        numbers[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].push({ value: "2", name: "1분~3분" });
        numbers[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].push({ value: "3", name: "3분~5분" });
        numbers[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].push({ value: "4+a", name: "5분이상" });
        for (let i = 0; i < 8; i += 1) {
            numbers[PROPERTYS.TOTAL_TIME.CODE].push({ value: `${i + 2}`, name: `${i + 2}시간` });
            numbers[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].push({ value: `${i + 1}`, name: `${i + 1}컷` });
        }
        numbers[PROPERTYS.TOTAL_TIME.CODE].push({ value: "10+a", name: "10시간이상" });
        numbers[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].push({ value: "9", name: "9컷" });
        numbers[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].push({ value: "10+a", name: "10컷이상" });


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
        this.onActive(null, "shot_kind", "photo_only");
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

            const changeProp = (props, target, flag, child = "DISABLED") => {
                if (props.indexOf(target.CODE) > -1) {
                    target[child] = flag;
                }
            };

            const targetReduce = (func, target) => {
                target.PROP.reduce((re, ob) => {
                    func(ob);
                    re.push(ob);
                    return re;
                }, []);
            };

            if (p_code === "shot_kind") {
                if (obj.CODE === "place") {
                    targetReduce(ob => changeProp(["seoul"], ob, true, "DEFAULT"), obj);
                    targetReduce(ob => changeProp(["gyeonggi", "etc"], ob, false, "DEFAULT"), obj);
                }
            }

            // 사진만 선택 시 촬영시간, 단체사진, 단체사진필요컷수 활성화
            if (c_code === "photo_only") {
                changeProp(["is_all_shot"], obj, false);
                changeProp(["video_directing", "all_shot_need_number", "video_directing_time", "subscribe"], obj, true);
                if (obj.CODE === "video_directing" || obj.CODE === "subscribe") {
                    targetReduce(ob => changeProp(["needless", "need"], ob, false, "DEFAULT"), obj);
                }

                if (obj.CODE === "is_all_shot") {
                    targetReduce(ob => changeProp(["needless"], ob, true, "DEFAULT"), obj);
                    targetReduce(ob => changeProp(["need"], ob, false, "DEFAULT"), obj);
                }
            }

            // 영상만 선택 시 촬영시간, 영상편집, 자막 활성화
            if (c_code === "video_only") {
                changeProp(["is_all_shot", "all_shot_need_number", "video_directing_time"], obj, true);
                changeProp(["video_directing", "subscribe"], obj, false);
                if (obj.CODE === "is_all_shot") {
                    targetReduce(ob => changeProp(["need", "needless"], ob, false, "DEFAULT"), obj);
                }

                if (obj.CODE === "video_directing" || obj.CODE === "subscribe") {
                    targetReduce(ob => changeProp(["needless"], ob, true, "DEFAULT"), obj);
                    targetReduce(ob => changeProp(["need"], ob, false, "DEFAULT"), obj);
                }
            }
            // 사진+영상 선택 시 모두 활성화
            if (c_code === "video_together") {
                changeProp(["is_all_shot", "video_directing", "subscribe"], obj, false);
                changeProp(["all_shot_need_number", "video_directing_time"], obj, true);

                if (obj.CODE === "video_directing" || obj.CODE === "subscribe" || obj.CODE === "is_all_shot") {
                    targetReduce(ob => changeProp(["needless"], ob, true, "DEFAULT"), obj);
                    targetReduce(ob => changeProp(["need"], ob, false, "DEFAULT"), obj);
                }
            }

            // 단체 촬영 필요 선택 시 단체사진 필요 컷수 활성화
            if (p_code === "is_all_shot") {
                if (c_code === "need") changeProp(["all_shot_need_number"], obj, false);
                if (c_code === "needless") changeProp(["all_shot_need_number"], obj, true);
            }
            // 영상 편집 필요 선택 시 편집 영상 시간 활성화
            if (p_code === "video_directing") {
                if (c_code === "need") changeProp(["video_directing_time"], obj, false);
                if (c_code === "needless") changeProp(["video_directing_time"], obj, true);
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
        // === 공통 데이터 초기화
        if (p_code === PROPERTYS.SHOT_KIND.CODE) {
            if (typeof this.props.onChangeShotKind === "function") {
                this.props.onChangeShotKind();
            }
            form[PROPERTYS.PLACE.CODE] = PLACE_PROPERTY.SEOUL.CODE;
            form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = "";
            form[PROPERTYS.VIDEO_DIRECTING_TIME.CODE] = "";
            // form.total_time = "";
            price_info[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = 0;
            price_info[PROPERTYS.VIDEO_DIRECTING_TIME.CODE] = 0;
            // price_info.total_time = 0;

            error[PROPERTYS.TOTAL_TIME.CODE].show = false;
            error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = false;
            error[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].show = false;
        }

        if (p_code === PROPERTYS.IS_ALL_SHOT.CODE || p_code === PROPERTYS.PLACE.CODE || p_code === PROPERTYS.VIDEO_DIRECTING.CODE || p_code === PROPERTYS.SUBSCRIBE.CODE) {
            error[PROPERTYS.TOTAL_TIME.CODE].show = !form[PROPERTYS.TOTAL_TIME.CODE] || false;
        }

        if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.VIDEO_TOGETHER.CODE) {
            if (p_code === PROPERTYS.SUBSCRIBE.CODE) {
                error[PROPERTYS.TOTAL_TIME.CODE].show = !form[PROPERTYS.TOTAL_TIME.CODE] || false;
            }
        }

        // === 데이터 초기화
        if (c_code === SHOT_KIND_PROPERTY.PHOTO_ONLY.CODE) {
            form[PROPERTYS.SHOT_KIND.CODE] = SHOT_KIND_PROPERTY.PHOTO_ONLY.CODE;
            form[PROPERTYS.IS_ALL_SHOT.CODE] = needless;
            form[PROPERTYS.VIDEO_DIRECTING.CODE] = "";
            form[PROPERTYS.SUBSCRIBE.CODE] = "";
        }

        if (c_code === SHOT_KIND_PROPERTY.VIDEO_TOGETHER.CODE) {
            form[PROPERTYS.SHOT_KIND.CODE] = SHOT_KIND_PROPERTY.VIDEO_TOGETHER.CODE;
            form[PROPERTYS.IS_ALL_SHOT.CODE] = needless;
            form[PROPERTYS.VIDEO_DIRECTING.CODE] = needless;
            form[PROPERTYS.SUBSCRIBE.CODE] = needless;
        }

        if (p_code === PROPERTYS.IS_ALL_SHOT.CODE && c_code === needless) {
            form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = "";
            price_info[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE] = 0;
            error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = false;
        }

        if (p_code === PROPERTYS.VIDEO_DIRECTING.CODE && c_code === needless) {
            form[PROPERTYS.VIDEO_DIRECTING_TIME.CODE] = "";
            price_info[PROPERTYS.VIDEO_DIRECTING_TIME.CODE] = 0;
            error[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].show = false;
        }
        // === 데이터 초기화 끝

        // === 알파값 설정
        if (p_code === "place") {
            alphas[p_code] = (c_code === "etc" || c_code === PLACE_PROPERTY.SEOUL.CODE) || false;
        }
        // === 알파값 설정 끝

        // === 에러값 설정

        if (form[PROPERTYS.TOTAL_TIME.CODE]) {
            if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.PHOTO_ONLY.CODE && p_code === PROPERTYS.IS_ALL_SHOT.CODE) {
                error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = c_code === need || false;
            }
            if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.VIDEO_ONLY.CODE && p_code === PROPERTYS.VIDEO_DIRECTING.CODE) {
                error.video_directing_time.show = c_code === need || false;
            }

            if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.VIDEO_TOGETHER.CODE) {
                if (p_code === PROPERTYS.IS_ALL_SHOT.CODE && c_code === need) {
                    error.all_shot_need_number.show = !form.video_directing_time || false;
                    if (form.video_directing === need && !form.video_directing_time) {
                        error.video_directing_time.show = false;
                    }

                    if (form.video_directing === need && form.video_directing_time) {
                        error.all_shot_need_number.show = true;
                    }
                }

                if (p_code === PROPERTYS.IS_ALL_SHOT.CODE && c_code === needless) {
                    error.video_directing_time.show = (form.video_directing === need && !form.video_directing_time) || false;
                }

                if (p_code === PROPERTYS.VIDEO_DIRECTING.CODE && c_code === need) {
                    error.video_directing_time.show = (!form.video_directing_time && form.all_shot_need_number) || false;
                    if (form.is_all_shot === needless && !form.video_directing_time) {
                        error.video_directing_time.show = true;
                    }
                }
            }
        }
        // === 에러값 설정 끝

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
        const { form, price_info } = this.state;
        let total_price = "";

        if (form.total_time) {
            if (form.shot_kind === "photo_only" && (form.is_all_shot === "needless" || (form.is_all_shot === "need" && form.all_shot_need_number))) {
                total_price += price_info.photo_only_base_price + ((price_info.total_time - 2) * price_info.photo_only_add_price);
                total_price *= 1;
                if ((price_info.total_time - 2) === 1) {
                    total_price += price_info.photo_add_price_1;
                    total_price *= 1;
                }
                if ((price_info.total_time - 2) === 2) {
                    total_price += price_info.photo_add_price_1 + price_info.photo_add_price_2;
                    total_price *= 1;
                }
                if ((price_info.total_time - 2) === 3) {
                    total_price += price_info.photo_add_price_1 + price_info.photo_add_price_2 + price_info.photo_add_price_3;
                    total_price *= 1;
                }
                if ((price_info.total_time - 2) > 3) {
                    total_price += price_info.photo_add_price_1 + price_info.photo_add_price_2 + price_info.photo_add_price_3 + price_info.photo_add_price_4;
                    total_price *= 1;
                }

                if (form.all_shot_need_number) {
                    total_price += price_info.all_shot_need_number * price_info.all_shot_price;
                    total_price *= 1;
                }
            }

            if (form.shot_kind === "video_only" && (form.video_directing === "needless" || (form.video_directing === "need" && form.video_directing_time))) {
                total_price += price_info.video_only_base_price + ((price_info.total_time - 2) * price_info.video_only_add_price);
                total_price *= 1;
                if (form.video_directing_time) {
                    total_price += price_info.video_directing_base_price + ((price_info.video_directing_time - 1) * price_info.video_directing_add_price);

                    if (price_info.video_directing_time === "4") {
                        total_price -= price_info.video_directing_add_price;
                    }
                    total_price *= 1;
                }
                if (form.subscribe === "need") {
                    total_price += price_info.subscribe_price;
                    total_price *= 1;
                }
            }

            if (form.shot_kind === "video_together"
                && (form.is_all_shot === "needless" || (form.is_all_shot === "need" && form.all_shot_need_number))
                && (form.video_directing === "needless" || (form.video_directing === "need" && form.video_directing_time))) {
                // 총 촬영시간에 맞는 가격은 사진과 영상을 합친 가격.
                total_price += price_info.photo_only_base_price + ((price_info.total_time - 2) * price_info.photo_only_add_price);
                total_price *= 1;
                if ((price_info.total_time - 2) === 1) {
                    total_price += price_info.photo_add_price_1;
                    total_price *= 1;
                }
                if ((price_info.total_time - 2) === 2) {
                    total_price += price_info.photo_add_price_1 + price_info.photo_add_price_2;
                    total_price *= 1;
                }
                if ((price_info.total_time - 2) === 3) {
                    total_price += price_info.photo_add_price_1 + price_info.photo_add_price_2 + price_info.photo_add_price_3;
                    total_price *= 1;
                }
                if ((price_info.total_time - 2) > 3) {
                    total_price += price_info.photo_add_price_1 + price_info.photo_add_price_2 + price_info.photo_add_price_3 + price_info.photo_add_price_4;
                    total_price *= 1;
                }

                // 영상 촬영 가격
                total_price += price_info.video_only_base_price + ((price_info.total_time - 2) * price_info.video_only_add_price);
                total_price *= 1;

                if (form.all_shot_need_number) {
                    total_price += price_info.all_shot_need_number * price_info.all_shot_price;
                    total_price *= 1;
                }

                // 단체사진
                if (form.all_shot_need_number) {
                    total_price += price_info.all_shot_need_number * price_info.all_shot_price;
                    total_price *= 1;
                }

                // 편집 영상
                if (form.video_directing_time) {
                    total_price += price_info.video_directing_base_price + ((price_info.video_directing_time - 1) * price_info.video_directing_add_price);

                    if (price_info.video_directing_time === "4") {
                        total_price -= price_info.video_directing_add_price;
                    }
                    total_price *= 1;
                }
                // 자막
                if (form.subscribe === "need") {
                    total_price += price_info.subscribe_price;
                    total_price *= 1;
                }
            }

            if (form.place && form.place !== "seoul") {
                total_price += price_info.place_price;
                total_price *= 1;
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
     * 드롭박스 변경 시
     */
    onChange(value, code) {
        const { form, price_info, alphas, error, warning } = this.state;
        let _value = value;

        if (isNaN(value)) {
            alphas[code] = true;
            const split_num = code === "video_directing_time" ? 1 : 2;
            _value = _value.substr(0, split_num);
        } else {
            alphas[code] = false;
        }

        const need = HAS_PROPERTY.NEED.CODE;
        const needless = HAS_PROPERTY.NEEDLESS.CODE;

        if (code === PROPERTYS.TOTAL_TIME.CODE) {
            error[PROPERTYS.TOTAL_TIME.CODE].show = !value || false;

            if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.PHOTO_ONLY.CODE) {
                error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = (value && form[PROPERTYS.IS_ALL_SHOT.CODE] === need && !form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) || false;
            }

            if (form[PROPERTYS.SHOT_KIND.CODE] === SHOT_KIND_PROPERTY.VIDEO_TOGETHER.CODE) {
                error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = (value && form[PROPERTYS.IS_ALL_SHOT.CODE] === need && !form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) || false;
                error[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].show = (value &&
                    ((form[PROPERTYS.IS_ALL_SHOT.CODE] === need && form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) || form[PROPERTYS.IS_ALL_SHOT.CODE] === needless) &&
                    (form[PROPERTYS.VIDEO_DIRECTING.CODE] === need && !form[PROPERTYS.VIDEO_DIRECTING_TIME.CODE])
                ) || false;
            }
        }

        if (code === PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE) {
            error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = (!value && form[PROPERTYS.TOTAL_TIME.CODE]) || false;
            error[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].show = (value && form[PROPERTYS.TOTAL_TIME.CODE] &&
                ((form[PROPERTYS.VIDEO_DIRECTING.CODE] === need && !form[PROPERTYS.VIDEO_DIRECTING_TIME.CODE]) || form[PROPERTYS.VIDEO_DIRECTING.CODE] === needless)) || false;
        }

        if (code === PROPERTYS.VIDEO_DIRECTING_TIME.CODE) {
            error[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE].show = (value && form[PROPERTYS.TOTAL_TIME.CODE] &&
                ((form[PROPERTYS.IS_ALL_SHOT.CODE] === need && !form[PROPERTYS.ALL_SHOT_NEED_NUMBER.CODE]) || form[PROPERTYS.IS_ALL_SHOT.CODE] === needless)
            ) || false;

            error[PROPERTYS.VIDEO_DIRECTING_TIME.CODE].show = (!value && form[PROPERTYS.TOTAL_TIME.CODE] && form[PROPERTYS.VIDEO_DIRECTING.CODE] === need) || false;
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
     */
    onConsultForsnap() {
        if (typeof this.props.onConsultForsnap === "function") {
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_E.CODE);
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

