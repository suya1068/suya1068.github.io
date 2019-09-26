import React, { Component, PropTypes } from "react";

class MainIntro extends Component {
    render() {
        return (
            <div className="ma__itr">
                <h1 className="sr-only">서비스 소개</h1>
                <div className="itr__ct">
                    <div className="ct__ic"><i className="_icon__camera__tt" /></div>
                    <div className="ct__txt">
                        <p className="ct__tt">언제 어디서나 가능한 촬영</p>
                        <p className="ct__sub">
                            656명 작가님의 1667개의<br />
                            촬영상품을 확인해보세요.
                        </p>
                    </div>
                </div>
                <div className="itr__ct">
                    <div className="ct__ic"><i className="_icon__talk__tt" /></div>
                    <div className="ct__txt">
                        <p className="ct__tt">작가님과 1:1대화</p>
                        <p className="ct__sub">
                            촬영과 관련된 궁금한 점을<br />
                            작가님께 직접 문의해보세요.
                        </p>
                    </div>
                </div>
                <div className="itr__ct">
                    <div className="ct__ic"><i className="_icon__lock__tt" /></div>
                    <div className="ct__txt">
                        <p className="ct__tt">안전한 거래 시스템</p>
                        <p className="ct__sub">
                            사진이 최종 전달될때까지 촬영대금을<br />
                            포스냅에서 안전하게 보관합니다.
                        </p>
                    </div>
                </div>
            </div>
        );
    }
}

export default MainIntro;
