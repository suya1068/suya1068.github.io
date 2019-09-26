import "./introEstimate.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import ReactDOM from "react-dom";
import * as INTRO from "shared/constant/intro-estimate";
import utils from "forsnap-utils";
import Icon from "desktop/resources/components/icon/Icon";
import Buttons from "desktop/resources/components/button/Buttons";

import App from "desktop/resources/components/App";
import HeaderContainer from "desktop/resources/components/layout/header/HeaderContainer";

export default class IntroEstimate extends Component {

    onRedirect(url) {
        location.href = url;
    }

    render() {
        return (
            <div className="intro-estimate">
                <Img image={{ src: INTRO.RANDING_URL, type: "image" }} isCrop isImageCrop />
                <div className="intro-estimate__contents">
                    <div className="contents-top">
                        <p className="title">
                            {INTRO.TOP.TITLE_01}<br />
                            <span className="yellow-text" style={{ color: "#ffba00" }}>{INTRO.TOP.TITLE_02}</span>
                        </p>
                        <p className="caption">{utils.linebreak(INTRO.TOP.CAPTION)}</p>
                    </div>
                    <div className="contents-middle">
                        <div className="button-left">
                            <Icon name={INTRO.MIDDLE.LEFT.ICON} />
                            <p className="button-title">{INTRO.MIDDLE.LEFT.TITLE}</p>
                            <p className="button-caption">{utils.linebreak(INTRO.MIDDLE.LEFT.CAPTION)}</p>
                        </div>
                        <div className="button-right">
                            <Icon name={INTRO.MIDDLE.RIGHT.ICON} />
                            <p className="button-title">{INTRO.MIDDLE.RIGHT.TITLE}</p>
                            <p className="button-caption">{utils.linebreak(INTRO.MIDDLE.RIGHT.CAPTION)}</p>
                        </div>
                    </div>
                    <div className="contents-bottom">
                        <Buttons
                            buttonStyle={{ width: "w276", shape: "round", size: "large", theme: "fill-emphasis" }}
                            inline={{ onClick: () => this.onRedirect(INTRO.BOTTOM.LEFT.LINK) }}
                        >
                            {INTRO.BOTTOM.LEFT.TITLE}
                        </Buttons>
                        <Buttons
                            buttonStyle={{ width: "w276", shape: "round", size: "large", theme: "reverse" }}
                            inline={{ onClick: () => this.onRedirect(INTRO.BOTTOM.RIGHT.LINK) }}
                        >
                            {INTRO.BOTTOM.RIGHT.TITLE}
                        </Buttons>
                    </div>
                </div>
                <p className="artist-nickName">photo by {INTRO.ARTIST_NICNNAME}</p>
            </div>
        );
    }
}

ReactDOM.render(
    <App>
        <HeaderContainer />
        <IntroEstimate />
    </App>,
    document.getElementById("root")
);
