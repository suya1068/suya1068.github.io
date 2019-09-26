import React, { Component, PropTypes } from "react";
import NoneList from "mobile/resources/views/users/mypage/component/none-list/NoneList";

export default class LikeNoneList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainCaption: "관심등록된 작가가 없어요!",
            subCaption: "포스냅에서 인생사진을 남기세요.",
            src: "/mobile/imges/f_img_bg_04.png",
            noneKey: "heart-none-list"
        };
    }

    render() {
        return (
            <div className="users-like__none-list">
                <NoneList {...this.state} />
            </div>
        );
    }
}
