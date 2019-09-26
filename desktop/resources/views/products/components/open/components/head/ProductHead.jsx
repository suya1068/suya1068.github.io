import "./product_head.scss";
import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";

export default class ProductHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            category: props.category,
            data: props.data
        };
    }

    componentWillMount() {

    }

    componentDidMount() {

    }

    render() {
        const { data } = this.props;
        return (
            <section className="product_list__head" style={{ background: `url(${__SERVER__.img}/products/list${data.bg_img}) center center / cover no-repeat` }}>
                <div className="container">
                    <div className="product_list__head__title">
                        <h2 className="category">{data.name}촬영</h2>
                        <p className="title">{utils.linebreak(data.title)}</p>
                        <p className="desc">{data.desc}</p>
                    </div>
                    <div className="product_list__head__artist">
                        {data.artist && <p>Photo by {data.artist}</p>}
                    </div>
                </div>
            </section>
        );
    }
}
