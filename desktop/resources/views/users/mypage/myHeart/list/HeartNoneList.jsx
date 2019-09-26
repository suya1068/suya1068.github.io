import React, { Component, PropTypes } from "react";

export default class HeartNoneList extends Component {
    render() {
        return (
            <div className="myHeart-none" key="noneHeart">
                <div className="myHeart-none__text">
                    <p className="h3 text-bold none-title">관심 등록된 작가가 없어요!</p>
                    <p className="h6">포스냅에서 인생사진을 남기세요. 실력있는 사진작가들을 만나세요.</p>
                </div>
                <div className="myHeart-none__image" />
            </div>
        );
    }
}
