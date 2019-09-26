import React, { Component } from "react";
import utils from "forsnap-utils";
import { Link } from "react-router";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";

export default class NavWrap extends Component {
    constructor(props) {
        super(props);
        this.state = {
            link: props.link,
            className: props.className,
            title: props.title
        };
        this.onClick = this.onClick.bind(this);
    }

    componentWillMount() {
        let { link } = this.state;
        const parseNewQuery = utils.query.parse(location.search)["new"];
        if (parseNewQuery === "true") {
            link += "?new=true";
        }
        this.setState({
            link
        });
    }

    componentWillReceiveProps(props) {

    }

    onClick() {
        const { link } = this.state;
        const flag = cookie.getCookies(CONSTANT.USER.ENTER) && sessionStorage.getItem(CONSTANT.USER.ENTER);
        const changeUrl = utils.query.addQuery(link, flag, `enter=${cookie.getCookies(CONSTANT.USER.ENTER)}`);
        ga("send", "pageview", changeUrl);
    }

    render() {
        const { link } = this.state;
        const { className, title } = this.props;
        return (
            <Link to={link} className={className} onClick={this.onClick}>{title}</Link>
        );
    }
}
