import React, { Component, PropTypes } from "react";
import { Header, Footer, Panel } from "../../components";
import { introduction } from "../../information.const";
import { Link } from "react-router";
import utils from "forsnap-utils";
import Auth from "forsnap-authentication";

export default class StrongPoint extends Component {
    constructor(props) {
        super(props);
        document.title = "작가로 활동하기";
        const session = Auth.getUser();

        this.state = {
            isLogin: session && session.apiToken,
            isArtist: session && session.data.is_artist
        };
    }

    render() {
        const { isArtist } = this.state;

        return (
            <section>
                <Header image={{ src: "/mobile/strong_point/str_top_img.jpg" }}>
                    <h1 className="mobile-information-heading">작가님들의 성공에<br />포스냅이 함께 합니다.</h1>
                    <p className="mobile-information-description">새로운 가능성으로 초대합니다.</p>
                    {
                        !isArtist &&
                        <a
                            href={`${__DESKTOP__}/users/registartist`}
                            style={{ borderRadius: "5px" }}
                            className="button button__theme__yellow button__rect"
                        >작가 등록하기</a>
                    }
                </Header>
                <Panel image={{ src: "/mobile/strong_point/str_img_01.png" }}>
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">01</p>
                            <p className="mobile-information-panel__heading-desc">작가등록 및 이용비용 무료</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            상품등록, 촬영 예약, 스케쥴 관리, 사진전달까지<br />
                            촬영에 필요한 모든 시스템 이용비용이 무료입니다.
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                <Panel image={{ src: "/mobile/strong_point/str_img_02.png" }}>
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">02</p>
                            <p className="mobile-information-panel__heading-desc">마케팅 대행서비스</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            포스냅에 상품을 등록하시면 네이버 쇼핑, 다음 쇼핑에 자동등록되며<br />
                            베스트상품의 경우 보도자료, 페이스북, 인스타그램 등에 소개됩니다.
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                <Panel image={{ src: "/mobile/strong_point/str_img_03.png" }}>
                    <div className="mobile-information-panel__heading">
                        <h2 className="mobile-information-panel__heading-title">
                            <p className="mobile-information-panel__heading-no">03</p>
                            <p className="mobile-information-panel__heading-desc">촬영수수료 0%</p>
                        </h2>
                        <p className="mobile-information-panel__heading-content">
                            고객과 작가님 모두의 행복한 촬영을 위해<br />
                            포스냅에서는 촬영 수수료가 0%입니다.
                        </p>
                    </div>
                    <div className="mobile-information-panel__content">{}</div>
                </Panel>
                <Footer>
                    <h1 className="mobile-information-heading">포스냅에 대해 궁금하신가요?</h1>
                    <div className="mobile-information-description">
                        <Link to={introduction.url}>포스냅 소개 페이지 가기</Link>
                    </div>
                </Footer>
            </section>
        );
    }
}

