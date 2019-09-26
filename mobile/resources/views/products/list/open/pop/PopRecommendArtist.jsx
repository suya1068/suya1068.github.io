import "./popRecommendArtist.scss";
import React, { Component, PropTypes } from "react";
import ArtistItem from "../preRecommendArtist/item/ArtistItem";
import Swiper from "swiper";
import classNames from "classnames";
import Modal, {MODAL_TYPE} from "../../../../../../../shared/components/modal/Modal";

export default class PopRecommendArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //no: props.no,
            totalPrice: props.totalPrice,
            list: props.list,
            title: props.title,
            desc: props.desc,
            selectArtist: [],
            hasSelect: false,
            count: props.count || 0,
            chargeMaxCount: 3
        };
        this.onSelectArtistSendConsult = this.onSelectArtistSendConsult.bind(this);
        this.onSelectArtist = this.onSelectArtist.bind(this);
    }

    componentDidMount() {
        this.setSwiperConfig();
    }

    componentWillReceiveProps(np) {
    }

    setSwiperConfig() {
        this.popRecommendArtist = new Swiper(".pop-recommend-artist__content", {
            slidesPerView: 2,
            spaceBetween: 5,
            height: 250,
            // width: 170,
            setWrapperSize: true
        });
    }

    onSelectArtist(no) {
        const { selectArtist, count, chargeMaxCount } = this.state;

        let _count = count;

        const _artist = selectArtist;
        const index = _artist.indexOf(no);

        if (chargeMaxCount - count > 0) {
            if (index !== -1) {
                _count -= 1;
                _artist.splice(index, 1);
            } else {
                _count += 1;
                _artist.push(no);
            }

            this.setState({ count: _count, selectArtist: _artist, hasSelect: _artist.length > 0 || false });
        }

        if (chargeMaxCount - count === 0) {
            if (_artist.includes(no)) {
                _count -= 1;
                _artist.splice(index, 1);
            } else {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: <p>포스냅에서는 최대 3명의 작가님께<br />견적 및 상담 신청이 가능합니다.<br />추가문의를 원하시는 경우 포스냅 전문가 상담<br />혹은 고객센터로 문의내용을 접수해주세요.</p>

                });
            }

            this.setState({ count: _count, selectArtist: _artist, hasSelect: _artist.length > 0 || false });
        }
    //     const { selectArtist } = this.state;
    //     const _artist = selectArtist.concat();
    //     const index = _artist.indexOf(no);
    //     if (index !== -1) {
    //         _artist.splice(index, 1);
    //     } else {
    //         _artist.push(no);
    //     }
    //     this.setState({ selectArtist: _artist, hasSelect: _artist.length > 0 || false });
    }

    onSelectArtistSendConsult() {
        const { selectArtist } = this.state;

        if (typeof this.props.selectArtistSendConsult === "function") {
            this.props.selectArtistSendConsult(selectArtist);
        }
    }

    render() {
        const { title, list, desc } = this.props;
        const { selectArtist, hasSelect, chargeMaxCount, count } = this.state;
        const restCount = chargeMaxCount - count;

        return (
            <div className="pop-recommend-artist">
                <div className="pop-recommend-artist__header">
                    <p className="title">추가 상담신청 남은 횟수 : {chargeMaxCount - count}회 (총 {chargeMaxCount}회)</p>
                    {/*<p className="title">{title}</p>*/}
                    {/*<p className="desc">{desc}</p>*/}
                    <p className="desc">현재
                        <span style={{ color: "#f7b500" }}>{chargeMaxCount - count}명</span>
                        의 작가님께 추가 상담신청이 가능합니다.</p>
                    <button className="_button _button__close white" onClick={() => this.props.onClose()} />
                </div>
                <div className="pop-recommend-artist__content swiper-container">
                    <div className="pop-recommend-artist__list swiper-wrapper">
                        {list.map((item, idx) => {
                            const isSelect = Array.isArray(selectArtist) ? selectArtist.includes(item.no) : false;

                            return (
                                <div className="swiper-slide" key={`pop-recommend-artist__${idx}`}>
                                    <ArtistItem
                                        data={item}
                                        onSelectArtist={this.onSelectArtist}
                                        enough={!(restCount > 0)}
                                        isSelect={isSelect}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="pop-recommend-artist__btn">
                    <button className={classNames("artist__btn", { "has-select": hasSelect })} onClick={this.onSelectArtistSendConsult}>{hasSelect ? "추가 문의" : "원하는 작가를 상단에서 체크해 주세요."}</button>
                </div>
            </div>
        );
    }
}
