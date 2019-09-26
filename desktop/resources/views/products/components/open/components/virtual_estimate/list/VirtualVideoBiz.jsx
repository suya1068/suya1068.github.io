import React, { Component, PropTypes } from "react";
import VirtualEstimateView from "../component/VirtualEstimateView";
import VirtualEstimateTotalView from "../component/VirtualEstimateTotalView";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import { PROPERTYS } from "../virtual_estimate.const";
import utils from "forsnap-utils";

export default class VirtualVideoBiz extends Component {
    constructor(props) {
        super(props);
        const data = props.data;
        this.state = {
            data,
            list: data.LIST,
            form: {
                interview_person: "",
                video_length: "",
                shot_kind: "viral_video",
                actor_casting: "needless",
                h_m_casting: "needless",
                plan_conti: "needless"
            },
            price_info: {
                // 영상 길이
                video_length: 0,
                // 인터뷰 인원
                interview_person: 0,
                // 바이럴 영상 단가
                viral_video_base_price: 1400000,
                viral_video_add_price: 600000,
                // 인터뷰 영상 단가
                interview_video_base_price: 700000,
                interview_video_add_price: 300000,
                // 배우 섭외
                actor_casting: 300000,
                base_actor_casting_price: 300000,
                add_actor_casting_price: 200000,
                // 헤메 섭외
                h_m_casting: 300000,
                base_h_m_casting_price: 300000,
                add_h_m_casting_price: 200000,
                // 기획 및 콘티
                plan_conti: 500000,
                // 인터뷰 인원당 단가
                interview_person_price: 100000
            },
            alphas: {
                // 영상 길이
                video_length: false,
                // 배우 섭외
                actor_casting: false,
                // 헤메 섭외
                h_m_casting: false
            },
            numbers: {
                video_length: [{ value: "", name: "제작하려는 영상의 길이를 선택해주세요." }],
                interview_person: [{ value: "", name: "인터뷰 촬영 인원을 선택해주세요." }]
            },
            error: {
                video_length: { show: false, content: "영상 길이를 선택해주세요." },
                interview_person: { show: false, content: "인원을 선택해주세요." }
            },
            activeButtonKey: [
                PROPERTYS.SHOT_KIND.CODE,
                PROPERTYS.MODEL_CASTING.CODE,
                PROPERTYS.H_M_CASTING.CODE,
                PROPERTYS.PLAN_CONTI.CODE
            ],
            priceInfoKey: [
                PROPERTYS.VIDEO_LENGTH.CODE,
                PROPERTYS.INTERVIEW_PERSON.CODE
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
        this.combineReceiveData = this.combineReceiveData.bind(this);
    }

    componentWillMount() {
        const { numbers } = this.state;
        numbers.video_length.push({ value: "1", name: "1분미만" });
        numbers.video_length.push({ value: "2", name: "1분~3분" });
        numbers.video_length.push({ value: "3", name: "3분~5분" });
        numbers.video_length.push({ value: "4+a", name: "5분이상" });

        for (let i = 0; i < 9; i += 1) {
            numbers.interview_person.push({ value: `${i + 1}`, name: `${i + 1}명` });
        }
        numbers.interview_person.push({ value: "10+a", name: "10명 이상" });

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
        this.onActive(null, "shot_kind", "viral_video");
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
            obj.reduce((r, o) => {
                // 활성화 변경 로직
                if (o.CODE === p_code) {
                    o.PROP.reduce((re, ob) => {
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

                const is_check = o.CODE === "actor_casting"
                    || o.CODE === "h_m_casting"
                    || o.CODE === "plan_conti";

                // disabled 변경 로직
                if (c_code === "viral_video") {
                    changeProp(["actor_casting", "h_m_casting", "plan_conti"], o, false);
                    changeProp(["interview_person"], o, true);
                    if (is_check) {
                        targetReduce(ob => changeProp(["needless"], ob, true, "DEFAULT"), o);
                    }
                }

                if (c_code === "interview_video") {
                    changeProp(["actor_casting", "h_m_casting", "plan_conti"], o, true);
                    changeProp(["interview_person"], o, false);
                    if (is_check) {
                        targetReduce(ob => changeProp(["need", "needless"], ob, false, "DEFAULT"), o);
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
        const { list, price_info, form, alphas, error, total_price } = this.state;
        const _list = this.composeActiveList(list, p_code, c_code);

        const needTypeSet = (f, code = "") => {
            f.actor_casting = code;
            f.h_m_casting = code;
            f.plan_conti = code;
        };

        const alphasSet = (a, code = false) => {
            a.video_length = code;
            a.actor_casting = code;
            a.h_m_casting = code;
        };

        // 촬영 종류를 클릭하면 다른 구간의 값을 초기화 한다.
        if (p_code === "shot_kind") {
            if (typeof this.props.onChangeShotKind === "function") {
                this.props.onChangeShotKind();
            }
            form.video_length = "";
            form.interview_person = "";
            price_info.video_length = 0;
            price_info.interview_person = 0;
            error.video_length.show = false;
            error.interview_person.show = false;
            needTypeSet(form);
            alphasSet(alphas);

            if (c_code === "viral_video") {
                form.shot_kind = "viral_video";
            }

            if (c_code === "interview_video") {
                form.shot_kind = "interview_video";
                error.video_length.show = true;
            }
        }

        if (form.shot_kind === "viral_video" && (p_code === "actor_casting" || p_code === "h_m_casting" || p_code === "plan_conti")) {
            error.video_length.show = !form.video_length || false;
        }

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
        const video_length = price_info.video_length;

        if (form.shot_kind === "viral_video" && video_length) {
            // 바이럴 영상일때 가격 세팅
            if (form.video_length) {
                total_price += price_info.viral_video_base_price + (video_length < 4 ? (video_length - 1) * price_info.viral_video_add_price : (video_length - 2) * price_info.viral_video_add_price);
                total_price *= 1;
            }

            if (form.actor_casting === "need") {
                total_price += price_info.base_actor_casting_price + (video_length < 4 ? (video_length - 1) * price_info.add_actor_casting_price : (video_length - 2) * price_info.add_actor_casting_price);
                total_price *= 1;
            }

            if (form.h_m_casting === "need") {
                total_price += price_info.base_h_m_casting_price + (video_length < 4 ? (video_length - 1) * price_info.add_h_m_casting_price : (video_length - 2) * price_info.add_h_m_casting_price);
                total_price *= 1;
            }

            if (form.plan_conti === "need") {
                total_price += price_info.plan_conti;
                total_price *= 1;
            }
        } else if (form.shot_kind === "interview_video" && video_length && price_info.interview_person) {
            // 인터뷰 영상일때 가격 세팅
            if (form.video_length) {
                total_price += price_info.interview_video_base_price + (video_length < 4 ? (video_length - 1) * price_info.interview_video_add_price : (video_length - 2) * price_info.interview_video_add_price);
                total_price *= 1;
            }

            if (form.interview_person) {
                total_price += price_info.interview_person * price_info.interview_person_price;
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
        const { form, price_info, alphas, error } = this.state;
        let _value = value;
        if (isNaN(value)) {
            alphas[code] = true;
            const split_num = code === "video_length" ? 1 : 2;
            _value = _value.substr(0, split_num);
        } else {
            alphas[code] = false;
        }

        const errorCheck = name => {
            if (value) error[name].show = !form[name] || false;
            return !value || false;
        };

        if (form.shot_kind === "interview_video" && code === "video_length") {
            error.video_length.show = errorCheck("interview_person");
        }

        if (form.shot_kind === "viral_video" && code === "video_length") {
            error.video_length.show = !value || false;
        }

        if (code === "interview_person") {
            error.interview_person.show = !value || false;
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
            this.props.onConsultForsnap(CONSULT_ACCESS_TYPE.PL_ESTIMATE_V.CODE);
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

