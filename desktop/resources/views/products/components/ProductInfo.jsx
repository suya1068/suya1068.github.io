import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";
import redirect from "forsnap-redirect";

import Buttons from "desktop/resources/components/button/Buttons";
import Icon from "desktop/resources/components/icon/Icon";
import ProductPortfolio from "desktop/resources/views/products/components/ProductPortfolio";
import PortfolioList from "../detail/components/PortfolioList";

const OPTION_ICON = {
    "ORIGIN": "opt_origin",
    "CUSTOM": "opt_custom",
    "PRINT": "opt_print",
    "DIRECT": "opt_direct"
};

const ProductInfo = props => {
    const optionDetails = [];
    let count = null;
    const data = {
        title: props.title,
        portfolio_cnt: props.portfolio_cnt,
        profile_img: props.profile_img,
        nick_name: props.nick_name,
        product_no: props.product_no
    };

    return (
        <div>
            <ProductPortfolio {...props.portfolio} data={data} enable_event={false} />
            <div className="productService">
                <h3 className="h6 text-bold">서비스 내용</h3>
                <table className="table style-trans">
                    <colgroup>
                        <col width="25px" />
                        <col />
                        <col span="4" width="120px" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th />
                            <th>옵션</th>
                            <th>촬영</th>
                            <th>보정</th>
                            <th>인화</th>
                            <th>가격</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            props.option.map((item, idx) => {
                                const optionContent = item.option_content;
                                if (item.option_type === "DIRECT") {
                                    if (optionContent === null) {
                                        optionDetails.push(null);
                                    } else if (optionContent !== null) {
                                        optionDetails.push(<p key={`opt-title-${idx}`} className="text-bold title">{item.option_name}</p>);
                                        optionDetails.push(<p key={`opt-content-${idx}`}>{utils.linebreak(item.option_content)}</p>);
                                    }
                                }
                                count = optionDetails.length;
                                if (optionDetails[idx] === null) {
                                    count -= (idx + 1);
                                }
                                return (
                                    <tr key={`opt${idx}`}>
                                        <td><Icon name={OPTION_ICON[item.option_type]} /></td>
                                        <td>{item.option_name}</td>
                                        <td>{`${item.min_cut_cnt} ~ ${item.max_cut_cnt}컷`}</td>
                                        <td>{Number(item.custom_cnt) ? `${item.custom_cnt}매` : "없음"}</td>
                                        <td>{Number(item.print_cnt) ? `${item.print_cnt}매` : "없음"}</td>
                                        <td>{utils.format.price(item.price)}원</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
            </div>
            {count > 0 ?
                (<div className="productOptionDetail" key="productOptionDetail">
                    <p className="h6-sub2 text-bold">작가 구성 옵션</p>
                    {optionDetails}
                </div>)
                : null
            }
            <div className="productDetail">
                <h3 className="h6-sub2 text-bold">상세 설명</h3>
                <p>{utils.linebreak(props.content)}</p>
            </div>
            {props.portfolio && Array.isArray(props.portfolio.list) && props.portfolio.list.length > 0 ?
                <PortfolioList list={props.portfolio.list} data={{ no: data.product_no, title: data.title }} /> : null
            }
            <div className="productReserve">
                <p className="h6-sub2 text-bold">예약 확인</p>
                <p>세부사항 관련 조율은 1:1문의로 문의해주세요.</p>
            </div>
            <div className="productTag">
                <h3 className="h6-sub2 text-bold">태그</h3>
                {
                    props.tag.map((productTag, idx) => (
                        <Buttons buttonStyle={{ shape: "round", theme: "bg-white", size: "small" }} inline={{ onClick: props.enable_event ? () => redirect.productList(`tag=${productTag}`) : undefined }} key={`tag${idx}`}>#{productTag}</Buttons>
                    ))
                }
            </div>
        </div>
    );
};

ProductInfo.propTypes = {
    portfolio: PropTypes.shape({
        total_cnt: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        list: PropTypes.arrayOf(PropTypes.shape({
            portfolio_no: PropTypes.string.isRequired,
            portfolio_img: PropTypes.string.isRequired,
            display_order: PropTypes.string.isRequired,
            width: PropTypes.string.isRequired,
            height: PropTypes.string.isRequired
        })).isRequired
    }).isRequired,
    option: PropTypes.arrayOf(PropTypes.shape({
        option_type: PropTypes.string,
        option_name: PropTypes.string,
        min_cut_cnt: PropTypes.string,
        max_cut_cnt: PropTypes.string,
        custom_cnt: PropTypes.string,
        print_cnt: PropTypes.string,
        price: PropTypes.string
    })).isRequired,
    content: PropTypes.string.isRequired,
    tag: PropTypes.arrayOf(PropTypes.string).isRequired,
    enable_event: PropTypes.bool,
    title: PropTypes.string,
    profile_img: PropTypes.string,
    nick_name: PropTypes.string,
    portfolio_cnt: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
};

ProductInfo.defaultProps = {
    enable_event: true
};

export default ProductInfo;
