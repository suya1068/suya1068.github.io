import "./excard_panel.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";
import classNames from "classnames";
import ExCardPanelBudget from "./budget/ExCardPanelBudget";
import ExCardPanelChat from "./chat/ExCardPanelChat";
import ExCardPanelInbox from "./inbox/ExCardPanelInbox";
import ExCardPanelInfo from "./info/ExCardPanelInfo";
import ExCardPanelList from "./list/ExCardPanelList";
import ExCardPanelNormal from "./normal/ExCardPanelNormal";
import ExCardPanelText from "./text/ExCardPanelText";

export default class ExCardPanel extends Component {
    constructor(props) {
        super(props);
        this.state = {
            photo_position: props.photo_position,
            mark_position: props.mark_position,
            category_name: props.category_name,
            data: props.data
        };
    }

    componentWillMount() {

    }

    /**
     * 부모 타입, 타겟 타입
     * @param parent_type
     * @param target_type
     * @param data
     */
    renderPanelSwitch(parent_type, target_type, data) {
        const style = this.setContentStyle(data);
        const { photo_position, mark_position, category_name } = this.props;

        if (parent_type === "text") {
            return <ExCardPanelText data={data} container_style={style} />;
        }

        switch (target_type) {
            case "info": return <ExCardPanelInfo data={data} container_style={style} />;
            case "list": return <ExCardPanelList data={data} container_style={style} />;
            case "budget": return <ExCardPanelBudget data={data} container_style={style} />;
            case "normal": return <ExCardPanelNormal data={data} container_style={style} />;
            case "chat": return <ExCardPanelChat data={data} container_style={style} />;
            case "inbox":
                return (
                    <ExCardPanelInbox data={data} container_style={style}>
                        <div className={classNames("panel_image", photo_position)} style={{ width: data.photo.width, height: data.photo.height }}>
                            <div className={classNames("mark", mark_position)}>{`${category_name} - 포스냅`}</div>
                            <Img image={{ src: data.photo.src, type: "image" }} />
                        </div>
                    </ExCardPanelInbox>
                );
            default: return null;
        }
    }

    setContentStyle(data) {
        const style = {};
        const photo_position = data.photo_position;

        style.textAlign = "left";
        style.wordBreak = "keep-all";
        if (photo_position === "right" || photo_position === "left") {
            style.width = `calc(100% - ${data.photo.width}px)`;
        }

        if (photo_position === "right") {
            style.left = 0;
            style.paddingRight = "20px";
        }

        if (photo_position === "left") {
            style.right = 0;
            style.paddingLeft = "20px";
        }

        if (data.text.type === "chat") {
            style.width = "100%";
        }

        return style;
    }

    render() {
        const { photo_position, mark_position, category_name, data } = this.props;
        const style = {};
        if (data.text.type === "info") {
            style.marginBottom = 35;
        }

        if (photo_position === "mix") {
            style.marginBottom = 220;
        }

        if (data.text.wrap) {
            style.marginBottom = 15;
        }

        return (
            <div className="ex_card__panel" style={style}>
                {data.type === "image" && data.text.type !== "inbox" &&
                    <div className={classNames("panel_image", photo_position)} style={{ width: data.photo.width, height: data.photo.height }}>
                        <div className={classNames("mark", mark_position)}>{`${category_name} - 포스냅`}</div>
                        <Img image={{ src: data.photo.src, type: "image" }} />
                    </div>
                }
                {data.type === "video" &&
                    <div className="panel_image">
                        <iframe
                            src={`https://player.vimeo.com/video/${data.video_id}`}
                            width="100%"
                            height="500"
                            frameBorder="0"
                        />
                    </div>
                    }
                {this.renderPanelSwitch(data.type, data.text.type, data)}
            </div>
        );
    }
}

ExCardPanel.propTypes = {
    photo_position: PropTypes.string,
    mark_position: PropTypes.string,
    category_name: PropTypes.string.isRequired,
    data: PropTypes.shape([PropTypes.node]).isRequired
};

ExCardPanel.defaultProps = {
    photo_position: "",
    mark_position: ""
};
