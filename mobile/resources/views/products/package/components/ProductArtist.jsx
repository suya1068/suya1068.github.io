import "../scss/ProductArtist.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import constant from "shared/constant";

import Img from "shared/components/image/Img";

class ProductArtist extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            category: props.category,
            height: 84,
            defaultHeight: 84,
            contentHeight: 0
        };

        this.onMoveArtistAbout = this.onMoveArtistAbout.bind(this);
        this.onMoreAbout = this.onMoreAbout.bind(this);
        this.onChat = this.onChat.bind(this);
    }

    componentDidMount() {
        const content = this.refAbout;

        if (content) {
            setTimeout(() => {
                const { defaultHeight } = this.state;
                this.setState({
                    contentHeight: content.offsetHeight,
                    height: content.offsetHeight > (defaultHeight * 2) ? defaultHeight : content.offsetHeight
                });
            }, 100);
        }
    }

    onMoreAbout() {
        const { height, defaultHeight, contentHeight } = this.state;

        if (this.refAbout) {
            if (height === defaultHeight) {
                this.setState({
                    height: contentHeight
                });
            } else {
                this.setState({
                    height: defaultHeight
                }, () => {
                    this.refArtist.scrollIntoView();
                });
            }
        }
    }

    onMoveArtistAbout(nick) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("작가정보보기", "", true);
        }
        location.href = `/@${nick}`;
        // location.href = `/artists/${id}/about`;
    }

    onChat(nick) {
        const { gaEvent, onChat } = this.props;
        if (typeof gaEvent === "function") {
            gaEvent("1:1문의_작가정보영역", "", true);
        }

        onChat();
    }

    render() {
        const { data, height, defaultHeight, contentHeight } = this.state;

        return (
            <div className="products__artist" ref={ref => (this.refArtist = ref)}>
                <div className="products__artist__info">
                    <div className="content">
                        <p className="name">
                            {data.nick_name || ""}
                            {data.is_crop === "Y" ? <span className="crop">기업</span> : null}
                        </p>
                        <p className="rank">Photographer</p>
                    </div>
                    <div className="profile">
                        <Img image={{ src: data.profile_img || "", content_width: 110, content_height: 110, default: constant.DEFAULT_IMAGES.PROFILE }} />
                    </div>
                </div>
                {data.artist_about ?
                    <div className="products__artist__about">
                        <div className="about__content" style={{ height: `${height}px`, transition: "height 0.4s" }}>
                            <div ref={ref => (this.refAbout = ref)}>
                                <span>{utils.linebreak(data.artist_about || "")}</span>
                            </div>
                        </div>
                        {contentHeight > (defaultHeight * 2) ?
                            <div className="about__more">
                                <button className="f__button f__button__small" onClick={this.onMoreAbout}>{height === defaultHeight ? "더보기" : "접기"}</button>
                            </div> : null
                        }
                    </div> : null
                }
                <div className="products__artist__stat">
                    <span>등록상품<strong>{data.product_count || 0}</strong></span>
                    <span>전체후기<strong>{data.review_count || 0}</strong></span>
                    <span>받은하트<strong>{data.heart_count || 0}</strong></span>
                </div>
                <div className="products__artist__buttons">
                    {!utils.checkCategoryForEnter(this.props.category) &&
                        <button className="f__button f__button__round f__button__theme__fill-black" onClick={() => this.onChat(data.nick_name)}>대화하기</button>
                    }
                    <button className="f__button f__button__round" onClick={() => this.onMoveArtistAbout(data.nick_name)}>작가정보보기</button>
                </div>
            </div>
        );
    }
}

ProductArtist.propTypes = {
    data: PropTypes.shape({
        nick_name: PropTypes.string,
        is_crop: PropTypes.string,
        profile_img: PropTypes.string,
        artist_about: PropTypes.string,
        product_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        review_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        heart_count: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    }).isRequired,
    onChat: PropTypes.func.isRequired
};

export default ProductArtist;
