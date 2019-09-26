import "../scss/payment_layout.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import api from "forsnap-api";
import mewtime from "forsnap-mewtime";
import auth from "forsnap-authentication";

import { PAYMENT_METHOD } from "shared/constant/payment.const";

import Input from "shared/components/ui/input/Input";
import TextArea from "shared/components/ui/textarea/TextArea";
import Accordion from "shared/components/ui/accordion/Accordion";
import CheckBox from "shared/components/ui/checkbox/CheckBox";
import PackageOptions from "shared/components/products/option/PackageOptions";
import ProductOptions from "shared/components/products/option/ProductOptions";

import SlimCalendar from "desktop/resources/components/calendar/SlimCalendar";

class PaymentProductReady extends Component {
    constructor(props) {
        super(props);

        const date = mewtime();

        this.state = {
            isMount: true,
            calendar: {
                events: [],
                min: date.clone().subtract(1).format("YYYY-MM-DD"),
                max: date.clone().add(3, mewtime.const.MONTH).format("YYYY-MM-DD"),
                date: date.format("YYYY-MM-DD")
            },
            user_name: "",
            form: this.composeForm({ package_no: props.package_no || "", option_no: props.option_no || "" })
        };

        this.onChangeForm = this.onChangeForm.bind(this);
        this.onSelectPackage = this.onSelectPackage.bind(this);
        this.onSelectOption = this.onSelectOption.bind(this);
        this.onSelectMethod = this.onSelectMethod.bind(this);
        this.onChangeExtra = this.onChangeExtra.bind(this);
        this.onPayment = this.onPayment.bind(this);

        this.setStateData = this.setStateData.bind(this);
        this.findProduct = this.findProduct.bind(this);
        this.combinePackage = this.combinePackage.bind(this);
        this.combineOptions = this.combineOptions.bind(this);
        this.composeForm = this.composeForm.bind(this);
        this.createForm = this.createForm.bind(this);
        this.createParams = this.createParams.bind(this);
        this.totalPriceOption = this.totalPriceOption.bind(this);

        this.layoutCalendar = this.layoutCalendar.bind(this);
        this.layoutOption = this.layoutOption.bind(this);
        this.layoutPayMethod = this.layoutPayMethod.bind(this);
        this.layoutSubscriber = this.layoutSubscriber.bind(this);
        this.layoutRefund = this.layoutRefund.bind(this);
        this.layoutServiceAgree = this.layoutServiceAgree.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { product_no } = this.props;
        this.findProduct(product_no)
            .then(data => {
                // console.log(data);
                this.setStateData(({ form }) => {
                    return {
                        ...this.combinePackage(data.package, data.extra_option, data.custom_option),
                        optionList: this.combineOptions(data.option)
                    };
                });
            });
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onChangeForm(n, v) {
        this.setStateData(({ form }) => ({ form: { ...form, [n]: v } }));
    }

    onSelectPackage(package_no) {
        this.onChangeForm("package_no", Number(package_no));
    }

    onSelectOption(option_on) {
        this.onChangeForm("option_on", Number(option_on));
    }

    onSelectMethod(method) {
        this.setStateData(() => ({ method }));
    }

    onChangeExtra(select_extra) {
        this.onChangeForm("select_extra", select_extra);
    }

    onPayment() {
        const { form } = this.state;
        // console.log("onPayment : ", form);
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => (update(state)), callBack);
        }
    }

    findProduct(product_no) {
        return api.products.queryProductInfo(product_no).then(response => response.data);
    }

    combinePackage(pkg = [], extra = [], custom = []) {
        if (!pkg || !Array.isArray(pkg) || !pkg.length) {
            return null;
        }

        const rs = {
            packageList: [].concat(pkg),
            extraList: [{ title: "추가옵션을 선택해주세요", code: "" }]
        };
        let price = null;

        if (Array.isArray(extra) && extra.length) {
            rs.extraList = rs.extraList.concat(extra.reduce((r, ex) => {
                r.push({
                    ...ex
                });

                return r;
            }, []));
        }

        if (Array.isArray(custom) && custom.length) {
            rs.extraList = rs.extraList.concat(custom.reduce((r, c) => {
                if (c.price && c.price !== 0) {
                    r.push({
                        ...c,
                        code: `custom_${c.custom_no}`
                    });
                }

                return r;
            }, []));
        }

        if (!this.state.form.package_no) {
            const package_no = pkg.reduce((r, p) => {
                if (price === null || Number(p.price) < price) {
                    price = p.price;
                    return p.package_no;
                }

                return r;
            }, "");
            rs.form = { ...this.state.form, package_no };
        }

        return rs;
    }

    combineOptions(option) {
        if (!option || !Array.isArray(option) || !option.length) {
            return null;
        }

        const rs = {};
        let price = null;
        rs.optionList = option.reduce((r, o, i) => {
            if (price === null || Number(o.price) < price) {
                price = o.price;
                rs.option_no = o.option_no;
            }

            r.push(Object.assign(o, {
                person: Number(o.basic_person),
                total_price: this.totalPriceOption(o.price, o.add_price, o.person, o.basic_person)
            }));
            return r;
        }, []);
        return rs;
    }

    composeForm(form = {}) {
        return {
            name: form.name || "",
            phone: form.phone || "",
            email: form.email || "",
            message: form.message || "",
            date: form.date || "",
            method: form.method || "",
            pay_name: form.pay_name || "",
            product_no: form.product_no || "",
            option_no: form.option_no || "",
            package_no: form.package_no || "",
            offer_no: form.offer_no || "",
            talk_no: form.talk_no || "",
            select_extra: form.select_extra || []
        };
    }

    createForm() {
        const { form } = this.state;
        return Object.keys(form).reduce((r, k) => {
            if (form[k]) {
                r[k] = form[k];
            }
            return r;
        }, {});
    }

    createParams() {
        const { form } = this.state;
        const user = auth.getUser();
        const params = {
            pay_method: form.method, // 결제방법
            amount: "", // 결제금액
            name: form.pay_name, // 결제명
            merchant_uid: "", // 주문번호
            buyer_email: form.email, // 구매자 이메일
            buyer_name: form.name, // 구매자 명
            custom_data: { // 커스텀 데이터
                user_id: user ? user.id || "" : "", // 유저 아이디
                user_msg: form.message // 요청사항
            }
        };

        // // 모바일경우 페이지가 리다이렉트됨
        // if (utils.agent.isMobile()) {
        //     params.m_redirect_url = `${__DOMAIN__}/products/${product_no}/process`;
        // }
        //
        // // 무통장 입금기한 설정
        // if (payMethod.value === "vbank") {
        //     // 가상계좌 입금 기한은 최대 3일이다.
        //     // 3일이 남지 않았으면, 예약일 전날 까지 입금해야한다
        //     const dueDate = mewtime().add(3, mewtime.const.DATE);
        //     const reserveDate = mewtime(mewtime.strToDate(date));
        //     params.vbank_due = dueDate.isSameOrBefore(reserveDate, mewtime.const.DATE) ? `${dueDate.format("YYYYMMDD")}2359` : `${reserveDate.format("YYYYMMDD")}2359`;
        // }
    }

    totalPriceOption(price, add_price, person, basic_person) {
        return Number(price) + (Number(person) > Number(basic_person) ? add_price * (person - basic_person) : 0);
    }

    layoutCalendar() {
        const { calendar } = this.state;

        return (
            <div className="payment__column">
                <div className="title">날짜선택</div>
                <div className="content reserve__date">
                    <SlimCalendar {...calendar} onSelect={({ date }) => this.onChangeForm("date", date.format("YYYYMMDD"))} />
                </div>
            </div>
        );
    }

    layoutOption() {
        const { packageList, optionList, extraList, form } = this.state;

        return (
            <div className="payment__column">
                <div className="title">옵션선택</div>
                <div className="content">
                    {Array.isArray(packageList) && packageList.length ?
                        <PackageOptions data={packageList} extra={extraList} package_no={form.package_no} onSelect={this.onSelectPackage} onChange={this.onChangeExtra} />
                        : <ProductOptions data={optionList} option_no={form.option_no} onSelect={this.onSelectOption} />
                    }
                </div>
            </div>
        );
    }

    layoutPayMethod() {
        const { form } = this.state;

        return (
            <div className="payment__column">
                <div className="title">결제방법 선택</div>
                <div className="content">
                    <div className="payment__method">
                        <div className="method__group">
                            {PAYMENT_METHOD.map(m => {
                                return (
                                    <button
                                        key={`method-${m.value}`}
                                        className={classNames("_button _button__default", { active: form.method === m.value })}
                                        onClick={() => this.onChangeForm("method", m.value)}
                                    >{m.name}</button>
                                );
                            })}
                        </div>
                        <div className="payment__attention">
                            <span className="attention__icon pink">!</span>계좌이체 무통장입금의 경우, 예약자 이름과 계좌번호 예금주가 일치 해야합니다
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    layoutSubscriber() {
        const { form } = this.state;

        return (
            <div className="payment__column">
                <div className="title">예약자 정보</div>
                <div className="content">
                    <div className="payment__subscriber">
                        <div className="subscriber__row">
                            <div className="title required">예약자</div>
                            <div className="content">
                                <Input
                                    value={form.name}
                                    name="name"
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                            </div>
                        </div>
                        <div className="subscriber__row">
                            <div className="title required">연락처</div>
                            <div className="content">
                                <Input
                                    value={form.phone}
                                    name="phone"
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                            </div>
                        </div>
                        <div className="subscriber__row">
                            <div className="title required">이메일</div>
                            <div className="content">
                                <Input
                                    value={form.email}
                                    name="email"
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                            </div>
                        </div>
                        <div className="subscriber__row">
                            <div className="title">요청사항</div>
                            <div className="content">
                                <TextArea
                                    value={form.message}
                                    rows="5"
                                    name="message"
                                    onChange={(e, n, v) => this.onChangeForm(n, v)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    layoutRefund() {
        return (
            <div className="payment__column">
                <div className="title">환불규정 안내</div>
                <div className="content">
                    <div className="payment__info">
                        <div className="info__row">
                            <div className="title lower">예약 30일전</div>
                            <div className="content">총 금액의 100%환불</div>
                        </div>
                        <div className="info__row">
                            <div className="title lower">예약 14일전</div>
                            <div className="content">총 금액의 50%환불</div>
                        </div>
                        <div className="info__row">
                            <div className="title lower">예약 7일전</div>
                            <div className="content">총 금액의 20%환불</div>
                        </div>
                        <div className="info__row">
                            <div className="title lower">예약 7이내</div>
                            <div className="content">환불불가</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    layoutServiceAgree() {
        return (
            <div className="payment__column">
                <div className="title">서비스 동의</div>
                <div className="content">
                    <div className="payment__info service__agree">
                        <div className="info__row">
                            <div className="content">
                                <div className="agree__title"><CheckBox />위 촬영의 계약조건 확인 및 결제진행 동의 <span className="is__required">(필수)</span></div>
                            </div>
                        </div>
                        <div className="info__row">
                            <div className="content">
                                <div className="agree__title">
                                    <div className="title"><CheckBox />환불규정 안내에 대한 동의 <span className="is__required">(필수)</span></div>
                                    <div className="arrow" onClick={() => this.refAgreeRefund.onToggle()} />
                                </div>
                                <Accordion ref={ref => (this.refAgreeRefund = ref)}>
                                    <div />
                                    <div className="agree__content">
                                        <p>부득이하게 예약한 상품의 날짜나 시간을 변경해야 하는 경우, 작가님과 고객님이 서로 상의하여 내용을 변경하시거나 예약을 취소하시면 됩니다.</p>
                                        <p>하지만, 협의가 무산되거나 한쪽의 일방적인 통보로 인해 예약을 취소해야 하는 경우, 회사가 정한 규정에 따라 환불이 진행됩니다. 이는 사진작가와 고객을 모두 보호하기 위한 포스냅의 정책입니다.</p>
                                        <p>
                                            고객 예약 취소의 경우<br />
                                            1. 30일 이전 취소 시 : 전액 환불<br />
                                            2. 14일 이전 취소 시 : 50% 환불<br />
                                            3. 7일 이전 취소 시 : 20% 환불<br />
                                            4. 7일 이내 취소 시 : 환불불가
                                        </p>
                                    </div>
                                </Accordion>
                            </div>
                        </div>
                        <div className="info__row">
                            <div className="content">
                                <div className="agree__title">
                                    <div className="title"><CheckBox />개인정보 제3자 제공 동의 <span className="is__required">(필수)</span></div>
                                </div>
                                <Accordion>
                                    <div />
                                    <div className="agree__content">
                                        <p>
                                            개인정보는 제3자에게 제공되지 않습니다. 하지만 포스냅과 연계된 서비스 또는 결제와 같이 제3자의 응대가 필요한 경우, 동의를 통해 개인정보가 전달 될 수도 있습니다.
                                        </p>
                                        <p>
                                            개인정보는 서비스 이용 완료 또는 고객 응대 후 파기됩니다.
                                        </p>
                                    </div>
                                </Accordion>
                            </div>
                        </div>
                        <div className="info__row">
                            <div className="content">
                                <div className="agree__title"><CheckBox />개인정보 수집 및 이용 동의 <span className="is__required">(필수)</span></div>
                                <Accordion>
                                    <div />
                                    <div className="agree__content">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>수집하는 개인정보 항목</th>
                                                    <th>수집 및 이용목적</th>
                                                    <th>보유 및 이용기간</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <p>
                                                            <strong>계정정보</strong>
                                                            이름, 성별, 생년월일, 이메일, 전화번호, 지역, 프로필이미지
                                                        </p>
                                                        <p>
                                                            <strong>웹 결제 정보</strong>
                                                            계약된 PG사에 전달된 결제 정보
                                                        </p>
                                                        <p>
                                                            <strong>로그 데이터</strong>
                                                            IP정보, 디바이스 또는 브라우저 정보, 조회된 도메인, 방문 웹페이지, 이용 통신사 구분, 이용 기록, 불량 이용 기록
                                                        </p>
                                                        <p>
                                                            <strong>계정정보</strong>
                                                            이름, 성별, 생년월일, 이메일, 전화번호, 지역, 프로필이미지
                                                        </p>
                                                        <p>
                                                            <strong>SNS 연동 정보</strong>
                                                            SNS에서 제공하는 사용자의 계정 정보와 친구 관계 정보 등 연동되는 SNS에서 허용하는 모든 정보 (지원 SNS는 운영에 따라 변경 가능합니다.)
                                                        </p>
                                                    </td>
                                                    <td>
                                                        포스냅의 원활한 이용을 위해 개인정보를 수집합니다. 세부적인 이용 목적은 다음과 같습니다.
                                                        <ul>
                                                            <li>본인 확인과 부정 이용 방지를 위해</li>
                                                            <li>서비스 이용 문의 응대를 위해</li>
                                                            <li>이용 현황 파악을 위한 통계 데이터 축적을 위해</li>
                                                            <li>캠페인 이벤트 등 추천 선물 발송을 위해</li>
                                                            <li>중요 공지사항의 전달을 위해</li>
                                                            <li>이벤트와 광고 전달을 위해</li>
                                                            <li>유료 이용 시 전송, 배송, 요금 정산을 위해</li>
                                                            <li>새로운 상품 추천을 위해</li>
                                                        </ul>
                                                    </td>
                                                    <td>
                                                        이용 목적을 위해 한시적으로 보유하고 목적 달성시 개인정보는 파기됩니다. 하지만 관계 법령 등으로 보존 필요가 있는 경우 일정 기간 보관합니다.
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </Accordion>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <div className="payment__container payment__ready">
                <div className="payment__contents">
                    {this.layoutCalendar()}
                    {this.layoutOption()}
                    {this.layoutPayMethod()}
                    {this.layoutSubscriber()}
                    {this.layoutRefund()}
                    {this.layoutServiceAgree()}
                </div>
            </div>
        );
    }
}

PaymentProductReady.propTypes = {
    product_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    offer_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    package_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    option_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default PaymentProductReady;
