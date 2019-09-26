import "./artist_trust.scss";
import React, { Component } from "react";

const iDontNo = "아직 몰라요";

export default class ArtistTrust extends Component {
    constructor(props) {
        super(props);
        this.state = {
            avg: props.rating_avg || 0,
            complete_cnt: props.reserve_cnt.complete_payment_cnt,
            cancel_cnt: props.reserve_cnt.cancel_payment_cnt,
            response_time: props.response_time || 0,
            region: props.region || [],
            moreHeight: 0
        };
        this.caculateHeight = this.caculateHeight.bind(this);
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.caculateHeight();
    }

    componentWillUnmount() {
    }

    onClick(e) {
        const { moreHeight } = this.state;
        // const currentTarget = e.currentTarget;
        // const showDiv = document.getElementsByClassName("hide-info")[0];
        // const targetPlus = currentTarget.querySelector(".plus");
        const showDiv = this.hide_info;
        const targetPlus = this.plus_button;
        targetPlus.classList.toggle("clicked");

        if (targetPlus.classList[1] === "clicked") {
            showDiv.classList.add("show");
            showDiv.style.height = `${moreHeight}px`;
        } else {
            showDiv.classList.remove("show");
            showDiv.style.height = 0;
        }
    }

    caculateHeight() {
        // const target = document.getElementsByClassName("hide-info")[0];
        // const targetChildren = target.querySelector(".test");
        const targetChildren = this.hide_node_child;
        this.setState({
            moreHeight: targetChildren.clientHeight
        });
    }

    timeCheck(time) {
        // 시간, 분으로 변환
        const hour = parseInt(time / 60, 10);
        // const min = parseInt(time % 60, 10);
        let message;
        if (hour === 0) {
            message = "1시간 이내";
        } else if (hour > 0 && hour < 12) {
            message = `${hour + 1}시간 이내`;
        } else {
            message = "12시간 이상";
        }

        return message;
    }

    convertRegion(region) {
        if (Array.isArray(region) && region.length > 0) {
            return region.join(", ");
        }

        return "";
    }

    render() {
        const { complete_cnt, avg, response_time, cancel_cnt, region } = this.state;
        return (
            <div className="artist-trust-component" id="artist-trust-component">
                <div className="info-box">
                    <div className="reserve-complete">
                        <p className="first-line">{`${complete_cnt} 건`}</p>
                        <p className="second-line">총촬영건수</p>
                    </div>
                    <div className="average-request">
                        <p className="first-line">{response_time ? this.timeCheck(response_time) : iDontNo}</p>
                        <p className="second-line">평균응답시간</p>
                    </div>
                    <div className="contentment">
                        <p className="first-line">{avg ? `${avg}%` : iDontNo}</p>
                        <p className="second-line">만족도</p>
                    </div>
                    <div className="more-info" onClick={this.onClick} >
                        <p className="first-line">더 보기</p>
                        <div className="second-line">
                            <div className="plus" ref={node => { this.plus_button = node; }} />
                        </div>
                    </div>
                </div>
                <div className="hide-info" ref={node => { this.hide_info = node; }}>
                    <div className="test" ref={node => { this.hide_node_child = node; }}>
                        <div className="hide-info-row">
                            <span className="hide-info-title">촬영취소건수</span>
                            <span className="hide-info-other">{`${cancel_cnt}건`}</span></div>
                        <div className="hide-info-row">
                            <span className="hide-info-title">주활동지역</span>
                            <span className="hide-info-other">{region && region.length > 0 ? this.convertRegion(region) : iDontNo}</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
