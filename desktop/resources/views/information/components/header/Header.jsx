import "./Header.scss";
import React, { PropTypes, Component } from "react";
import CountUp from "react-countup";

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: props.image,
            children: props.children,
            counting: props.counting
        };
    }

    componentDidMount() {
    }

    render() {
        const { image, children, counting } = this.props;
        const imageURL = `url(${__SERVER__.img}/${image.src}?v=20180424_1607)`;

        return (
            <header className="information-header" style={{ backgroundImage: imageURL }}>
                <div className="information-inner">
                    <div className="container">
                        <div className="information-contents">
                            {children}
                            {counting &&
                            <div className="information-extra">
                                <div className="regist_artists half">
                                    <p className="counting">
                                        <CountUp start={counting.artists.min} end={counting.artists.max} separator="," duration={2} />
                                    </p>
                                    <p className="description">등록된 작가</p>
                                </div>
                                <div className="regist_products half">
                                    <p className="counting">
                                        <CountUp start={counting.products.min} end={counting.products.max} separator="," duration={2} />
                                    </p>
                                    <p className="description">등록된 포트폴리오</p>
                                </div>
                            </div>
                            }
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

Header.propTypes = {
    image: PropTypes.shape({
        src: PropTypes.string,
        className: PropTypes.string,
        alt: PropTypes.string
    }).isRequired,
    children: PropTypes.node.isRequired
};


export default Header;
