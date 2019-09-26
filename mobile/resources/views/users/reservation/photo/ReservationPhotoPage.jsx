import "./ReservationPhotoPage.scss";
import React, { Component, PropTypes } from "react";
import ReactDOM from "react-dom";
import { Router, Route, browserHistory, routerShape } from "react-router";

import api from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import Img from "desktop/resources/components/image/Img";

import * as CONST from "mobile/resources/stores/constants";
import AppDispatcher from "mobile/resources/AppDispatcher";
import AppContainer from "mobile/resources/containers/AppContainer";
import { HeaderContainer, LeftSidebarContainer, Footer, OverlayContainer } from "mobile/resources/containers/layout";

import PhotoViewModal from "./components/PhotoViewModal";

class ReservationPhotoPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            buy_no: null,
            product_no: null,
            user_type: "U",
            data: [],
            list: [],
            limit: 30,
            total: 0
        };

        if (props.params) {
            this.state.buy_no = props.params.buy_no || null;
            this.state.product_no = props.params.product_no || null;
        }

        this.onMore = this.onMore.bind(this);
        this.onShowImage = this.onShowImage.bind(this);

        this.fetch = this.fetch.bind(this);
        this.more = this.more.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentDidMount() {
        setTimeout(() => {
            AppDispatcher.dispatch({ type: CONST.GLOBAL_BREADCRUMB, payload: "이미지 확인" });
        }, 0);

        this.fetch(0, 9999)
            .then(response => {
                const data = response.data;
                this.setStateData(() => {
                    return {
                        data: data.list,
                        list: this.more(data.list, 0),
                        total: data.origin_count
                    };
                });
            })
            .catch(error => {
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(error.data)
                    });
                }
            });
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onMore() {
        const { data } = this.state;
        this.setStateData(({ list }) => {
            return {
                list: list.concat(this.more(data, list.length))
            };
        });
    }

    onShowImage(index) {
        const { data } = this.state;

        Modal.show({
            type: MODAL_TYPE.CUSTOM,
            full: true,
            content: <PhotoViewModal data={data} index={index} onClose={() => Modal.close()} />
        });
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    fetch(offset, limit) {
        const { buy_no, product_no, user_type } = this.state;
        return api.reservations.reservePhotosOrigin(buy_no, product_no, user_type, offset, limit || this.state.limit);
    }

    more(data, offset) {
        const { limit } = this.state;
        const more = [];
        for (let i = offset; i < (offset + limit); i += 1) {
            const item = data[i];
            if (item) {
                more.push(Object.assign({}, item));
            }
        }

        return more;
    }

    render() {
        const { list, total } = this.state;

        return (
            <div className="user__reservation__photo__page">
                <div className="photo__title">
                    <div className="title">이미지 개수</div>
                    <div className="count"><span>{total}</span> 장</div>
                </div>
                <div className="photo__content">
                    <div className="photo__list">
                        {list.map((o, i) => {
                            return (
                                <div key={`photo_${o.photo_no}`} className="photo__item" onClick={() => this.onShowImage(i)}>
                                    <Img image={{ src: `/${o.thumb_key}`, type: "private", content_width: 360, content_height: 360 }} isCrop={false} />
                                </div>
                            );
                        })}
                    </div>
                    {utils.isArray(list) && list.length < total ?
                        <div className="photo__buttons">
                            <button className="_button _button__default" onClick={this.onMore}>이미지 더보기</button>
                        </div> : null
                    }
                </div>
            </div>
        );
    }
}

ReservationPhotoPage.contextTypes = {
    router: routerShape
};

ReactDOM.render(
    <AppContainer roles={["customer"]}>
        <HeaderContainer />
        <LeftSidebarContainer />
        <div className="site-main">
            <Router history={browserHistory} >
                <Route path="/users/reservation/photo/:buy_no(/:product_no)" component={ReservationPhotoPage} />
            </Router>
            <Footer />
            <OverlayContainer />
        </div>
    </AppContainer>,
    document.getElementById("root")
);
