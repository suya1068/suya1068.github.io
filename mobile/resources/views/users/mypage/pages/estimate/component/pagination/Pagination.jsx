import "./Pagination.scss";
import React, { Component, PropTypes } from "react";
import classnames from "classnames";

export default class Pagination extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: props.page,
            pages: this.calculatePages(props.total, props.limit),
            pagingGroup: 1,
            pagingGroups: this.caclulatePagesGroup(props.total, props.limit),
            perPage: 5
        };

        this.hasPrevPage = this.hasPrevPage.bind(this);
        this.hasNextPage = this.hasNextPage.bind(this);
        this.hasCurrentPage = this.hasCurrentPage.bind(this);
        this.onPrevPage = this.onPrevPage.bind(this);
        this.onNextPage = this.onNextPage.bind(this);
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const props = {
            pages: this.calculatePages(nextProps.total, nextProps.limit),
            pagingGroups: this.caclulatePagesGroup(nextProps.total, nextProps.limit)
        };

        if (this.props.page !== nextProps.page) {
            props.page = nextProps.page;
        }

        this.setState(props);
    }

    /**
     * [event] 이전 페이지를 호출한다.
     * @param event
     */
    onPrevPage(event) {
        event.preventDefault();
        if (!this.hasPrevPage()) {
            return;
        }

        const perPage = this.state.perPage;
        let pagingGroup = this.state.pagingGroup;

        const prevPage = this.state.page - 1;

        if (prevPage % 5 === 0) {
            pagingGroup -= 1;
        }

        this.setState({ page: prevPage, pagingGroup });

        if (typeof this.props.query === "function") {
            this.props.query({ page: prevPage });
        }
    }

    /**
     * [event] 다음 페이지를 호출한다.
     * @param event
     */
    onNextPage(event) {
        event.preventDefault();
        if (!this.hasNextPage()) {
            return;
        }
        const perPage = this.state.perPage;
        let pagingGroup = this.state.pagingGroup;

        const nextPage = this.state.page + 1;

        if (nextPage % 5 === 1) {
            pagingGroup += 1;
        }


        this.setState({ page: nextPage, pagingGroup });

        if (typeof this.props.query === "function") {
            this.props.query({ page: nextPage });
        }
    }

    onActivePage(event, page) {
        event.preventDefault();
        if (!this.hasCurrentPage(page + 1)) {
            return;
        }

        const currentPage = page + 1;
        this.setState({ page: currentPage });

        if (typeof this.props.query === "function") {
            this.props.query({ page: currentPage });
        }
    }


    /**
     * 이전 페이지가 존재하는지 판단한다.
     * @returns {boolean}
     */
    hasPrevPage() {
        return this.state.page - 1 >= 1;
    }

    /**
     * 다음 페이지가 존재하는지 판단한다.
     * @returns {boolean}
     */
    hasNextPage() {
        return this.state.page + 1 <= this.state.pages;
    }

    /**
     * 현재 페이지를 클릭했는지 판단한다.
     * @returns {*}
     */
    hasCurrentPage(page) {
        return this.state.page !== page;
    }

    calculatePages(total, limit) {
        return Math.ceil(total / limit);
    }

    caclulatePagesGroup(total, limit) {
        const pages = this.calculatePages(total, limit);
        return Math.ceil(pages / 5);
    }

    isActive(idx) {
        return idx === this.state.page;
    }

    pageList() {
        const pagesContent = [];
        const page = this.state.page;
        const pages = this.state.pages;
        const perPage = this.state.perPage;
        const pagingGroup = this.state.pagingGroup;
        let startIndex = 0;
        let endIndex = pages;

        if (pages > perPage) {
            endIndex = perPage;
            if (page > perPage) {
                startIndex = perPage * (pagingGroup - 1);
                endIndex = perPage * pagingGroup;
                if (endIndex > pages) {
                    endIndex = pages;
                }
            }
        }
        for (let i = startIndex; i < endIndex; i += 1) {
            pagesContent.push(
                <div className={classnames("button-unit", { "active": this.isActive(i + 1) })} key={`pagenation__${i}`} >
                    <a className={classnames("button button-small")} title="previous page" onClick={e => this.onActivePage(e, i)}>{i + 1}</a>
                </div>
            );
        }
        return pagesContent;
    }

    render() {
        return (
            <div className="pagination-buttons" aria-label="pagination group">
                <div className="pagination-buttons-inner">
                    <div className="prev-button" onClick={this.onPrevPage}>
                        <div className="harp-circle" />
                        <a className={classnames("button button-small", { "button--disabled": !this.hasPrevPage() })} title="previous page">
                            <i className="m-icon m-icon-gt_b rotate" />
                        </a>
                    </div>
                    {this.pageList()}
                    <div className="next-button" onClick={this.onNextPage}>
                        <div className="harp-circle" />
                        <a className={classnames("button button-small", { "button--disabled": !this.hasNextPage() })} title="previous page">
                            <i className="m-icon m-icon-gt_b" />
                        </a>
                    </div>
                </div>
            </div>
        );
    }
}
