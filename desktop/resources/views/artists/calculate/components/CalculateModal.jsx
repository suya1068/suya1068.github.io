import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

class CalculateModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            loading: false
        };
    }

    componentWillMount() {
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
    }

    componentDidMount() {
        const { buy_no } = this.props;
        const user = auth.getUser();

        if (user) {
            api.artists.fetchCrewCalculate(user.id, buy_no)
                .then(response => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    return response.data;
                })
                .then(data => {
                    if (this.state.isMount) {
                        this.setState(() => {
                            return {
                                price_info: data.price_info,
                                reserve_list: data.reserve_list,
                                loading: true
                            };
                        });
                    }
                })
                .catch(error => {
                    Modal.close(MODAL_TYPE.PROGRESS);
                    if (error && error.data) {
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data
                        });
                    }
                });
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "로그인 후 이용해주세요."
            });
        }
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    render() {
        const { loading, price_info, reserve_list } = this.state;

        if (!loading) {
            return null;
        }

        return (
            <div className="artist__calculate__modal">
                <div className="calculate__modal__header">
                    {"2"}월 정산내역
                    <button className="_button _button__close black__lighten" onClick={() => Modal.close()} />
                </div>
                <table>
                    <colgroup>
                        <col width="232px" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th>예약번호</th>
                            <th>촬영비용</th>
                            <th>기타비용</th>
                            <th>부가세</th>
                            <th>총액</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reserve_list.map(o => {
                            return (
                                <tr key={o.buy_no}>
                                    <td>{o.buy_no}</td>
                                    <td>{utils.format.price(Number(o.shot_price))}</td>
                                    <td>{utils.format.price(Number(o.etc_price))}</td>
                                    <td>{utils.format.price(Number(o.forsnap_surtax))}</td>
                                    <td>{utils.format.price(Number(o.price))}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td>총합</td>
                            <td>{utils.format.price(Number(price_info.shot_price))}</td>
                            <td>{utils.format.price(Number(price_info.etc_price))}</td>
                            <td>{utils.format.price(Number(price_info.forsnap_surtax))}</td>
                            <td className="total__price">{utils.format.price(Number(price_info.shot_price) + Number(price_info.etc_price) + Number(price_info.forsnap_surtax))}</td>
                        </tr>
                    </tfoot>
                </table>
                <div className="calculate__total">
                    <table>
                        <colgroup>
                            <col width="232px" />
                        </colgroup>
                        <tbody>
                            <tr>
                                <th>고정지급</th>
                                <td>{utils.format.price(Number(price_info.fixed_price))}</td>
                                <td>{utils.format.price(Number(price_info.etc_price))}</td>
                            </tr>
                            <tr>
                                <th>비율지급</th>
                                <td>{utils.format.price(Number(price_info.rate_price))}</td>
                                <td />
                            </tr>
                            <tr>
                                <th className="th2">합계</th>
                                <td>{utils.format.price(Number(price_info.fixed_price) + Number(price_info.rate_price))}</td>
                                <td>{utils.format.price(Number(price_info.etc_price))}</td>
                            </tr>
                            <tr>
                                <th className="th2">부가세</th>
                                <td>{utils.format.price(Number(price_info.shot_surtax))}</td>
                                <td>{utils.format.price(Number(price_info.etc_surtax))}</td>
                            </tr>
                            <tr>
                                <th className="th3">총지급액</th>
                                <td />
                                <td className="total__price">{utils.format.price(Number(price_info.artist_price))}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="logo">
                        <img alt="logo" src={`${__SERVER__.img}/common/f_logo_gray.png`} />
                    </div>
                </div>
            </div>
        );
    }
}

CalculateModal.propTypes = {
    buy_no: PropTypes.string
};

export default CalculateModal;
