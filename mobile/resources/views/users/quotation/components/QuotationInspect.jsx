import React, { Component, PropTypes } from "react";
import utils from "forsnap-utils";
import mewtime from "forsnap-mewtime";
import RequestJS, { STATE } from "shared/components/quotation/request/QuotationRequest";
import ImageSlider from "shared/components/image/ImageSlider";
import Img from "shared/components/image/Img";
import classNames from "classnames";

class QuotationInspect extends Component {
    constructor() {
        super();

        const reserve = RequestJS.getState(STATE.RESERVE.key);
        let category;
        const categoryList = RequestJS.getState(STATE.CATEGORY_CODES);
        if (categoryList) {
            category = categoryList.find(obj => {
                const value = reserve[STATE.RESERVE.CATEGORY];
                if (value) {
                    return obj.code === value.toUpperCase();
                }

                return false;
            });
        }

        this.state = {
            category,
            [STATE.ORDER_NO]: RequestJS.getState(STATE.ORDER_NO),
            [STATE.USER.key]: RequestJS.getState(STATE.USER.key),
            [STATE.RESERVE.key]: reserve,
            // [STATE.OPTIONS.key]: RequestJS.getState(STATE.OPTIONS.key),
            [STATE.CONTENT]: RequestJS.getState(STATE.CONTENT),
            // [STATE.BUDGET]: RequestJS.getState(STATE.BUDGET),
            // [STATE.COUNSEL]: RequestJS.getState(STATE.COUNSEL),
            // [STATE.MEETING]: RequestJS.getState(STATE.MEETING),
            [STATE.ATTACH]: RequestJS.getState(STATE.ATTACH),
            [STATE.ATTACH_FILE]: RequestJS.getState(STATE.ATTACH_FILE),
            reserveTime: RequestJS.getReserveTimes()
        };

        this.sliderResize = this.sliderResize.bind(this);
    }

    componentWillMount() {
        // const { category } = this.state;
        //
        // if (category) {
        //     this.state[STATE.ACCEPT_OPTIONS] = RequestJS.getState(STATE.ACCEPT_OPTIONS)[category.code];
        // }

        window.addEventListener("resize", this.sliderResize);
    }

    componentDidMount() {
        this.sliderResize();
        window.scroll(0, 0);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.sliderResize);
    }

    sliderResize() {
        const slider = this.slider;

        if (slider) {
            const quotation = this.quotation;
            const rs = utils.resize(4, 3, quotation.offsetWidth, 0, true);

            slider.style.width = `${rs.width}px`;
            slider.style.height = `${rs.height}px`;
        }
    }

    convertValue(op, v) {
        let value = "";

        switch (v) {
            case "Y":
                value = "필요해요";
                break;
            case "N":
                value = "필요없어요";
                break;
            case "NA":
                value = "미정";
                break;
            default:
                if (op.subtitle) {
                    value += "필요해요 / ";
                }
                value += `${v}${op.unit}`;
                break;
        }

        return value;
    }

    render() {
        const { category, reserveTime } = this.state;
        // const acceptOptions = this.state[STATE.ACCEPT_OPTIONS];
        const user = this.state[STATE.USER.key];
        const reserve = this.state[STATE.RESERVE.key];
        // const options = this.state[STATE.OPTIONS.key];
        const content = this.state[STATE.CONTENT];
        // const budget = this.state[STATE.BUDGET];
        // const counsel = this.state[STATE.COUNSEL];
        // const meeting = this.state[STATE.MEETING];
        const attach = this.state[STATE.ATTACH];
        const attach_file = this.state[STATE.ATTACH_FILE];

        if (!category) {
            return null;
        }

        const categoryName = category ? category.name || "" : "";
        // const isBelong = false; // ["PRODUCT", "FOOD", "INTERIOR"].indexOf(category.code) !== -1;
        let date = "미정";
        let time = "미정";

        if (RequestJS.isDate(reserve[STATE.RESERVE.DATE])) {
            date = mewtime.strToStr(reserve[STATE.RESERVE.DATE]);
        } else if (RequestJS.isDateOption(reserve[STATE.RESERVE.DATE])) {
            date = reserve[STATE.RESERVE.DATE];
        }

        if (RequestJS.isTime(reserve[STATE.RESERVE.TIME])) {
            time = `${reserveTime.sh}시 ~ ${reserveTime.eh}시`;
        } else if (RequestJS.isTimeOption(reserve[STATE.RESERVE.TIME])) {
            time = reserve[STATE.RESERVE.TIME];
        }

        return (
            <div className="quotation__inspect" ref={ref => (this.quotation = ref)}>
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>입력한 정보를 확인해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <div className="row__title">
                                    <span>이름</span>
                                </div>
                                <div className="row__content">
                                    {user[STATE.USER.NAME]}
                                </div>
                            </div>
                            <div className="column__row hr-trans" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>연락처</span>
                                </div>
                                <div className="row__content">
                                    {user[STATE.USER.PHONE]}
                                </div>
                            </div>
                            <div className="column__row hr-trans" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>이메일</span>
                                </div>
                                <div className="row__content">
                                    {user[STATE.USER.EMAIL]}
                                </div>
                            </div>
                        </div>
                        {content ?
                            <div className="column__box">
                                <div className="column__row">
                                    <div className="row__content align-start" style={{ color: "#969696" }}>
                                        <span className="content__caption">{utils.linebreak(content)}</span>
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                        <div className="column__box">
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영종류</span>
                                </div>
                                <div className="row__content">
                                    {categoryName}
                                </div>
                            </div>
                            <div className="column__row hr" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영지역</span>
                                </div>
                                <div className="row__content">
                                    {reserve[STATE.RESERVE.REGION]}
                                </div>
                            </div>
                            <div className="column__row hr" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영날짜</span>
                                </div>
                                <div className="row__content">
                                    {date}
                                </div>
                            </div>
                            <div className="column__row hr" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영시간</span>
                                </div>
                                <div className="row__content">
                                    {time}
                                </div>
                            </div>
                        </div>
                        {attach && attach.length > 0 ?
                            <div ref={ref => (this.slider = ref)} style={{ marginBottom: "30px" }}>
                                <ImageSlider data={{ nav: { position: "bottom", inout: "out", posY: -10 }, arrow: { position: "middle" } }}>
                                    {attach.map(obj => {
                                        return (
                                            <li key={`attach-item-${obj.no}`}>
                                                <Img image={{ src: obj.photo, content_width: 640, content_height: 640 }} isCrop={false} isImageCrop={false} />
                                            </li>
                                        );
                                    })}
                                </ImageSlider>
                            </div>
                            : null
                        }
                        {attach_file && attach_file.length > 0 ?
                            <div className="column__box">
                                {attach_file.map((obj, idx) => {
                                    return [
                                        idx !== 0 && <div className="column__row hr" />,
                                        <div className="column__row" key={`attach-file-${idx}`}>
                                            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                                <a className="row__title" style={{ color: "#000" }} href={`${__SERVER__.data}${obj.path}`} id={`attach_${idx}`} download={`attach_${idx}`} target="_blank">
                                                    {obj.file_name}
                                                </a>
                                            </span>
                                        </div>
                                    ];
                                })}
                            </div> : null
                        }
                    </div>
                </div>
            </div>
        );
        /*
        return (
            <div className="quotation__inspect" ref={ref => (this.quotation = ref)}>
                <div className="content__column">
                    <div className="content__column__head">
                        <h1>입력한 정보를 확인해주세요.</h1>
                    </div>
                    <div className="content__column__body">
                        <div className="column__box">
                            <div className="column__row">
                                <div className="row__title">
                                    <span>이름</span>
                                </div>
                                <div className="row__content">
                                    {user[STATE.USER.NAME]}
                                </div>
                            </div>
                            <div className="column__row hr-trans" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>연락처</span>
                                </div>
                                <div className="row__content">
                                    {user[STATE.USER.PHONE]}
                                </div>
                            </div>
                            <div className="column__row hr-trans" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>이메일</span>
                                </div>
                                <div className="row__content">
                                    {user[STATE.USER.EMAIL]}
                                </div>
                            </div>
                        </div>
                        {content ?
                            <div className="column__box">
                                <div className="column__row">
                                    <div className="row__content align-start" style={{ color: "#969696" }}>
                                        <span className="content__caption">{utils.linebreak(content)}</span>
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                        <div className="column__box">
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영종류</span>
                                </div>
                                <div className="row__content">
                                    {categoryName}
                                </div>
                            </div>
                            <div className="column__row hr" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>최대예산</span>
                                </div>
                                <div className="row__content">
                                    {utils.format.price(budget)} 원
                                </div>
                            </div>
                            <div className="column__row hr" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영지역</span>
                                </div>
                                <div className="row__content">
                                    {reserve[STATE.RESERVE.REGION]}
                                </div>
                            </div>
                            <div className="column__row hr" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영날짜</span>
                                </div>
                                <div className="row__content">
                                    {date}
                                </div>
                            </div>
                            <div className="column__row hr" />
                            <div className="column__row">
                                <div className="row__title">
                                    <span>촬영시간</span>
                                </div>
                                <div className="row__content">
                                    {time}
                                </div>
                            </div>
                            {utils.isArray(acceptOptions) ?
                                acceptOptions.map((op, i) => {
                                    return [
                                        <div className="column__row hr" />,
                                        <div className="column__row">
                                            <div className="row__title">
                                                <span>{op.title}</span>
                                            </div>
                                            <div className="row__content">
                                                {this.convertValue(op, options[op.key])}
                                            </div>
                                        </div>
                                    ];
                                }) : null
                            }
                        </div>
                        {isBelong ?
                            <div className="column__box">
                                <div className="column__row">
                                    <div className="row__title">
                                        <span>전화상담</span>
                                    </div>
                                    <div className="row__content">
                                        {this.convertValue(null, counsel)}
                                    </div>
                                </div>
                                <div className="column__row hr" />
                                <div className="column__row">
                                    <div className="row__title">
                                        <span>미팅상담</span>
                                    </div>
                                    <div className="row__content">
                                        {this.convertValue(null, meeting)}
                                    </div>
                                </div>
                            </div> : null
                        }
                        {attach && attach.length > 0 ?
                            <div ref={ref => (this.slider = ref)}>
                                <ImageSlider data={{ nav: { position: "bottom", inout: "out", posY: -10 }, arrow: { position: "middle" } }}>
                                    {attach.map(obj => {
                                        return (
                                            <li key={`attach-item-${obj.no}`}>
                                                <Img image={{ src: obj.photo, content_width: 640, content_height: 640 }} isCrop={false} isImageCrop={false} />
                                            </li>
                                        );
                                    })}
                                </ImageSlider>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
         */
    }
}

// {attach.map(obj => {
//     return [<div className="column__row hr" />,
//         <div className="column__row" key={`attach-${obj.order_no}-${obj.no}`}>
//             <div className={classNames("row__content", "align-end")}>
//                 <button className="attach__del button button__default" onClick={() => this.deleteAttach(obj.order_no, obj.no)}><i className="m-icon m-icon-cancel" /></button>
//                 <Img image={{ src: obj.photo, content_width: 640, content_height: 640 }} />
//             </div>
//         </div>];
// })}

export default QuotationInspect;
