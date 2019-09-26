import React, { Component } from "react";
import classNames from "classnames";
import DropDown from "desktop/resources/components/form/Dropdown";

export default class VirtualEstimateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numbers: props.numbers,
            error: props.error,
            form: props.form,
            list: props.list,
            info: props.info,
            sendInfo: props.sendInfo
        };
        this.renderColumn = this.renderColumn.bind(this);
    }

    renderColumn(o, i) {
        const { numbers, error, form, info, sendInfo, mainTest } = this.props;
        const column = `column-${o.COLUMN}`;
        const type = o.TYPE;
        const di = `di-${o.DI}`;
        const disabled = o.DISABLED;

        let number = null;

        if (type === "dropdown") {
            number = numbers[o.CODE];
        }
        const code = o.CODE;

        let infoText = "";
        if (info && info[code]) {
            const t = o.PROP && o.PROP.filter(obj => obj.DEFAULT)[0];
            infoText = t && info[code][t.CODE] ? info[code][t.CODE].content : "";
        }

        if (sendInfo && sendInfo.code === code) {
            infoText = sendInfo.value;
        }

        return (
            <div className={classNames("content__column", { "disabled": disabled }, { "test": mainTest })} key={`virtual-estimate__product__${o.CODE}__${i}`}>
                <div className={classNames("content__column__inner", column)}>
                    {disabled &&
                    <div className="disabled-wrap" />
                    }
                    <div className="content__column__title">
                        {o.NAME}
                        {o.CAPTION.HAS &&
                        <div className="caption">
                            <i className="_icon _icon__ext__black" />
                            <div className={classNames("pop-info-box", { "box-left": o.CAPTION_POS && o.CAPTION_POS === "right" })}>
                                {o.CAPTION.LIST.map((l, indx) => {
                                    return (
                                        <div className="info-box-item" key={`${o.CODE}__${indx}`}>
                                            <div className="text-box">
                                                <p className="title">{l.TITLE}</p>
                                                <p className="desc">{l.DESC}</p>
                                            </div>
                                            {l.IMG &&
                                            <div className="image-box" style={{ width: 120, height: 120, border: "1px solid #dfdfdf" }}>
                                                <img role="presentation" src={`${__SERVER__.img}${l.IMG}`} />
                                                <p className="artist" style={{ color: l.COLOR || "" }}>by {l.ARTIST}</p>
                                            </div>
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        }
                    </div>
                    <div className={classNames("content__column__content", type, di, { "disabled": disabled })}>
                        {type === "select" &&
                        o.PROP.map((p, index) => {
                            const active = p.DEFAULT;
                            return (
                                <div
                                    className={classNames("select-box", { "active": active })}
                                    key={`select_box_${i}__${index}`}
                                    onClick={e => this.props.onActive(e, o.CODE, p.CODE, o)}
                                >
                                    <div className={classNames("border-box", { "active": active })} />
                                    {p.NAME}
                                </div>
                            );
                        })
                        }
                        {type === "dropdown" &&
                        <DropDown
                            list={number}
                            select={form[o.CODE]}
                            resultFunc={value => this.props.onChange(value, o.CODE)}
                            no_icon
                            // error_msg={error[code] && error[code].show ? error[code].content : ""}
                        />
                        }
                        {
                        error[code] && error[code].show &&
                        <span className="error-msg">{error[code].content}</span>
                        }
                        {
                            infoText &&
                            <span className="info-msg">{infoText}</span>
                        }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        const { list } = this.props;

        return (
            <div className="virtual-estimate__content">
                <div className="virtual-estimate__content__box">
                    {list.map((obj, idx) => {
                        return (
                            <div className="content__row" key={`virtual-estimate__product__${idx}`}>
                                {obj.map((o, i) => this.renderColumn(o, i))}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
