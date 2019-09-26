import React, { Component, PropTypes } from "react";
import html2canvas from "html2canvas";

import mewtime from "forsnap-mewtime";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE, MODAL_ALIGN } from "shared/components/modal/Modal";

import EstimateDetail from "../detail/EstimateDetail";

class OutsideModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            image: null,
            blob: null
        };

        this.onDownload = this.onDownload.bind(this);
        this.onPrint = this.onPrint.bind(this);
    }

    componentDidMount() {
        Modal.show({ type: MODAL_TYPE.PROGRESS });
        html2canvas(this.refSnapshot, { logging: false, useCORS: true })
            .then(canvas => {
                const data = canvas.toDataURL("image/jpeg", 1.0);
                const imgData = atob(data.split(",")[1]);
                const len = imgData.length;
                const buf = new ArrayBuffer(len);
                const view = new Uint8Array(buf);
                for (let i = 0; i < len; i += 1) {
                    view[i] = imgData.charCodeAt(i) & 0xff;
                }
                const blob = new Blob([view], {
                    type: "application/octet-stream"
                });
                this.setState({
                    image: data,
                    blob
                }, () => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                });
            });
    }

    onDownload() {
        const name = `${mewtime().format("YYYYMMDD_HHmmss")}_견적서.jpg`;

        if (window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(this.state.blob, name);
        } else {
            const a = document.createElement("a");
            a.download = name;
            a.href = this.state.image;
            a.click();
        }
    }

    onPrint() {
        if (this.print && !this.print.closed) {
            this.print.close();
        }
        this.print = window.open("", "견전서 인쇄", "location=no, toolbar=no, menubar=no, scrollbars, resizable");
        this.print.document.body.innerHTML = `<img alt='print' src='${this.state.image}' onload='window.print();' style="width:21cm;" />`;
    }

    render() {
        const { estimate } = this.props;
        const data = {
            option: estimate.option,
            content: estimate.content
        };

        return (
            <div className="estimate__outside__content">
                <div className="top__buttons">
                    <button className="_button _button__close" onClick={() => Modal.close()} />
                </div>
                <div className="estimate__logo">
                    <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/logo_estimate.png`} width="180" />
                </div>
                <div className="estimate__content">
                    <EstimateDetail data={data} />
                </div>
                <div className="estimate__information">
                    <div className="estimate__buttons">
                        <button className="_button _button__fill__yellow" onClick={this.onDownload}>다운로드</button>
                        <button className="_button _button__fill__yellow" onClick={this.onPrint}>인쇄</button>
                    </div>
                    <div className="description">
                        <strong>본 견적서의 견적번호는 {estimate.order_no}-{estimate.offer_no} 입니다.</strong><br />
                        포스냅 서비스는 작가님과 고객님 모두 중개수수료가 0%이니, 수수료에 대한 걱정 없이 포스냅을 통한 예약을 진행해주세요.<br />
                        포스냅을 통하여 예약하시면 최종 이미지를 전달 받으실 때까지 안전하게 대금이 보관됩니다.<br />
                        견적서상 내용은 예약 확정 시 변동될 수 있습니다.<br />
                        포스냅은 중개업체로 세금계산서는 실제 서비스를 제공한 작가님이 발행합니다.<br />
                    </div>
                </div>
                <div className="estimate__snapshot" ref={ref => (this.refSnapshot = ref)}>
                    <div className="estimate__outside__content">
                        <div className="estimate__logo">
                            <img alt="estimate_logo" src={`${__SERVER__.img}/estimate/logo_estimate.png`} width="180" />
                        </div>
                        <div className="estimate__content">
                            <EstimateDetail data={data} />
                        </div>
                        <div className="estimate__information">
                            <div className="estimate__buttons" />
                            <div className="description">
                                <strong>본 견적서의 견적번호는 {estimate.order_no}-{estimate.offer_no} 입니다.</strong><br />
                                포스냅 서비스는 작가님과 고객님 모두 중개수수료가 0%이니, 수수료에 대한 걱정 없이 포스냅을 통한 예약을 진행해주세요.<br />
                                포스냅을 통하여 예약하시면 최종 이미지를 전달 받으실 때까지 안전하게 대금이 보관됩니다.<br />
                                견적서상 내용은 예약 확정 시 변동될 수 있습니다.<br />
                                포스냅은 중개업체로 세금계산서는 실제 서비스를 제공한 작가님이 발행합니다.<br />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

OutsideModal.propTypes = {
    estimate: PropTypes.shape([PropTypes.node])
};

export default OutsideModal;
