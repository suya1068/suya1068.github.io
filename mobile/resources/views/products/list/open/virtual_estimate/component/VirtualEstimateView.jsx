import React, { Component } from "react";
import classNames from "classnames";
import DropDown from "shared/components/ui/dropdown/DropDown";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import utils from "forsnap-utils";

export default class VirtualEstimateView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numbers: props.numbers,
            error: props.error,
            form: props.form,
            list: props.list,
            info: props.info,
            sendInfo: props.sendInfo,
            isMobile: utils.agent.isMobile()
        };
        this.renderColumn = this.renderColumn.bind(this);
    }

    componentWillMount() {
    }

    handleInfoModal(list, code) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            close: true,
            content: (
                <div className="pop-info-box">
                    {list.map((l, indx) => {
                        return (
                            <div className="info-box-item" key={`${code}__${indx}`}>
                                <div className="text-box">
                                    <p className="title">{l.TITLE}</p>
                                    <p className="desc">{l.DESC}</p>
                                </div>
                                {l.IMG &&
                                <div className="image-box">
                                    <img role="presentation" src={`${__SERVER__.img}${l.IMG}`} />
                                    <p className="artist" style={{ color: l.COLOR || "" }}>by {l.ARTIST}</p>
                                </div>
                                }
                            </div>
                        );
                    })}
                </div>
            )
        });
    }

    renderColumn(o, i) {
        const { numbers, error, form, info, sendInfo, renewDetail, mainTest } = this.props;
        const { isMobile } = this.state;
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

        let clickEvt = () => this.handleInfoModal(o.CAPTION.LIST, o.CODE);
        if (renewDetail && !isMobile) {
            clickEvt = null;
        }

        return (
            <div className="content__column__outer">
                {!disabled &&
                    <div className={classNames("content__column", { "disabled": disabled })} key={`virtual-estimate__product__${o.CODE}__${i}`}>
                        {disabled &&
                        <div className="disabled-wrap" />
                        }
                        <div>
                            <div className="content__column__title" style={{ justifyContent: renewDetail && !isMobile && "flex-start" }}>
                                {o.NAME}
                                {o.CAPTION.HAS &&
                                <div className="m_caption">
                                    <div
                                        className="caption__box"
                                        onClick={clickEvt}
                                    >
                                        <i className="_icon _icon__ext__gray" />
                                        {isMobile && <span style={{ marginLeft: 5, fontSize: 12 }}>도움말보기</span>}
                                        {!isMobile &&
                                        <div className="m_pop-info-box">
                                            {o.CAPTION.LIST.map((l, indx) => {
                                                return (
                                                    <div className="m_info-box-item" key={`${code}__${indx}`}>
                                                        <div className="text-box">
                                                            <p className="title">{l.TITLE}</p>
                                                            <p className="desc">{l.DESC}</p>
                                                        </div>
                                                        {l.IMG &&
                                                        <div className="image-box">
                                                            <img role="presentation" src={`${__SERVER__.img}${l.IMG}`} />
                                                            <p className="artist" style={{ color: l.COLOR || "" }}>by {l.ARTIST}</p>
                                                        </div>
                                                        }
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        }
                                    </div>
                                </div>
                                }
                            </div>
                            <div className={classNames(type, { "disabled": disabled })}>
                                <div
                                    className={classNames(
                                        "content__column__content",
                                        o.DI ? di : ""
                                    )}
                                >
                                    {type === "select" &&
                                    o.PROP.map((p, index) => {
                                        const active = p.DEFAULT;
                                        return (
                                            <div
                                                className={classNames("m_select-box", { "active": active }, { "test": mainTest })}
                                                key={`select_box_${i}__${index}`}
                                                onClick={e => this.props.onActive(e, o.CODE, p.CODE, o)}
                                            >
                                                <p>{p.NAME}</p>
                                                <div className={classNames("border-box", { "active": active })} />
                                            </div>
                                        );
                                    })
                                    }
                                    {type === "dropdown" &&
                                    <DropDown
                                        data={number}
                                        select={form[o.CODE]}
                                        onSelect={value => this.props.onChange(value, o.CODE)}
                                        textAlign="center"
                                        border="black"
                                        error_msg={error[code] && error[code].show ? error[code].content : ""}
                                    />
                                    }
                                </div>
                                {
                                    infoText &&
                                    <span className={classNames("info-msg")}>{infoText}</span>
                                }
                            </div>
                        </div>
                    </div>
                }
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
                            !obj.DISABLED &&
                            <div className="content__row" key={`virtual-estimate__product__${idx}`}>
                                {this.renderColumn(obj, idx)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
