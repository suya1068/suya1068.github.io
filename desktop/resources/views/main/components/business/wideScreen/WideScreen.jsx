import "./wide_screen.scss";
import React, { Component } from "react";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";
import TypesConst from "./types.const";
import Type from "./components/type/Type";
import utils from "forsnap-utils";

export default class WideScreen extends Component {
    constructor() {
        super();
        this.state = {
            test_data: TypesConst.TYPE_B,
            test: true,
            is_load: false
        };
        this.testConsult = this.testConsult.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    testConsult(data) {
        const { onConsult } = this.props;
        if (typeof onConsult === "function") {
            utils.ad.gaEvent("기업_메인", "상단배너", data.title);
            if (typeof this.props.gaEvent === "function") {
                this.props.gaEvent("상단배너");
            }

            // gtag("event", "play", {
            //     "event_category": "Videos",
            //     "event_label": "Fall Campaign"
            // });
            onConsult({ access_type: CONSULT_ACCESS_TYPE[data.consult_code].CODE });
        }
    }

    render() {
        const { test, test_data } = this.state;

        return (
            <section className="biz-widescreen biz-page__hr">
                <div className="container">
                    <div className="biz-widescreen-container">
                        <h3 className="biz-panel__title" style={{ color: "#fff" }}>
                            {test ? "상담부터 견적과 촬영까지 포스냅에 맡기세요." : "촬영하고 싶은데 얼마인가요?"}
                        </h3>
                        {
                            !test &&
                            <p className="biz-panel__descr" style={{ color: "#fff" }}>포스냅에서 진행한 촬영의 예산을 확인해보세요</p>
                        }
                        {
                            test &&
                            test_data.list &&
                            <div className="test-banner-container">
                                {test_data.list.map((obj, idx) => {
                                    return (
                                        <Type
                                            data={obj}
                                            width={test_data.width}
                                            height={test_data.height}
                                            button_pa={test_data.button_pa}
                                            key={`test__${idx}`}
                                            onConsult={this.testConsult}
                                            main
                                        />
                                    );
                                })}
                            </div>
                        }
                    </div>
                </div>
            </section>
        );
    }
}
