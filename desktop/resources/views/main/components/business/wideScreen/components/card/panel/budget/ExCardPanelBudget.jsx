import "./excard_panel_budget.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "shared/helper/utils";

export default class ExCardPanelBudget extends Component {
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
        return (
            <div className={classNames("ex_card__panel__type", text_type)} style={container_style}>
                <p className={classNames(`${text_type}__title`, data.photo_position)}>{utils.linebreak(text_data.title)}</p>
                <div className={`${text_type}__content`}>
                    {text_data.content.map((obj, idx) => {
                        return (
                            <p
                                className={classNames(`${text_type}__content-key`, { "end": obj.result })}
                                key={`${text_type}__content-key__${idx}`}
                            >{obj.desc}</p>
                        );
                    })}
                </div>
            </div>
        );
    }
}

