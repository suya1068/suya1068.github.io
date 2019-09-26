import "./anotherRecommendArtist.scss";
import React, { Component } from "react";
import Modal, {MODAL_TYPE} from "shared/components/modal/Modal";
// import ArtistItem from "../recom_artist/ArtistItem";
import Swiper from "swiper";
import Icon from "desktop/resources/components/icon/Icon";
import utils from "forsnap-utils";
import classNames from "classnames";
import RecommendItem from "../recom_artist/RecommendItem";

export default class AnotherRecommendArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list || [],
            no: props.no,
            limit: 5,
            page: 0,
            renderList: [],
            selectArtist: [],
            hasSelect: false,
            count: props.count || 0,
            chargeMaxCount: 3
        };
        this.onSelectArtist = this.onSelectArtist.bind(this);
        this.onSelectArtistSendConsult = this.onSelectArtistSendConsult.bind(this);
    }

    componentWillMount() {
        this.setPaging();
    }

    componentDidMount() {
        this.testSwiper = new Swiper(".another__artist", {
            slidesPerView: 3,
            spaceBetween: 12,
            setWrapperSize: true,
            nextButton: ".another__artist__arrow-right",
            prevButton: ".another__artist__arrow-left",
            paginationClickable: true,
            pagination: ".another__artist__pages",
            paginationBulletRender: (swiper, index, className) => {
                return `<span class="slide_page ${className}">${utils.fillSpace(index + 1)}</span>`;
            }
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
                    content: <p>포스냅에서는 최대 3명의 작가님께 견적 및 상담 신청이 가능합니다.<br />추가문의를 원하시는 경우 포스냅 전문가 상담 혹은 고객센터로 문의내용을 접수해주세요.</p>
                });
            }

            this.setState({ count: _count, selectArtist: _artist, hasSelect: _artist.length > 0 || false });
        }
    }

    setPaging() {
        const { list, limit, renderList } = this.state;
        const { no } = this.props;

        const _renderList = renderList;
        const maxLength = list.length < limit ? list.length : limit;

        let count = 0;
        list.forEach((o, i) => {
            if (no !== list[i].no) {
            // if (no !== list[i].no && count < maxLength) {
                _renderList.push(list[i]);
                count += 1;
            }
        });

        this.setState({ renderList: _renderList });
    }

    onSelectArtistSendConsult() {
        const { selectArtist } = this.state;

        if (typeof this.props.selectArtistSendConsult === "function") {
            this.props.selectArtistSendConsult(selectArtist);
        }
    }

    render() {
        const { renderList, page, hasSelect, selectArtist, chargeMaxCount, count } = this.state;
        const { title, desc, total_price } = this.props;

        return (
            <div className="another__recommend__artist">
                <div className="another__recommend__artist__head">
                    <div className="container">
                        <div className="_modal__view__close">
                            <button className="_button _button__close white" onClick={() => Modal.close("another_artist")} />
                        </div>
                        <div className="another__recommend__artist__info" >
                            <p className="info-title">{title}</p>
                            <p className="info-desc">현재
                                <span style={{ color: "#f7b500" }}>{chargeMaxCount - count}명</span>
                                의 작가님께 추가 상담신청이 가능합니다.</p>
                        </div>
                    </div>
                </div>
                <div className="another__recommend__artist__content">
                    <div className="another__artist swiper-container container">
                        <div className="another__artist__content swiper-wrapper">
                            {renderList.map((item, idx) => {
                                const isSelect = Array.isArray(selectArtist) ? selectArtist.includes(item.no) : false;

                                return (
                                    <div className="swiper-slide another__test" key={`another_artist__${idx}`}>
                                        <RecommendItem
                                            select
                                            onSelectArtist={this.onSelectArtist}
                                            data={item}
                                            isSelect={isSelect}
                                            total_price={total_price}
                                            //onClick={this.onClick}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="another__artist__arrow-left">
                        <Icon name="circle_arrow_left" />
                    </div>
                    <div className="another__artist__arrow-right">
                        <Icon name="circle_arrow_right" />
                    </div>
                </div>
                <div className="another__artist__pages" />
                <div className="another__artist__btn">
                    <button className={classNames("artist__btn", { "has-select": hasSelect })} onClick={hasSelect ? this.onSelectArtistSendConsult : null}>{hasSelect ? "선택한 작가에게 문의하기" : "원하는 작가를 상단에서 체크해 주세요."}</button>
                </div>
            </div>
        );
    }
}
