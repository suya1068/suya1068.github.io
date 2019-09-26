import "./information.scss";
import React from "react";
import utils from "forsnap-utils";

const poster_list = [
    { no: "01", type: "icon", img: "introduction", title: "포스냅 소개", caption: "간편가입으로 작가와\n멋진 사진을 남기세요.", link: "/information/introduction" },
    { no: "02", type: "icon", img: "photo-gray", title: "작가로 활동하기", caption: "수많은 사람들이 당신의\n사진을 기다리고 있습니다.", link: "/information/strong-point" },
    { no: "04", type: "icon", img: "operation-guide", title: "이용안내", caption: "효율적인 이용방법을 통해\n포스냅을 만나보세요.", link: "/information/service-guide" },
    { no: "03", type: "icon", img: "policy-gray", title: "서비스 정책", caption: "투명한 마켓환경을 위해\n노력합니다.", link: "/information/service-policy" }
];

const Information = () => {
    return (
        <section className="mobile-main-information">
            <div className="mobile-main-information__heading">
                <h3 className="mobile-main-information__heading-title">포스냅과 함께 해요!</h3>
            </div>
            <div className="mobile-main-information__content">
                {poster_list.map(obj => {
                    return (
                        <div className="mobile-main-information__content-icon" key={`main_information__${obj.img}`}>
                            <a className="mobile-main-information__content-icon-link" href={obj.link}>
                                <i className={`m-icon m-icon_${obj.img}`} />
                                <p className="title">{obj.title}</p>
                                <p className="desc">{utils.linebreak(obj.caption)}</p>
                            </a>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default Information;
