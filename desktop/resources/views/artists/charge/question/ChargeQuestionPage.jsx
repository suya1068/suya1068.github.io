import "./ChargeQuestionPage.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import api from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Img from "shared/components/image/Img";
import {
    PROPERTYS,
    SHOT_KIND_PROPERTY,
    NUKKI_KIND_PROPERTY,
    PLACE_PROPERTY,
    SIZE_PROPERTY,
    MATERIAL_PROPERTY,
    DIRECTING_PROPERTY,
    PROXY_DIRECTING_PROPERTY
} from "shared/constant/virtual_estimate_property.const";

import Pagelist from "desktop/resources/components/table/Pagelist";

import ChangeStatusModal from "./modal/ChangeStatusModal";

class ChargeQuestionPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            list: [],
            offset: 0,
            limit: 7,
            total: 0,
            page: 1,
            user: auth.getUser(),
            select: null
        };

        this.onPage = this.onPage.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onChangeStatus = this.onChangeStatus.bind(this);

        this.getQuestionList = this.getQuestionList.bind(this);
        this.setStateData = this.setStateData.bind(this);
        this.createContent = this.createContent.bind(this);
        this.createPhone = this.createPhone.bind(this);
    }

    componentDidMount() {
        this.getQuestionList();
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onPage(page, offset) {
        this.getQuestionList(offset)
            .then(data => {
                this.setStateData(() => {
                    return {
                        page,
                        offset
                    };
                });
            });
    }

    onSelect(no) {
        const { select } = this.state;
        this.setStateData(() => {
            return {
                select: select === no ? null : no
            };
        });
    }

    onChangeStatus(no, reception_type) {
        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            content: (
                <ChangeStatusModal
                    close={() => Modal.close()}
                    confirm={() => {
                        const { user } = this.state;
                        Modal.show({
                            type: MODAL_TYPE.PROGRESS
                        });
                        api.artists.updateQuestionStatus(user.id, no, { reception_type })
                            .then(response => {
                                Modal.close(MODAL_TYPE.PROGRESS);
                                Modal.close();
                                this.getQuestionList();
                            })
                            .catch(error => {
                                Modal.close(MODAL_TYPE.PROGRESS);
                                if (error && error.data) {
                                    Modal.show({
                                        type: MODAL_TYPE.ALERT,
                                        content: utils.linebreak(error.data)
                                    });
                                }
                            });
                    }}
                />
            )
        });
    }

    getQuestionList(offset = this.state.offset) {
        const { user, limit } = this.state;
        Modal.show({
            type: MODAL_TYPE.PROGRESS
        });
        return api.artists.fetchAllQuestion(user.id, { offset, limit })
            .then(response => {
                Modal.close(MODAL_TYPE.PROGRESS);
                return response.data;
            })
            .then(data => {
                this.setStateData(() => {
                    return {
                        list: data.list,
                        total: data.total_cnt
                    };
                });
                return data;
            })
            .catch(error => {
                Modal.close(MODAL_TYPE.PROGRESS);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    createContent(content, portfolio_info, selected) {
        if (!content && !portfolio_info) {
            return <div className="content">고객님께서 선택하신 견적내용이 없습니다.</div>;
        }

        let info = null;

        if (content && typeof content === "object") {
            info = Object.keys(content).reduce((r, key) => {
                let value = isNaN(content[key]) && typeof content[key] === "string" ? content[key].toUpperCase() : content[key];
                const property = PROPERTYS[key.toUpperCase()];
                if (property && value) {
                    switch (key) {
                        case "shot_kind": {
                            const shot_kind = SHOT_KIND_PROPERTY[value];
                            if (shot_kind) {
                                value = shot_kind.NAME;
                            }
                            break;
                        }
                        case "nukki_kind": {
                            const nukki_kind = NUKKI_KIND_PROPERTY[value];
                            if (nukki_kind) {
                                value = nukki_kind.NAME;
                            }
                            break;
                        }
                        case "place": {
                            const place = PLACE_PROPERTY[value];
                            if (place) {
                                value = place.NAME;
                            }
                            break;
                        }
                        case "size": {
                            const size = SIZE_PROPERTY[value];
                            if (size) {
                                value = size.NAME;
                            }
                            break;
                        }
                        case "material": {
                            const material = MATERIAL_PROPERTY[value];
                            if (material) {
                                value = material.NAME;
                            }
                            break;
                        }
                        case "directing_kind": {
                            const directing_kind = DIRECTING_PROPERTY[value];
                            if (directing_kind) {
                                value = directing_kind.NAME;
                            }
                            break;
                        }
                        case "proxy_directing_kind": {
                            const proxy_directing_kind = PROXY_DIRECTING_PROPERTY[value];
                            if (proxy_directing_kind) {
                                value = proxy_directing_kind.NAME;
                            }
                            break;
                        }
                        default:
                            break;
                    }

                    r.push({
                        code: key,
                        name: property.NAME,
                        value
                    });
                }

                return r;
            }, []);
        }

        if (selected) {
            return (
                <div className={classNames("content", { selected })}>
                    <div className="info">
                        {info ?
                            info.map(o => {
                                return <p key={o.code} className={o.code === "total_price" ? "price" : ""}>{o.name} : {o.value}</p>;
                            }) : content
                        }
                        {portfolio_info ?
                            <div>
                                <p>*고객님께서 컨셉이미지를 선택하셨습니다.</p>
                                <div className="portfolio">
                                    <Img key="portfolio_img" image={{ src: `/${portfolio_info.file_path}`, type: "private" }} />
                                </div>
                            </div> : null
                        }
                    </div>
                    {typeof content === "string" && content.length < 20 ?
                        null :
                        <div className="toggle">
                            <img alt="d" src={`${__SERVER__.img}/common/icon/circle_${selected ? "ut" : "dt"}.png`} width="18" />
                        </div>
                    }
                </div>
            );
        }

        return (
            <div className={classNames("content", { selected })}>
                <div className="info">
                    {info ?
                        info.map(o => {
                            return `${o.name} : ${o.value}`;
                        }).join(" / ") : content
                    }
                    {portfolio_info ?
                        "*고객님께서 컨셉이미지를 선택하셨습니다." : null
                    }
                </div>
                {typeof content === "string" && content.length < 20 ?
                    null :
                    <div className="toggle">
                        <img alt="d" src={`${__SERVER__.img}/common/icon/circle_${selected ? "ut" : "dt"}.png`} width="18" />
                    </div>
                }
            </div>
        );
    }

    createPhone(phone) {
        return `${phone.substr(0, 3)}-${phone.substr(3, 4)}-${phone.substr(7, 4)}`;
    }

    render() {
        const { list, offset, limit, page, total, select } = this.state;

        return (
            <div className="charge__question__page">
                <div className="question__header">
                    <div className="title">문의접수</div>
                    <div className="description">포스냅 광고를 통해 접수된 문의를 확인하실 수 있습니다.</div>
                </div>
                <div className="question__container">
                    <div className="question__title">문의접수 현황</div>
                    <div className="question__list">
                        <table className="table">
                            <colgroup>
                                <col width="70" />
                                <col width="95" />
                                <col />
                                <col width="130" />
                                <col width="300" />
                                <col width="110" />
                                <col width="140" />
                            </colgroup>
                            <thead>
                                <tr>
                                    <th>번호</th>
                                    <th>카테고리</th>
                                    <th>고객이름</th>
                                    <th>연락처</th>
                                    <th>견적 내용</th>
                                    <th>접수일자</th>
                                    <th>진행상황</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Array.isArray(list) && list.length ?
                                    list.map((o, i) => {
                                        return (
                                            <tr key={o.no} onClick={() => this.onSelect(o.no)}>
                                                <td>{(total - offset) - i}</td>
                                                <td>{o.category_name}</td>
                                                <td>{o.user_name}</td>
                                                <td>{o.user_phone.includes("*") ? o.user_phone : this.createPhone(o.user_phone)}</td>
                                                <td>{this.createContent(o.content, o.portfolio_info, o.no === select)}</td>
                                                <td>{o.reg_dt ? o.reg_dt.substr(0, 10) : "-"}</td>
                                                <td>
                                                    {o.complete_dt ?
                                                        <span className="complete">촬영완료</span> :
                                                        <div>
                                                            대기중
                                                            <button className="btn_complete" onClick={() => this.onChangeStatus(o.no, o.reception_type)}>촬영완료</button>
                                                        </div>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    }) :
                                    <tr>
                                        <td colSpan="7">
                                            <div className="empty_row">
                                                <img className="exclamation" alt="!" src={`${__SERVER__.img}/common/icon/icon_exclamation.png`} width="20" />
                                                <span>포스냅 광고 진행 시 더 많은 고객님들의 문의를 받으실 수 있습니다.</span>
                                            </div>
                                        </td>
                                    </tr>
                                }
                            </tbody>
                        </table>
                        <div>
                            <Pagelist
                                page={page}
                                totalCount={total}
                                listCount={limit}
                                pageCount="10"
                                callBack={this.onPage}
                                render={value => utils.fillSpace(value, 2)}
                                renderLt={click => <img className="page__lt" onClick={click} alt="l" src={`${__SERVER__.img}/common/icon/arrow_lt.png`} width="7" />}
                                renderGt={click => <img className="page__gt" onClick={click} alt="r" src={`${__SERVER__.img}/common/icon/arrow_gt.png`} width="7" />}
                            />
                        </div>
                    </div>
                </div>
                <div className="question__container">
                    <div className="question__title">안내사항</div>
                    <div className="question__info">
                        <p>- 접수된 고객명과 연락처는 접수일로부터 30일 후 비노출 처리됩니다.</p>
                        <p>- 촬영완료 상태로 변경하시면 고객님께 감사문자가 전달되며, 자동후기가 등록됩니다.</p>
                    </div>
                </div>
            </div>
        );
    }
}

export default ChargeQuestionPage;
