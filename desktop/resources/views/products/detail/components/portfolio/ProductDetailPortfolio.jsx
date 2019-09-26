import "./productDetailPortfolio.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import Icon from "desktop/resources/components/icon/Icon";
import classNames from "classnames";
import Input from "desktop/resources/components/form/Input";
import MoreBtn from "../../business/component/more/MoreBtn";
import Buttons from "desktop/resources/components/button/Buttons";
import PopDownContent from "desktop/resources/components/pop/popdown/PopDownContent";
import PopModal from "shared/components/modal/PopModal";
import VideoThumb from "./VideoThumb";

export default class ProductDetailPortfolio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // prop data
            list: props.list,
            // videoList: props.videoList,
            // total_cnt: props.total_cnt,
            title: props.title,
            product_no: props.product_no,
            isLike: props.isLike,
            // state data
            renderList: [],
            offset: 0,
            limit: 10,
            isMore: false,
            shareActive: false
        };
        this.onMore = this.onMore.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.onShare = this.onShare.bind(this);
        this.onLike = this.onLike.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onShow = this.onShow.bind(this);
        this.onToggle = this.onToggle.bind(this);
    }

    componentWillMount() {
        const { list } = this.props;

        this.setState({
            ...this.combineRenderList(list)
        });
    }

    componentDidMount() {
    }

    onMore() {
        const { list } = this.props;
        this.gaEvent("유료_포트폴리오 더보기");

        this.setState({
            ...this.combineRenderList(list)
        });
    }

    /**
     * 포트폴리오 렌더링 리스트
     * @param list
     * @returns {{renderList: Array, isMore: boolean}}
     */
    combineRenderList(list) {
        const { renderList, offset, limit } = this.state;

        // if (Array.isArray(videoList) && videoList.length > 0) {
        //     for (let i = 0; i < videoList.length; i += 1) {
        //         renderList.push(videoList[i]);
        //     }
        // }

        const lastListFlag = list.length > (limit + offset);
        const maxLength = lastListFlag ? (limit + offset) : list.length;
        let isMore = false;

        if (lastListFlag) {
            isMore = true;
        }

        for (let i = offset; i < maxLength; i += 1) {
            renderList.push(list[i]);
        }

        return { renderList, isMore, offset: limit + offset };
    }

    /**
     * 현재 주소 복사 기능
     */
    onCopy() {
        let state = true;
        try {
            window.getSelection().removeAllRanges();

            const text = document.getElementById("copyText");
            const range = document.createRange();
            range.selectNode(text);
            window.getSelection().addRange(range);

            document.execCommand("copy");

            window.getSelection().removeAllRanges();
        } catch (error) {
            state = false;
        }

        PopModal.alert(state ? "URL이 복사되었습니다." : "지원하지 않는 브라우저입니다.");
    }

    /**
     * 공유하기 이벤트 전달
     * @param type
     */
    onShare(type) {
        this.gaEvent("유료_공유하기");
        if (typeof this.props.onShare === "function") {
            this.props.onShare(type);
        }
    }

    onShow(e, index) {
        this.gaEvent("유료_포트폴리오");
        if (typeof this.props.onShow === "function") {
            this.props.onShow(index + 1);
        }
    }

    /**
     * 즐겨찾기 이벤트 전달
     */
    onLike() {
        const { isLike } = this.props;
        if (!isLike) {
            this.gaEvent("유료_좋아요");
        }
        if (typeof this.props.onLike === "function") {
            this.props.onLike();
        }
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }

    onToggle(flag) {
        this.setState({
            shareActive: flag
        });
    }

    render() {
        const { renderList, isMore, shareActive } = this.state;
        const { title, isLike } = this.props;

        return (
            <section className={classNames("product__portfolio", { "no-more": !isMore })}>
                <h2 className="sr-only">포트폴리오</h2>
                <div className="container">
                    <div className="product__portfolio__box">
                        <div className="product__portfolio__head">
                            <div className="head__left">
                                <p className="head__title">{title}</p>
                            </div>
                            <div className="head__right">
                                <div className="head__button">
                                    <PopDownContent
                                        PropStyle={{ marginTop: "18px", right: "-70px" }}
                                        toggleBtn={this.onToggle}
                                        target={
                                            <button className="share__button">
                                                <img src={`${__SERVER__.img}/common/icon/${shareActive ? "share_active.png" : "share.png"}`} width="20" height="23" alt="공유버튼" />
                                            </button>
                                        }
                                        align="left"
                                    >
                                        <div className="share__social">
                                            <button
                                                type="button"
                                                className="share__brand"
                                                style={{ marginRight: 40 }}
                                                onClick={() => this.onShare("naver")}
                                            >
                                                <div className="share-brand__icon"><Icon name={"naver"} /></div>
                                                <div className="share-brand__text">네이버</div>
                                            </button>
                                            <button type="button" className="share__brand" onClick={() => this.onShare("facebook")}>
                                                <div className="share-brand__icon"><Icon name={"facebook_c"} /></div>
                                                <div className="share-brand__text">페이스북</div>
                                            </button>
                                        </div>
                                        <div className="share__social__copy">
                                            <Input
                                                inputStyle={{ size: "small", width: "w154" }}
                                                inline={{ id: "copyText", value: location.href }}
                                                disabled="disabled"
                                            />
                                            <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "bg-lightgray" }} inline={{ onClick: this.onCopy }}>복사</Buttons>
                                        </div>
                                    </PopDownContent>
                                </div>
                                <div className="head__button" onClick={this.onLike}>
                                    {/*<Icon name="pink_heart" active={isLike ? "active" : ""} />*/}
                                    <img src={`${__SERVER__.img}/common/icon/${isLike ? "heart_full.png" : "heart_empty.png"}`} width="20" height="19" alt="좋아요버튼" />
                                </div>
                            </div>
                        </div>
                        <div className="product__portfolio__thumbs">
                            {renderList.map((obj, idx) => {
                                const isVideo = Object.prototype.hasOwnProperty.call(obj, "portfolio_video");
                                return (
                                    <div className="portfolio__thumb" key={`portfolio__thumb__${idx}`} onClick={e => this.onShow(e, idx)}>
                                        <div className="overlay">
                                            <img alt="icon" src={`${__SERVER__.img}/common/icon/icon_circle_plus.png`} />
                                            <div className="title">포트폴리오 크게 보기</div>
                                        </div>
                                        {isVideo ?
                                            <VideoThumb url={obj.portfolio_video} /> :
                                            <Img image={{ src: obj.portfolio_img, content_width: 320, content_height: 320 }} />
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {isMore &&
                        <MoreBtn title="포트폴리오 더보기" onMore={this.onMore} />
                    }
                </div>
            </section>
        );
    }
}

ProductDetailPortfolio.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    // total_cnt: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    product_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    isLike: PropTypes.bool.isRequired
};

ProductDetailPortfolio.defaultProps = {
    list: [],
    // total_cnt: 0,
    title: "",
    product_no: 0,
    isLike: false
};
