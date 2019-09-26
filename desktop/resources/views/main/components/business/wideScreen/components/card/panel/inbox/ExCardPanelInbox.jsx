import "./excard_panel_inbox.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "shared/helper/utils";

export default class ExCardPanelInbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            container_style: props.container_style
        };
    }

    componentWillMount() {

    }

    render() {
        const { data, container_style } = this.props;
        const text_data = data.text;
        const text_type = text_data.type;
        const style = container_style;
        style.paddingLeft = 0;

        return (
            <div className={classNames("ex_card__panel__type", text_type)} style={style}>
                <div>
                    <p className={classNames(`${text_type}__title`, data.photo_position)}>{utils.linebreak(text_data.title)}</p>
                    {this.props.children}
                </div>
                <div className={`${text_type}__content`} style={{ width: `calc(100% - ${data.photo.width}px)` }}>
                    {text_data.content.map((obj, idx) => {
                        return (
                            <div
                                className={classNames(`${text_type}__content-key`, { "end": obj.end })}
                                key={`${text_type}__content-key__${idx}`}
                            >
                                {utils.linebreak(obj.desc)}
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
