import "./chargePagination.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import classNames from "classnames";
import PopModal from "shared/components/modal/PopModal";

export default class ChargePagination extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            pageLimit: 10,
            pageGroup: 1,
            totalCount: props.totalCount,
            pageForRowLimit: 8,
            maxPage: 1
        };
        this.onPageMove = this.onPageMove.bind(this);
        this.setMaxPage = this.setMaxPage.bind(this);
        this.prevMove = this.prevMove.bind(this);
        this.nextMove = this.nextMove.bind(this);
    }

    componentWillMount() {
        const { totalCount } = this.props;
        const { page, pageLimit, pageForRowLimit } = this.state;
        this.setMaxPage(totalCount, pageForRowLimit);
    }

    componentDidMount() {
        // console.log("2", this.props);
    }

    // componentWillReceiveProps(np) {
    //     console.log("???:", np);
    //     if (this.props.totalCount !== np.totalCount) {
    //         console.log("333");
    //         const { page, pageLimit, pageForRowLimit } = this.state;
    //         this.setMaxPage(np.totalCount, pageForRowLimit);
    //     }
    // }

    /**
     * 페이지 이동
     * @param page
     */
    onPageMove(page) {
        this.setState({ page }, () => {
            if (typeof this.props.onPageMove === "function") {
                PopModal.progress();
                this.props.onPageMove(page);
            }
        });
    }

    /**
     * 최대 페이지 계산
     * @param total
     * @param limit
     */
    setMaxPage(total, limit) {
        const maxPage = Math.ceil(total / limit);
        this.setState({ maxPage });
    }

    prevMove() {
        const { page, maxPage } = this.state;
        if (page > 1) {
            this.setState({ page: page - 1 }, () => {
                if (typeof this.props.onPageMove === "function") {
                    PopModal.progress();
                    this.props.onPageMove(this.state.page);
                }
            });
        }
    }

    nextMove() {
        const { page, maxPage } = this.state;
        if (page < maxPage) {
            this.setState({ page: page + 1 }, () => {
                if (typeof this.props.onPageMove === "function") {
                    PopModal.progress();
                    this.props.onPageMove(this.state.page);
                }
            });
        }
    }

    render() {
        const { maxPage, page } = this.state;
        return (
            <div className="charge-artist__pagination">
                <div className="prev-button" onClick={this.prevMove}>
                    <i className="_icon _icon__gray_lt" />
                </div>
                <div className="pagination-button__box">
                    {Array.from(new Array(maxPage)).map((obj, idx) => {
                        return (
                            <div
                                className={classNames("pagination-button", { "active": page === idx + 1 })}
                                key={`page__${idx + 1}`}
                                onClick={() => this.onPageMove(idx + 1)}
                            >
                                <p>{utils.fillSpace(idx + 1, 2, "0")}</p>
                            </div>
                        );
                    })}
                </div>
                <div className="next-button" onClick={this.nextMove}>
                    <i className="_icon _icon__gray_gt" />
                </div>
            </div>
        );
    }
}
