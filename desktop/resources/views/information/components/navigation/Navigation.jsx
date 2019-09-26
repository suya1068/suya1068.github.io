import "./Navigation.scss";
import React, { Component, PropTypes } from "react";

import { Link } from "react-router";


class Navigation extends Component {
    onClick() {
        ga("send", "pageview");
    }

    render() {
        return (
            <div className="information-navigation">
                <div className="container">
                    <nav>
                        <h1 className="sr-only">메뉴</h1>
                        <ul className="nav-group">
                            {
                                this.props.data.map(nav => (
                                    <li key={nav.id} className="nav-item">
                                        <Link
                                            activeClassName="nav-link--active"
                                            className="nav-link"
                                            to={nav.url}
                                            onClick={this.onClick}
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

Navigation.contextTypes = {
    router: PropTypes.object
};

Navigation.propTypes = {
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            name: PropTypes.string,
            url: PropTypes.string
        })
    ).isRequired
};

export default Navigation;
