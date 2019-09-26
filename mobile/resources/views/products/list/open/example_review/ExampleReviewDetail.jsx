import "./ExampleReviewDetail.scss";
import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import utils from "forsnap-utils";

import { CATEGORY } from "shared/constant/product.const";
import regular from "shared/constant/regular.const";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import ChargeCount from "shared/helper/charge/ChargeCount";

import ConsultModal from "mobile/resources/components/modal/consult/ConsultModal";

class ExampleReviewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.chargeCount = new ChargeCount();

        this.onScroll = this.onScroll.bind(this);
        this.onShowConsult = this.onShowConsult.bind(this);
        this.insertAdvice = this.insertAdvice.bind(this);
        this.externalEvents = this.externalEvents.bind(this);
    }

    componentWillMount() {
        this.chargeCount.init();
        this.setState({
            crc: this.chargeCount.getCRC(),
            chargeMaxCount: this.chargeCount.getMaxCount()
        });
    }

    onScroll(e) {
        const target = e.target;

        if (this.refClose) {
            const top = target.scrollTop - 50;

            if (top < 0) {
                this.refClose.style.top = 0;
            } else {
                this.refClose.style.top = `${top}px`;
            }
        }
    }

    onShowConsult() {
        const { data, category } = this.props;
        const { crc } = this.state;
        const p = {
            access_type: "pl_ex_review",
            device_type: "mobile",
            category,
            artist_id: data.artist_id
        };
        const modal_name = "consult_modal";

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: modal_name,
            content: (
                <div className="example__consult__modal">
                    <ConsultModal
                        isTypeRecommendArtist
                        onConsult={pr => {
                            const params = Object.assign({}, pr, {
                                ...p
                            });
                            this.insertAdvice(params, modal_name);
                        }}
                        requestAbleCount={3 - crc}
                        onClose={() => Modal.close()}
                    />
                </div>
            )
        });
    }

    insertAdvice(params, modal_name) {
        const { chargeMaxCount, crc } = this.state;
        if (chargeMaxCount - crc === 0) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: <p>포스냅에서는 최대 3명의 작가님께 견적 및 상담 신청이 가능합니다.<br />추가문의를 원하시는 경우 포스냅 전문가 상담 혹은 고객센터로 문의내용을 접수해주세요.</p>
            });
        } else {
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
            api.orders.insertArtistOrder(params)
                .then(response => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    this.chargeCount.setCRC();
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak("전달이 완료되었습니다.\n다른작가님에게도 촬영안내를 받아보세요."),
                        onSubmit: () => Modal.close(modal_name)
                    });
                    this.externalEvents();
                    this.chargeCount.setCRC();
                    this.setState({
                        crc: this.chargeCount.getCRC()
                    });
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error && error.date) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                });
        }
    }

    externalEvents() {
        utils.ad.wcsEvent("4");
        utils.ad.gtag_report_conversion(location.href);
        utils.ad.gaEvent("기업고객", "상담전환");
        utils.ad.gaEventOrigin("기업고객", "상담전환");
    }

    render() {
        const { data, onClose } = this.props;
        const category = CATEGORY[data.category];
        let content = data.content;

        const reg = new RegExp(regular.HTML_IMG, "gi");
        const m = content.match(reg);

        if (m) {
            m.map(o => {
                const a = document.createElement("a");
                const s = o.match(/(https|http):\/\/[a-z0-9./:_-]+/gi);

                if (s[0]) {
                    a.href = s[0] || "";
                    if (`${a.protocol}//${a.hostname}${a.port ? `:${a.port}` : ""}` === __SERVER__.thumb) {
                        const src = a.href.split("/");
                        const size = src[5].split("x");

                        const w = window.screen.width - ((window.screen.width * 0.12) + 30);
                        if (Number(size[0]) > w) {
                            const resize = utils.image.resize(size[0], size[1], size[0] > w ? w : size[0], 1, true);
                            size[0] = resize.width;
                            size[1] = resize.height;
                            src[5] = size.join("x");
                        }

                        content = content.replace(a.href, src.join("/"));
                    }
                }

                return null;
            });
        }

        return (
            <div className="example__review__detail__modal" onScroll={this.onScroll} onClick={onClose}>
                <div className="detail__container" onClick={e => { e.preventDefault(); e.stopPropagation(); }}>
                    <div>
                        <div className="close" onClick={onClose} ref={ref => (this.refClose = ref)}><button className="_button _button__close black__lighten" /></div>
                        <div className="detail__info">
                            <div className="content">{category ? category.name : ""} | {data.nick_name} 작가님</div>
                        </div>
                        <div className="detail__title">
                            {data.title}
                        </div>
                        <div className="detail__tag">
                            {data.tag ? data.tag.split(",").map((o, i) => {
                                return <div key={i} className="tag">#{o}</div>;
                            }) : null}
                        </div>
                        <div className="detail__content" dangerouslySetInnerHTML={{ __html: content }} />
                        <div className="detail__buttons">
                            <button className="_button" onClick={this.onShowConsult}>작가에게 문의하기</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

ExampleReviewDetail.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    category: PropTypes.string,
    onClose: PropTypes.func
};

export default ExampleReviewDetail;
