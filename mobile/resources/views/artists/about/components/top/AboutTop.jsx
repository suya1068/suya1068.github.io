import "./aboutTop.scss";
import React, { Component, PropTypes } from "react";
import Img from "desktop/resources/components/image/Img";
import utils from "forsnap-utils";
import classNames from "classnames";

class AboutTop extends Component {
// const AboutTop = props => {
    constructor(props) {
        super(props);
        this.state = {
            profile_img: props.profile_img || "",
            nick_name: props.nick_name || "",
            intro: props.intro || "",
            is_corp: props.is_corp || "N",
            isIntroShowButton: false,
            isIntroShow: false,
            moreHeight: 0
        };
        this.gaEvent = this.gaEvent.bind(this);
        this.onMoveRegReview = this.onMoveRegReview.bind(this);
    }

    componentWillMount() {

    }

    componentDidMount() {
        const target = this.intro;
        this.caculateHeight("intro-mobile");
        if (target.clientHeight && target.clientHeight === 70) {
            this.isIntroShow(true);
        }
    }

    onShow(id, flag) {
        const { moreHeight } = this.state;
        const target = document.getElementById(id);
        const baseMaxHeight = 70;
        this.setState({
            isIntroShow: flag
        }, () => {
            if (!flag) {
                window.scrollTo(0, 0);
                target.style.maxHeight = `${baseMaxHeight}px`;
            } else {
                target.style.maxHeight = `${moreHeight}px`;
            }
        });
    }

    caculateHeight(id) {
        const target = document.getElementById(id);
        const targetChild = target.querySelector(".transition-height");
        if (target) {
            this.setState({
                moreHeight: targetChild.clientHeight || 50
            });
        }
    }

    isIntroShow(flag = true) {
        this.setState({ isIntroShowButton: flag });
    }

    onMoveRegReview(e) {
        e.preventDefault();
        const node = e.currentTarget;
        this.gaEvent();
        location.href = node.href;
    }

    gaEvent() {
        const eCategory = "후기 남기기";
        const eAction = "";
        const eLabel = "";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    render() {
        const { profile_img, nick_name, intro, isIntroShow, isIntroShowButton, is_corp } = this.state;

        return (
            <section className="about-top-surface">
                <div className="artist-surface">
                    <div className="artist-surface-profile-img">
                        <Img image={{ src: profile_img }} isCrop />
                    </div>
                    <div className="artist-surface-info">
                        <p className="nick_name">{nick_name}</p>
                        <p className="text">{is_corp === "Y" ? <span className="col">세금계산서가능</span> : null}Photographer</p>
                    </div>
                </div>
                <div>
                    <a
                        href={`${__DOMAIN__}/@${nick_name}/review`}
                        className="button button-block button__theme__yellow"
                        onClick={this.onMoveRegReview}
                    >후기 남기기</a>
                </div>
                <div className={classNames("intro", { "show": isIntroShow })} ref={node => { this.intro = node; }} id="intro-mobile">
                    <p className="transition-height">{utils.linebreak(intro)}</p>
                    {isIntroShowButton ?
                        <div className={classNames("intro-gradient", { "none": isIntroShow })} /> : null
                    }
                </div>
                {isIntroShowButton ?
                    <div className={classNames("introShowButton", isIntroShow ? "hide" : "")} onClick={() => this.onShow("intro-mobile", !isIntroShow)}>
                        {!isIntroShow ? "더보기" : "접기"}
                    </div> : null
                }
            </section>
        );
    }
}

export default AboutTop;

AboutTop.propTypes = {
    profile_img: PropTypes.string,
    nick_name: PropTypes.string,
    intro: PropTypes.string
};

AboutTop.defaultProps = {
    profile_img: "",
    nick_name: "",
    intro: ""
};
