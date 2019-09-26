import "./RegistVideo.scss";
import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

import Regular from "shared/constant/regular.const";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import Input from "shared/components/ui/input/Input";

class RegistVideo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            list: props.data || []
        };

        this.onPreview = this.onPreview.bind(this);
        this.onAddVideo = this.onAddVideo.bind(this);
        this.onRemoveVideo = this.onRemoveVideo.bind(this);
        this.onChangeVideoUrl = this.onChangeVideoUrl.bind(this);
        this.onCheckVideoUrl = this.onCheckVideoUrl.bind(this);

        this.validate = this.validate.bind(this);
        this.validateVideo = this.validateVideo.bind(this);
        this.validVideoUrl = this.validVideoUrl.bind(this);
        this.layoutVideoList = this.layoutVideoList.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(np) {
    }

    onPreview(url) {
        const valid = this.validVideoUrl(url);

        if (valid) {
            if (url) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: (
                        <iframe
                            src={url}
                            width="800"
                            height="450"
                            frameBorder="0"
                            allowFullScreen
                        />
                    )
                });
            }
        } else {
            Modal.show({
                type: MODAL_TYPE.ALERT,
                content: "Youtube, vimeo 동영상 주소만 가능합니다."
            });
        }
    }

    onAddVideo() {
        this.setState(state => {
            const length = state.list.length;
            state.list.push({ key: Date.now(), display_order: length, portfolio_video: "" });
            return {
                list: state.list
            };
        });
    }

    onRemoveVideo(index) {
        this.setState(state => {
            state.list.splice(index, 1);
            return {
                list: state.list
            };
        });
    }

    onChangeVideoUrl(index, url) {
        this.setState(state => {
            if (state.list[index]) {
                state.list[index].portfolio_video = url;

                return {
                    list: state.list
                };
            }

            return null;
        });
    }

    onCheckVideoUrl(n, v) {
        if (this.validVideoUrl(v)) {
            const type = v.match(/(vimeo|youtube|youtu)/);
            const key = v.replace(Regular.VIDEO_URL_REPLACE, "");
            let url = "";

            if (utils.isArray(type)) {
                switch (type[0].toLowerCase()) {
                    case "youtu":
                    case "youtube":
                        url = `https://www.youtube.com/embed/${key}`;
                        break;
                    case "vimeo":
                        url = `https://player.vimeo.com/video/${key}`;
                        break;
                    default:
                        break;
                }
            }

            const list = this.state.list;
            const count = list.reduce((r, o) => {
                if (o.portfolio_video === url) {
                    r += 1;
                }

                return r;
            }, 0);

            if (count > 1) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: "중복된 동영상 주소입니다."
                });
                this.onChangeVideoUrl(n, "");
            } else if (isNaN(n)) {
                this.setState({
                    [n]: url
                });
            } else {
                this.onChangeVideoUrl(n, url);
            }
        } else {
            return "Youtube, vimeo 동영상 주소만 가능합니다.";
        }

        return null;
    }

    validVideoUrl(url) {
        return Regular.VIDEO_URL.test(url);
    }

    validate() {
        const result = this.validateVideo();
        return result.status ? null : result.message;
    }

    validateVideo() {
        const { list } = this.state;
        const result = {
            status: false,
            message: ""
        };

        if (!utils.isArray(list)) {
            result.message = "포트폴리오 영상 주소를 입력해주세요.";
        } else {
            let index = 1;
            result.status = true;
            result.video_list = list.reduce((r, o, i) => {
                if (Number(o.display_order) !== (index)) {
                    result.updateVideo = true;
                }

                if (o.portfolio_video.replace(/\s/, "")) {
                    if (!Regular.VIDEO_URL.test(o.portfolio_video)) {
                        result.message = "포트폴리오 영상은\nYoutube, vimeo 동영상 주소만 가능합니다.";
                        result.status = false;
                    }
                    r.push({
                        display_order: index,
                        portfolio_video: o.portfolio_video
                    });
                    index += 1;
                }

                return r;
            }, []);

            if (result.video_list.length < 3) {
                result.status = false;
                result.message = "포트폴리오 영상은 최소 3개 이상 입력해주세요.";
            }
        }

        return result;
    }

    layoutVideoList() {
        const list = this.state.list;
        const total = 10;
        const count = 2;
        const result = [];

        for (let i = 0; i < Math.ceil(total / count); i += 1) {
            const row = [];

            for (let j = 0; j < count; j += 1) {
                const index = (i * 2) + j;
                const item = list[index];

                if (item) {
                    row.push(
                        <div key={`${item.key}_${item.display_order}`} className="list__item">
                            <Input
                                type="text"
                                value={item.portfolio_video}
                                placeholder="예시) https://youtu.be/-ISrz1GI-3Y"
                                onChange={(e, n, v) => this.onChangeVideoUrl(index, v)}
                                onValidate={(e, n, v) => this.onCheckVideoUrl(index, v)}
                            />
                            <button className="_button _button__default" onClick={() => this.onPreview(item.portfolio_video)}>미리보기</button>
                            <button className="_button _button__close white__darken" onClick={() => this.onRemoveVideo(index)} />
                        </div>
                    );
                } else {
                    row.push(
                        <div key={`list-item-${index}`} className="list__item empty" onClick={this.onAddVideo} />
                    );
                }
            }

            result.push(
                <div key={`list-${i}`} className="list__row">
                    {row}
                </div>
            );
        }

        return result;
    }

    render() {
        return (
            <div className="regist-video-page">
                <div className="package__video__information">
                    <h2 className="content__title">등록시 안내사항</h2>
                    <div className="information">
                        <p className="highlight">Youtube, vimeo에 업로드 된 영상만 등록 가능합니다.</p>
                        <p>포트폴리오의 경우 상세설명 하단에 등록되며 포트폴리오는 최소 3개, 최대 10개까지 등록 가능합니다.</p>
                        <p>이미지 업로드는 선택사항이며 해상도가 낮거나 노출불가 이미지의 경우 임의 삭제 될 수 있습니다.</p>
                        <p>등록된 영상 및 이미지는 포스냅 SNS에 광고용으로 게시될 수 있습니다.</p>
                    </div>
                </div>
                <div className="package__video__list">
                    <h2 className="content__title">포트폴리오 영상 업로드</h2>
                    {this.layoutVideoList()}
                </div>
            </div>
        );
    }
}

RegistVideo.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])),
    category: PropTypes.string
};

export default RegistVideo;
