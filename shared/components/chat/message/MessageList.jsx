import "../scss/message.scss";
import React, { Component, PropTypes, createElement } from "react";
import classNames from "classnames";

import API from "forsnap-api";
import auth from "forsnap-authentication";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";

import PopModal from "shared/components/modal/PopModal";

import MessageLines from "./MessageLines";

const objMessage = {
    offset: 0,
    list: [],
    scrollTop: 0,
    isMore: true,
    unreadCount: 0
};

class MessageList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            talk: undefined,
            limit: 20,
            messages: undefined,
            messageList: {},
            keyId: props.userType === "A" ? "user_id" : "artist_id",
            desc: props.desc,
            isMore: false,
            files: [],
            uploadInfo: null,
            isUpload: false
        };

        this.onScroll = this.onScroll.bind(this);
        this.onCustomPaymentCancel = this.onCustomPaymentCancel.bind(this);

        this.getMessages = this.getMessages.bind(this);
        this.setMessageList = this.setMessageList.bind(this);

        this.initData = this.initData.bind(this);
        this.readMessage = this.readMessage.bind(this);
        this.scrollCheck = this.scrollCheck.bind(this);
        this.moveScroll = this.moveScroll.bind(this);
        this.moreMessage = this.moreMessage.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.addFileList = this.addFileList.bind(this);
        this.uploadProcess = this.uploadProcess.bind(this);
        this.checkUploadInfo = this.checkUploadInfo.bind(this);

        this.createMessages = this.createMessages.bind(this);
        this.onContactReg = this.onContactReg.bind(this);
    }

    componentWillMount() {
        this.props.interface({
            initData: this.initData,
            readMessage: this.readMessage,
            sendMessage: this.sendMessage,
            scrollCheck: this.scrollCheck,
            moveScroll: this.moveScroll,
            addFileList: this.addFileList
        });
    }

    componentDidMount() {
        this.getMessages(0, 30);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true;
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onContactReg() {
        if (typeof this.props.onContactReg === "function") {
            this.props.onContactReg();
        }
    }

    /**
     * 스크롤링하여 메세지 더보기 체크
     */
    onScroll() {
        const { talk, messages, keyId, desc, isMore, limit } = this.state;
        const container = this.container;

        if (container && messages && messages.isMore) {
            if (talk) {
                const currentId = talk[keyId];
                const currentNo = talk.product_no;
                const receiveId = this.state.talk[keyId];
                const productNo = this.state.talk.product_no;

                if (receiveId === currentId && productNo === currentNo) {
                    messages.scrollTop = container.scrollTop;
                }
            }

            const scroll = this.scrollCheck(!desc);
            if (scroll.isScroll && scroll.top !== scroll.bottom && !isMore) {
                if (!this.state.isMore && this.state.talk) {
                    if (this.state.isMount) {
                        this.setState({
                            isMore: true
                        }, () => {
                            setTimeout(() => {
                                this.moreMessage(messages.offset, limit);
                            }, 1000);
                        });
                    }
                }
            }
        }
    }

    onCustomPaymentCancel(talk_no) {
        PopModal.confirm("맞춤결제를 취소하시겠습니까?", () => {
            const { talk } = this.state;
            const user = auth.getUser();
            PopModal.progress();
            API.talks.updateCustomPaymentCancel(talk_no, { group_key: `${talk.user_id}:${user.id}:${talk.product_no}${talk.group_type === "OFFER" ? ":offer" : ""}` })
                .then(response => {
                    PopModal.closeProgress();
                    const data = response.data;
                    const content = JSON.parse(data.content);
                    const messages = this.state.messages;
                    const message = messages.list.find(m => m.message_no === data.no);

                    if (message) {
                        message.status = content.status || "";
                        this.setState({
                            renderLayout: this.createMessages()
                        });
                    }
                })
                .catch(error => {
                    PopModal.closeProgress();
                    PopModal.alert(error.data ? error.data : "맞춤결제 취소중 에러가 발생했습니다.\n잠시후 다시 시도해주세요.\n계속 에러가 발생하면 고객센터로 문의해주세요.");
                });
        });
    }

    /**
     * 대화내용 가져오기
     * @param offset - Number
     * @param limit - Number
     */
    getMessages(offset, limit) {
        const { talk, keyId } = this.state;

        if (talk) {
            const userType = this.props.userType;
            const groupType = talk.group_type;
            const receiveId = talk[keyId];
            const productNo = talk.product_no;
            let request;

            if (talk.group_type === "HELP") {
                request = API.talks.help(auth.getUser().id, offset, limit);
            } else if (talk.group_type === "HELP_OFFER") {
                request = API.talks.offer(auth.getUser().id, offset, limit);
            } else {
                request = API.talks.messages(receiveId, productNo, userType, groupType, offset, limit);
            }

            request.then(response => {
                // console.log("MESSAGES : ", response);
                if (response.status === 200) {
                    const data = response.data;
                    const currentToc = this.state.talk;

                    if (currentToc) {
                        const currentId = currentToc[keyId];
                        const currentNo = currentToc.product_no;

                        if (receiveId === currentId && productNo === currentNo) {
                            this.setMessageList(data.list, limit);
                        }
                    }
                }
            }).catch(error => {
                if (error.status && error.status === 400) {
                    PopModal.alert(error.data, { key: "get_messages_error" });
                }
            });
        }
    }

    /**
     * 메세지 리스트 합치기
     * @param list - Array (새로운 메세지)
     * @param count - Number (요청한 메세지 수)
     */
    setMessageList(list, count = "") {
        const { messages, limit, desc, isMore } = this.state;
        const length = messages.list.length;
        const mergeList = utils.mergeArrayTypeObject(messages.list, list, ["message_no"], ["reg_dt", "message_no"], desc);

        messages.offset += mergeList.count;
        messages.list = mergeList.list;
        messages.isMore = list.length === limit;

        const oldScroll = this.scrollCheck(desc);

        if (this.state.isMount) {
            this.setState({
                messages,
                renderLayout: this.createMessages(),
                isMore: false
            }, () => {
                setTimeout(() => {
                    if (count !== limit) {
                        if (oldScroll.isScroll) {
                            this.moveScroll();
                        }
                    } else if (length && length > 0) {
                        if (!desc) {
                            const scroll = this.scrollCheck(desc);
                            this.moveScroll((scroll.bottom - oldScroll.bottom) + scroll.top);
                        }
                    } else {
                        this.moveScroll();
                    }
                }, 600);
            });
        }
    }

    /**
     * 메시지 초기 셋팅
     * @param talk - Object
     */
    initData(data) {
        const { talk, messages, messageList, limit, desc, keyId } = this.state;
        const { userType } = this.props;
        const prop = {
            files: []
        };
        let callBack;

        if (talk) {
            const saveKey = `${talk.group_type}-${talk[keyId] || ""}-${talk.product_no || ""}`;
            messageList[saveKey] = Object.assign({}, messages);
            prop.messageList = messageList;
            prop.messages = undefined;
            prop.talk = undefined;
            prop.isMore = false;
        }

        if (data) {
            const loadKey = `${data.group_type}-${data[keyId] || ""}-${data.product_no || ""}`;
            const saveMessage = messageList[loadKey];
            const unreadCount = data[userType === "U" ? "artist_unread_cnt" : "user_unread_cnt"];

            if (saveMessage) {
                prop.messages = saveMessage;
            } else {
                prop.messages = Object.assign({}, objMessage);
            }

            const count = prop.messages.list.length > 0 ? prop.messages.list.length : limit;
            prop.messages.unreadCount = unreadCount;

            prop.talk = data;
            callBack = () => {
                if (this.state.isMount) {
                    this.setState({
                        renderLayout: this.createMessages()
                    }, () => {
                        this.getMessages(0, count);

                        if (count < 1) {
                            setTimeout(() => {
                                this.moveScroll();
                            }, 300);
                        }
                    });
                }
            };
        }

        if (this.state.isMount) {
            this.setState(prop, callBack);
        }
    }

    /**
     * 읽지않은 메시지 가져오기
     * @param data - Object (messageCount, unreadCount)
     */
    readMessage(data) {
        const { talk, messages, limit } = this.state;
        const { messageCount, unreadCount } = data;
        const props = {};

        if (talk) {
            if (messages) {
                messages.unreadCount = unreadCount || 0;
                props.messages = messages;
            }

            if (this.state.isMount) {
                this.setState(props, () => {
                    if (messages && messageCount > 0) {
                        this.getMessages(0, limit + messageCount);
                    } else {
                        this.setState({
                            renderLayout: this.createMessages()
                        });
                    }
                });
            }
        }
    }

    /**
     * 스크롤 위치 체크 (최상위 또는 최하위)
     * @params desc - bool (리스트 정렬 방식)
     * @params move - bool (스크롤 상태에 따라 스크롤을 변경할지 여부)
     * @return Object
     */
    scrollCheck(desc, move) {
        const container = this.container;
        const result = {
            isScroll: true,
            top: 0,
            bottom: 0
        };

        if (container) {
            const min = 75;
            const st = container.scrollTop;
            const sh = container.scrollHeight;
            const ch = container.offsetHeight;
            const bt = sh - ch;

            result.top = st;
            result.bottom = bt;

            if (desc) {
                result.isScroll = st < min;
            } else if (sh > ch) {
                result.isScroll = st > bt - min;
            }

            if (result.isScroll && move) {
                if (desc) {
                    this.moveScroll(0);
                } else {
                    this.moveScroll(bt);
                }
            }

            return result;
        }

        return result;
    }

    moveScroll(p) {
        const { desc } = this.state;
        const container = this.container;

        if (!container) {
            return;
        }

        if (p) {
            container.scrollTop = p;
        } else if (desc) {
            container.scrollTop = 0;
        } else {
            const scroll = this.scrollCheck(desc);
            container.scrollTop = scroll.bottom;
        }
    }

    /**
     * 메세지 더 가져오기
     */
    moreMessage(offset, limit) {
        this.getMessages(offset, limit);
    }

    /**
     * 메세지 보내기
     */
    sendMessage(msg) {
        return new Promise((resolve, reject) => {
            const { talk, isSend, keyId, desc } = this.state;
            const userType = this.props.userType;
            const receiveId = talk[keyId];

            if (msg.replace(/\s/g, "") === "") {
                PopModal.toast("보낼 메세지를 입력해주세요.");
                resolve({ result: false });
            } else {
                let request;

                if (talk.group_type === "HELP") {
                    request = API.talks.question(auth.getUser().id, { content: msg });
                } else if (talk.group_type === "HELP_OFFER") {
                    request = API.talks.sendOffer(auth.getUser().id, { content: msg });
                } else {
                    request = API.talks.send(receiveId, talk.product_no, userType, talk.group_type, msg);
                }

                request.then(response => {
                    // console.log("SEND MESSAGE : ", response);
                    if (response.status === 200) {
                        const data = response.data;
                        const messages = this.state.messages;

                        if (talk.group_type !== "HELP") {
                            messages.unreadCount += 1;
                        }

                        if (this.state.isMount) {
                            this.setState({
                                messages
                            }, () => {
                                this.moveScroll();
                                this.setMessageList(data.list);
                                resolve({ result: true });
                            });
                        }
                    }

                    resolve({ result: false, response });
                }).catch(error => {
                    reject({ result: false, error });
                });
            }
        });
    }

    // 파일업로드 파일 추가
    addFileList(files) {
        if (files && files instanceof FileList && files.length > 0) {
            const { talk, keyId } = this.state;
            const { userType } = this.props;
            let isExt = false;
            let count = 0;
            const messages = [];
            const user = auth.getUser();
            const date = mewtime();
            const timestamp = date.valueOf();

            for (let i = 0; i < files.length; i += 1) {
                const file = files.item(i);
                const ext = utils.fileExtension(file.name);

                if ((/(jpg|jpeg|png|bmp|pdf)$/i).test(ext)) {
                    const no = `${timestamp + i}-upload`;
                    const type = "TEMP_UPLOAD";
                    this.state.files.push({
                        file,
                        receiveId: talk[keyId],
                        no: talk.product_no,
                        userType,
                        groupType: talk.group_type,
                        message_type: type,
                        message_no: no
                    });

                    messages.push({
                        user_id: user.id,
                        unread_count: 1,
                        reg_dt: date.format("YYYY-MM-DD H:m:s"),
                        message_type: type,
                        content: `업로드중입니다\n${file.name}`,
                        message_no: no,
                        file_name: file.name,
                        file_path: file.path
                    });

                    count += 1;
                } else {
                    isExt = true;
                }
            }

            if (isExt) {
                PopModal.toast("파일 업로드는\nJPG, JPEG, PNG, BMP 확장자만 가능합니다.");
            }

            this.setMessageList(messages);
            if (!this.state.isUpload) {
                if (count > 0) {
                    if (this.state.isMount) {
                        this.setState({
                            isUpload: true
                        }, () => {
                            this.uploadProcess();
                        });
                    }
                }
            }
        }
    }

    // 이미지 업로드 처리
    uploadProcess() {
        const files = this.state.files;
        const isUpload = this.state.isUpload;

        if (files && Array.isArray(files) && files.length > 0 && isUpload) {
            const item = files[0];
            const file = item.file;

            this.checkUploadInfo().then(isUploadInfo => {
                if (isUploadInfo) {
                    const { uploadInfo } = this.state;
                    const form = new FormData();
                    const uploadKey = `${uploadInfo.key}${utils.uniqId()}.${utils.fileExtension(file.name)}`;

                    form.append("key", uploadKey);
                    form.append("acl", uploadInfo.acl);
                    form.append("policy", uploadInfo.policy);
                    form.append("X-Amz-Credential", uploadInfo["X-Amz-Credential"]);
                    form.append("X-Amz-Algorithm", uploadInfo["X-Amz-Algorithm"]);
                    form.append("X-Amz-Date", uploadInfo["X-Amz-Date"]);
                    form.append("X-Amz-Signature", uploadInfo["X-Amz-Signature"]);
                    form.append("file", file);

                    API.common.uploadS3(uploadInfo.action, form)
                        .then(res => {
                            let request;

                            if (item.groupType === "HELP") {
                                request = API.talks.question(auth.getUser().id, { content: "", s3_key: uploadKey, file_name: file.name });
                            } else {
                                request = API.talks.send(item.receiveId, item.no, item.userType, item.groupType, "", uploadKey, file.name);
                            }

                            request.then(response => {
                                if (response.status === 200) {
                                    const { talk, keyId } = this.state;
                                    const data = response.data;

                                    if (talk
                                        && item.groupType === talk.group_type
                                        && ((item.receiveId === talk[keyId]
                                            && item.no === talk.product_no)
                                            || talk.group_type === "HELP"
                                        )) {
                                        this.state.messages.list = this.state.messages.list.reduce((r, m) => {
                                            if (m.message_type === item.message_type && m.message_no === item.message_no) {
                                                this.state.messages.unreadCount += 1;
                                                return r;
                                            }

                                            r.push(m);
                                            return r;
                                        }, []);

                                        this.setMessageList(data.list);
                                        this.state.files.shift();
                                    } else {
                                        const saveKey = `${item.groupType}-${item.receiveId || ""}-${item.no || ""}`;
                                        const messages = this.state.messageList[saveKey];
                                        this.state.messageList[saveKey] = messages.list.reduce((r, m) => {
                                            if (m.message_type === item.message_type && m.message_no === item.message_no) {
                                                messages.unreadCount += 1;
                                                return r;
                                            }

                                            r.push(m);
                                            return r;
                                        }, []);

                                        this.state.files.shift();
                                    }

                                    this.uploadProcess();
                                }
                            })
                            .catch(error => {
                                PopModal.alert(error.data, { key: "upload-photo-error" });
                                const index = this.state.messages.list.findIndex(m => {
                                    return m.message_type === item.message_type && m.message_no === item.message_no;
                                });
                                this.state.messages.list.splice(index, 1);
                                this.state.files.shift();
                                this.uploadProcess();
                            });
                        })
                        .catch(error => {
                            PopModal.alert("이미지 업로드중 에러가 발생했습니다.\n잠시후 다시 시도해주세요.\n계속 에러가 발생하면 고객센터로 문의해주세요.");
                            const index = this.state.messages.list.findIndex(m => {
                                return m.message_type === item.message_type && m.message_no === item.message_no;
                            });
                            this.state.messages.list.splice(index, 1);
                            this.state.files.shift();
                            this.uploadProcess();
                        });
                }
            }).catch(error => {
                PopModal.alert("업로드 준비중 에러가 발생했습니다.\n잠시후 다시 시도해주세요.\n계속 에러가 발생하면 고객센터로 문의해주세요.");
            });
        } else {
            this.state.isUpload = false;
        }
    }

    checkUploadInfo() {
        return new Promise((resolve, reject) => {
            const { uploadInfo } = this.state;
            const user = auth.getUser();
            let isUpdate = true;

            if (user) {
                if (uploadInfo && uploadInfo.expire) {
                    isUpdate = uploadInfo.expire < Date.now();
                }

                if (isUpdate) {
                    API.talks.uploadInfo(user.id).then(response => {
                        if (response.status === 200) {
                            const data = response.data;
                            this.state.uploadInfo = data.upload_info;
                            this.state.uploadInfo.expire = mewtime().add(45, mewtime.const.MINUTE).valueOf();
                            resolve(true);
                        }

                        reject(response);
                    }).catch(error => {
                        reject(error);
                    });
                } else {
                    resolve(true);
                }
            } else {
                reject();
            }
        });
    }

    // 메세지 리스트 만들기
    createMessages() {
        const { talk, messages, desc, isMore } = this.state;
        const { userType, onPayment } = this.props;
        const child = [];
        const user = auth.getUser();

        if (messages) {
            const list = messages.list;
            const length = list.length;
            const nextDate = mewtime();
            const curDate = mewtime();
            let data = [];
            let isPrint = false;

            for (let i = 0; i < length; i += 1) {
                const nextMesage = list[i + 1];
                const message = list[i];
                const count = desc ? i + 1 : length - i;

                if (count <= messages.unreadCount) {
                    if (message.user_id === user.id) {
                        message.unreadCount = 1;
                    } else {
                        message.unreadCount = 0;
                    }
                } else {
                    message.unreadCount = 0;
                }

                data.push(message);

                if (nextMesage) {
                    nextDate.setTime(nextMesage.reg_dt);
                    curDate.setTime(message.reg_dt);

                    if (message.user_id === "SYSTEM"
                        || message.user_id !== nextMesage.user_id
                        || nextDate.format("YYYYMMDDHHmm") !== curDate.format("YYYYMMDDHHmm")
                        || message.message_type === "OFFER_PAY"
                        || message.message_type === "PRODUCT_PAY"
                    ) {
                        isPrint = true;
                    }
                } else {
                    isPrint = true;
                }

                if (isPrint) {
                    isPrint = false;
                    const target = data[0];

                    child.push(
                        <MessageLines
                            key={`messages-lines-${target.message_no}`}
                            userId={user.id}
                            messages={data}
                            groupType={talk.group_type}
                            artist_nick_name={talk.nick_name}
                            desc={desc}
                            userType={userType}
                            onPayment={onPayment}
                            onCustomPaymentCancel={this.onCustomPaymentCancel}
                            onContactReg={this.onContactReg}
                        />);
                    data = [];
                }
            }

            const moreProgress = (
                <div className={classNames("message__list__more", desc ? "desc" : "asc", isMore ? "active" : "")} key="message-list-more">
                    <div className="message__list__more__progress">
                        <div className="progress-bar" />
                    </div>
                </div>
            );

            if (desc) {
                child.push(moreProgress);
            } else {
                child.unshift(moreProgress);
            }
        }

        return child;
    }

    render() {
        const { renderLayout } = this.state;

        return (
            <div
                className="chat__message__list"
                ref={ref => (this.container = ref)}
                onScroll={this.onScroll}
            >
                {renderLayout}
            </div>
        );
    }
}

MessageList.propTypes = {
    userType: PropTypes.oneOf(["U", "A"]).isRequired,
    desc: PropTypes.bool,
    interface: PropTypes.func.isRequired,
    onPayment: PropTypes.func
};

MessageList.defaultProps = {
    desc: false
};

export default MessageList;
