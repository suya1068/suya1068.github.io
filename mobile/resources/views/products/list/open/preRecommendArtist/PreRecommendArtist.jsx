import "./preRecommendArtist.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import ArtistPanel from "./panel/ArtistPanel";
import ArtistVideoPanel from "./panel/ArtistVideoPanel";
import utils from "forsnap-utils";
import classNames from "classnames";
import Swiper from "swiper";
import Icon from "desktop/resources/components/icon/Icon";
import PopModal from "../../../../../../../shared/components/modal/PopModal";

export default class PreRecommendArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            list: [],
            artistLimit: 30,
            portfolioThumbLimit: 8,
            is_loaded: false,
            activeIndex: 0
        };
        this.setPortfolioList = this.setPortfolioList.bind(this);
        this.setActiveIndex = this.setActiveIndex.bind(this);
        this.onPopArtistReview = this.onPopArtistReview.bind(this);
        this.onConsult = this.onConsult.bind(this);
    }

    componentWillMount() {
        const { category, getReceiveList } = this.props;
        const { artistLimit } = this.state;

        if (category) {
            getReceiveList({ category, limit: artistLimit, offset: 0 })
                .then(response => {
                    const data = response.data;
                    this.setState({
                        list: this.setRecommendArtistList(data.list),
                        is_loaded: true
                    }, () => {
                        this.recommendArtist = new Swiper(".pre-recommend-artist__content-head .swiper-container", {
                            slidesPerView: "auto",
                            spaceBetween: 10,
                            nextButton: ".swiper_arrow.right",
                            prevButton: ".swiper_arrow.left",
                            onSliderMove: swiper => {
                                const index = swiper.activeIndex;
                                swiper.updateActiveIndex();
                                if (index !== swiper.activeIndex) {
                                    this.setState({ activeIndex: swiper.activeIndex });
                                }
                            },
                            onSlideChangeStart: swiper => {
                                utils.ad.gaEvent("M_기업_리스트", "추천_꺽쇠", category);
                                this.setState({ activeIndex: swiper.activeIndex });
                            }
                        });

                        if (typeof this.props.checkState === "function") {
                            this.props.checkState(true);
                        }
                    });
                })
                .catch(error => {
                    PopModal.alert(error.data);
                });
        }
    }

    componentWillReceiveProps(np) {
        // if (this.props.list.length !== np.list.length) {
        //     this.setState({
        //         list: np.list
        //     }, () => {
        //         this.setRecommendArtistList(np.list);
        //     });
        // }
    }

    /**
     * 추천작가 리스트를 세팅합니다.
     * @param list
     */
    setRecommendArtistList(list) {
        const renderList = [];
        for (let i = 0; i < list.length; i += 1) {
            const portfolio = this.setPortfolioList(list[i].portfolio);
            renderList.push({ ...list[i], portfolio });
        }
        return renderList;
    }

    /**
     * 작가 포트폴리오를 세팅합니다.
     * @param portfolio
     * @returns {Array}
     */
    setPortfolioList(portfolio) {
        const { portfolioThumbLimit } = this.state;
        const portfolioList = [];
        const maxThumbLimit = Number(portfolio.total_cnt) < portfolioThumbLimit ? Number(portfolio.total_cnt) : portfolioThumbLimit;
        let i = 0;
        while (i < maxThumbLimit) {
            portfolioList.push(portfolio.list[i]);
            i += 1;
        }

        return portfolioList;
    }

    setActiveIndex(index) {
        const { activeIndex } = this.state;
        this.setState({
            activeIndex: index
        }, () => {
            if (activeIndex !== index) {
                this.recommendArtist.slideTo(index);
            }
        });
    }

    onSelectArtist(index) {
        this.setState({ activeIndex: index });
    }

    onPopArtistReview(list, nick, no) {
        if (typeof this.props.onPopArtistReview === "function") {
            this.props.onPopArtistReview(list, nick, no);
        }
    }

    onConsult(item) {
        if (typeof this.props.onConsult === "function") {
            this.props.onConsult(item);
        }
    }

    renderPanelSwitch(category) {
        const { list, activeIndex } = this.state;
        const isVideoCategory = category === "VIDEO_BIZ";
        let content = (
            <ArtistPanel
                list={list}
                activeIndex={activeIndex}
                // onConsult={this.onConsult}
                setActiveIndex={this.setActiveIndex}
                onPopArtistReview={this.onPopArtistReview}
            />
        );
        if (isVideoCategory) {
            content = (
                <ArtistVideoPanel
                    list={list}
                    activeIndex={activeIndex}
                    // onConsult={this.onConsult}
                    setActiveIndex={this.setActiveIndex}
                    onPopArtistReview={this.onPopArtistReview}
                />
            );
        }

        return content;
    }

    render() {
        const { category } = this.props;
        const { list, is_loaded, activeIndex } = this.state;

        return (
            <section className="products__list__page__pre-recommend-artist pre-recommend-artist" id="pre_recommend_artist">
                <div className="pre-recommend-artist__head">
                    <img className="logo__transparent" alt="forsnap" src={`${__SERVER__.img}/common/logo_transparent2.png`} width="100" />
                    <h2 className="section-title title">추천 작가의 포트폴리오를 확인해보세요.</h2>
                </div>
                {is_loaded &&
                <div className="pre-recommend-artist__content">
                    <div className="pre-recommend-artist__content-head">
                        <div className="swiper-container">
                            <div className="swiper-wrapper">
                                {list.map((o, idx) => {
                                    return (
                                        <div key={`recommend_item_${idx}`} className="swiper-slide recommend__artist__item" onClick={() => this.onSelectArtist(idx)}>
                                            <div className="profile_img">
                                                <Img image={{ src: o.thumb_img, content_width: 320, content_height: 320 }} />
                                            </div>
                                            <div className="nick_name">
                                                {o.nick_name}
                                            </div>
                                            <div className={classNames("arrow", { "show": activeIndex === idx })} />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    {this.renderPanelSwitch(category)}
                </div>
                }
            </section>
        );
    }
}
