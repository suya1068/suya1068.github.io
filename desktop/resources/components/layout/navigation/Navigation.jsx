import "./navigation.scss";
import React, { Component, PropTypes } from "react";
// import { Router, Route, browserHistory, IndexRoute, Link, routerShape } from "react-router";
import NavWrap from "./NavWrap";

/***
 *  공통 navigation 부분
 */

class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            navData: props.navData
        };
    }

    componentWillMount() {
        // nav정보의 갯수만큼 반복문 수행
        const currentPath = location.pathname;
        const changedData = this.state.navData.map(item => {
            if (item.baseUrl + item.restUrl === currentPath || currentPath.indexOf(item.baseUrl + item.restUrl) !== -1) {
                item.className = "nav-select";
            } else {
                item.className = "nav-nonSelect";
            }
            return item;
        });

        // 변경된 className의 값 적용
        this.setState({
            navData: changedData
        });
    }

    // 탭 변경시마다 호출
    componentWillReceiveProps(nextProps) {
        const currentPath = location.pathname;
        this.state.navData.map(item => {
            if (item.baseUrl + item.restUrl === currentPath || currentPath.indexOf(item.baseUrl + item.restUrl) !== -1) {
                item.className = "nav-select";
            } else {
                item.className = "nav-nonSelect";
            }
            return item;
        });
    }

    scrollUp() {
        window.scrollTo(0, 0);
    }

    generateLink() {
        const datas = this.state.navData.map((data, index) => {
            let link = data.baseUrl + data.restUrl;
            if (data.link) {
                link = data.link;
            }

            return (
                <li key={index} onMouseUp={this.scrollUp}>
                    <NavWrap link={link} className={data.className} title={data.navTitle} />
                    {/*<Link to={link} className={data.className}>{data.navTitle}</Link>*/}
                </li>
            );
        });

        return datas;
    }
    render() {
        return (
            <nav className="nav">
                <div className="nav-default">
                    <div className="container" >
                        <ul className="nav-list">
                            {this.generateLink()}
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}

Navigation.propTypes = {
    navData: PropTypes.arrayOf(PropTypes.shape({
        baseUrl: PropTypes.string,
        restUrl: PropTypes.string,
        className: PropTypes.string,
        navTitle: PropTypes.string
    }))
};

export default Navigation;
