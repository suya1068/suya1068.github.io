import React, { Component, PropTypes } from "react";

import utils from "forsnap-utils";

class ProductsVideoItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data
        };
    }

    componentDidMount() {
    }

    render() {
        const { data } = this.state;
        const resize = utils.resize(16, 9, document.body.getBoundingClientRect().width, 1, true);

        return (
            <div className="portfolio__video">
                <iframe
                    src={data}
                    width="100%"
                    height={resize.height}
                    frameBorder="0"
                    allowFullScreen
                />
            </div>
        );
    }
}

ProductsVideoItem.propTypes = {
    data: PropTypes.string
};

export default ProductsVideoItem;
