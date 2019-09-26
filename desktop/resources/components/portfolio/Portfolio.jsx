import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import AnotherRecommendArtist from "desktop/resources/views/products/components/open/components/pop/another/AnotherRecommendArtist";

import Information from "./components/information/Information";
import PortfolioList from "./components/list/PortfolioList";
import * as virtualEstimateHelper
    from "../../views/products/components/open/components/virtual_estimate/virtualEstimateHelper";
import ChargeCount from "shared/helper/charge/ChargeCount";
import * as EstimateSession from "desktop/resources/views/products/components/open/components/extraInfoSession";

export default class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.chargeCount = new ChargeCount();

        this.state = {
            images: props.images,
            videos: props.videos,
            list: props.list,
            information: props.information,
            active_index: props.active_index,
            axis_type: props.axis_type,
            ext_page: props.ext_page,
            category: props.category,
            //is_direct: props.is_direct,
            //recommend: props.recommend,
            type: props.type,
            chargeArtistNo: props.chargeArtistNo,
            gaEvent: props.gaEvent
        };

        this.onClose = this.onClose.bind(this);
        this.onShowSlider = this.onShowSlider.bind(this);
        this.onShowChargeArtist = this.onShowChargeArtist.bind(this);
        this.onChargeArtistConsult = this.onChargeArtistConsult.bind(this);

        this.fetchChargeArtist = this.fetchChargeArtist.bind(this);
        this.setCRC = this.setCRC.bind(this);
        this.renderLastPhase = this.renderLastPhase.bind(this);
    }

    componentWillMount() {
        this.chargeCount.init();

        const chargeMaxCount = this.chargeCount.getMaxCount();
        const crc = this.chargeCount.getCRC();
        this.setState({
            crc,
            chargeMaxCount
        });
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    onShowSlider(idx) {
        if (typeof this.props.onShowSlider === "function") {
            this.props.onShowSlider(idx);
        }
    }

    onClose() {
        if (typeof this.props.onClose === "function") {
            this.props.onClose();
        }
    }

    onShowChargeArtist(title, desc, consult) {
        const { crc, chargeMaxCount } = this.state;
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        if (chargeMaxCount - crc > 0) {
            this.fetchChargeArtist({ category: this.props.category })
                .then(response => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    const data = response.data;
                    const prop = {
                        list: data.list || [],
                        title,
                        desc,
                        selectArtistSendConsult: select_list => this.onChargeArtistConsult(consult, data.list, select_list)
                    };

                    Modal.show({
                        type: MODAL_TYPE.CUSTOM,
                        name: "another_artist",
                        overflow: false,
                        //full: true,
                        content: <AnotherRecommendArtist {...prop} count={crc} />
                    });
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                });
        } else {
            this.renderLastPhase();
        }
    }

    onChargeArtistConsult(consult, list, select_list) {
        const { category } = this.props;
        const agent = cookie.getCookies("FORSNAP_UUID");

        const prop = {
            ...consult,
            category,
            device_type: "pc"
        };

        if (agent) {
            prop.agent = agent;
        }

        Modal.close();
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });

        const promise = select_list.map(no => {
            const artist = list.find(o => o.no === no);
            if (artist) {
                return api.orders.insertArtistOrder(Object.assign(prop, { artist_id: artist.user_id, product_no: artist.product_no }))
                    .then(() => {
                        this.chargeCount.setCRC();
                        this.setState({
                            crc: this.chargeCount.getCRC()
                        });
                        this.sendToConversion();
                    });
            }
            return null;
        });

        Promise.all(promise)
            .then(() => {
                this.renderLastPhase();
            });
    }

    renderLastPhase() {
        Modal.close(MODAL_TYPE.PROGRESS);
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <div>
                    <div className="container">
                        <div style={{ color: "#fff", textAlign: "center" }}>
                            <p style={{ fontSize: 28, marginBottom: 10 }}>작가님께 전달이 완료되었습니다.</p>
                            <p style={{ fontSize: 18, marginBottom: 30 }}>
                                빠르게 연락드리겠습니다. 감사합니다.
                            </p>
                            <button
                                style={{
                                    width: 200,
                                    height: 60,
                                    cursor: "pointer",
                                    color: "#fff",
                                    backgroundColor: "#f5a623",
                                    fontSize: 18,
                                    fontWeight: "bold",
                                    textAlign: "center"
                                }}
                                onClick={() => Modal.close()}
                            >확인</button>
                        </div>
                    </div>
                </div>
            )
        });

        setTimeout(() => {
            Modal.close();
        }, 5000);
    }

    fetchChargeArtist(params) {
        const { information } = this.props;
        if (!params.ignore_artist_id) {
            params.ignore_artist_id = information.artist_id;
        }

        if (!params.limit) {
            params.limit = 10;
            params.offset = 0;
        }
        return virtualEstimateHelper.apiGetChargeArtistProduct(params);
    }

    sendToConversion() {
        utils.ad.wcsEvent("4");
        utils.ad.gtag_report_conversion(location.href);
        utils.ad.gaEvent("기업고객", "상담전환");
        utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    setCRC() {
        this.chargeCount.setCRC();
        this.setState({
            crc: this.chargeCount.getCRC()
        });
    }

    render() {
        const { information, list, images, videos, active_index, axis_type, ext_page, category, type, chargeArtistNo, gaEvent } = this.props;
        const { crc, chargeMaxCount } = this.state;
        return (
            <div className="portfolio-pc">
                <div className="forsap-portfolio">
                    <Information
                        chargeArtistNo={chargeArtistNo}
                        information={information}
                        ext_page={ext_page}
                        active_index={active_index || 1}
                        category={category}
                        type={type}
                        onClose={this.onClose}
                        onShowChargeArtist={this.onShowChargeArtist}
                        chargeMaxCount={chargeMaxCount}
                        crc={crc}
                        setCRC={this.setCRC}
                        getCRC={this.chargeCount.getCRC}
                        gaEvent={gaEvent}
                    />
                    <PortfolioList
                        list={list}
                        images={images}
                        videos={videos}
                        active_index={active_index || 1}
                        axis_type={axis_type}
                        ext_page={ext_page}
                        xhr={false}
                        onShowSlider={this.onShowSlider}
                    />
                </div>
            </div>
        );
    }
}

Portfolio.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    information: PropTypes.shape({
        profile_img: PropTypes.string,
        nick_name: PropTypes.string,
        title: PropTypes.string,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    active_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    axis_type: PropTypes.string.isRequired,
    category: PropTypes.string
};

PortfolioList.defaultProps = {
    category: ""
};
