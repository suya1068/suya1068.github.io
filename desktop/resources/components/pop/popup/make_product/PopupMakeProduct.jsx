import "./popup_makeProduct.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import Icon from "desktop/resources/components/icon/Icon";
import PopModal from "shared/components/modal/PopModal";
import { MAKE_PRODUCT } from "./make_product.const";

export default class PopupMakeProduct extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: MAKE_PRODUCT,
            entity: this.composeData(MAKE_PRODUCT)
        };
        this.onClose = this.onClose.bind(this);
        this.onCheckClose = this.onCheckClose.bind(this);
    }

    componentWillMount() {
        utils.ad.gaEvent("기업_메인", "상세페이지 제작안내", "상세페이지 제작안내");
    }

    componentDidMount() {
        const c_modal = document.getElementsByClassName(`modal-contents ${this.props.modal_name}`)[0];
        if (c_modal) {
            c_modal.addEventListener("click", this.onCheckClose);
        }
    }

    onCheckClose(e) {
        const target = e.target;
        const c = target && target.className;
        if (c === `modal-contents ${this.props.modal_name}`) {
            PopModal.close();
        }
    }

    composeData(data) {
        return this.changeObjectToKeys(data);
    }

    changeObjectToKeys(data) {
        if (typeof data !== "object" || !(data instanceof Object)) {
            throw Error("type is not object");
        }

        return Object.keys(data);
    }

    onClose() {
        const { modal_name } = this.props;
        PopModal.close(modal_name);
    }

    prepareToRender(key) {
        let content;
        const data = this.state.data[key];
        switch (key) {
            case "HONEST": content = this.renderHonest(data); break;
            case "INFO": content = this.renderInfo(data); break;
            case "PROCESS": content = this.renderProcess(data); break;
            case "WARN": content = this.renderWarn(data); break;
            default: break;
        }

        return content;
    }

    /**
     * 상세페이지 정직 컨텐츠를 렌더링한다.
     * @param data
     * @returns {*}
     */
    renderHonest(data) {
        return (
            <div className="honest__content-box">
                {data.CONTENT.map(content => {
                    return (
                        <div className="content__item" key={`honest__${content.TITLE}`}>
                            <div className="icon-box">
                                <img role="presentation" alt={content.TITLE} src={`${__SERVER__.img}${content.ICON}`} />
                            </div>
                            <div className="text-box">
                                <p className="title">{content.TITLE}</p>
                                <p className="desc">{content.DESC}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }

    /**
     * 상세페이지 제작 안내 컨텐츠를 렌더링한다.
     * @param data
     * @returns {*}
     */
    renderInfo(data) {
        return (
            <div className="info__content-box">
                {data.CONTENT.map((content, idx) => {
                    return (
                        <div className={classNames("info__row", { "first_row": idx === 0 })} key={`info_content__row_${idx}`}>
                            <div className={classNames("info__column", "th", { "first": idx === 0 })}>
                                <p>{content.TITLE}</p>
                            </div>
                            {content.LIST.map((list, i) => {
                                return (
                                    <div className={classNames("info__column", "item")} key={`info__column__${idx}__${i}`}>
                                        <p>{list.TEXT}</p>
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        );
    }

    /**
     * 상세페이지 제작 과정 컨텐츠를 렌더링한다.
     * @param data
     * @returns {*}
     */
    renderProcess(data) {
        const content = data.CONTENT;
        const _data = this.composeProcessData(content);

        return (
            <div className="process__content-box">
                {_data.map((item, idx) => {
                    return (
                        <div className={classNames("step", { "arrow": item.CODE === "arrow" })} key={`process__${idx}`}>
                            {item.TITLE}
                            {item.CODE === "arrow" &&
                                <i className="_icon _icon__arrow__y_right" />
                            }
                        </div>
                    );
                })}
            </div>
        );
    }

    composeProcessData(data) {
        return data.reduce((result, item, idx) => {
            if (idx > 0) {
                result.push({ CODE: "arrow", TITLE: "" });
            }
            result.push(item);
            return result;
        }, []);
    }

    /**
     * 상세페이지 유의사항 컨텐츠를 렌더링한다.
     * @param data
     * @returns {*}
     */
    renderWarn(data) {
        return (
            <div className="warn__content-box">
                {data.CONTENT.map((item, idx) => {
                    return (
                        <div className="warn__content__row" key={`warn__content__${idx}`}>
                            <p className="warn__text">{item.TEXT}</p>
                        </div>
                    );
                })}
            </div>
        );
    }

    render() {
        const { data, entity } = this.state;
        return (
            <div className="make_product_popup">
                <div className="make_product_popup__header">
                    <div className="close-button" onClick={this.onClose}>
                        <Icon name="close_w" />
                    </div>
                    <p className="title">
                        <span className="color-yellow">상세페이지 제작</span>도<br />
                        포스냅과 함께하세요!
                    </p>
                </div>
                <div className="make_product_popup__body">
                    {entity.map(obj => {
                        return (
                            <div className="make_product_popup__content" key={`make_product__content__${obj}`}>
                                <p className="title">{data[obj].TITLE}</p>
                                <div className={classNames("make_product_popup__content__box", obj.toLowerCase())}>
                                    {this.prepareToRender(obj)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
