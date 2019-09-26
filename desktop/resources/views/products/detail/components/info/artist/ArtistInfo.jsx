import "./artistInfo.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import MoreBtn from "../../../business/component/more/MoreBtn";

export default class ArtistInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            career: props.career,
            minCount: 10,
            isMinCareer: false,
            isLoaded: false
        };
        this.renderCareer = this.renderCareer.bind(this);
        this.onMore = this.onMore.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(np) {
        if (JSON.stringify(this.props.career) !== JSON.stringify(np.career)) {
            this.setState({
                isLoaded: true,
                isMinCareer: np.career.length > this.state.minCount
            });
        }
    }

    /**
     * 경력 더보기
     */
    onMore() {
        this.gaEvent("유료_경력더보기");
        this.setState({
            isMinCareer: false
        });
    }

    /**
     * ga이벤트 전달
     * @param action
     */
    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    /**
     * 경력사항을 그린다.
     * @param list
     * @returns {*}
     */
    renderCareer(list) {
        const { isMinCareer } = this.state;
        let content = null;
        if (Array.isArray(list) && list.length > 0) {
            content = (
                <div className={classNames("career-box", { "min": isMinCareer })}>
                    {list.map((obj, idx) => {
                        return (
                            <div className="career-row" key={`career__${idx}`}>
                                <p className="career-date">{`${obj.date.substr(0, 4)}.${obj.date.substr(4, 2)}`}</p>
                                <p className="career-content">{obj.content}</p>
                            </div>
                        );
                    })}
                </div>
            );
        }

        return content;
    }

    render() {
        const { career } = this.props;
        const { isMinCareer, isLoaded } = this.state;

        if (!isLoaded) {
            return false;
        }

        return (
            <div className="product__artist-info artist-info" id="artist-info">
                <h3 className="sr-only">작가경력</h3>
                <div className="artist-info__content">
                    {this.renderCareer(career)}
                </div>
                {isMinCareer &&
                <MoreBtn title="작가경력 더보기" onMore={this.onMore} moreStyle={{ fontSize: 12 }} />
                }
            </div>
        );
    }
}
