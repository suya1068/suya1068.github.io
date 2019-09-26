import React, { Component, PropTypes } from "react";
import API from "forsnap-api";
import CenterInfoPanel from "./CenterInfoPanel";
import Accordion from "desktop/resources/components/form/Accordion";

const tempData = [{
    title: "포스냅 사이트 오픈!!!",
    content: "남는건 사진뿐!!! 포스냅! \n\n" +
        "포스냅 사이트가 오픈하였습니다. \n" +
        "궁금사항은 자주묻는 질문 페이지와 고객센터를 찾아주세요~!",
    reg_dt: "2017-04-27"
}];

class NoticeBoard extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="board container">
                <CenterInfoPanel />
                <h1>공지사항</h1>
                <div className="board__notice">
                    <Accordion data={tempData} type="notice" />
                </div>
            </div>
        );
    }
}


export default NoticeBoard;
