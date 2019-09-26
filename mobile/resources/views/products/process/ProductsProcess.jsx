import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import { Footer } from "mobile/resources/containers/layout";
import ScrollTop from "mobile/resources/components/scroll/ScrollTop";

class ProductsProcess extends Component {
    constructor(props) {
        super(props);

        this.state = {
            productNo: props.productNo,
            result: props.result,
            data: props.data,
            method: {
                card: "신용카드",
                trans: "계좌이체",
                vbank: "무통장 입금"
            }
        };
    }

    render() {
        const { productNo, data, result, method } = this.state;
        const isSuccess = !!result.imp_success;

        let messages;
        try {
            messages = result.error_msg.replace(/[+]+/gi, " ").split(" | ")[1];
        } catch (error) {
            messages = "결제가 취소되었습니다";
        }

        return (
            <div className="products__payment process">
                <div className="products__payment__breadcrumb">
                    <div className="payment__breadcrumb__process">
                        결제하기
                    </div>
                    <div className="payment__breadcrumb__bar">
                        &gt;
                    </div>
                    <div className="payment__breadcrumb__complete active">
                        주문완료
                    </div>
                </div>
                <div className="products__payment__content">
                    <div className="layout__body">
                        <div className="layout__body__main">
                            <div className="layer">
                                <div className="layer__body">
                                    <div className="layer__container">
                                        <div className="layer__border">
                                            <div className="layer__column padding__default align__center">
                                                <div className="text__header">
                                                    {`예약과 결제가 ${isSuccess ? "완료" : "취소"} 되었습니다.`}
                                                </div>
                                                <div className="text__content">
                                                    주문번호 : {utils.format.formatByNo(result.merchant_uid)}
                                                </div>
                                                {!isSuccess ? <div className="text__content">{messages}</div> : null}
                                            </div>
                                        </div>
                                        {isSuccess && data ?
                                            <div className="layer__border">
                                                <div className="layer__column text-right">
                                                    <div className="layer__row padding__default">
                                                        <h2 className="text__header">
                                                            촬영날짜
                                                        </h2>
                                                        <div>
                                                            {mewtime(data.reserve_dt).format("YYYY년 MM월 DD일")}
                                                        </div>
                                                    </div>
                                                    <div className="hr" />
                                                    <div className="layer__row padding__default">
                                                        <h2 className="text__header">
                                                            예약 상품명
                                                        </h2>
                                                        <div>
                                                            {data.title}
                                                        </div>
                                                    </div>
                                                    {data.add_price && data.add_price > 0 ? [
                                                        <div key="pay-price-hr" className="hr" />,
                                                        <div key="pay-price" className="layer__row padding__default">
                                                            <h2 className="text__header">상품 결제금액</h2>
                                                            <div>{utils.format.price(data.price)}원</div>
                                                        </div>,
                                                        <div key="add-price-hr" className="hr" />,
                                                        <div key="add-price" className="layer__row padding__default">
                                                            <h2 className="text__header">추가 결제금액</h2>
                                                            <div>{utils.format.price(data.add_price)}원</div>
                                                        </div>] : null}
                                                    <div className="hr" />
                                                    <div className="layer__row padding__default">
                                                        <h2 className="text__header">
                                                            총 결제금액
                                                        </h2>
                                                        <div style={{ color: "#ff326c" }}>
                                                            {utils.format.price(data.total_price)}원
                                                        </div>
                                                    </div>
                                                    <div className="hr" />
                                                    <div className="layer__row padding__default">
                                                        <h2 className="text__header">
                                                            결제방법
                                                        </h2>
                                                        <div>
                                                            {data.pay_type === "vbank"
                                                                ? utils.linebreak(`입금계좌 : ${data.vbank_name}\n계좌번호 : ${data.vbank_num}\n입금기한 : ${data.vbank_date}`)
                                                                : method[data.pay_type]}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> : null
                                        }
                                        <div className="layer__row padding__default nth__margin__left">
                                            <a className="f__button f__button__round active" href="/">메인페이지가기</a>
                                            {isSuccess && data ?
                                                <a className="f__button f__button__round active" href={`/users/progress/${data.pay_type === "vbank" ? "ready" : "payment"}`}>예약확인하기</a>
                                                : <a className="f__button f__button__round active" href={`/products/${productNo}`}>상품페이지가기</a>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Footer>
                        <ScrollTop />
                    </Footer>
                </div>
            </div>
        );
    }
}

ProductsProcess.propTypes = {
    data: PropTypes.shape([PropTypes.node]),
    result: PropTypes.shape([PropTypes.node]),
    productNo: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

export default ProductsProcess;
