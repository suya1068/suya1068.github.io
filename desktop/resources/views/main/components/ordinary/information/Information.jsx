import "./information.scss";
import React from "react";

import Poster from "desktop/resources/components/icon/poster/Poster";


const posterList = [
    { no: "01", type: "icon", img: "introduction", title: "포스냅 소개", caption: "간편가입으로 작가와<br />멋진 사진을 남기세요.", link: "/information/introduction" },
    { no: "02", type: "icon", img: "photo-gray", title: "작가로 활동하기", caption: "수많은 사람들이 당신의<br />사진을 기다리고 있습니다.", link: "/information/strong-point" },
    { no: "04", type: "icon", img: "operation-guide", title: "이용안내", caption: "효율적인 이용방법을 통해<br />포스냅을 만나보세요.", link: "/information/service-guide" },
    { no: "03", type: "icon", img: "policy-gray", title: "서비스 정책", caption: "투명한 마켓환경을 위해<br />노력합니다.", link: "/information/service-policy" }
];

const Information = props => {
    return (
        <section className="main-information">
            <div className="container">
                <h2 className="main-information__heading">포스냅과 함께 해요!</h2>
                <div className="main-information__contents">
                    {
                        posterList.map(item => (
                            <a key={item.no} href={item.link} className="main-information-item">
                                <Poster data={item} />
                            </a>
                        ))
                    }
                </div>
            </div>
        </section>
    );
};

export default Information;
