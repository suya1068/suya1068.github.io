import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import PortfolioContainer from "desktop/resources/views/products/portfolio/PortfolioContainer";
import PortfolioList from "./PortfolioList";
import PortfolioView from "../PortfolioView";

export default class PortfolioListContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uploadInfo: undefined,
            user: auth.getUser(),
            list: [],
            total: 0,
            preview: {},
            isLoading: false
        };
        this.onDelete = this.onDelete.bind(this);
        this.viewDataSet = this.viewDataSet.bind(this);
        this.removePortfolioAPI = this.removePortfolioAPI.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const { user } = this.state;
        if (user) {
            this.getEstimatePortfolioList(user.id);
        }
    }

    onView(data) {
        const modalName = "portfolio_view";
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modalName,
            full: true,
            content: (
                <PortfolioView name={modalName}>
                    <PortfolioContainer images={data.images} videos={data.videos} information={data.information} />
                </PortfolioView>
            )
        });
    }

    onDelete(no) {
        const { user } = this.state;
        API.offers.deleteEstimatePortfolio(user.id, no).then(response => {
            const data = response.data;
            this.setState({
                list: data.list,
                total: data.total_cnt
            }, () => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "삭제되었습니다"
                });
            });
        }).catch(error => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error.data)
            });
        });
    }

    getEstimatePortfolioList(id) {
        this.getListAPI(id).then(response => {
            const data = response.data;
            if (!this._calledComponentWillUnmount) {
                this.setState({
                    list: data.list,
                    total: data.total_cnt,
                    artist_profile_img: data.session_info.artist_profile_img,
                    isLoading: true,
                    block_dt: data.session_info.block_dt
                });
            }
        }).catch(error => {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(error.data)
            });
        });
    }

    getListAPI(id) {
        return API.offers.getEstimatePortfolioList(id);
    }

    viewDataSet(pNo) {
        const { preview } = this.state;
        if (preview[pNo]) {
            this.onView(preview[pNo]);
        } else {
            const user = auth.getUser();
            const request = API.offers.getEstimatePortfolioDetail(user.id, pNo);
            request.then(response => {
                const data = response.data;
                const images = [];
                const videos = [];
                let total = 0;

                if (utils.isArray(data.list)) {
                    data.list.reduce((r, o) => {
                        r.push({
                            type: "image",
                            no: Number(o.photo_no),
                            display_order: Number(o.display_order),
                            url: `/${o.thumb_key}`,
                            signed: true
                        });
                        return r;
                    }, images);
                    total += images.length;
                }

                if (data.portfolio_video && utils.isArray(data.portfolio_video.list)) {
                    data.portfolio_video.list.reduce((r, o) => {
                        r.push({
                            type: "video",
                            no: Number(o.portfolio_no),
                            display_order: Number(o.display_order),
                            url: o.portfolio_video
                        });
                        return r;
                    }, videos);
                    total += videos.length;
                }

                const information = {
                    profile_img: data.session_info.artist_profile_img,
                    artist_name: data.session_info.nick_name,
                    title: data.title,
                    total
                };

                preview[pNo] = {
                    images,
                    videos,
                    information
                };

                this.setState({
                    preview
                }, () => {
                    this.onView(preview[pNo]);
                });
            }).catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(error.data)
                });
            });
        }
    }

    removePortfolioAPI(no) {
        Modal.show({
            type: MODAL_TYPE.CONFIRM,
            content: utils.linebreak("포트폴리오를 삭제하시겠습니까?\n삭제하신 포트폴리오는 복구할 수 없습니다."),
            onSubmit: () => { this.onDelete(no); }
        });
    }

    render() {
        const { isLoading, list, total, artist_profile_img, block_dt } = this.state;
        if (!isLoading) {
            return null;
        }
        return (
            <div className="portfolio-list-container">
                <PortfolioList
                    data={{ list, total, artist_profile_img, block_dt }}
                    onDelete={this.removePortfolioAPI}
                    onView={this.viewDataSet}
                />
            </div>
        );
    }
}
