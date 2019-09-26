import "./noneArtistPanel.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import DUMMY_DATA from "./noneArtistPanel.const";
import Img from "shared/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";

export default class NoneArtistPanel extends Component {
    render() {
        const artists = DUMMY_DATA.ARTISTS;
        const portfolio = DUMMY_DATA.PORTFOLIO;

        return (
            <div className="none__recommend-artist">
                <div className="none__recommend-artist__flag">
                    <img src={`${__SERVER__.img}${DUMMY_DATA.FLAG_IMG_2X}`} alt="플래그" />
                </div>
                <div className="none__recommend-artist__inner">
                    <div className="none__recommend-artist__head">
                        <h2 className="none__recommend-artist__head-title">계산된 견적가로 작가에게 문의하기</h2>
                    </div>
                    <div className="after-inquire-artist__content-head none__recommend-artist__head-content">
                        {artists.map((item, idx) => {
                            return (
                                <div className="after-inquire-artist__content__box none__recommend-artist__thumb" key={`product__list__${idx}`}>
                                    <div className="after-inquire-artist__content__box__thumb">
                                        <div className="thumb_image">
                                            {item.SELECT &&
                                            <div className="dummy_select">
                                                <i className="_icon _icon__yellow__check" />
                                            </div>
                                            }
                                            <div className="image dummy-artist-thumb">
                                                <Img image={{ src: `${DUMMY_DATA.ARTIST_THUMB_BASE_PATH}${item.IMG_PATH_2X}`, type: "image" }} />
                                            </div>
                                        </div>
                                        <p className="artist__nick-name">{item.NICK}</p>
                                        <p className="author">작가님</p>
                                    </div>
                                    <div className={classNames("arrow", { "show": item.ACTIVE })} />
                                </div>
                            );
                        })
                        }
                        <div className="arrow-left">
                            <Icon name="left_bracket_big_gray" />
                        </div>
                        <div className="arrow-right">
                            <Icon name="right_bracket_big_gray" />
                        </div>
                    </div>
                    <div className="pre-recommend-artist__content__box__info none__recommend-portfolio__box">
                        <div className="pre-recommend-artist__content__box__info-wrap">
                            <div>
                                <div className="pre-recommend-artist__content__box__info-portfolio none__recommend-artist__portfolio">
                                    {portfolio.map((image, idx) => {
                                        return (
                                            <div className="portfolio__thumb-image dummy-portfolio" key={`artist__dummy__portfolio__${idx}`}>
                                                <Img image={{ src: `${DUMMY_DATA.PORTFOLIO_BASE_PATH}${image.IMG_PATH_2X}`, type: "image" }} />
                                            </div>
                                        );
                                    })}
                                    <div className="selected-box">
                                        <i className="_icon _icon__yellow__check_s" />
                                        <span className="yellow-text" style={{ marginRight: 3, marginLeft: 5 }}>{DUMMY_DATA.ARTIST_NAME}</span> 작가님이 선택되었습니다.
                                    </div>
                                </div>
                                <div className="pre-recommend-artist__content__box__info-artist">
                                    <p className="nick-name">뮤</p>
                                    <div className="wrap-box select dummy-btn">
                                        <div className="dummy-select-box">
                                            <img src={`${__SERVER__.img}/common/icon/yellow_checkbox.png`} alt="yellow_checkbox" />
                                        </div>
                                        <p className="choice-artist">작가선택하기</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="none__recommend-artist__dots">
                        <div className="dot active" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                        <div className="dot" />
                    </div>
                </div>
            </div>
        );
    }
}
