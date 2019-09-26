import "./reviewPage.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import API from "forsnap-api";
import Input from "desktop/resources/components/form/Input";
import Buttons from "desktop/resources/components/button/Buttons";
import auth from "forsnap-authentication";
import PopModal from "shared/components/modal/PopModal";

const REVIEW_LIST_COUNT = 4;

export default class ReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            user: auth.getUser(),
            list: [],
            status_text: {
                WAIT: "등록대기",
                READY: "승인대기",
                COMPLETE: "승인완료",
                CANCEL: "승인거절"
            },
            button_text: {
                REQUEST: "승인요청",
                DELETE: "삭제"
            },
            isLoading: false
        };
        this.initReviewList = this.initReviewList.bind(this);
        // this.testSetList = this.testSetList.bind(this);
        this.findReviewList = this.findReviewList.bind(this);
    }

    componentWillMount() {
        this.initReviewList();
    }

    componentDidMount() {
        this.findReviewList();
        // this.testSetList();
    }

    // updateReviewList() {
    //     const { user, address } = this.state;
    //     return API.updateReviewList(user.id, address);
    // }
    //
    // deleteReviewlist(no) {
    //     const { user } = this.state;
    //     return API.deleteReviewList(user.id, no);
    // }

    // testSetList() {
    //     const { list } = this.state;
    //     if (test.length > 0) {
    //         test.reduce((result, obj, idx) => {
    //             const o = { status: obj.status, address: obj.address, button: obj.button };
    //             list[idx] = o;
    //
    //             return null;
    //         }, []);
    //         this.setState({
    //             list
    //         });
    //     }
    // }

    setReviewList(afterList) {
        const { list } = this.state;
        afterList.reduce((result, obj, idx) => {
            const isDisable = obj.status !== "READY" ? "disabled" : "";
            const o = { status: obj.status, address: obj.url, button: "DELETE", disabled: isDisable, no: obj.review_no };
            list[idx] = o;
            return null;
        }, []);

        this.setState({
            list
        });
    }

    initReviewList() {
        const props = {};
        const list = [];
        for (let i = 0; i < REVIEW_LIST_COUNT; i += 1) {
            list.push({ status: "WAIT", address: "", button: "REQUEST", disabled: "" });
        }
        props.list = list;
        this.setState(props);
    }

    findReviewList() {
        const { user } = this.state;
        if (user) {
            API.artists.getReviewList(user.id).then(response => {
                const data = response.data;
                const list = data.list;
                if (list.length > 0) {
                    this.setReviewList(list);
                    this.setState({
                        isLoading: true
                    });
                }
            }).catch(error => {
                if (error.data !== "") {
                    PopModal.alert(error.data);
                } else {
                    PopModal.alert("에러");
                }
            });
        }
    }

    render() {
        const { address, status_text, button_text, list, isLoading } = this.state;

        if (!isLoading) {
            return null;
        }

        return (
            <div className="artists-page-account reg-review">
                <div className="reg-review-title">
                    <p className="title">촬영후기 등록안내</p>
                    <p className="description">
                        {utils.linebreak("네이버블로그, 인스타그램 후기를 등록할 수 있습니다. 최대 4개까지 등록가능하며,\n" +
                        "외부연락처 (카카오톡아이디, 스튜디오명 등)가 노출되어있거나 정책상 등록 불가능한 후기의 경우 반려될 수 있습니다.\n" +
                        "등록된 후기는 상품상세페이지 하단에 노출됩니다. 승인 재요청이 필요한 경우에는 삭제 후 재등록 해주시면됩니다.")}
                    </p>
                </div>
                <div className="reg-review-address">
                    <p className="title">촬영후기글 등록주소</p>
                    {list.map((obj, idx) => {
                        return (
                            <div className="address-row" key={`blog_reivew_artists__${idx}`}>
                                <p className="status">{status_text[obj.status]}</p>
                                <Input
                                    inputStyle={{ size: "small", width: "w412" }}
                                    inline={{ placeholder: "http://... or https://...", value: obj.address, disabled: obj.disabled, maxLength: 50, onChange: (e, value) => this.setState({ address: value }) }}
                                />
                                <Buttons buttonStyle={{ size: "small", width: "w135", shape: "circle", theme: "default" }} /*inline={{ onClick: this.apiArtistEmailCode }}*/>{button_text[obj.button]}</Buttons>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }
}
