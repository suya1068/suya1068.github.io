import "./scss/index.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Portfolio from "./Portfolio";
import PortfolioSlider from "./components/slider/PortfolioSlider";
import utils from "forsnap-utils";

export default class PortfolioContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMount: true,
            list: [],
            images: props.images,
            videos: props.videos,
            information: props.information,
            active_index: props.active_index,
            axis_type: props.axis_type,
            ext_page: props.ext_page,
            category: props.category,
            type: props.type,
            full: false,
            index: 0,
            // is_direct: document.referrer.indexOf("forsnap.com") === -1,
            chargeArtistNo: props.chargeArtistNo || null,
            gaEvent: props.gaEvent || null,
            gaAction: props.gaAction || ""
        };
        this.onClose = this.onClose.bind(this);
        this.onShow = this.onShow.bind(this);
        this.onHide = this.onHide.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
        const { images, videos } = this.props;
        let { list } = this.state;
        if (utils.isArray(videos)) {
            list = [].concat(videos, images || []);
        } else if (utils.isArray(images)) {
            list = [].concat(images);
        }
        this.setState({ list });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    /**
     * ga이벤트 전파
     * @param action
     */
    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    /**
     * 포트폴리오 전체 뷰 노출
     * @param index
     */
    onShow(index) {
        const { gaEvent, chargeArtistNo, category, information } = this.props;
        if (gaEvent) {
            this.gaEvent("유료_포트폴리오크게보기");
        }
        if (utils.checkCategoryForEnter(category) && !chargeArtistNo) {
            utils.ad.gaEvent("기업_상세", "무료_포트폴리오", `${category}_${information.artist_name}_${information.product_no}`);
        } else if (!utils.checkCategoryForEnter(category)) {
            utils.ad.gaEvent("개인_상세", "포트폴리오크게보기", `${category || information.category}_${information.artist_name}_${information.product_no}`);
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

    render() {
        const { images, videos, information, axis_type, ext_page, category, type, chargeArtistNo, gaEvent } = this.props;
        const { list, active_index, full, index } = this.state;

        const isBiz = utils.checkCategoryForEnter(category);
        return (
            <div className={classNames("portfolio-container_pc", { "ext_page": ext_page })}>
                <Portfolio
                    chargeArtistNo={chargeArtistNo}
                    list={list}
                    images={images}
                    videos={videos}
                    information={information}
                    active_index={active_index}
                    axis_type={axis_type}
                    category={category}
                    // is_direct={is_direct}
                    ext_page={ext_page}
                    // type={type}
                    onClose={this.onClose}
                    onShowSlider={this.onShow}
                    gaEvent={this.gaEvent}
                />
                <PortfolioSlider
                    ext_page={ext_page}
                    list={list}
                    show={full}
                    index={index}
                    isBiz={isBiz}
                    // chargeArtistNo={chargeArtistNo}
                    // is_direct={is_direct}
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
    ext_page: PropTypes.bool,
    category: PropTypes.string
};

PortfolioContainer.defaultProps = {
    active_index: 1,
    axis_type: "x",
    ext_page: false,
    category: ""
};
