import "./ArtistCalculatePage.scss";
import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import SearchContainer from "./search/SearchContainer";
import ListContainer from "./list/ListContainer";

import CalculateModal from "./components/CalculateModal";

class ArtistCalculatePage extends Component {
    constructor(props) {
        super(props);

        this.state = this.initState();

        this.onFetch = this.onFetch.bind(this);
        this.onShowCalculateModal = this.onShowCalculateModal.bind(this);

        this.fetch = this.fetch.bind(this);
    }

    componentDidMount() {
        this.onFetch();
    }

    onFetch(offset) {
        this.fetch(offset);
    }

    onShowCalculateModal({ buy_no, status_type, update_dt }) {
        const d = mewtime(update_dt);
        d.month(d.month() + 1).date(1);

        if (status_type === "COMPLETE" && d.isSameOrBefore(mewtime(), mewtime.const.DATE)) {
            Modal.show({
                type: MODAL_TYPE.CUSTOM,
                content: <CalculateModal buy_no={buy_no} />
            });
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak("일괄정산내역은\n촬영완료일 기준 익월 1일에 제공됩니다.")
            });
        }
    }

    initState() {
        return {
            list: {
                nopay: [],
                pay: [],
                length: 0
            },
            total: 0,
            artist_price_sum: 0,
            total_price_sum: 0,
            is_calculate: 0,
            isProcess: false
        };
    }

    setProgress(b) {
        this.state.isProcess = b;

        if (b) {
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
        } else {
            Modal.close(MODAL_TYPE.PROGRESS);
        }
    }

    fetch(offset = 0) {
        const user = auth.getUser();
        if (user) {
            if (!this.state.isProcess) {
                this.setProgress(true);
                const searchParams = this.refSearch.createSearchParams();

                api.artists.fetchCalculateList(user.id, { ...searchParams, offset })
                    .then(response => {
                        this.setProgress(false);

                        const { list, artist_price_sum, total_price_sum } = this.state;
                        const data = response.data;
                        const result = (data.list || []).reduce((r, o) => {
                            const isPay = utils.stringToBoolen(o.payment);
                            if (isPay) {
                                r.pay.push(o);
                            } else {
                                r.nopay.push(o);
                            }
                            return r;
                        }, { pay: [], nopay: [] });

                        let payList;
                        let nopayList;

                        if (offset > 0) {
                            const orderType = searchParams.date_type === "CALCULATE" ? "calculate_dt" : "reg_dt";
                            const payMergeObj = utils.mergeArrayTypeObject(list.pay, result.pay, ["buy_no"], [orderType], true);
                            const nopayMergeObj = utils.mergeArrayTypeObject(list.nopay, result.nopay, ["buy_no"], [orderType], true);

                            payList = payMergeObj.list;
                            nopayList = nopayMergeObj.list;
                        } else {
                            payList = result.pay;
                            nopayList = result.nopay;
                        }

                        this.setState({
                            list: {
                                nopay: nopayList,
                                pay: payList,
                                length: payList.length + nopayList.length
                            },
                            total: Number(data.total_cnt),
                            artist_price_sum: Number(data.artist_price_sum) || 0,
                            total_price_sum: Number(data.total_price_sum) || 0,
                            is_calculate: Number(data.is_calculate) || 0
                        });
                    })
                    .catch(error => {
                        this.setProgress(false);
                        Modal.show({
                            type: MODAL_TYPE.ALERT,
                            content: error.data ? error.data : "정산리스트를 가져오지 못했습니다."
                        });
                    });
            }
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "로그인 후 이용해주세요"
            });
        }
    }

    render() {
        const { list, total, artist_price_sum, total_price_sum, is_calculate } = this.state;

        return (
            <div className="artist__calculate">
                <div>
                    <SearchContainer ref={ref => (this.refSearch = ref)} onFetch={this.onFetch} />
                </div>
                <div>
                    <ListContainer
                        data={list}
                        total={total}
                        total_price_sum={total_price_sum}
                        artist_price_sum={artist_price_sum}
                        is_calculate={is_calculate}
                        onFetch={this.onFetch}
                        onShowCalculateModal={this.onShowCalculateModal}
                    />
                </div>
                <div>
                    <div className="information">
                        <h4 className="title">작가 정산 정책 안내</h4>
                        <p>판매금 정산시점은 최종본 전달 후, 구매자 승인완료일을 기준으로 합니다.</p>
                        <p>구매자 승인완료 1일~15일: 말일 지급</p>
                        <p>구매자 승인완료 16일~31일: 15일 지급</p>
                        <p>(지급일이 영업일이 아닌 경우, 다음 영업일에 지급됩니다)</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ArtistCalculatePage;
