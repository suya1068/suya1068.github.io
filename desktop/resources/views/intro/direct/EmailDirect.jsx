import React, { Component } from "react";
import ReactDOM from "react-dom";
import utils from "forsnap-utils";

export default class EmailDirect extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onDiplayPage = this.onDiplayPage.bind(this);
        this.combineParams = this.combineParams.bind(this);
    }

    componentWillMount() {
        const query = document.getElementById("query").getAttribute("content");
        const JSONQuery = JSON.parse(query);
        // console.log(JSONQuery);
        // this.state.query = JSONQuery;
        this.setState(this.combineParams(JSONQuery));
    }

    componentDidMount() {
    }

    onDiplayPage() {
        const { dp } = this.state;
        let redirect_url = "";
        let host = __DESKTOP__;
        if (utils.agent.isMobile()) {
            host = __MOBILE__;
        }
        switch (dp) {
            case "main": redirect_url = `${host}/`; break;
            case "qna": redirect_url = `${host}/cs/qna`; break;
            case "uq": redirect_url = `${host}/users/quotation`; break;
            default: break;
        }
        location.href = redirect_url;
    }

    combineParams(query) {
        return {
            dp: query.dp,
            tt: query.tt,
            cid: query.cid
        };
    }

    render() {
        const { cid, tt, dp } = this.state;

        return (
            <div>
                <img
                    role="presentation"
                    onLoad={this.onDiplayPage}
                    src={`http://www.google-analytics.com/collect?v=1&tid=UA-91761764-1&cid=${cid}&t=event&ec=포스냅_메일광고_1차&ea=${tt}&el=click&cs=${tt}&cm=click&cn=포스냅_메일광고_1차`}
                />
            </div>
        );
    }
}

ReactDOM.render(
    <EmailDirect />,
    document.getElementById("root")
);
