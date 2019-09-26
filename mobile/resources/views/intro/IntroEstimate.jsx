import "./introEstimate.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import ReactDOM from "react-dom";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, OverlayContainer } from "mobile/resources/containers/layout";
import * as INTRO from "shared/constant/intro-estimate";
import utils from "forsnap-utils";
import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";

export default class IntroEstimate extends Component {
    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "촬영요청 이용안내" });
        }, 0);
    }

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
                            <span className="yellow-text">{INTRO.TOP.TITLE_02}</span>
                        </p>
                        <p className="caption">{utils.linebreak(INTRO.TOP.CAPTION)}</p>
                    </div>
                    <div className="contents-middle">
                        <div className="button-left">
                            <icon className={`m-icon m-icon-${INTRO.MIDDLE.LEFT.ICON}`} />
                            <p className="button-title">{INTRO.MIDDLE.LEFT.TITLE}</p>
                            <p className="button-caption">{utils.linebreak(INTRO.MIDDLE.LEFT.CAPTION)}</p>
                        </div>
                        <div className="button-right">
                            <icon className={`m-icon m-icon-${INTRO.MIDDLE.RIGHT.ICON}`} />
                            <p className="button-title">{INTRO.MIDDLE.RIGHT.TITLE}</p>
                            <p className="button-caption">{utils.linebreak(INTRO.MIDDLE.RIGHT.CAPTION)}</p>
                        </div>
                    </div>
                    <div className="contents-bottom">
                        <button className="button button__theme__yellow" onClick={() => this.onRedirect(INTRO.BOTTOM.LEFT.LINK)}>{INTRO.BOTTOM.LEFT.TITLE}</button>
                        <button className="button button__theme__transparent" onClick={() => this.onRedirect(INTRO.BOTTOM.RIGHT.LINK)}>{INTRO.BOTTOM.RIGHT.TITLE}</button>
                    </div>
                </div>
                <p className="artist-nickName">photo by {INTRO.ARTIST_NICNNAME}</p>
            </div>
        );
    }
}

ReactDOM.render(
    <AppContainer>
        <HeaderContainer />
        <LeftSidebarContainer />
        <IntroEstimate />
        <OverlayContainer />
    </AppContainer>,
    document.getElementById("root")
);
