import "../scss/toc.scss";
import React, { Component, PropTypes } from "react";

import API from "forsnap-api";
import utils from "forsnap-utils";
import auth from "forsnap-authentication";

import PopModal from "shared/components/modal/PopModal";

import TocItem from "./TocItem";

class TocList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            toc: {
                list: [],
                limit: 100
            },
            user: auth.getUser(),
            userType: props.userType,
            keyId: props.userType === "A" ? "user_id" : "artist_id",
            selectItem: undefined,
            userId: props.userId,
            productNo: props.productNo,
            offerNo: props.offerNo,
            keyword: "",
            intervalId: undefined
        };

        this.onSearch = this.onSearch.bind(this);
        this.onSelectItem = this.onSelectItem.bind(this);
        this.onPopState = this.onPopState.bind(this);
        this.onPushState = this.onPushState.bind(this);

        this.getTocList = this.getTocList.bind(this);
        this.deselectToc = this.deselectToc.bind(this);
        this.deleteTalk = this.deleteTalk.bind(this);
    }

    componentWillMount() {
        const { toc } = this.state;
        this.state.intervalId = setInterval(() => this.getTocList(0, toc.list.length), 3000);
        window.addEventListener("popstate", this.onPopState, false);

        this.props.interface({
            deselectToc: this.deselectToc,
            onSearch: this.onSearch
        });
    }

    componentDidMount() {
        const { toc } = this.state;
        this.getTocList(0, toc.limit);
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalId);
        window.removeEventListener("popstate", this.onPopState, false);
    }

    /**
     * 대화목록 선택
     * @param data - Object (대화목록 아이템 데이터)
     */
    onSelectItem(data) {
        if (data) {
            const { selectItem, keyId, userId, productNo, offerNo } = this.state;
            const onSelect = this.props.onSelect;
            const prop = {
                productNo: undefined,
                offerNo: undefined,
                selectItem: data
            };

            if (["help", "collabo", "help_offer"].indexOf(data.group_type.toLowerCase()) !== -1) {
                prop.userId = data.group_type.toLowerCase();
            } else if (["offer"].indexOf(data.group_type.toLowerCase()) !== -1) {
                prop.userId = data[keyId];
                prop.offerNo = data.product_no;
            } else {
                prop.userId = data[keyId];
                prop.productNo = data.product_no;
            }

            this.setState(prop, () => {
                if (typeof this.props.getIsGuestUser === "function") {
                    this.props.getIsGuestUser(this.getUserType());
                }
                if (typeof onSelect === "function") {
                    onSelect(data);
                    this.onPushState();
                }
            });
        }
    }

    getUserType() {
        return this.state.selectItem.user_type || "";
    }

    onSearch(keyword) {
        this.setState({
            keyword
        });
    }

    onPopState() {
        if (typeof this.props.onSelect === "function") {
            this.state.selectItem = null;
            this.state.userId = null;
            this.state.productNo = null;
            this.state.offerNo = null;
            this.props.onSelect(null);
        }
    }

    onPushState() {
        const isMobile = utils.agent.isMobile();
        if (isMobile) {
            if (window.history) {
                window.history.pushState(null, null, document.location.pathname);
            }
        }
    }

    // API 대화 목록 가져오기
    getTocList(offset, limit) {
        const { toc, keyId, userType, user } = this.state;

        if (userType === "A" && (user && user.data && !user.data.is_artist)) {
            PopModal.alert("작가 등록 후 이용해주세요.",
                {
                    key: "artists_chat_error_isArtist",
                    callBack: () => {
                        location.href = `${__DESKTOP__}/users/registartist`;
                    }
                });
        } else {
            API.talks.list(userType, offset, limit)
                .then(response => {
                    if (response.status === 200) {
                        const data = response.data;
                        let item;

                        if (data && Array.isArray(data.list)) {
                            const list = data.list;
                            const merge = utils.mergeArrayTypeObject(toc.list, list, [keyId, "group_type", "product_no"], ["talk_dt", "talk_no"], true);
                            const { userId, productNo, offerNo } = this.state;

                            if (userId || productNo || offerNo) {
                                item = merge.list.find(obj => {
                                    if (userId && productNo) {
                                        return obj[keyId] === userId && obj.group_type === "PRODUCT" && obj.product_no === productNo;
                                    } else if (userId && offerNo) {
                                        return obj[keyId] === userId && obj.group_type === "OFFER" && obj.product_no === offerNo;
                                    } else if (["help", "collabo", "help_offer"].indexOf(userId) !== -1) {
                                        return obj.group_type === userId.toUpperCase();
                                    }

                                    return false;
                                });

                                if (item) {
                                    const messageCount = !item || !item.unread_cnt || isNaN(item.unread_cnt) ? 0 : parseInt(item.unread_cnt, 10);
                                    const unreadCount = item[userType === "U" ? "artist_unread_cnt" : "user_unread_cnt"] * 1;
                                    item.unread_cnt = 0;

                                    if (typeof this.props.onUpdate === "function") {
                                        this.props.onUpdate({ talk: item, messageCount, unreadCount, phone_send_block_dt: data.phone_send_block_dt });
                                    }
                                }
                            }

                            if (toc.list.length === 0 && item) {
                                this.onSelectItem(item);
                            }

                            toc.list = merge.list;

                            if (!this._calledComponentWillUnmount) {
                                this.setState({
                                    toc
                                });
                            }
                        }
                    }
                })
                .catch(error => {
                    if (!(error instanceof Error)) {
                        PopModal.alert(error.data, { key: "get_toc_list" });
                    }
                });
        }
    }

    /**
     * 선택된 대화목록 해제
     */
    deselectToc() {
        this.setState({
            userId: null,
            productNo: null,
            offerNo: null
        });
    }

    deleteTalk(talk) {
        const { group_type, group_no } = talk;

        if (group_type && ["HELP", "HELP_OFFER"].indexOf(group_type) === -1 && group_no) {
            PopModal.confirm("대화방을 삭제하시겠습니까?", () => {
                API.talks.deleteTalk(group_no).then(response => {
                    if (response.status === 200) {
                        const { toc } = this.state;
                        const length = toc.list.length;

                        const index = toc.list.findIndex(t => {
                            return t.group_no === group_no;
                        });

                        if (index !== -1) {
                            toc.list.splice(index, 1);
                        }

                        this.setState({
                            toc
                        }, () => {
                            PopModal.toast("대화방이 삭제되었습니다");
                            this.getTocList(0, length > 1 ? length - 1 : 0);
                        });
                    }
                });
            }, null, "center", { key: "chat-delete", titleOk: "삭제" });
        }
    }

    // 대화 목록 생성
    createToc() {
        const { toc, keyId, userId, productNo, offerNo, keyword } = this.state;
        const pattern = new RegExp(keyword);

        return (
            toc.list.map((obj, i) => {
                let active = false;

                if (userId && productNo) {
                    active = obj[keyId] === userId && obj.group_type === "PRODUCT" && obj.product_no === productNo;
                } else if (userId && offerNo) {
                    active = obj[keyId] === userId && obj.group_type === "OFFER" && obj.product_no === offerNo;
                } else if (["help", "collabo", "help_offer"].indexOf(userId) !== -1) {
                    active = obj.group_type === userId.toUpperCase();
                }

                if (active) {
                    obj.unread_cnt = 0;
                }

                if (keyword) {
                    let match = false;

                    if (obj.group_type.toLowerCase() === "help"
                        || obj.group_type.toLowerCase() === "help_offer"
                        || (obj.title && pattern.test(obj.title.toLowerCase()))
                        || (obj.nick_name && pattern.test(obj.nick_name.toLowerCase()))
                    ) {
                        match = true;
                    }

                    if (!match) {
                        return null;
                    }
                }

                return [<TocItem data={obj} IFToc={{ onSelect: this.onSelectItem, onDelete: this.deleteTalk }} active={active} />];
            })
        );
    }

    render() {
        return (
            <div className="chat__toc__list">
                {this.createToc()}
            </div>
        );
    }
}

TocList.propTypes = {
    userType: PropTypes.oneOf(["U", "A"]).isRequired,
    onSelect: PropTypes.func,
    onUpdate: PropTypes.func,
    userId: PropTypes.string,
    productNo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    offerNo: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    interface: PropTypes.func.isRequired
};

export default TocList;
