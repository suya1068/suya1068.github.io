import "./chargeProducts.scss";
import React, { Component, PropTypes } from "react";
import Img from "shared/components/image/Img";

export default class ChargeProducts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            category: props.category,
            limit: 4,
            renderList: []
        };
        this.combineList = this.combineList.bind(this);
        this.gaEvent = this.gaEvent.bind(this);
        this.onMovePage = this.onMovePage.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(np) {
        if (JSON.stringify(this.props.list) !== JSON.stringify(np.list)) {
            this.combineList(np.list);
        }
    }

    combineList(list) {
        const { limit, renderList } = this.state;
        const max = list.length > limit ? limit : list.length;

        for (let i = 0; i < max; i += 1) {
            renderList.push(list[i]);
        }

        this.setState({ renderList });
    }

    /**
     * ga이벤트 전달
     * @param action
     */
    gaEvent(action) {
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent(action);
        }
    }


    onMovePage(e, no) {
        e.preventDefault();
        this.gaEvent("유료_추천상품");
        const url = `/products/${no}`;
        const myWindow = window.open("", "_blank");
        myWindow.location.href = url;
    }

    renderList(list) {
        let content = null;
        if (Array.isArray(list) && list.length > 0) {
            content = (
                list.map((obj, idx) => {
                    return (
                        <div className="charge-products__item" key={`charge__list__${idx}`} onClick={e => this.onMovePage(e, obj.product_no)}>
                            <div className="item__thumb">
                                <Img image={{ src: obj.thumb_img, content_width: 320, content_height: 320 }} />
                            </div>
                            <div className="item__info">
                                <p className="product-title">{obj.title}</p>
                                <p className="from-artist">by {obj.nick_name}</p>
                            </div>
                        </div>
                    );
                })
            );
        }

        return content;
    }

    render() {
        const { renderList } = this.state;

        return (
            <div className="charge-products">
                <div className="container">
                    <div className="charge-products__head">
                        <h2 className="charge-products__title">비슷한 포트폴리오</h2>
                    </div>
                    <div className="charge-products__content">
                        {this.renderList(renderList)}
                    </div>
                </div>
            </div>
        );
    }
}
