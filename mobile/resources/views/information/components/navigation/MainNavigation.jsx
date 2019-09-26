import "./navigation.scss";
import React, { Component, PropTypes } from "react";
import { Link } from "react-router";
import { main_navigation } from "../../information.const";
import classNames from "classnames";

export default class MainNavigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_active: "introduction"
        };
        this.onCheckParams = this.onCheckParams.bind(this);
    }

    componentWillMount() {
        this.onCheckParams();
    }

    componentWillReceiveProps(nextProps) {
        this.onCheckParams();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.is_active !== nextState.is_active;
    }

    /**
     * 활성화된 페이지의 코드값을 저장한다.
     */
    onCheckParams() {
        const base_url = "/information/";
        const pathname = location.pathname;

        this.setState({
            is_active: pathname.substr(base_url.length)
        });
    }

    /**
     * 페이지 코드값을 저장한다.
     * @param code
     */
    onClick(code) {
        this.setState({ is_active: code });
        ga("send", "pageview");
    }

    /**
     * 활성화된 코드인지 검증한다.
     * @param code
     * @returns {boolean}
     */
    isActive(code) {
        return code === this.state.is_active;
    }

    render() {
        return (
            <div className="mobile-information">
                <div className="information-navigation">
                    <nav>
                        <h2 className="sr-only">메뉴</h2>
                        <ul className="information-nav-group">
                            {
                                main_navigation.map(nav => (
                                    <li key={nav.id} className={classNames("information-nav-item", { "active": this.isActive(nav.code) })}>
                                        <Link
                                            activeClassName="information-nav-link--active"
                                            className="information-nav-link"
                                            to={nav.url}
                                            onClick={() => this.onClick(nav.code)}
                                        >{nav.name}</Link>
                                    </li>
                                ))
                            }
                        </ul>
                    </nav>
                </div>
            </div>
        );
    }
}

