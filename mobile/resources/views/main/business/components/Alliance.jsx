import React, { Component } from "react";
import Img from "shared/components/image/Img";
import { BUSINESS_MAIN } from "shared/constant/main.const";

class Alliance extends Component {
    constructor() {
        super();
        this.state = {
            ALLIANCE_CONST: BUSINESS_MAIN.ALLIANCE
        };
    }
    componentDidMount() {
    }

    render() {
        const { ALLIANCE_CONST } = this.state;
        const IMG_BASE_URL = ALLIANCE_CONST.IMG_BASE_URL;

        return (
            <section className="biz-alliance biz-page__hr biz-panel__dist">
                <div className="biz-alliance__list">
                    <div className="biz-alliance__list-wrapper_dev">
                        {ALLIANCE_CONST.LIST.map((obj, idx) => {
                            return (
                                <div className="biz-alliance__list-item_dev" key={`biz-alliance__list__item__${idx}`}>
                                    <Img image={{ src: `${IMG_BASE_URL}${obj.IMG_SRC}`, type: "image", width: 1, height: 1 }} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        );
    }
}

export default Alliance;
