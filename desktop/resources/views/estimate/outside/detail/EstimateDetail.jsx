import "./EstimateDetail.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Img from "desktop/resources/components/image/Img";

import EstimateDetailPortfolio from "./components/EstimateDetailPortfolio";
import EstimateDetailVideo from "./components/EstimateDetailVideo";

class EstimateDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {};

        this.renderPortfolioVideo = this.renderPortfolioVideo.bind(this);
        this.renderPortfolio = this.renderPortfolio.bind(this);
    }

    renderPortfolioVideo(video) {
        if (video && utils.isArray(video.list)) {
            return (
                <div className="estimate__row">
                    <div className="title"><span>포트폴리오 비디오</span></div>
                    <EstimateDetailVideo data={video} />
                </div>
            );
        }

        return null;
    }

    renderPortfolio(portfolio) {
        if (portfolio && utils.isArray(portfolio.list)) {
            return (
                <div className="estimate__row">
                    <div className="title"><span>포트폴리오 이미지</span></div>
                    <EstimateDetailPortfolio data={portfolio} onFullScreen={this.props.onFullScreen} />
                </div>
            );
        }

        return null;
    }

    render() {
        const { data } = this.props;
        let totalPrice = 0;

        return (
            <div className="estimate__outside__detail">
                <div className="estimate__row">
                    <div className="title"><span>견적정보</span></div>
                    <table className="fixed">
                        <colgroup>
                            <col width="30%" />
                            <col width="25%" />
                            <col width="20%" />
                            <col width="25%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>항목</th>
                                <th>단가</th>
                                <th>단위</th>
                                <th>금액</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data && data.option && data.option.map((o, i) => {
                                totalPrice += Number(o.total_price) || 0;
                                const cnt = o.count || 1;
                                const tp = o.total_price || (o.option_price * cnt);
                                return (
                                    <tr key={`option_${i}`}>
                                        <td>{o.option_name}</td>
                                        <td>{utils.format.price(o.option_price)}원</td>
                                        <td>{utils.format.price(cnt)}</td>
                                        <td>{utils.format.price(tp)}원</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>총합</td>
                                <td className="total__price" colSpan="3">{utils.format.price(totalPrice)}원</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div className="estimate__row">
                    <div className="title"><span>상세정보</span></div>
                    <div className="description">
                        {data && data.content ? utils.linebreak(data.content) : ""}
                    </div>
                </div>
                {this.renderPortfolioVideo(data.portfolio ? data.portfolio.portfolio_video : null)}
                {this.renderPortfolio(data.portfolio || null)}
                {data && utils.isArray(data.attach_image) ?
                    <div className="estimate__row">
                        <div className="title"><span>첨부이미지</span></div>
                        <div className="attach__image">
                            <div className="attach__image__list">
                                {data.attach_image.map((o, i) => {
                                    return <div key={`attach_image_${i}`}><Img image={{ src: o.photo }} /></div>;
                                })}
                            </div>
                        </div>
                    </div> : null
                }
                {data && utils.isArray(data.attach_file) ?
                    <div className="estimate__row">
                        <div className="title"><span>첨부파일</span></div>
                        <div className="attach__file">
                            {data.attach_file.map((o, i) => {
                                return (
                                    <div key={`attach_file_${i}`} className="attach__item">
                                        <a className="row__title" style={{ color: "#000" }} href={`${__SERVER__.data}${o.path}`} id={`attach_${i}`} download={o.file_name} target="_blank">
                                            {o.file_name}
                                        </a>
                                    </div>
                                );
                            })}
                        </div>
                    </div> : null
                }
            </div>
        );
    }
}

EstimateDetail.propTypes = {
    data: PropTypes.shape({
        order_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        offer_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        option: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
        content: PropTypes.string,
        portfolio: PropTypes.shape([PropTypes.node]),
        attach_image: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
        attach_file: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
    }),
    onFullScreen: PropTypes.func
};
EstimateDetail.defaultProps = {};

export default EstimateDetail;
