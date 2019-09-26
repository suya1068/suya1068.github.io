import React, { Component, PropTypes } from "react";
import cookie from "shared/management/cookie";


class ScrollTop extends Component {
    constructor(props) {
        super(props);
        this.ENTER = "ENTER";
        this.state = {
            is_enter: !!(cookie.getCookies(this.ENTER) && sessionStorage.getItem(this.ENTER))
        };

        this.scrollToTop = this.scrollToTop.bind(this);
        this.scrollEvt = this.scrollEvt.bind(this);
    }

    componentWillMount() {
        window.addEventListener("scroll", this.scrollEvt);
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollEvt);
    }

    /**
     * TOP 버튼 클릭
     * @param event
     * @param scrollDuration
     */
    scrollToTop(event, scrollDuration) {
        event.preventDefault();
        const speed = scrollDuration || 200;
        const scrollStep = -(typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY) / (speed / 10);
        const scrollInterval = setInterval(() => {
            if ((typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY) !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
    }

    /**
     * 스크롤 이벤트
     */
    scrollEvt() {
        const goToTop = document.getElementById("top-button");
        const scrollY = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        if (goToTop) {
            if (scrollY === 0) {
                goToTop.style.display = "none";
            } else {
                goToTop.style.display = "block";
            }
        }
    }

    render() {
        const { device, is_artist } = this.props;
        // const { is_enter } = this.state;
        let top_icon = (<icon className="icon icon-disable_dt" />);
        if (device === "mobile") {
            top_icon = (<img role="presentation" src={`${__SERVER__.img}/mobile/icon/top_btn.png`} />);
        }

        return (
            <div id="goToTop" className={device} style={{ zIndex: 1061, position: this.props.position }}>
                {!is_artist && this.props.children}
                {!(location.pathname === "/artists/chat" || location.pathname === "/users/chat") &&
                    <a
                        href=""
                        id="top-button"
                        key="desktop-scrollTop"
                        onClick={event => this.scrollToTop(event)}
                    >
                        <div className={device === "mobile" ? "m_float__top" : "scroll-top round center"}>
                            {top_icon}
                            {device !== "mobile" && <span className="button-text" style={{ color: "#969696" }}>TOP</span>}
                        </div>
                    </a>
                }
            </div>
        );
    }
}

ScrollTop.propTypes = {
    device: PropTypes.string.isRequired,
    is_artist: PropTypes.bool
};

ScrollTop.defaultProps = {
    device: "pc",
    is_artist: false,
    position: "fixed"
};

export default ScrollTop;
