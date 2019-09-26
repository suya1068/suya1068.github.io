import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Buttons from "desktop/resources/components/button/Buttons";

import "./table.scss";


/**
 * 페이지 리스트
 * @param totalCount - number (리스트 총 갯수)
 * @param listCount - number (한 페이지에 보여줄 리스트 갯수)
 * @param pageCount - number (한 페이지에 보여줄 페이지 갯수)
 * @param isJump - boolean (맨 처음, 맨 끝 버튼 추가 여부)
 * @param callBack - func or url (번호를 눌렀을때 이동될 주소 또는 실행될 함수)
 */
class Pagelist extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    render() {
        const { render } = this.props;
        let page = this.props.page * 1;
        const totalCount = this.props.totalCount * 1;
        const listCount = this.props.listCount * 1;
        let pageCount = this.props.pageCount * 1;
        const isJump = this.props.isJump;
        const callBack = this.props.callBack;

        const totalPage = Math.ceil(totalCount / listCount);

        if (page < 1) {
            page = 1;
        } else if (page > totalPage && totalPage > 0) {
            page = totalPage;
        }

        const pages = [];
        const range = (Math.ceil(page / pageCount) - 1) * pageCount;
        const isLT = range >= pageCount;
        const isGT = range + pageCount < totalPage;

        if ((range + pageCount) > totalPage) {
            pageCount -= (range + pageCount) - totalPage;
        }

        const highPage = (range + pageCount);

        const lt = isLT ? <Buttons inline={{ className: "pagelist-lt", onClick: () => callBack(range + 1, range * listCount) }}>&lt;</Buttons> : null;
        const gt = isGT ? <Buttons inline={{ className: "pagelist-gt", onClick: () => callBack(highPage + 1, highPage * listCount) }}>&gt;</Buttons> : null;
        const laquo = isLT ? <Buttons inline={{ className: "pagelist-laquo", onClick: () => callBack(1, 0) }}>&lt;&lt;</Buttons> : null;
        const raquo = isGT ? <Buttons inline={{ className: "pagelist-raquo", onClick: () => callBack(totalPage, (totalPage - 1) * listCount) }}>&gt;&gt;</Buttons> : null;

        for (let i = range; i < (range + pageCount); i += 1) {
            const num = i + 1;
            const inline = {};
            inline.className = classNames("pagelist-num", num === page ? "active" : "");
            inline.onClick = () => callBack(num, (i * listCount));

            const content = <Buttons inline={inline} key={num}>{typeof render === "function" ? render(num) : num}</Buttons>;
            pages.push(content);
        }

        return (
            <div className="pagelist">
                {isJump ? laquo : ""}
                {lt}
                {pages}
                {gt}
                {isJump ? raquo : ""}
            </div>
        );
    }
}

Pagelist.propTypes = {
    page: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    totalCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    listCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    pageCount: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    isJump: PropTypes.bool,
    callBack: PropTypes.oneOfType([PropTypes.func, PropTypes.string]).isRequired,
    render: PropTypes.func
};

Pagelist.defaultProps = {
    page: 1,
    isJump: false
};

export default Pagelist;
