import "./portfolioList.scss";
import React, { Component, PropTypes } from "react";
import { Router, Link, browserHistory, hashHistory } from "react-router";

import Buttons from "desktop/resources/components/button/Buttons";
import PortfolioProduct from "./PortfolioProduct";
import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

export default class PortfolioList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            onDelete: props.onDelete,
            isMount: !this._calledComponentWillUnmount
        };
        this.onDeleteFromList = this.onDeleteFromList.bind(this);
        this.onViewPortfolio = this.onViewPortfolio.bind(this);
        this.onMovePage = this.onMovePage.bind(this);
    }

    componentWillMount() {
    }

    componentWillReceiveProps(nextProps, nextState) {
        if (nextProps.data.list.length !== this.state.data.list.length) {
            this.setState({
                data: nextProps.data
            });
        }
    }

    onMovePage(no = "") {
        const { block_dt } = this.state.data;

        if (block_dt && block_dt !== "0000-00-00") {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "계정블럭상태로 접근이 불가합니다."
            });
        } else {
            let url = "/artists/product/portfolio/regist";
            if (no !== "") {
                url = `/artists/product/portfolio/regist/${no}`;
            }

            browserHistory.push(url);
        }
    }

    onDeleteFromList(no) {
        if (typeof this.props.onDelete === "function") {
            this.props.onDelete(no);
        }
    }

    onViewPortfolio(no) {
        if (typeof this.props.onView === "function") {
            this.props.onView(no);
        }
    }

    render() {
        const { data } = this.state;
        let content;

        if (data.list.length > 0) {
            content = (
                <div className="list-units">
                    <PortfolioProduct
                        list={data.list}
                        profileImg={data.artist_profile_img}
                        onMove={this.onMovePage}
                        onDeleteToProduct={this.onDeleteFromList}
                        onViewToPortfolio={this.onViewPortfolio}
                    />
                </div>
            );
        } else {
            content = (
                <div className="estimate-portfolio-list-none">
                    <div className="none-area">
                        <div className="empty-list">
                            <p className="h4">등록된 포트폴리오가 없어요</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="estimate-portfolio-list">
                <div className="header-wrap">
                    <h1 className="list-head" data-count={data.total}>포트폴리오 목록</h1>
                    <div className="button-div">
                        <Buttons buttonStyle={{ size: "small", shape: "circle", theme: "default" }} inline={{ onClick: () => this.onMovePage() }}>포트폴리오 등록</Buttons>
                    </div>
                </div>
                <div className="page-description">
                    <p>
                        비노출 포트폴리오는 촬영요청의 견적서 작성, 포스냅 상담요청건의 견적제안 시 고객님에게 전달되며 다른 곳에는 노출되지 않습니다.<br />
                        고객님에게 전달 시 일주일간만 노출되기 때문에 외부로 공개하기 어려운 포트폴리오도 등록이 가능합니다.<br />
                        카테고리별/컨셉별로 포트폴리오를 등록하시면 포스냅으로 직접 상담요청한 고객에게 작가님 안내 시 소개되며,<br />
                        촬영요청의 견적서 작성시에도 해당 포트폴리오를 첨부하실 수 있습니다.
                    </p>
                </div>
                {content}
            </div>
        );
    }
}
