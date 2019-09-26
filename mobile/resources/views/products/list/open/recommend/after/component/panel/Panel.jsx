import "./panel.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import Img from "shared/components/image/Img";
import * as EstimateSession from "../../../../extraInfoSession";
import utils from "forsnap-utils";

export default class Panel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dummy: props.dummy,
            data: props.data,
            index: props.index,
            noSelect: props.noSelect
        };
        this.renderPanel = this.renderPanel.bind(this);
        this.onSelectArtist = this.onSelectArtist.bind(this);
        this.onMoveDetailPage = this.onMoveDetailPage.bind(this);
    }

    componentWillMount() {
    }

    onMoveDetailPage(data) {
        const detailUrl = `/portfolio/${data.product_no}`;
        const params = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        utils.ad.gaEvent("M_기업_리스트", "견적_추천작가포폴", `${data.category}_${data.nick_name}_${data.product_no}`);
        const addParams = Object.assign(params || {}, { artist_id: data.user_id, product_no: data.product_no });

        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, addParams);
        window.open(detailUrl, "_blank");
    }

    renderPanel(flag) {
        let content;
        if (flag) {
            content = (
                <div className="artist__panel dummy">
                    <div className="artist__panel__head">
                        <p className="nick_name">오디니크</p>
                        <div className="select__btn">
                            <div className={classNames("wrap-box", "select")}>
                                <p>다른작가로 변경</p>
                            </div>
                        </div>
                    </div>
                    <div className="artist__panel__portfolio">
                        <div className="portfolio__thumb">
                            <Img image={{ src: "/estimate/virtual/image_01_2x.png", type: "image" }} />
                        </div>
                        <div className="portfolio__thumb">
                            <Img image={{ src: "/estimate/virtual/image_02_2x.png", type: "image" }} />
                        </div>
                        <div className="portfolio__thumb">
                            <Img image={{ src: "/estimate/virtual/image_03_2x.png", type: "image" }} />
                        </div>
                        <div className="portfolio__thumb">
                            <Img image={{ src: "/estimate/virtual/image_04_2x.png", type: "image" }} />
                        </div>
                    </div>
                </div>
            );
        } else {
            const { data, index } = this.props;
            const portfolio = data.portfolio;
            const list = portfolio.list;
            content = (
                <div className="artist__panel">
                    <div className="artist__panel__head">
                        <p className="nick_name">{data.nick_name}</p>
                        <div className="select__btn">
                            <div className={classNames("wrap-box", "select")} onClick={() => this.onSelectArtist(data.no, index)}>
                                <p>다른작가로 변경</p>
                            </div>
                        </div>
                    </div>
                    <div className="artist__panel__portfolio">
                        <div
                            className="portfolio__thumb"
                            onClick={e => this.onMoveDetailPage(data)}
                        >
                            <Img image={{ src: list[0] && list[0].portfolio_img, content_width: 320, content_height: 320 }} />
                        </div>
                        <div
                            className="portfolio__thumb"
                            onClick={e => this.onMoveDetailPage(data)}
                        >
                            <Img image={{ src: list[1] && list[1].portfolio_img, content_width: 320, content_height: 320 }} />
                        </div>
                        <div
                            className="portfolio__thumb"
                            onClick={e => this.onMoveDetailPage(data)}
                        >
                            <Img image={{ src: list[2] && list[2].portfolio_img, content_width: 320, content_height: 320 }} />
                        </div>
                        <div
                            className="portfolio__thumb"
                            onClick={e => this.onMoveDetailPage(data)}
                        >
                            <Img image={{ src: list[3] && list[3].portfolio_img, content_width: 320, content_height: 320 }} />
                        </div>
                    </div>
                </div>
            );
        }
        return content;
    }

    /**
     * 작가선택 버튼 클릭
     * @param no
     * @param index
     */
    onSelectArtist(no, index) {
        const { noSelect, onSetProducts } = this.props;
        if (!noSelect && typeof onSetProducts === "function") {
            onSetProducts(no, index);
        }
    }

    render() {
        const { dummy } = this.props;
        return (
            <div className={classNames("recommend-artist__panel", { "dummy": dummy })}>
                {this.renderPanel(dummy)}
            </div>
        );
    }
}

Panel.defaultProps = {
    dummy: false,
    noSelect: false
};
