import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import api from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Img from "shared/components/image/Img";
import TextArea from "shared/components/ui/textarea/TextArea";
import CheckBox from "shared/components/ui/checkbox/CheckBox";

import Heart from "mobile/resources/components/heart/Heart";

class ReviewModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            data: [],
            list: [],
            limit: 15,
            total: 0,
            user_type: "U",
            comment: "",
            kind: 0,
            quality: 0,
            service: 0,
            price: 0,
            talk: 0,
            trust: 0,
            photo_no: [],
            agree: false
        };

        this.onConfirm = this.onConfirm.bind(this);
        this.onMore = this.onMore.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onAgree = this.onAgree.bind(this);

        this.more = this.more.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { buy_no, product_no } = this.props;
        const { user_type } = this.state;
        api.reservations.reservePhotosCustom(buy_no, product_no, user_type, 0, 9999)
            .then(response => {
                const data = response.data;
                this.setStateData(() => {
                    return {
                        data: data.list,
                        list: this.more(data.list, 0),
                        total: data.custom_count
                    };
                });
            })
            .catch(error => {
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onConfirm() {
        const { buy_no, product_no, onConfirm } = this.props;
        const { comment, kind, quality, service, price, talk, trust, photo_no, agree } = this.state;
        let message = "";

        if (!comment.replace(/\s/g, "")) {
            message = "후기를 작성해주세요.";
        } else if (comment.length < 10) {
            message = "후기는 최소 10자 이상 입력해주세요.";
        } else if (kind > 5 || kind < 0.5) {
            message = "친절 점수를 선택해주세요.";
        } else if (quality > 5 || quality < 0.5) {
            message = "품질 점수를 선택해주세요.";
        } else if (service > 5 || service < 0.5) {
            message = "서비스 점수를 선택해주세요.";
        } else if (price > 5 || price < 0.5) {
            message = "가격 점수를 선택해주세요.";
        } else if (talk > 5 || talk < 0.5) {
            message = "소통 점수를 선택해주세요.";
        } else if (trust > 5 || trust < 0.5) {
            message = "신뢰 점수를 선택해주세요.";
        } else if (!agree) {
            message = "개인정보 수집 및 이용에 동의해주세요.";
        }

        if (message) {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: utils.linebreak(message)
            });
        } else {
            const params = {
                buy_no,
                comment,
                kind,
                quality,
                service,
                price,
                talk,
                trust,
                photo_no: photo_no.join(",")
            };

            if (typeof onConfirm === "function") {
                onConfirm(product_no, params);
            }
        }
    }

    onMore() {
        const { data } = this.state;
        this.setStateData(({ list }) => {
            return {
                list: list.concat(this.more(data, list.length))
            };
        });
    }

    onSelect(no) {
        this.setStateData(state => {
            const list = state.photo_no;
            const index = list.findIndex(o => o === no);

            if (index > -1) {
                list.splice(index, 1);
            } else if (list.length < 3) {
                list.push(no);
            } else {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "사진은 3개까지 선택이 가능합니다."
                });
            }

            return {
                photo_no: list
            };
        });
    }

    onAgree(b) {
        this.setStateData(() => {
            return {
                agree: b
            };
        });
    }

    more(data, offset) {
        const { limit } = this.state;
        const more = [];
        for (let i = offset; i < (offset + limit); i += 1) {
            const item = data[i];
            if (item) {
                more.push(Object.assign({}, item));
            }
        }

        return more;
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { onClose } = this.props;
        const { comment, kind, quality, service, price, talk, trust, list, total, photo_no, agree } = this.state;

        return (
            <div className="progress__review__modal">
                <div className="review__container">
                    <div className="review__header">
                        <div className="title">당신의 후기를 추가해 주세요.</div>
                        <div className="description">마음에 드는 사진과 후기를 등록해 주세요.</div>
                    </div>
                    <div className="review__image__list">
                        <div className="image__list">
                            {list.map(o => {
                                const checked = photo_no.findIndex(n => n === o.photo_no);

                                return (
                                    <div key={`photo_${o.photo_no}`} className={classNames("list__item", { checked: checked > -1 })} onClick={() => this.onSelect(o.photo_no)}>
                                        <div data-index={checked + 1}>
                                            <Img image={{ src: `/${o.thumb_key}`, type: "private", content_width: 360, content_height: 360 }} isCrop={false} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {utils.isArray(list) && list.length < total ?
                            <div className="image__more">
                                <button className="_button _button__default" onClick={this.onMore}>이미지 더보기</button>
                            </div> : null
                        }
                    </div>
                    <div className="review__content">
                        <TextArea
                            value={comment}
                            name="comment"
                            placeholder="후기를 작성해주세요."
                            rows="8"
                            onChange={(e, n, v) => this.setState({ [n]: v })}
                        />
                    </div>
                    <div className="review__score">
                        <div className="score__item">
                            <div className="title">친절</div>
                            <div className="heart"><Heart total="5" score={kind} disable={false} onSelect={value => this.setState({ kind: value })} /></div>
                        </div>
                        <div className="score__item">
                            <div className="title">품질</div>
                            <div className="heart"><Heart total="5" score={quality} disable={false} onSelect={value => this.setState({ quality: value })} /></div>
                        </div>
                        <div className="score__item">
                            <div className="title">서비스</div>
                            <div className="heart"><Heart total="5" score={service} disable={false} onSelect={value => this.setState({ service: value })} /></div>
                        </div>
                        <div className="score__item">
                            <div className="title">가격</div>
                            <div className="heart"><Heart total="5" score={price} disable={false} onSelect={value => this.setState({ price: value })} /></div>
                        </div>
                        <div className="score__item">
                            <div className="title">소통</div>
                            <div className="heart"><Heart total="5" score={talk} disable={false} onSelect={value => this.setState({ talk: value })} /></div>
                        </div>
                        <div className="score__item">
                            <div className="title">신뢰</div>
                            <div className="heart"><Heart total="5" score={trust} disable={false} onSelect={value => this.setState({ trust: value })} /></div>
                        </div>
                    </div>
                    <div className="review__agree">
                        <div className="title">[개인정보 수집 및 이용동의]</div>
                        <div className="agree"><CheckBox checked={agree} onChange={this.onAgree}>동의합니다.</CheckBox></div>
                    </div>
                </div>
                <div className="review__buttons">
                    <button className="review__cancel" onClick={onClose}>취소</button>
                    <button className="review__confirm" onClick={this.onConfirm}>확인</button>
                </div>
            </div>
        );
    }
}

ReviewModal.propTypes = {
    buy_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    product_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onConfirm: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};

export default ReviewModal;
