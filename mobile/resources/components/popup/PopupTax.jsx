import "./scss/PopupTax.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";

class PopupTax extends Component {
    render() {
        const { price, data } = this.props;

        return (
            <div className="popup__tax__container">
                <div className="popup__tax__header">
                    <div>
                        <h1 className="tax__title">포스냅 세금 정산</h1>
                    </div>
                    <span className="tax__desc">사업자등록번호가 없는 프리랜서는 세금계산서 미발행에 해당되며 원천징수 3.3%후 정산됩니다.</span>
                </div>
                <div className="popup__tax__content">
                    <table className="table">
                        <colgroup>
                            <col width="26%" />
                            <col width="37%" />
                            <col width="37%" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th />
                                <th>세금계산서 발행</th>
                                <th>세금계산서 미발행</th>
                            </tr>
                        </thead>
                        <tbody className="price">
                            <tr>
                                <td>상품 판매 매출액</td>
                                <td>{utils.format.price(price)}</td>
                                <td>{utils.format.price(price)}</td>
                            </tr>
                            <tr>
                                <td>공급가액</td>
                                <td>{utils.format.price(Math.round(data.exComiPrice))}</td>
                                <td>{utils.format.price(Math.round(data.exComiPrice))}</td>
                            </tr>
                            <tr>
                                <td>부가가치세/소득세</td>
                                <td>{utils.format.price(Math.round(data.vat - data.vatComi))}</td>
                                <td>{utils.format.price(Math.round(data.tax + data.vatTax))} (소득세&nbsp;3.3%)</td>
                            </tr>
                        </tbody>
                    </table>
                    <table className="table">
                        <colgroup>
                            <col width="26%" />
                            <col width="37%" />
                            <col width="37%" />
                        </colgroup>
                        <tbody className="total">
                            <tr>
                                <td>정산금액</td>
                                <td>{utils.format.price(Math.round(data.exComiPrice + (data.vat - data.vatComi)))}</td>
                                <td>{utils.format.price(Math.round(data.exComiPrice - (data.taxPrice)))}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

PopupTax.propTypes = {
    price: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default PopupTax;
