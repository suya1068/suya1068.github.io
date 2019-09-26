import React, { Component, PropTypes } from "react";
import update from "immutability-helper";

import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import desk from "desktop/resources/management/desktop.api";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import Product from "desktop/resources/components/product/Product";
import Buttons from "desktop/resources/components/button/Buttons";

import PackageEditModal from "./components/PackageEditModal";

class ProductListPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: [],
            total_cnt: 0,
            isProcess: false,
            isUnMount: false,
            isLoaded: false
            // enter: cookie.getCookies(CONSTANT.USER.ENTER)
        };

        this.changeDisplay = this.changeDisplay.bind(this);
        this.editProduct = this.editProduct.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.apiProductLists();
    }

    componentWillUnmount() {
        this.state.isUnMount = true;
    }

    /**
     * API 상품목록 가져오기
     */
    apiProductLists() {
        const user = auth.getUser();

        if (user) {
            const artists = desk.artists.listProduct(user.id);

            artists.then(response => {
                if (response.status === 200) {
                    const data = response.data;

                    if (!this.state.isUnMount) {
                        this.setState({
                            list: update(this.state.list, { $set: data.list }),
                            isLoaded: true,
                            total_cnt: data.total_cnt
                        });
                    }
                }
            }).catch(error => {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: error.data
                });
            });
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "로그인 후 이용해주세요."
            });
        }
    }

    /**
     * 상품 노출 정보 변경
     * @param idx -
     */
    changeDisplay(product) {
        const pNo = product.product_no;
        const displayYn = product.display_yn;

        if (!this.state.isProcess) {
            this.state.isProcess = true;

            if (!product.thumb_img) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak("썸네일 이미지를 등록해야\n상품노출이 가능합니다."),
                    onSubmit: () => {
                        this.editProduct(pNo, "portfolio");
                        this.state.isProcess = false;
                    }
                });
            } else {
                const user = auth.getUser();
                const request = desk.artists.displayProduct(user.id, pNo, (displayYn === "Y" ? "N" : "Y"));

                request.then(response => {
                    if (response.status === 200) {
                        const data = response.data;
                        const list = this.state.list;

                        const index = list.findIndex(obj => {
                            return obj.product_no === pNo;
                        });

                        if (!this.state.isUnMount) {
                            this.setState({
                                list: update(this.state.list, { [index]: { display_yn: { $set: data.display_yn } } }),
                                isProcess: false
                            }, () => {
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    content: `${data.display_yn === "Y" ? "노출" : "비노출"}상태로 변경되었습니다.`
                                });
                            });
                        }
                    }
                }).catch(error => {
                    this.state.isProcess = false;
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: error.data
                    });
                });
            }
        }
    }

    /**
     * 상품 삭제
     * @param pNo - String (상품번호)
     */
    deleteProduct(pNo) {
        if (!this.state.isProcess) {
            this.state.isProcess = true;
            Modal.show({
                type: MODAL_TYPE.CONFIRM,
                content: utils.linebreak("상품을 삭제하시겠습니까?<br />삭제하신 상품은 복구할 수 없습니다."),
                onSubmit: () => {
                    Modal.show({
                        type: MODAL_TYPE.CONFIRM,
                        content: "정말 삭제하시겠습니까?",
                        onSubmit: () => {
                            const user = auth.getUser();
                            const request = desk.artists.deleteProduct(user.id, pNo);

                            request.then(response => {
                                if (response.status === 200) {
                                    const data = response.data;

                                    if (!this.state.isUnMount) {
                                        this.setState({
                                            list: update(this.state.list, { $set: data.list }),
                                            total_cnt: data.total_cnt,
                                            isProcess: false
                                        });
                                    }
                                }
                            }).catch(error => {
                                const props = {
                                    isProcess: false
                                };

                                const index = this.state.list.findIndex(obj => {
                                    return obj.product_no === pNo;
                                });

                                if (index !== -1) {
                                    props.list = update(this.state.list, { $splice: [[index, 1]] });
                                    props.total_cnt = props.list.length;
                                }

                                this.setState(props);
                                Modal.show({
                                    type: MODAL_TYPE.ALERT,
                                    content: error.data
                                });
                            });
                        },
                        onCancel: () => {
                            this.state.isProcess = false;
                        }
                    });
                },
                onCancel: () => {
                    this.state.isProcess = false;
                }
            });
        }
    }

    /**
     * 상품정보 변경
     * @param pNo
     */
    editProduct(pNo, path) {
        const modalName = "";
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            name: "product_edit",
            close: true,
            content: <PackageEditModal product_no={pNo} path={path} />,
            onClose: () => this.apiProductLists()
        });
    }

    render() {
        const { isLoaded, list } = this.state;
        const content = [];

        if (isLoaded && list.length > 0) {
            content.push(
                <div key="product-list" className="product-list">
                    <div className="list-title">
                        <h4 className="h4-sub text-bold" data-num={this.state.total_cnt}>상품목록</h4>
                        <p className="h5-caption">최대 30개의 상품을 등록할 수 있어요.</p>
                    </div>
                    <div className="product-container">
                        <ul className="artist-product-list">
                            {list.map((product, i) => {
                                return (
                                    <li key={i} style={{ position: "relative" }}>
                                        <Product data={product} size="small">
                                            <div className="button-wrap" style={{ paddingTop: 10 }}>
                                                <Buttons
                                                    buttonStyle={{ width: "w113", size: "small", shape: "round", theme: "muted" }}
                                                    inline={{ onClick: () => { window.location.href = `/products/${product.product_no}`; } }}
                                                >상품보러가기</Buttons>
                                            </div>
                                        </Product>
                                        <div className="category">{product.category_name}</div>
                                        <div className="product-list-status">&quot;{product.display_yn === "Y" ? "노출" : "비노출"}&quot; 상태입니다</div>
                                        <div className="product-list-btn">
                                            <div className="list-btn-left">
                                                <Buttons
                                                    buttonStyle={{ size: "small", width: "block", shape: "circle", theme: "pink" }}
                                                    inline={{ className: product.display_yn === "Y" ? "" : "active", onClick: () => this.changeDisplay(product) }}
                                                >{product.display_yn === "Y" ? "노출" : "비노출"}</Buttons>
                                                <Buttons buttonStyle={{ size: "small", width: "block", shape: "circle", theme: "default" }} inline={{ onClick: () => this.deleteProduct(product.product_no) }}>삭제</Buttons>
                                            </div>
                                            <div className="list-btn-right">
                                                <Buttons buttonStyle={{ size: "small", width: "w68", shape: "circle", theme: "default" }} inline={{ className: "btn-product-edit", onClick: () => this.editProduct(product.product_no) }}>변경</Buttons>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            );
        } else if (isLoaded && list.length < 1) {
            content.push(
                <div key="product-list" className="product-list">
                    <div className="list-title">
                        <h4 className="h4-sub text-bold">&nbsp;</h4>
                        <p className="h5-caption">&nbsp;</p>
                    </div>
                    <div className="product-container">
                        <div key="empty-list" className="empty-list">
                            <h4 className="h4">등록된 상품이 없어요</h4>
                            <p className="h5-caption empty-cpation">최대 30개의 상품을 등록할 수 있어요.</p>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="artists-page-product">
                {content}
            </div>
        );
    }
}

export default ProductListPage;
