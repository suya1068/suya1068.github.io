import "./footer.scss";
import React, { Component, PropTypes } from "react";
import ScrollTop from "shared/components/scroll/scroll_top/ScrollTop";
import Icon from "../../icon/Icon";
import auth from "forsnap-authentication";

class Footer extends Component {
    /**
     * 공통 Footer를 화면에 랜더링한다.
     * @returns {XML}
     */
    constructor(props) {
        super(props);
        this.state = {
            user: auth.getUser(),
            no_scroll_top: props.no_scroll_top
        };
    }

    componentWillMount() {
    }

    componentDidMount() {

    }

    render() {
        return (
            <footer id="site-footer">
                <h1 className="sr-only">Footer</h1>
                <div className="container">
                    <div className="row">
                        <div className="columns col-2 co-sign">
                            <p className="co-sign__forsnap">ⓒ FORSNAP</p>
                        </div>
                        <div className="columns col-7 paddingTB-0 pull-left">
                            <nav>
                                <h1 className="sr-only">Footer Nav</h1>
                                <ul className="nav-list">
                                    <li><a href="/information/introduction">포스냅 소개</a></li>
                                    <li><a href="/information/strong-point">작가로 활동하기</a></li>
                                    <li><a href="/cs/qna">고객센터</a></li>
                                    <li><a href="/policy/private">개인정보 취급방침</a></li>
                                    <li><a href="/policy/term">이용약관</a></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="columns col-3 icon-box">
                            <a href="mailto:help@forsnap.com"><Icon name="email" /></a>
                            <a target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/forsnap.official/"><Icon name="facebook" /></a>
                            <a target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/forsnap.official/"><Icon name="instargram" /></a>
                        </div>
                    </div>
                </div>
                <div className="footer-info">
                    <div className="container">
                        <div className="row">
                            <address className="address">
                                <p style={{ fontWeight: "bold", marginBottom: 10, color: "#000" }}>주식회사 포스냅은 통신판매중개자로서 통신판매 당사자가 아니며, 판매자가 등록한 상품정보 및 거래에 대한 의무와 책임은 각 판매자에게 있습니다.</p>
                                <p>
                                    (주) 포스냅 | 대표자명: 박현철 | 사업자등록번호: 267-81-00524
                                    <a
                                        className="button__ftc"
                                        href="http://www.ftc.go.kr/bizCommPop.do?wrkr_no=2678100524"
                                        // href="http://www.ftc.go.kr/info/bizinfo/communicationView.jsp?apv_perm_no=2017322016230200062&area1=&area2=&currpage=1&searchKey=04&wrkr_no=2678100524&stdate=&enddate="
                                        target="_blank"
                                    >사업자정보확인 &gt;</a>
                                    | 통신판매업번호: 제 2017-서울강남-00062 호</p>
                                <p>서울 성동구 서울숲4길 17 호영빌딩 B1 | e-mail: <a href="mailto:help@forsnap.com">help@forsnap.com</a></p>
                            </address>
                            <div className="mark">
                                <a href="https://mark.inicis.com/mark/escrow_popup.php?mid=MOIforsnap" rel="noopener noreferrer" target="_blank" >
                                    <img src="https://image.inicis.com/mkt/certmark/escrow/escrow_74x74_color.png" alt="클릭하시면 이니시스 결제시스템의 유효성을 확인하실 수 있습니다." />
                                </a>
                            </div>
                        </div>
                        {!this.props.no_scroll_top &&
                            <div className="scrollTop-wrapper">
                                <ScrollTop device="PC" is_artist={this.state.user && this.state.user.data.is_artist}>
                                    {this.props.children}
                                </ScrollTop>
                            </div>
                        }
                    </div>
                </div>
            </footer>
        );
    }
}

Footer.propTypes = {
    no_scroll_top: PropTypes.bool
};

Footer.defaultProps = {
    no_scroll_top: false
};

export default Footer;
