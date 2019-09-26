import "./productSelect.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

import Pagelist from "desktop/resources/components/table/Pagelist";
import li from "eslint-plugin-jsx-a11y/src/util/implicitRoles/li";

export default class ProductSelect extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product_list: [],
            list: [],
            checked: [],
            selectProduct: "",
            freeCategory: ["INTERIOR", "VIDEO_BIZ", "PROFILE_BIZ"],
            page: 1,
            limit: 5
        };

        this.onChangeCheck = this.onChangeCheck.bind(this);
        this.onPage = this.onPage.bind(this);

        this.combineProducts = this.combineProducts.bind(this);
    }

    componentWillReceiveProps(np) {
        if (this.props.list.length !== np.list.length) {
            this.setState({
                product_list: np.list
            }, () => {
                this.onPage(1, 0);
            });
        }
    }

    onChangeCheck(p, b) {
        this.setState(({ checked }) => {
            if (b) {
                const find = checked.find(o => o.category_code === p.category_code);

                if (find) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: "카테고리당 한개의 상품만 선택 가능합니다."
                    });
                } else {
                    checked.push({
                        product_no: p.product_no,
                        category_code: p.category_code
                    });
                }
            } else {
                const index = checked.findIndex(o => o.product_no === p.product_no);
                if (index > -1) {
                    checked.splice(index, 1);
                }
            }

            return {
                checked
            };
        }, () => {
            this.props.onSelectProduct(this.state.checked);
        });
    }

    onPage(page, offset) {
        const { product_list, limit } = this.state;

        this.setState({
            page,
            list: product_list.slice(offset, offset + limit)
        });
    }

    /**
     * 드랍박스 형식에 맞게 리스트를 조정한다.
     */
    combineProducts(list) {
        const data = list.reduce((result, p) => {
            if (p.display_yn === "Y" && utils.checkCategoryForEnter(p.category_code)) {
                result.push(p);
            }
            return result;
        }, []);
        return data;
    }

    render() {
        const { product_list, list, checked, page, limit } = this.state;
        return (
            <div className="charge-artist__row charge-artist__select">
                <div className="charge-artist__column">
                    <p className="column__title">상품목록 및 상품선택</p>
                    <div className="column__caption">
                        <span className="column__caption__title">현재 노출 중인 상품만 신청가능합니다.</span>
                    </div>
                </div>
                <div className="charge-artist__column">
                    <table className="table">
                        <colgroup>
                            <col width="100" />
                            <col width="140" />
                            <col />
                            <col width="110" />
                        </colgroup>
                        <thead>
                            <tr>
                                <th>번호</th>
                                <th>카테고리</th>
                                <th>상품명</th>
                                <th>상품담기</th>
                            </tr>
                        </thead>
                        <tbody>
                            {list.map(o => {
                                const check = !!checked.find(f => f.product_no === o.product_no);
                                return (
                                    <tr key={`product_${o.product_no}`}>
                                        <td className="text-center">{o.product_no}</td>
                                        <td className="text-center">{o.category_name}</td>
                                        <td>{o.title}</td>
                                        <td className="text-center">
                                            <CheckBox checked={check} onChange={value => this.onChangeCheck(o, value)} />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan="4" className="text-center">
                                    <Pagelist
                                        page={page}
                                        totalCount={product_list.length}
                                        listCount={limit}
                                        pageCount="10"
                                        callBack={this.onPage}
                                        isJump
                                        render={num => utils.fillSpace(num, 2)}
                                    />
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    }
}

ProductSelect.propTypes = {
    onSelectProduct: PropTypes.func.isRequired
};
