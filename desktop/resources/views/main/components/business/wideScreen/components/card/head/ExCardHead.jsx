import "./excard_head.scss";
import React, { Component, PropTypes } from "react";
import utils from "shared/helper/utils";
import Img from "shared/components/image/Img";

export default class ExCardHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data
        };
    }

    componentWillMount() {
    }

    render() {
        const { data } = this.props;

        return (
            <div className="ex_card__head">
                <div className="ex_card__head-box">
                    <div className="ex_card__head-box__bg">
                        <Img image={{ src: data.head_bg, type: "image" }} />
                    </div>
                    <div className="ex_card__head-box__content">
                        <div className="ex_card__head__content-head">
                            <p>포스냅 촬영 사례</p>
                            <img src={`${__SERVER__.img}/common/f_logo_renew.png`} role="presentation" />
                        </div>
                        <div className="ex_card__head__content-body">
                            <div className="ex_card__head__category">
                                <p>
                                    {data.category_name}
                                </p>
                            </div>
                            <p className="ex_card__head__title">{utils.linebreak(data.title)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
