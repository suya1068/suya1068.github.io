import "./header.scss";
import React, { Component, PropTypes } from "react";

export default class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            image: props.image,
            children: props.children
        };
    }

    componentDidMount() {
    }

    render() {
        const { image, children } = this.props;
        const imageURL = `url(${__SERVER__.img}/${image.src}?v=20180424_1607)`;

        return (
            <div className="mobile-information-header" style={{ backgroundImage: imageURL }}>
                <div className="mobile-information-inner">
                    <div className="mobile-information-contents">
                        {children}
                    </div>
                </div>
            </div>
        );
    }
}

