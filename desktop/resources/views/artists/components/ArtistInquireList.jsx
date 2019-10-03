import React, { Component, PropTypes } from "react";
import Swiper from "swiper";

class ArtistInquireList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            advice_order: Array.isArray(props.advice_order) ? props.advice_order.splice(0, 30) : null
        };
    }

    componentDidMount() {
        const option = {
            slidesPerView: 5,
            spaceBetween: 10,
            loop: true,
            autoplay: 1300,
            autoplayDisableOnInteraction: true
        };

        this.SwiperList = new Swiper(".artist__inquire__list .swiper-container", option);
    }

    render() {
        const { advice_order } = this.state;

        return (
            <div className="artist__inquire__list">
                <div className="swiper-container">
                    <div className="swiper-wrapper">
                        {advice_order.map((o, i) => {
                            return (
                                <div key={`${o.reg_dt}_${i}`} className="swiper-slide">
                                    <div className="inquire__item">
                                        <div className="title">{o.category_name}</div>
                                        <div className="name">{o.user_name}</div>
                                        <div className="phone">{o.user_phone}</div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }
}

ArtistInquireList.propTypes = {
    advice_order: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired
};

export default ArtistInquireList;
