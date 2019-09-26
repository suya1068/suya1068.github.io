import "./accordion.scss";
import React, { Component } from "react";
import classNames from "classnames";

export default class Accordion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            is_open: false,
            height: 0,
            border_bottom: ""
        };

        this.onShow = this.onShow.bind(this);
    }

    /**
     * 어코디언 동작
     * @param e
     */
    onShow(e) {
        e.preventDefault();
        const { is_open } = this.state;
        this.setState({ is_open: !is_open }, () => {
            const target = this.content;
            let height = 0;
            let border_bottom = "";

            if (this.state.is_open) {
                height = target.clientHeight;
                border_bottom = "1px solid #e1e1e1";
            } else {
                height = 0;
                border_bottom = "";
            }
            this.setState({ height, border_bottom });
        });
    }

    render() {
        const { title, is_open, height, border_bottom } = this.state;
        return (
            <article className="accordion">
                <div className="accordion__heading" onClick={this.onShow}>
                    <h4 className="accordion__heading-title">
                        <span>{`${title}`}</span>
                    </h4>
                    <div className={classNames("accordion__heading-icon", is_open ? "show" : "hide")}>
                        <i className="m-icon m-icon-gt_b" />
                    </div>
                </div>
                <div className="accordion__content" style={{ height, borderBottom: border_bottom }} ref={node => { this.content_container = node; }}>
                    <div className={classNames(is_open ? "show" : "hide")} ref={node => { this.content = node; }}>
                        {this.props.children}
                    </div>
                </div>
            </article>
        );
    }
}
