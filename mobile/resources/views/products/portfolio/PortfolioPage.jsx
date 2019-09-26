import "./PortfolioPage.scss";
import React, { Component } from "react";
import ReactDOM from "react-dom";

import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import App from "desktop/resources/components/App";

// import PortfolioContainer from "./PortfolioContainer";
import PortfolioMobile from "mobile/resources/components/portfolio/PortfolioContainer";

import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";

class PortfolioPageContainer extends Component {
    constructor() {
        super();

        const data = document.getElementById("product-data");
        // const search = location.search;
        // const parseSearch = search ? utils.query.parse(search) : null;

        this.state = {
            isMount: true,
            data: data ? JSON.parse(data.getAttribute("content")) : null,
            images: [],
            videos: [],
            total: 0,
            index: 0
            // type: parseSearch ? parseSearch.type : null
            // recommend: search && utils.query.parse(search) ? utils.query.parse(search).recommend : 0
        };

        this.onIndex = this.onIndex.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.gaEvent = this.gaEvent.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
        const { data } = this.state;

        if (data && typeof data === "object") {
            const { portfolio, portfolio_video } = data;
            let images = [];
            let re_data = {};
            let axis_type = "";
            const videos = [];
            let total = 0;

            if (portfolio && utils.isArray(portfolio.list)) {
                // portfolio.list.reduce((r, o) => {
                //     r.push({
                //         type: "image",
                //         no: Number(o.portfolio_no),
                //         display_order: Number(o.display_order),
                //         url: o.portfolio_img,
                //         thumb: false
                //     });
                //     return r;
                // }, images);
                // total += images.length;
                if (["VIDEO", "VIDEO_BIZ"].indexOf(data.category) === -1) {
                    re_data = this.composeList(data.portfolio.list);
                    images = re_data.images;
                    axis_type = re_data.axis_type;
                    total += images.length;
                } else {
                    portfolio.list.reduce((r, o) => {
                        r.push({
                            type: "image",
                            no: Number(o.portfolio_no),
                            display_order: Number(o.display_order),
                            url: o.portfolio_img,
                            thumb: false
                        });
                        return r;
                    }, images);
                    total += images.length;
                }
            }

            if (portfolio_video && utils.isArray(portfolio_video.list)) {
                portfolio_video.list.reduce((r, o) => {
                    r.push({
                        type: "video",
                        no: Number(o.portfolio_no),
                        display_order: Number(o.display_order),
                        url: o.portfolio_video,
                        thumb: false
                    });
                    return r;
                }, videos);
                total += videos.length;

                switch (data.category) {
                    case "VIDEO":
                    case "VIDEO_BIZ":
                        total += 1;
                        videos.unshift({
                            type: "video",
                            no: null,
                            display_order: 1,
                            url: data.main_img,
                            thumb: false
                        });
                        break;
                    default:
                        break;
                }
            }

            const information = {
                profile_img: data.profile_img,
                artist_name: data.nick_name,
                title: data.title,
                total,
                artist_id: data.user_id,
                product_no: data.product_no
            };

            this.setStateData(() => {
                return {
                    images,
                    axis_type,
                    videos,
                    information
                };
            });
        } else {
            const has_product_check = typeof data === "string" && (data === "\"내용이 없습니다\"" || data === "\"해당 상품은 비노출 상태입니다.\"");
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: has_product_check ? "마감된 상품입니다." : data,
                onSubmit: () => (location.href = "/")
            });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onIndex(index) {
        this.setStateData(() => {
            return {
                index
            };
        });
    }

    composeList(list) {
        const images = [];
        let axis_type = "x";

        if (list && utils.isArray(list)) {
            let vertical_type_count = 0;
            list.reduce((r, o, i) => {
                const width = Number(o.width);
                const height = Number(o.height);

                const vertical_ratio = width < height; // ? 세로형 : 가로형

                if (vertical_ratio) {
                    vertical_type_count += 1;
                }
                r.push({
                    type: "image",
                    no: Number(o.portfolio_no),
                    display_order: Number(o.display_order),
                    url: o.portfolio_img,
                    src: o.portfolio_img,
                    width: 206,
                    height: 206,
                    thumb: false,
                    vertical_type: vertical_ratio
                });
                return r;
            }, images);

            if (Math.round((list.length / 2)) < vertical_type_count) {
                axis_type = "y";
            }
        }

        return { images, axis_type };
    }

    onLoad(no, src) {
        if (this.refThumb) {
            this.refThumb.onLoad(no, src);
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    gaEvent(action, label) {
        utils.ad.gaEvent("M_기업_상세", action, label);
    }

    render() {
        const { category } = this.state.data;
        const { data, images, videos, information, axis_type } = this.state;

        if (!data || typeof data === "string") {
            return null;
        }

        const artist = {
            nick_name: data.nick_name,
            product_no: data.product_no,
            charge: !!data.charge_artist_no
        };

        return (
            <div>
                <HeaderContainer category={category} artist={artist} gaEvent={this.gaEvent} />
                <div className="site-main">
                    <LeftSidebarContainer />
                    <div className="products__portfolio__page">
                        <PortfolioMobile
                            ext_page
                            videos={videos}
                            chargeArtistNo={data.charge_artist_no}
                            images={images}
                            category={category}
                            axis_type={axis_type}
                            information={information}
                            active_index={1}
                            onClose={() => window.close()}
                        />
                    </div>
                    <OverlayContainer />
                </div>
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <PortfolioPageContainer />
    </App>, document.getElementById("root")
);

