import "./scss/index.scss";
import React, { Component, PropTypes } from "react";
import Portfolio from "./Portfolio";
import PortfolioSlider from "./components/slider/PortfolioSlider";
import utils from "forsnap-utils";
import Modal, { MODAL_TYPE } from "../../../../shared/components/modal/Modal";
import * as virtualEstimateHelper
    from "../../../../desktop/resources/views/products/components/open/components/virtual_estimate/virtualEstimateHelper";
import PopRecommendArtist from "../../views/products/list/open/pop/PopRecommendArtist";
import cookie from "forsnap-cookie";
import ChargeCount from "shared/helper/charge/ChargeCount";
import * as EstimateSession from "desktop/resources/views/products/components/open/components/extraInfoSession";
import classNames from "classnames";

export default class PortfolioContainer extends Component {
    constructor(props) {
        super(props);
        this.chargeCount = new ChargeCount();

        this.state = {
            isMount: true,
            images: props.images,
            videos: props.videos,
            information: props.information,
            active_index: props.active_index,
            axis_type: props.axis_type,
            category: props.category,
            ext_page: props.ext_page || false,
            // type: props.type,
            full: false,
            index: 0,
            list: [],
            chargeArtistNo: props.chargeArtistNo || null,
            renewDetail: props.renewDetail || false
            // is_direct: document.referrer.indexOf("forsnap.com") === -1
        };
        this.onClose = this.onClose.bind(this);

        this.onShow = this.onShow.bind(this);
        this.onHide = this.onHide.bind(this);

        this.setStateData = this.setStateData.bind(this);
        this.onShowChargeArtist = this.onShowChargeArtist.bind(this);
        this.onChargeArtistConsult = this.onChargeArtistConsult.bind(this);
        this.fetchChargeArtist = this.fetchChargeArtist.bind(this);

        this.setCRC = this.setCRC.bind(this);
        this.renderLastPhase = this.renderLastPhase.bind(this);
    }

    componentWillMount() {
        const { images, videos } = this.props;
        let { list } = this.state;
        if (utils.isArray(videos)) {
            list = [].concat(videos, images || []);
        } else if (utils.isArray(images)) {
            list = [].concat(images);
        }
        this.setState({ list }, () => {
            this.chargeCount.init();

            const chargeMaxCount = this.chargeCount.getMaxCount();
            const crc = this.chargeCount.getCRC();
            this.setState({
                crc,
                chargeMaxCount
            });
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    /**
     * 포트폴리오 전체 뷰 노출
     * @param index
     */
    onShow(index) {
        const { chargeArtistNo, information, category } = this.props;
        if (chargeArtistNo) {
            utils.ad.gaEvent("M_기업_상세", "유료_포트폴리오크게보기", `${category}_${information.artist_name}_${information.product_no}`);
        } else if (!utils.checkCategoryForEnter(category)) {
            utils.ad.gaEvent("M_개인_상세", "포트폴리오크게보기", `${category || information.category}_${information.artist_name}_${information.product_no}`);
        }
        this.setStateData(() => {
            return {
                full: true,
                index
            };
        });
    }

    /**
     * 포트폴리오 전체 뷰 숨기기
     */
    onHide() {
        this.setStateData(() => {
            return {
                full: false
            };
        });
    }

    /**
     * 스테이트 저장 메서드
     * @param update
     * @param callback
     */
    setStateData(update, callback) {
        this.setState(state => {
            return update(state);
        }, callback);
    }

    /**
     * 포트폴리오 모달 닫기
     */
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
                        opacity: "0.7",
                        content: (
                            <PopRecommendArtist
                                {...prop}
                                count={crc}
                                onClose={() => Modal.close()}
                            />
                        )
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
        const { crc, chargeMaxCount } = this.state;

        const agent = cookie.getCookies("FORSNAP_UUID");
        const prop = {
            ...consult,
            category,
            device_type: "mobile"
        };

        if (agent) {
            prop.agent = agent;
        }

        if (select_list.length > 0) {
            Modal.close();
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });

            const promise = select_list.map(no => {
                const artist = list.find(o => o.no === no);
                if (artist) {
                    return virtualEstimateHelper.apiInsertArtistOrder(Object.assign(prop, { artist_id: artist.user_id, product_no: artist.product_no }))
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
    }

    renderLastPhase() {
        const { crc, chargeMaxCount } = this.state;
        const userName = EstimateSession.getSessionEstimateData(EstimateSession.USER_NAME);

        Modal.close(MODAL_TYPE.PROGRESS);
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <div className="pop-recommend-artist__last_phase" style={{ textAlign: "center" }}>
                    <div style={{ color: "#fff" }}>
                        <p style={{ fontSize: 21, fontWeight: "bold", marginBottom: 10 }}>작가님께 전달이 완료되었습니다.</p>
                        <p style={{ fontSize: 16, marginBottom: 26 }}>
                            빠르게 연락드리겠습니다.<br />감사합니다.
                        </p>
                    </div>
                    <button
                        style={{
                            width: 150,
                            height: 42,
                            cursor: "pointer",
                            color: "#fff",
                            backgroundColor: "#f5a623",
                            fontSize: 16,
                            fontWeight: "bold",
                            textAlign: "center"
                        }}
                        onClick={() => Modal.close()}
                    >확인</button>
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
        const { images, renewDetail, videos, information, axis_type, category, ext_page, chargeArtistNo } = this.props;
        const { active_index, list, full, index, crc, chargeMaxCount } = this.state;
        return (
            <div className={classNames("portfolio-container_mo", { "ext_page": ext_page })}>
                <Portfolio
                    chargeArtistNo={chargeArtistNo}
                    renewDetail={renewDetail}
                    list={list}
                    images={images}
                    videos={videos}
                    information={information}
                    active_index={active_index}
                    axis_type={axis_type}
                    category={category}
                    ext_page={ext_page}
                    chargeMaxCount={chargeMaxCount}
                    crc={crc}
                    setCRC={this.setCRC}
                    onClose={this.onClose}
                    onShowSlider={this.onShow}
                    onShowChargeArtist={this.onShowChargeArtist}
                />
                <PortfolioSlider
                    list={list}
                    show={full}
                    index={index}
                    onClose={this.onHide}
                />
            </div>
        );
    }
}

PortfolioContainer.propTypes = {
    images: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    information: PropTypes.shape({
        profile_img: PropTypes.string,
        nick_name: PropTypes.string,
        title: PropTypes.string,
        total: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    active_index: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    axis_type: PropTypes.string,
    category: PropTypes.string
};

PortfolioContainer.defaultProps = {
    active_index: 1,
    axis_type: "x",
    ext_page: false,
    category: ""
};
