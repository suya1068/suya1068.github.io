import "./popup_shot_info.scss";
import React, { Component, PropTypes } from "react";
import { SHOT_INFO } from "./shot_info.const";
import Icon from "desktop/resources/components/icon/Icon";
import Img from "shared/components/image/Img";
import utils from "forsnap-utils";
import PopModal from "shared/components/modal/PopModal";

export default class PopupShotInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal_name: props.modal_name,
            shot_info: SHOT_INFO
        };
        this.onCheckClose = this.onCheckClose.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        const c_modal = document.getElementsByClassName(`modal-contents ${this.props.modal_name}`)[0];
        if (c_modal) {
            c_modal.addEventListener("click", this.onCheckClose);
        }
    }

    onCheckClose(e) {
        const target = e.target;
        const c = target && target.className;
        if (c === `modal-contents ${this.props.modal_name}`) {
            PopModal.close();
        }
    }

    onClose() {
        PopModal.close(this.props.modal_name);
    }

    render() {
        const { shot_info } = this.state;
        return (
            <div className="shot_info_popup">
                <div className="shot_info_popup__header">
                    <div className="shot_info_popup__header__title">
                        <span>{shot_info.TITLE}</span>
                        <Icon name="shot_info_tip" />
                    </div>
                    <p className="shot_info_popup__header__desc">{utils.linebreak(shot_info.DESC)}</p>
                    <div className="close-button" onClick={this.onClose}>
                        <Icon name="big_black_close" />
                    </div>
                </div>
                <div className="shot_info_popup__body">
                    <div className="shot_info_popup__body__info-basic">
                        <div className="shot_info_popup__body-row">
                            <div className="shot_info_popup__body__info-basic-box">
                                {shot_info.INFO_BASIC.map(info => {
                                    return (
                                        <div
                                            className="shot_info_popup__body__info-basic-box__row"
                                            style={{ backgroundColor: info.BACKGROUND_COLOR }}
                                            key={`info-basic__${info.NO}`}
                                        >
                                            <Icon name={info.ICON} />
                                            <div className="text-box">
                                                <p className="text-box__title">{info.TITLE}</p>
                                                <p className="text-box__desc">{utils.linebreak(info.DESC)}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className="shot_info_popup__body-row">
                            <p className="shot_info_popup__body-row__title">{shot_info.INFO_KIND.TITLE}</p>
                            <div className="shot_info_popup__body__shot-kind__box">
                                {shot_info.INFO_KIND.LIST.map(kind => {
                                    return (
                                        <div className="shot_info_popup__body__shot-kind__box-item" key={`shot-kind__${kind.NO}`}>
                                            <div className="shot_info_popup__body__shot-kind__box-item__text-box">
                                                <p className="text-box-title">{kind.TITLE}</p>
                                                <p className="text-box-desc">{utils.linebreak(kind.DESC)}</p>
                                            </div>
                                            <div className="shot_info_popup__body__shot-kind__box-item__image-box">
                                                {kind.IMAGES.map(image => {
                                                    return (
                                                        <div className="image-box-image" key={`shot_kind__images__${kind.NO}-${image.NO}`}>
                                                            <Img image={{ src: image.SRC, type: "image" }} />
                                                            <span className="artist" style={{ color: image.ARTIST_COLOR }}>{`by ${image.ARTIST}`}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="shot_info_popup__body__shot-kind__box__think-box">
                                <p className="text-box-title">{shot_info.ADD_THING.TITLE}</p>
                                <p className="text-box-desc">{utils.linebreak(shot_info.ADD_THING.DESC)}</p>
                            </div>
                        </div>
                        <div className="shot_info_popup__body-row">
                            <p className="shot_info_popup__body-row__title">{shot_info.HOW_CUT.TITLE}</p>
                            <div className="shot_info_popup__body__howshot-box">
                                <p className="shot_info_popup__body-row__desc">{utils.linebreak(shot_info.HOW_CUT.DESC)}</p>
                                <div className="shot_info_popup__body__howshot-box__images">
                                    {shot_info.HOW_CUT.IMAGES.map(image => {
                                        return (
                                            <div
                                                className="shot_info_popup__body__howshot-box__images-image"
                                                key={`how_cut__${image.NO}`}
                                                style={{ width: image.WIDTH, height: image.HEIGHT }}
                                            >
                                                <Img image={{ src: image.SRC, type: "image" }} />
                                                <span className="artist">{`by ${image.ARTIST}`}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                        <div className="shot_info_popup__body-row">
                            <p className="shot_info_popup__body-row__title">{shot_info.HOW_CONCEPT.TITLE}</p>
                            <p className="shot_info_popup__body-row__desc">{utils.linebreak(shot_info.HOW_CONCEPT.DESC)}</p>
                            <div className="shot_info_popup__body__how-reference-box">
                                <div
                                    className="shot_info_popup__body__how-reference-box__title-box"
                                    style={{ backgroundColor: shot_info.HOW_REFERENCE.TITLE_BACKGROUND_COLOR }}
                                >{shot_info.HOW_REFERENCE.TITLE}</div>
                                <p className="text-box-desc">{utils.linebreak(shot_info.HOW_REFERENCE.DESC)}</p>
                                <div className="shot_info_popup__body__how-reference-box__image">
                                    <Img image={{ src: shot_info.HOW_REFERENCE.IMAGE.SRC, type: "image" }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
