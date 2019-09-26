import "./product_options.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import REGULAR from "shared/constant/regular.const";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Accordion from "shared/components/ui/accordion/Accordion";
import DropDown from "shared/components/ui/dropdown/DropDown";
import Input from "shared/components/ui/input/Input";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

class PackageOptions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            package_no: props.package_no,
            select_extra: props.select_extra,
            select: ""
        };

        this.onChangeExtra = this.onChangeExtra.bind(this);
        this.onSelectExtra = this.onSelectExtra.bind(this);
        this.onDeleteExtra = this.onDeleteExtra.bind(this);
        this.onChangeCount = this.onChangeCount.bind(this);
        this.onBlurCount = this.onBlurCount.bind(this);
        this.onClickCount = this.onClickCount.bind(this);
        this.onPayment = this.onPayment.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillReceiveProps(np) {
        const prop = {};

        if (np.package_no !== this.state.package_no) {
            prop.package_no = np.package_no;
        }

        if (JSON.stringify(np.select_extra) !== JSON.stringify(this.state.select_extra)) {
            prop.select_extra = np.select_extra;
        }

        if (Object.keys(prop).length) {
            this.setStateData(() => {
                return prop;
            });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onChangeExtra() {
        if (typeof this.props.onChange === "function") {
            this.props.onChange(this.state.select_extra);
        }
    }

    onSelectExtra(extra_no) {
        if (extra_no) {
            const { extra } = this.props;
            this.setStateData(({ select_extra }) => {
                const item = extra.find(ex => ex.extra_no === extra_no);
                if (!item) {
                    return select_extra;
                }

                let selectExtra;
                if (!select_extra.find(o => o.extra_no === extra_no)) {
                    selectExtra = select_extra.concat([{
                        extra_no,
                        count: 1
                    }]);
                }

                return {
                    select_extra: selectExtra || select_extra,
                    select: extra_no
                };
            }, this.onChangeExtra);
        }
    }

    onDeleteExtra(extra_no) {
        this.setStateData(({ select_extra }) => {
            return {
                select_extra: select_extra.reduce((r, o) => {
                    if (o.extra_no !== extra_no) {
                        r.push(o);
                    }
                    return r;
                }, [])
            };
        }, this.onChangeExtra);
    }

    onChangeCount(n, v) {
        const count = Number(v);
        this.setStateData(({ select_extra }) => {
            return {
                select_extra: select_extra.reduce((r, o) => {
                    if (o.extra_no === n) {
                        o.count = isNaN(count) ? o.count : count;
                    }
                    r.push(o);
                    return r;
                }, [])
            };
        }, this.onChangeExtra);
    }

    onBlurCount(n, v) {
        const count = Number(v);
        this.setStateData(({ select_extra }) => {
            return {
                select_extra: select_extra.reduce((r, o) => {
                    if (o.extra_no === n) {
                        o.count = isNaN(count) ? o.count : count || 1;
                    }
                    r.push(o);
                    return r;
                }, [])
            };
        }, this.onChangeExtra);
    }

    onClickCount(code, b) {
        this.setStateData(({ select_extra }) => {
            return {
                select_extra: select_extra.reduce((r, o) => {
                    if (o.extra_no === code) {
                        o.count += b ? 1 : -1;
                        if (o.count < 1) {
                            o.count = 1;
                        } else if (o.count > 9999) {
                            o.count = 9999;
                        }
                    }
                    r.push(o);
                    return r;
                }, [])
            };
        }, this.onChangeExtra);
    }

    onPayment() {
        const { onPayment } = this.props;

        if (typeof onPayment === "function") {
            onPayment();
        }
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    render() {
        const { data, extra, onSelect, onPayment } = this.props;
        const { package_no, select_extra, select } = this.state;
        const isPayment = typeof onPayment === "function";

        if (Array.isArray(data) && data.length) {
            return (
                <div className="product__options">
                    {data.map((p, i) => {
                        const { photo_cnt, custom_cnt, photo_time, running_time, size, complete_period } = p;
                        const selected = Number(package_no) === Number(p.package_no);
                        let total = Number(p.price);

                        return (
                            <Accordion key={`option_no_${i}`} selected={selected} onSelect={b => onSelect(b ? p.package_no : null)}>
                                <div className="option__title">
                                    <div className="check"><CheckBox checked={selected} /></div>
                                    <div className="title">{p.title}</div>
                                    <div className="price">{utils.format.price(p.price)}</div>
                                </div>
                                <div>
                                    <div className="option__content">
                                        <div>
                                            <div className="service__info">
                                                {photo_cnt ? <div className="service__row"><div className="title">이미지</div><div className="content">{utils.format.price(photo_cnt)}</div></div> : null}
                                                {custom_cnt ? <div className="service__row"><div className="title">보정</div><div className="content">{utils.format.price(custom_cnt)}</div></div> : null}
                                                {photo_time ? <div className="service__row"><div className="title">촬영시간</div><div className="content">{utils.format.price(photo_time)}</div></div> : null}
                                                {running_time ? <div className="service__row"><div className="title">영상러닝타임</div><div className="content">{utils.format.price(running_time)}</div></div> : null}
                                                {size ? <div className="service__row"><div className="title">의상사이즈</div><div className="content">{utils.format.price(size)}</div></div> : null}
                                                {complete_period ? <div className="service__row"><div className="title">작업일</div><div className="content">{utils.format.price(complete_period)}</div></div> : null}
                                            </div>
                                            <div className="service__content">
                                                {p.content}
                                            </div>
                                        </div>
                                    </div>
                                    {extra && Array.isArray(extra) && extra.length ?
                                        <div className="extra__content">
                                            <DropDown
                                                data={extra}
                                                select={select}
                                                name="title"
                                                value="extra_no"
                                                onSelect={this.onSelectExtra}
                                            />
                                            {select_extra && Array.isArray(select_extra) && select_extra.length ?
                                                <div className="extra__select__list">
                                                    {select_extra.map(o => {
                                                        const item = extra.find(ex => ex.extra_no === o.extra_no);
                                                        total += Number(o.count) * Number(item.price);
                                                        return (
                                                            <div key={item.extra_no} className="extra__item">
                                                                <div className="extra__item__info">
                                                                    <div className="title">
                                                                        {item.title}
                                                                    </div>
                                                                    {!o.required ?
                                                                        <div className="delete">
                                                                            <button className="_button _button__close" onClick={() => this.onDeleteExtra(item.extra_no)} />
                                                                        </div> : null
                                                                    }
                                                                </div>
                                                                <div className="extra__item__info">
                                                                    <div className="qty">
                                                                        <Input
                                                                            type="text"
                                                                            value={o.count}
                                                                            name={item.extra_no}
                                                                            max="9999"
                                                                            regular={REGULAR.INPUT.NUMBER}
                                                                            onChange={(e, n, v) => this.onChangeCount(n, v)}
                                                                            onBlur={(e, n, v) => this.onBlurCount(n, v)}
                                                                        />
                                                                        <button className="_button" onClick={() => this.onClickCount(o.extra_no, true)} />
                                                                        <button className="_button reverse" onClick={() => this.onClickCount(o.extra_no, false)} />
                                                                    </div>
                                                                    <div className="price">
                                                                        {utils.format.price(item.price)} 원
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div> : null
                                            }
                                        </div> : null
                                    }
                                    {isPayment ?
                                        <div className="payment__button">
                                            <button className="_button _button__yellow__over" onClick={this.onPayment}>{utils.format.price(total)} 예약 & 결제하기</button>
                                        </div> : null
                                    }
                                </div>
                            </Accordion>
                        );
                    })}
                </div>
            );
        }

        return null;
    }
}

PackageOptions.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    extra: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    select_extra: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    package_no: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    onSelect: PropTypes.func.isRequired,
    onChange: PropTypes.func.isRequired,
    onPayment: PropTypes.func
};

PackageOptions.defaultProps = {
    select_extra: []
};

export default PackageOptions;
