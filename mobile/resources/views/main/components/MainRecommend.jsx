import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Swiper from "swiper";

import utils from "forsnap-utils";

import constant from "shared/constant";

class MainRecommend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            data: props.data,
            select: null,
            limit: 16
        };

        this.onError = this.onError.bind(this);
        this.onClickIndex = this.onClickIndex.bind(this);

        this.gaEvent = this.gaEvent.bind(this);
        this.setSwiper = this.setSwiper.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.onClickIndex(0);
    }

    componentWillReceiveProps(np) {
        const { select } = this.state;

        if ((JSON.stringify(np.data) !== JSON.stringify(this.props.data || []))) {
            this.setState({
                data: np.data
            }, () => {
                this.onClickIndex(select);
            });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onError(product_no) {
        const { data, select } = this.state;
        const item = data[select];
        const obj = item.list.find(o => o.product_no === product_no);
        if (obj) {
            obj.thumb_img = constant.DEFAULT_IMAGES.BACKGROUND;
        }

        this.setState({
            data
        }, () => {
            this.setSwiper();
        });
    }

    onClickIndex(i) {
        this.setStateData(({ data }) => {
            const prop = {};
            let index = i;
            if (index < 0) {
                index = data.length - 1;
            } else if (index > (data && data.length - 1)) {
                index = 0;
            }

            prop.select = index;

            return prop;
        }, () => { this.setSwiper(); });
    }

    gaEvent(e, obj) {
        const { nick_name, product_no, category } = obj;
        utils.ad.gaEvent("M_개인_메인", "메인 추천상품 선택", `${category}_${nick_name}_${product_no}`);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("메인 추천상품 선택");
        }
    }

    setSwiper() {
        const { data, select } = this.state;

        if (data && Array.isArray(data) && data.length) {
            const item = data[select];

            if (item && item.list && Array.isArray(item.list) && item.list.length) {
                const option = {
                    slidesPerView: "auto",
                    spaceBetween: 10,
                    nextButton: ".rcmd__sld__ar.next",
                    prevButton: ".rcmd__sld__ar.prev"
                };

                if (item.list.length > 2) {
                    option.grabCursor = true;
                    option.loop = true;
                    option.autoplay = 5000;
                    option.autoplayDisableOnInteraction = false;
                }

                return new Swiper(".rcmd__swiper", option);
            }
        }

        return null;
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { data, select } = this.state;

        if (!data || !Array.isArray(data) || !data.length) {
            return null;
        }

        const item = data[select];

        return (
            <div className="ma__rcmd">
                <div className="rcmd__tab">
                    {data.map((o, i) => {
                        const active = i === select;
                        return (
                            <div key={o.code} className={classNames("tab__item", { active })} onTouchStart={() => this.onClickIndex(i)}>
                                {o.name}
                            </div>
                        );
                    })}
                </div>
                <div className="rcmd__ct" key={item ? item.code : "empty"}>
                    {item && item.list && Array.isArray(item.list) && item.list.length ?
                        <div className="rcmd__swiper">
                            <div className="swiper-wrapper">
                                {item.list.map(o => {
                                    let url = `${__SERVER__.thumb}/normal/crop/182x182/${o.thumb_img}`;
                                    if (!o.thumb_img || o.thumb_img === constant.DEFAULT_IMAGES.M_BACKGROUND) {
                                        url = `${__SERVER__.img}/${constant.DEFAULT_IMAGES.M_BACKGROUND}`;
                                    }
                                    return (
                                        <a
                                            key={`item_${o.product_no}`}
                                            className="swiper-slide"
                                            href={`/products/${o.product_no}`}
                                            target="_blank"
                                            onTouchStart={e => this.gaEvent(e, o)}
                                        >
                                            <div className="item__bg" style={{ background: `url(${url}) center center no-repeat` }}>
                                                {url !== constant.DEFAULT_IMAGES.BACKGROUND ?
                                                    <img className="hidden__img" alt="none" src={url} onError={() => this.onError(o.product_no)} />
                                                    : null
                                                }
                                                <div className="overlay" />
                                            </div>
                                            <div className="item__ct">
                                                <span className="tag">#{o.tag}</span>
                                            </div>
                                            <div className="item__sub">
                                                <span>by {o.nick_name}</span>
                                            </div>
                                        </a>
                                    );
                                })}
                            </div>
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}

MainRecommend.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        tag: PropTypes.arrayOf(PropTypes.string).isRequired,
        bg: PropTypes.string.isRequired
    }))
};
MainRecommend.defaultProps = {};

export default MainRecommend;
