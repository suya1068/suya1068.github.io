import "./PersonalPage.scss";
import React, { Component, PropTypes } from "react";

import api from "forsnap-api";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";
import { PERSONAL_CATEGORY } from "shared/constant/main.const";

import MainCategory from "../components/MainCategory";
import MainIntro from "../components/MainIntro";
import MainRecommend from "../components/MainRecommend";
import ReserveComplete from "../components/ordinary/reserve-complete/ReserveComplete";
import Review from "../components/ordinary/review/Review";
import Information from "../components/ordinary/information/Information";

class PersonalPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            mainType: "newpc,recommend"
        };

        this.fetchMain = this.fetchMain.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.fetchMain()
            .then(data => {
                const { newpc, recommend } = data;
                const init = { list: [], total_cnt: 0 };
                const recommendList = PERSONAL_CATEGORY.reduce((r, o) => {
                    if (o.code !== "VIDEO") {
                        const { list, total_cnt } = recommend[o.code];

                        r.push(Object.assign(
                            {},
                            o,
                            {
                                list,
                                total_cnt
                            }
                        ));
                    }

                    return r;
                }, []);

                this.setState({
                    order: Object.assign(init, newpc.order),
                    reserve: Object.assign(init, newpc.reserve),
                    recommend: recommendList
                });
            });
        this.gaEvent("메인로딩");
    }

    fetchMain() {
        return api.products.findMainProducts(this.state.mainType)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: error.data
                    });
                }
            });
    }

    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(false, action);
        }
    }

    render() {
        const { reserve, recommend } = this.state;

        return (
            <div className="personal__page">
                <div className="main__row row__full">
                    <MainCategory data={PERSONAL_CATEGORY} gaEvent={this.gaEvent} />
                </div>
                <div className="main__row">
                    <MainIntro />
                </div>
                {reserve ?
                    <div className="main__row row__full border__top">
                        <ReserveComplete reserve_list={reserve.list || []} gaEvent={this.gaEvent} />
                    </div> : null
                }
                <div className="main__row row__full">
                    <Review gaEvent={this.gaEvent} />
                </div>
                <div className="main__row">
                    <h1>추천상품</h1>
                    <MainRecommend data={recommend} gaEvent={this.gaEvent} />
                </div>
                <div className="main__row row__full border__top">
                    <Information />
                </div>
            </div>
        );
    }
}

PersonalPage.propTypes = {
    gaEvent: PropTypes.func
};

export default PersonalPage;
