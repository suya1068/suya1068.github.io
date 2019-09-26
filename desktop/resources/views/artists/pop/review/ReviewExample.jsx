import "./reviewExample.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import Icon from "desktop/resources/components/icon/Icon";
import ARTIST_REVIEW_EXAMPLE from "./reviewExample.const";

export default class ReviewExample extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: ARTIST_REVIEW_EXAMPLE
        };
    }

    renderTags(tags) {
        const _tags = tags.split(",");
        return (
            _tags.map((tag, idx) => {
                return (
                    <div className="tag-item" key={`tag__${idx}`}>{`#${tag}`}</div>
                );
            })
        );
    }

    renderRow(data) {
        const rowType = data.TYPE;
        let content = "";

        if (rowType === "TEXT") {
            content = this.renderRowText(data);
        }
        if (rowType === "IMAGE") {
            content = this.renderRowImage(data);
        }

        return content;
    }

    renderRowText(data) {
        return (
            <div className="review-example__content-text">
                {utils.linebreak(data.VALUE)}
            </div>
        );
    }

    renderRowImage(data) {
        const IMAGE_PATH = this.state.data.IMG_BASE_PATH;
        return (
            <div className="review-example__content-image">
                {data.IMG_DATA.LIST.map((image, idx) => {
                    const style = {
                        width: image.WIDTH,
                        height: image.HEIGHT
                    };

                    return (
                        <div className={classNames("content-image-box", { "di": image.DI })} key={`image_list__${data.NO}__${idx}`} style={{ ...style }}>
                            <img src={`${__SERVER__.img}${IMAGE_PATH}${image.SRC_2X}`} role="presentation" />
                        </div>
                    );
                })}
            </div>
        )
    }

    render() {
        const { data } = this.state;
        return (
            <div className="pop-artist-review__example review-example">
                <div className="review-example__head">
                    <div className="review-example__head-artist">
                        <p className="head-artist__info">{data.CATEGORY_NAME} | {data.ARTIST_NAME} 작가님</p>
                    </div>
                    <p className="review-example__head-title">{data.TITLE}</p>
                    <div className="review-example__head-button">
                        <button className="close-btn" onClick={() => this.props.onClose()}>
                            <img src={`${__SERVER__.img}/common/cancel_black.png`} role="presentation" />
                        </button>
                    </div>
                    <div className="review-example__head-tag">
                        {this.renderTags(data.TAG)}
                    </div>
                </div>
                <div className="review-example__content">
                    {data.LIST.map((obj, idx) => {
                        return (
                            <div className="content-row" key={`content-row__${obj.TYPE}__${obj.NO}`}>
                                {this.renderRow(obj)}
                            </div>
                        );
                    })}
                </div>
                <div className="review-example__button">
                    <button className="example-button">작가에게 문의하기</button>
                </div>
            </div>
        );
    }
}
