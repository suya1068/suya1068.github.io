import "./alliance.scss";
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
                <div className="container">
                    <h3 className="biz-panel__title">많은 기업들이 포스냅 작가님들과 함께하고 있습니다.</h3>
                    <div className="biz-alliance__list">
                        <div className="biz-alliance__list-wrapper_dev">
                            {ALLIANCE_CONST.LIST.map((obj, idx) => {
                                return (
                                    <div className="biz-alliance__list-item_dev" key={`biz-alliance__list__item__${idx}`}>
                                        <div className="alliance-icon">
                                            <Img image={{ src: `${IMG_BASE_URL}${obj.IMG_SRC}`, type: "image" }} />
                                        </div>
                                        <div className="alliance-name">
                                            {obj.NAME_K}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Alliance;
