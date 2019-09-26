import "./artistItem.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import classNames from "classnames";
import * as EstimateSession from "../../extraInfoSession";

export default class ArtistItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
        this.onClick = this.onClick.bind(this);
        this.onSelectArtist = this.onSelectArtist.bind(this);
    }

    /**
     * 작가에게 문의 클릭
     * @param e
     */
    onClick(e) {
        const { data } = this.props;

        if (typeof this.props.onConsult === "function") {
            utils.ad.gaEvent("M_기업_리스트", "추천작가에게문의", `${data.category}_${data.nick_name}_${data.product_no}`);
            this.props.onConsult(data);
        }
    }

    /**
     * 작가선택하기 클릭
     * @param no
     */
    onSelectArtist(no) {
        if (typeof this.props.onSelectArtist === "function") {
            this.props.onSelectArtist(no);
        }
    }

    /**
     * 상품상세 페이지 이동
     * @param e
     * @param data
     * @param url
     */
    movePortfolioPage(data, url) {
        const { total_price } = this.props;
        const params = EstimateSession.getSessionEstimateData(EstimateSession.EXTRA_INFO_KEY);
        utils.ad.gaEvent("M_기업_리스트", total_price ? "견적_후_추가신청_포폴" : "추천작가포트폴리오", `${data.category}_${data.nick_name}_${data.product_no}`);

        const addParams = Object.assign(params || {}, { artist_id: data.user_id, product_no: data.product_no });
        EstimateSession.setSessionEstimateData(EstimateSession.EXTRA_INFO_KEY, addParams);
        window.open(url, "_blank");
    }

    render() {
        const { data, isSelect, enough } = this.props;
        const detailUrl = `/portfolio/${data.product_no}`;
        const portfolio = data.portfolio.list;

        return (
            <div className="artist-item">
                {enough && !isSelect &&
                <div className="enough" />
                }
                <div className="artist-item__thumb" onClick={e => this.movePortfolioPage(data, detailUrl)}>
                    <img src={portfolio[0] ? `${__SERVER__.thumb}/normal/crop/320x320${portfolio[0].portfolio_img}` : ""} role="presentation" />
                </div>
                <div className="artist-item__info">
                    <div className="artist-profile-img" onClick={e => this.movePortfolioPage(data, detailUrl)}>
                        <img src={`${__SERVER__.thumb}/normal/crop/110x110${data.profile_img}`} role="presentation" />
                    </div>
                    <div className="artist__info-box">
                        <p className="artist-nick_name">{data.nick_name}</p>
                        <p className="artist-title">작가님</p>
                        <div className="artist__info__select">
                            <div className={classNames("wrap-box", { "select": isSelect })} onClick={() => this.onSelectArtist(data.no)}>
                                <div className="select-box">
                                    <div className="check-mark" />
                                </div>
                                <p>작가 선택하기</p>
                            </div>
                        </div>
                        {/*<div className="artist-consult" onClick={this.onClick}>{"작가에게 문의하기 >"}</div>*/}
                    </div>
                </div>
            </div>
        );
    }
}
//
// ArtistItem.propTypes = {
//     select: PropTypes.bool
// };
//
// ArtistItem.defaultProps = {
//     select: false
// };
