import "./RecommendList.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

class RecommendList extends Component {
    constructor(props) {
        super(props);

        let tags = [];

        if (props.data && props.data.tag) {
            tags = utils.search.parse(props.data.tag);
        }

        this.state = {
            tags
        };

        this.onResult = this.onResult.bind(this);
        // this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        const tag = nextProps.data.tag;
        const { tags } = this.state;
        const prop = {};

        if (tag !== utils.search.params(tags)) {
            prop.tags = utils.search.parse(tag);
        }

        this.setState(prop);
    }

    onResult(tag, isDelete) {
        const { onResult, data } = this.props;
        const { tags } = this.state;

        if (tags) {
            const index = tags.findIndex(t => {
                return t === tag;
            });

            if (isDelete) {
                tags.splice(index, 1);
            } else if (index === -1) {
                tags.push(tag);
                if (typeof this.props.gaEvent === "function") {
                    this.props.gaEvent("추천태그", `${data.categoryCode}_${tag}`);
                }
                // this.gaEvent(data.categoryCode, tag);
            }

            if (typeof onResult === "function") {
                onResult(utils.search.params(tags));
            }
        }
    }

    // gaEvent(code, tag) {
    //     const { eventName } = this.props;
    //     const eCategory = eventName;
    //     const eAction = "";
    //     const eLabel = `카테고리코드: ${code} / 태그명: ${tag}`;
    //     utils.ad.gaEvent(eCategory, eAction, eLabel);
    // }

    render() {
        const { list } = this.props.data;
        const { tags } = this.state;

        if (!list) {
            return null;
        }

        return (
            <div className="category__recommend">
                <div className="category__recommend__container">
                    <div className="category__recommend__contents">
                        <div className="category__recommend__buttons arrow__left" />
                        <div className="category__recommend__list">
                            <div className="recommend__list">
                                {list.map((recom, i) => {
                                    let className = "";
                                    if (tags && Array.isArray(tags) && tags.length > 0) {
                                        const index = tags.findIndex(t => {
                                            return t === recom;
                                        });

                                        if (index !== -1) {
                                            className = "selected";
                                        }
                                    }

                                    return (
                                        <div className={classNames("recommend__list__item", className)} key={`recommend__item__${i}`}>
                                            <button onClick={() => this.onResult(recom, !!className)}>{recom}</button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="category__recommend__buttons arrow__right" />
                    </div>
                </div>
                {/* tags && Array.isArray(tags) && tags.length > 0 ?
                    <div className="category__recommend__container bg-trans">
                        <div className="category__recommend__contents">
                            <div className="category__recommend__list selected">
                                <div className="recommend__list">
                                    {tags.map((recom, i) => {
                                        return (
                                            <div className="recommend__list__item" key={`recommend__item__${i}`}>
                                                <button>{recom}</button>
                                                <i className="close" onClick={() => this.onResult(recom, true)} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                    : null
                */}
            </div>
        );
    }
}

/**
 * @param data - {
 *      list: Array(Object),
 *      tag: String
 * }
 * @type {{data: *}}
 */
RecommendList.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    onResult: PropTypes.func.isRequired,
    eventName: PropTypes.string
};

RecommendList.defaultProps = {
    eventName: "목록태그선택"
};

export default RecommendList;
