import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE, MODAL_ALIGN } from "shared/components/modal/Modal";

import Img from "desktop/resources/components/image/Img";
import FullSlider from "desktop/resources/components/image/FullSlider/FullSliderContainer";

class EstimateDetailPortfolio extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: [],
            offset: 0,
            limit: props.limit || 15
        };

        this.onMore = this.onMore.bind(this);
        this.onFullScreen = this.onFullScreen.bind(this);
    }

    componentWillMount() {
        this.onMore();
    }

    onMore() {
        const { data } = this.props;
        const { offset, limit } = this.state;
        const list = [];
        let index = offset;
        for (index; index < (offset + limit); index += 1) {
            const item = data.list[index];
            if (item) {
                list.push(item);
            } else {
                break;
            }
        }

        this.setState({
            list: this.state.list.concat(list),
            offset: index
        });
    }

    onFullScreen(index) {
        const { data } = this.props;
        const portfolio = data.list.reduce((r, o) => {
            r.push({
                ...o,
                src: data.photoType === "private" ? `/${o.thumb_key}` : o.portfolio_img,
                type: data.photoType
            });
            return r;
        }, []);

        if (typeof this.props.onFullScreen === "function") {
            this.props.onFullScreen(portfolio, data.total_cnt, data, index);
        } else {
            Modal.show({
                type: MODAL_TYPE.CUSTOM,
                full: true,
                content: (
                    <div className="estimate__portfolio__full">
                        <button className="_button _button__close white" onClick={() => Modal.close()} />
                        <FullSlider images={portfolio} photoType={data.photoType} viewType="portfolio" activeIndex={index} data={data} lazy />
                    </div>
                )
            });
        }
    }

    render() {
        const { data } = this.props;
        const { list, offset } = this.state;
        const isMobile = utils.agent.isMobile();

        return (
            <div className="portfolio">
                <div className={classNames("portfolio__list", { mobile: isMobile })}>
                    {list.map((o, i) => {
                        return (
                            <div key={`portfolio_${i}`} className="portfolio__item" onClick={() => this.onFullScreen(i)}>
                                <div>
                                    {data.photoType === "private" ?
                                        <Img image={{ src: `/${o.thumb_key}`, type: "private" }} />
                                        : <Img image={{ src: o.portfolio_img }} />
                                    }
                                </div>
                            </div>
                        );
                    })}
                </div>
                {offset < data.total_cnt ?
                    <div className="portfolio__more">
                        <button className="_button _button__default" onClick={this.onMore}>더보기</button>
                    </div> : null
                }
            </div>
        );
    }
}

EstimateDetailPortfolio.propTypes = {
    data: PropTypes.shape({
        list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
        total_cnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        portfolio_cnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        title: PropTypes.string,
        profile_img: PropTypes.string,
        nick_name: PropTypes.string,
        no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        viewType: PropTypes.string,
        photoType: PropTypes.string
    }),
    limit: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onFullScreen: PropTypes.func
};

export default EstimateDetailPortfolio;
