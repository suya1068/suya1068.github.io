import "./print_receipt.scss";
import React, { Component, PropTypes } from "react";
// import ReactDOM from "react-dom";
import html2canvas from "html2canvas";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import utils from "forsnap-utils";

export default class PrintReceipt extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_loading: true,
            form: props.form,
            onClose: props.onClose
        };
        this.onPrint = this.onPrint.bind(this);
        this.initPrintConfig = this.initPrintConfig.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.props.form) !== JSON.stringify(nextProps.form)) {
            this.setState({ form: nextProps.form, is_loading: false }, () => {
                this.initPrintConfig();
            });
        }
    }

    /**
     * 프린트 이미지 저장
     */
    initPrintConfig() {
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
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                location.reload();
            });
    }

    /**
     * 프린트
     */
    onPrint() {
        if (this.print && !this.print.closed) {
            this.print.close();
        }
        this.print = window.open("", "견전서 인쇄", "location=no, toolbar=no, menubar=no, scrollbars, resizable");
        this.print.document.body.innerHTML = `<img alt='print' src='${this.state.image}' style="width:520px;height:auto;" onload='window.print();' style="width:21cm;" />`;
    }

    render() {
        const { form, is_loading } = this.state;
        if (is_loading) {
            return null;
        }
        return (
            <div className="print_receipt">
                <div className="print_receipt__snapshot" ref={ref => (this.refSnapshot = ref)}>
                    <div className="print_receipt__header">
                        <p className="print_receipt__header-title">구매 영수증</p>
                        <p className="print_receipt__header-desc">포스냅에서 주문하신 내역입니다.</p>
                    </div>
                    <div className="print_receipt__body">
                        <div className="print_receipt__body__content-row">
                            <p className="print_receipt__body__content-row__name">주문번호</p>
                            <p className="print_receipt__body__content-row__value">{form.buy_no}</p>
                        </div>
                        <div className="print_receipt__body__content-row">
                            <p className="print_receipt__body__content-row__name">결제일시</p>
                            <p className="print_receipt__body__content-row__value">{form.paid_dt}</p>
                        </div>
                        <div className="print_receipt__body__content-row">
                            <p className="print_receipt__body__content-row__name">상품명</p>
                            <p className="print_receipt__body__content-row__value">{form.title}</p>
                        </div>
                        <div className="print_receipt__body__content-row">
                            <p className="print_receipt__body__content-row__name">결제금액</p>
                            <p className="print_receipt__body__content-row__value">{form.total_price ? utils.format.price(form.total_price) : ""} 원</p>
                        </div>
                        <div className="print_receipt__body__content-row">
                            <p className="print_receipt__body__content-row__name">회사명</p>
                            <p className="print_receipt__body__content-row__value">{"포스냅"}</p>
                        </div>
                        <div className="print_receipt__body__content-row">
                            <p className="print_receipt__body__content-row__name">서명</p>
                            <p className="print_receipt__body__content-row__value">{form.user_name}</p>
                        </div>
                        <div className="print_receipt__body__content-row desc">
                            <span>구매영수증은 세금계산서 등 증빙서류로 활용할 수 없습니다.</span>
                        </div>
                        <div className="print_receipt__body__info">
                            <div className="print_receipt__body__info-logo" style={{ width: 108, height: 32 }}>
                                <img src={`${__SERVER__.img}/common/logo-estimate.png`} style={{ width: "100%", height: "100%" }} alt="receipt_print" />
                            </div>
                            <div className="print_receipt__body__info-box">
                                <p className="print_receipt__body__info-text">서울 성동구 서울숲4길 17 호영빌딩 B1</p>
                                <p className="print_receipt__body__info-text">대표이사 박현철, 사업자 등록번호 (267-81-00524),</p>
                                <p className="print_receipt__body__info-text">문의전화 (070-4060-4406)</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="print_receipt__footer">
                    <div className="print_receipt__footer__buttons">
                        <button className="_button" onClick={this.props.onClose}>확인</button>
                        <button className="_button _button__black" onClick={this.onPrint}>인쇄</button>
                    </div>
                </div>
            </div>
        );
    }
}
