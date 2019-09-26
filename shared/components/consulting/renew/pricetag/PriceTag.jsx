import "./price_tag.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import { BASE_IMAGE_PATH } from "./priceTag.const";
import classNames from "classnames";

export default class PriceTag extends Component {
    constructor(props) {
        super(props);
        this.state = {
            entry: "",
            is_clicked: "",
            isMount: true,
            device_type: props.device_type,
            ext_click: props.ext_click
        };
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    componentWillReceiveProps(nextProps) {
        const { ext_click } = nextProps;

        if (ext_click) {
            this.setState({ is_clicked: "" });
        }
    }

    onMouseEnter(e, key, desc) {
        let entry = key;
        if (!desc) {
            entry = "";
        }
        this.setState(state => { return { entry }; });
    }

    onMouseLeave(e, key) {
        this.setState(state => { return { entry: "" }; });
    }

    equalTagKeyToEntry(key, name) {
        return this.state[name] === key;
    }

    onClick(e, key, desc) {
        e.preventDefault();
        e.stopPropagation();
        const { is_clicked } = this.state;
        let _clicked = is_clicked;
        if (is_clicked === key || !desc) {
            _clicked = "";
        } else {
            _clicked = key;
        }

        this.setState({ is_clicked: _clicked });
    }

    onClose() {
        this.setState({ is_clicked: "" });
    }

    render() {
        const { data, device_type, ext_click } = this.props;
        return (
            <div className="simple-consult__body__pricetag__tag-box tag-box">
                <div className="tag-box__header">
                    <p className="title">{data.name} 촬영 단가표</p>
                </div>
                <div className="tag-box__content">
                    {data.tag.map((t, idx) => {
                        return (
                            <div className="tag-box__content__row" key={`tag-box__row__${idx}`}>
                                {t.map(tag => {
                                    const key = `tag-item__${tag.code}__${tag.no}`;
                                    const amp = tag.no % 2 === 0;
                                    const c_device_distance = device_type === "mobile" ? 16 : 24;

                                    return [
                                        <div
                                            key={key}
                                            className={
                                                classNames("tag-box__content-tag",
                                                    { "active": this.equalTagKeyToEntry(key, "entry") },
                                                    { "on": this.equalTagKeyToEntry(key, "is_clicked") })
                                            }
                                            onMouseEnter={e => this.onMouseEnter(e, key, tag.desc)}
                                            onMouseLeave={e => this.onMouseLeave(e)}
                                            onTouchStart={e => this.onMouseEnter(e, key, tag.desc)}
                                            onTouchEnd={e => this.onMouseLeave(e)}
                                            onClick={e => this.onClick(e, key, tag.desc)}
                                            style={{ paddingRight: amp ? "" : c_device_distance, paddingLeft: amp ? c_device_distance : "" }}
                                        >
                                            <span className="tag_name">{tag.name}</span>
                                            <span className="tag_price">{Number.isNaN(tag.price) ? tag.price : utils.format.price(tag.price)}</span>
                                        </div>,
                                        this.equalTagKeyToEntry(key, "is_clicked") && tag.desc && !ext_click &&
                                            [
                                                <div className={classNames("tag-box__content-tag__shot-pop", { "text": !tag.sample_img })}>
                                                    {tag.sample_img &&
                                                        <div className="pop-image-content">
                                                            <img role="presentation" alt={tag.name} src={`${__SERVER__.img}${BASE_IMAGE_PATH}${tag.sample_img}`} />
                                                            <span className="artist" style={{ color: tag.color }}>by {tag.artist}</span>
                                                        </div>
                                                    }
                                                    <div className="pop-text-content">
                                                        <p className="name">{tag.name}</p>
                                                        <span className="desc">{utils.linebreak(tag.desc)}</span>
                                                    </div>
                                                    <div className="close-button" onClick={this.onClose} />
                                                </div>
                                            ]
                                    ];
                                })}
                            </div>
                        );
                    })}
                </div>
                {data.warn &&
                    <div className="tag-box__content__warning-msg">
                        <span className="required">*</span>{data.warn}
                    </div>
                }
            </div>
        );
    }
}

PriceTag.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};
