import "./portfolio.scss";
import React, { Component, PropTypes } from "react";
// import Img from "desktop/resources/components/image/Img";
import Swiper from "swiper";
import Icon from "desktop/resources/components/icon/Icon";
// import classNames from "classnames";
// import utils from "forsnap-utils";

export default class Portfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            nickName: props.nickName,
            activeIndex: props.activeIndex,
            isSelect: props.isSelect,
            no: props.no
        };
        this.onSelectArtist = this.onSelectArtist.bind(this);
    }

    componentDidMount() {
        this.configSwiper();
    }

    configSwiper() {
        this.popPortfolio = new Swiper(".pop-portfolio__list__slider", {
            slidesPerView: 1,
            initialSlide: this.props.activeIndex,
            nextButton: ".arrow-right",
            prevButton: ".arrow-left"
        });
    }

    onSelectArtist() {
        const { no, onSelectArtist, onClose, nickName } = this.props;
        if (typeof onSelectArtist === "function") {
            onSelectArtist(no);
            onClose();
        }
    }

    render() {
        const { nickName, list, isSelect } = this.props;
        return (
            <div className="pop-portfolio">
                <div className="pop-portfolio__head">{}</div>
                <div className="pop-portfolio__list">
                    <div className="pop-portfolio__list__slider swiper-container">
                        <div className="swiper-wrapper">
                            {list.map((image, idx) => {
                                const width = image.width;
                                const height = image.height;
                                const prop = {
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform: "translate(-50%, -50%)"
                                };
                                if (width > height) {
                                    prop.width = "100%";
                                } else {
                                    prop.height = "100%";
                                }
                                return (
                                    <div className="pop-portfolio__item swiper-slide" key={`portfolio-pop__${idx}`}>
                                        <img
                                            alt="portfolio"
                                            src={`${__SERVER__.thumb}/normal/resize/${1400}x${1000}${image.portfolio_img}`}
                                            style={prop}
                                        />
                                        {/*<Img image={{ src: image.portfolio_img, content_width: 1400, content_height: 1000, ...prop }} isCrop={false} />*/}
                                    </div>
                                );
                            })}
                        </div>
                        {/*{isSelect &&*/}
                        {/*<div className="selected-box">*/}
                        {/*<i className="_icon _icon__yellow__check_s" />*/}
                        {/*<span className="yellow-text" style={{ color: "#f7b500", marginRight: 3, marginLeft: 5 }}>{nickName}</span> 작가님이 선택되었습니다.*/}
                        {/*</div>*/}
                        {/*}*/}
                    </div>
                    <div className="arrow-left">
                        <Icon name="left_bracket_big_white" />
                    </div>
                    <div className="arrow-right">
                        <Icon name="right_bracket_big_white" />
                    </div>
                </div>
                <div className="pop-portfolio__info">
                    <div className="pop-portfolio__info-artist">
                        <p className="nick_name">{nickName}</p>
                        <p className="author">작가님</p>
                    </div>
                    {/*<div className="pop-portfolio__info-button">*/}
                    {/*<button className={classNames("_button", { "is_select": isSelect })} onClick={this.onSelectArtist}>{isSelect ? "작가선택해제" : "작가선택하기"}</button>*/}
                    {/*</div>*/}
                </div>
            </div>
        );
    }
}
