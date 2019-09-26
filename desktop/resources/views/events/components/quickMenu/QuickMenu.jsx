import "./quickMenu.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
// import ApplyConsulting from "shared/components/consulting/register/ApplyConsulting";
import PersonalConsult from "shared/components/consulting/personal/ConsultContainer";
import PopModal from "shared/components/modal/PopModal";
import EVENT_CONST from "../reg_dt_20180321/event.const";
import utils from "shared/helper/utils";

export default class QuickMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.scrollEvt = this.scrollEvt.bind(this);
        this.scrollToTop = this.scrollToTop.bind(this);
    }

    componentWillMount() {
        const referrer = document.referrer;
        if (referrer) {
            const data = utils.query.combineConsultToReferrer(referrer);
            const params = utils.query.setConsultParams({ ...data });
            this.setState({ ...params });
        }
        window.addEventListener("scroll", this.scrollEvt);
    }

    componentDidMount() {
        this.scrollEvt();
    }

    componentWillReceiveProps(nextProps) {
    }

    componentWillUnmount() {
        window.removeEventListener("scroll", this.scrollEvt);
    }

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

    scrollEvt() {
        const goToTop = document.querySelector(".quick-menu__top");
        const scrollY = typeof window.scrollY === "undefined" ? window.pageYOffset : window.scrollY;
        if (scrollY === 0) {
            goToTop.style.visibility = "hidden";
        } else {
            goToTop.style.visibility = "visible";
        }
    }

    onConsult() {
        const { referer, referer_keyword } = this.state;
        const ref_data = { referer, referer_keyword };
        const modal_name = "personal_consult";
        const options = {
            className: "personal_consult"
        };
        const consult_component = <PersonalConsult {...ref_data} device_type="pc" access_type="event" />;
        // if (is_enter) {
        //     consult_component = <ApplyConsulting name={modal_name} deviceType="pc" accessType="product_list" />;
        //     options.className = modal_name;
        //     options.modal_close = false;
        // }
        PopModal.createModal(modal_name, consult_component, options);
        // PopModal.createModal(modal_name, <ApplyConsulting name={modal_name} {...ref_data} deviceType="pc" accessType="event" />, { className: modal_name, modal_close: false });
        PopModal.show(modal_name);
    }

    onMoveMain() {
        location.href = "/";
    }

    render() {
        return (
            <div className="event-quick-menu" id="event-quick-menu">
                <h2 className="sr-only">퀵 메뉴</h2>
                <div className="quick-menu quick-menu__main" onClick={this.onMoveMain}>
                    <Img image={{ src: EVENT_CONST.QUICK.MAIN, type: "image" }} />
                </div>
                <div className="quick-menu quick-menu__quotation" onClick={this.onConsult}>
                    <Img image={{ src: EVENT_CONST.QUICK.QUOTATION, type: "image" }} />
                </div>
                <div className="quick-menu quick-menu__top" onClick={event => this.scrollToTop(event)}>
                    <div className="button-wrap">
                        <Img image={{ src: EVENT_CONST.QUICK.TOP, type: "image", width: 77, height: 77 }} />
                    </div>
                </div>
            </div>
        );
    }
}
