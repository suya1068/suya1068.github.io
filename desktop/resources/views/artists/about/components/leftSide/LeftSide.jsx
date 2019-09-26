import "./leftSide.scss";
import React, { Component, PropTypes } from "react";
import Profile from "desktop/resources/components/image/Profile";
import utils from "forsnap-utils";
// import auth from "forsnap-authentication";
import ArtistTrust from "../artist_trust/ArtistTrust";

export default class LeftSide extends Component {
    constructor(props) {
        super(props);
        this.state = {
            profile_img: props.profile_img,
            nick_name: props.nick_name || "",
            career: props.career || [],
            intro: props.intro || "",
            is_corp: props.is_corp,
            artistTrustData: props.artistTrustData || {}
        };
        this.onMoveRegReview = this.onMoveRegReview.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    onMoveRegReview(e) {
        e.preventDefault();
        const node = e.currentTarget;
        this.gaEvent();
        location.href = node.href;
    }

    gaEvent() {
        const eCategory = "후기 남기기";
        const eAction = "후기";
        const eLabel = "";
        utils.ad.gaEvent(eCategory, eAction, eLabel);
    }

    render() {
        const {
            profile_img,
            nick_name,
            career,
            intro,
            is_corp,
            artistTrustData
        } = this.state;

        return (
            <section className="about-artist-leftside">
                <div className="top-info">
                    <Profile image={{ src: profile_img }} size="large" />
                    <div className="artist-id">
                        <h2 className="nick_name">{nick_name}</h2>
                        <p className="text">{is_corp === "Y" ? <span className="col">세금계산서가능</span> : null}Photographer</p>
                    </div>
                </div>
                <div className="link-block">
                    <a
                        href={`${__DOMAIN__}/@${nick_name}/review`}
                        className="btn btn-block btn-round btn-fill-emphasis"
                        onClick={this.onMoveRegReview}
                    >
                        후기 남기기
                    </a>
                </div>
                <ArtistTrust {...artistTrustData} type="desktop" />
                <div className="intro-info">
                    <h3 className="title">자기소개</h3>
                    <p className="content">{utils.linebreak(intro)}</p>
                </div>
                <div className="career-info">
                    <h3 className="title">경력사항</h3>
                    {career.map((obj, idx) => {
                        const date = obj.date;
                        const year = date.substr(0, 4);
                        const day = date.substr(4);
                        const changeDate = `${year}.${day}`;
                        return (
                            <div className="career" key={`about-artist-career__${idx}`}>
                                <p className="date">{changeDate}</p>
                                <p className="content">{obj.content}</p>
                            </div>
                        );
                    })}
                </div>
            </section>
        );
    }
}

LeftSide.propTypes = {
    profile_img: PropTypes.string,
    nick_name: PropTypes.string,
    career: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    intro: PropTypes.string,
    is_corp: PropTypes.string
};

LeftSide.defaultProps = {
    profile_img: "",
    nick_name: "",
    career: [],
    intro: "",
    is_corp: "N"
};
