import React, { Component, PropTypes } from "react";

class PortfolioItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            src: props.src,
            style: props.style
        };
    }

    componentDidMount() {
        const content = this.refContent;
        if (content) {
            content.style.height = `${content.offsetWidth}px`;
        }
    }

    render() {
        const { src, style } = this.state;

        return (
            <div ref={ref => (this.refContent = ref)}>
                <img
                    alt="portfolio"
                    src={src}
                    style={style}
                />
            </div>
        );
    }
}

PortfolioItem.propTypes = {
    src: PropTypes.string,
    style: PropTypes.shape([PropTypes.node])
};

export default PortfolioItem;
