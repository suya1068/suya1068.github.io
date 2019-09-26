import React, { Component, PropTypes } from "react";

import Header from "desktop/resources/components/layout/BACKUP/Header";


/**
 * 네비게이션 데모 페이지
 */
class NavPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount() {
        document.getElementsByClassName("demo-left")[0].style.display = "none";
    }

    render() {
        return (
            <div>
                <div className="demo-content">
                    <Header navTitle="artist" />
                    A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />
                    A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />
                    A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />
                    A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />
                    A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />
                    A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />A<br />B<br />C<br />
                </div>
            </div>
        );
    }
}

export default NavPage;
