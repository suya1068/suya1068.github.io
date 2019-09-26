import React, { Component } from "react";
import ScrollTop from "shared/components/scroll/scroll_top/ScrollTop";
import auth from "forsnap-authentication";

class Footer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser()
        };
    }

    componentWillMount() {
        const user = this.state.user;

        if (user) {
            this.setState({
                is_artist: !!user.data.is_artist
            });
        }
    }

    render() {
        const { is_artist } = this.state;
        return (
            <footer className="site-footer">
                <div className="footer-component forsnap">
                    <div className="forsnap__legal">
                        <p>주식회사 포스냅은 통신판매중개자로서 통신판매 당사자가 아니며, 판매자가 등록한 상품정보 및 거래에 대한 의무와 책임은 각 판매자에게 있습니다.</p>
                    </div>
                    <div className="forsnap__sign">
                        <p className="forsnap__sign-text">ⓒ FORSNAP</p>
                    </div>
                    <nav className="forsnap__politics-link">
                        <h1 className="sr-only">포스냅 정책</h1>
                        <a role="button" href="/policy/private">개인정보 취급방침</a>
                        <a role="button" href="/policy/term">이용약관</a>
                        <a role="button" href="/information/strong-point">작가로활동하기</a>
                    </nav>
                    <div className="forsnap__info">
                        <p>(주) 포스냅 | 대표자명: 박현철</p>
                        <p>사업자등록번호: 267-81-00524
                            <a
                                className="button__ftc"
                                href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=2678100524"
                                // href="http://www.ftc.go.kr/info/bizinfo/communicationView.jsp?apv_perm_no=2017322016230200062&area1=&area2=&currpage=1&searchKey=04&wrkr_no=2678100524&stdate=&enddate="
                                target="_blank"
                            >사업자정보확인 &gt;</a></p>
                        <p>통신판매업번호: 제 2017-서울강남-00062호</p>
                        <p>서울 성동구 서울숲4길 17 호영빌딩 B1</p>
                        <p>e-mail: help@forsnap.com</p>
                    </div>
                </div>
                {location.pathname.startsWith("/login") ||
                location.pathname.startsWith("/join") ||
                location.pathname.startsWith("/forget")
                    ? null
                    :
                    <ScrollTop device="mobile" is_artist={this.state.user && is_artist}>
                        {this.props.children}
                    </ScrollTop>
                }
            </footer>
        );
    }
}

export default Footer;
