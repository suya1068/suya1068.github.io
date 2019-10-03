import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import "./icon.scss";

const iconName = {
    join: "icon-join",
    photo: "icon-photo",
    policy: "icon-policy",
    picture: "icon-picture",
    profit: "icon-profit",
    "introduction": "icon-introduction",
    "photo-gray": "icon-photo-gray",
    "policy-gray": "icon-policy-gray",
    "operation-guide": "icon-operation-guide",
    "profit-gray": "icon-profit-gray",
    sign: "icon-sign",
    comm: "icon-comm",
    set: "icon-set",
    system: "icon-system",
    secure: "icon-secure",
    email: "icon-email",
    facebook: "icon-facebook",
    instargram: "icon-instargram",
    calendar: "icon-calendar",
    trash: "icon-trash",
    naver: "icon-naver",
    facebook_c: "icon-facebook_c",
    kakao: "icon-kakao",
    megaphone: "icon-megaphone",
    price: "icon-price",
    pholar: "icon-pholar",
    twitter: "icon-twitter",
    circle_minus: "icon-circle_minus",
    circle_plus: "icon-circle_plus",
    noti_customer: "icon-noti_customer",
    upper: "icon-upper",
    noti_schedule: "icon-noti_schedule",
    noti_picture: "icon-noti_picture",
    noti_receipt: "icon-noti_receipt",
    share: "icon-share",
    heart_e: "icon-heart_e",
    close: "icon-close",
    close_c: "icon-close_c",
    check: "icon-check",
    close_s: "icon-close_s",
    clip: "icon-clip",
    heart: "icon-heart",
    heart_s: "icon-heart_s",
    heart_s_full: "icon-heart_s_full",
    lt_s: "icon-lt_s",
    gt_s: "icon-gt_s",
    gt_s_disabled: "icon-gt_s_disabled",
    dt: "icon-dt",
    lt: "icon-lt",
    gt: "icon-gt",
    chat_s: "icon-chat_s",
    chat_m: "icon-chat_m",
    dot: "icon-dot",
    usb: "icon-usb",
    frame: "icon-frame",
    picture_s: "icon-picture_s",
    picture_bg: "icon-picture_bg",
    search: "icon-search",
    "search-black": "icon-search-black",
    chat: "icon-chat",
    "chat-black": "icon-chat-black",
    alarm: "icon-alarm",
    calendar_s: "icon-calendar_s",
    check_s: "icon-check_s",
    check_s_gray: "icon-check_s_gray",
    dt_a: "icon-dt_a",
    close_w: "icon-close_w",
    people: "icon-people",
    question: "icon-question",
    arrow_l: "icon-arrow_l",
    arrow_r: "icon-arrow_r",
    people_list: "icon-people_list",
    heart_recycle: "icon-heart_recycle",
    creditcard_s: "icon-creditcard_s",
    monitor: "icon-monitor",
    paper: "icon-paper",
    calendar_l: "icon-calendar_l",
    creditcard: "icon-creditcard",
    market: "icon-market",
    camera: "icon-camera",
    camera_disabled: "icon-camera_disabled",
    heart_bag: "icon-heart_bag",
    heart_hand: "icon-heart_hand",
    receipt: "icon-receipt",
    receipt_disabled: "icon-receipt_disabled",
    face: "icon-face",
    grid_list: "icon-grid_list",
    opt_origin: "icon-opt_origin",
    opt_custom: "icon-opt_custom",
    opt_print: "icon-opt_print",
    opt_direct: "icon-opt_direct",
    dt_m: "icon-dt_m",
    dt_l: "icon-dt_l",
    serrate: "icon-serrate",
    close_tiny: "icon-close_tiny",
    share_blog: "icon-share_blog",
    share_cafe: "icon-share_cafe",
    home: "icon-home",
    pink_heart: "icon-pink_heart",
    lt_white: "icon-lt_white",
    gt_white: "icon-gt_white",
    triangle_ut: "icon-triangle_ut",
    triangle_dt: "icon-triangle_dt",
    lt_shadow: "icon-lt_shadow",
    gt_shadow: "icon-gt_shadow",
    big_dots: "icon-big_dots",
    small_dots: "icon-small_dots",
    gray_button: "icon-gray_button",
    normal_lt: "icon-normal_lt",
    normal_gt: "icon-normal_gt",
    memo: "icon-memo",
    thunder_white: "icon-thunder_white",
    thunder_yellow: "icon-thunder_yellow",
    thunder_yellow_big: "icon-thunder_yellow_big",
    file_clip: "icon-file_clip",
    list1: "icon-list1",
    list2: "icon-list2",
    circle_calendar: "icon-circle-calendar",
    payment_custom: "icon-payment-custom",
    photo_frame: "icon-photo_frame",
    click: "icon-click",
    video_play: "icon-video_play",
    consulting: "icon-consulting",
    "process-step1": "icon-process-step1",
    "process-step2": "icon-process-step2",
    "process-step3": "icon-process-step3",
    "process-step4": "icon-process-step4",
    "heart-black-surface": "icon-heart-black-surface",
    "heart-pink-surface": "icon-heart-pink-surface",
    more_product: "icon-more_product",
    ////////////// disabled icons
    disable_heart_s: "icon-disable_heart_s",
    disable_dt: "icon-disable_dt",
    document: "icon-document",
    document_check: "icon-document_check",
    person_check: "icon-person_check",
    enter_document: "icon-enter_document",
    enter_studio: "icon-enter_studio",
    enter_person_check: "icon-enter_person_check",
    studio: "icon-studio",
    // renew biz-main icon
    mint_model: "icon-mint_model",
    mint_shot: "icon-mint_camera",
    mint_makeup: "icon-mint_makeup",
    mint_edit: "icon-mint_edit",
    mint_stylist: "icon-mint_stylist",
    mint_place: "icon-mint_place",
    main_enlarge: "icon-main_enlarge",
    arrow_l_on: "icon-arrow_l_on",
    arrow_l_off: "icon-arrow_l_off",
    arrow_r_on: "icon-arrow_r_on",
    arrow_r_off: "icon-arrow_r_off",
    // 20190107 add icon
    free: "icon-free",
    contact_res: "icon-contact_res",
    contact_progress: "icon-contact_progress",
    // 20190116 add icon
    more: "icon-more",
    transparent_image: "icon-transparent_image",
    transparent_folder: "icon-transparent_folder",
    transparent_shot: "icon-transparent_shot",
    shot_info_tip: "icon-shot_info_tip",
    big_black_close: "icon-big_black_close",
    // 20190219 add icon
    estimate_camera: "icon-estimate_camera",
    consult_schedule: "icon-consult_schedule",
    // 20190221 add icon
    folder_product: "icon-folder_product",
    folder_food: "icon-folder_product",
    folder_fashion: "icon-folder_fashion",
    folder_event: "icon-folder_event",
    folder_interior: "icon-folder_interior",
    folder_profile_biz: "icon-folder_profile_biz",
    folder_video_biz: "icon-folder_video_biz",
    // 20190319 add icon
    black_dt: "icon-black_dt",
    // 20190512 add icon
    circle_arrow_left: "icon-circle_arrow_left",
    circle_arrow_right: "icon-circle_arrow_right",
    // 20190612 add icon
    left_bracket_gray: "icon-left_bracket_gray",
    left_bracket_big_white: "icon-left_bracket_big_white",
    right_bracket_big_white: "icon-right_bracket_big_white",
    left_bracket_big_gray: "icon-left_bracket_big_gray",
    right_bracket_big_gray: "icon-right_bracket_big_gray",
    share_gray: "icon-share_gray"
};

/**
 * 아이콘 컴포넌트
 * @param icon - 아이콘 키값
 * @param link - 아이콘 클릭시 연결된 링크 (링크가 없을시 생략 가능)
 *
 * icon 키값은 상단에 선언한 키값 참조
 */
class Icon extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iconName: props.name,
            isActive: props.active,
            isHide: props.hide
        };
    }

    componentWillReceiveProps(nextProps) {
        if (JSON.stringify(this.state) !== JSON.stringify(nextProps)) {
            this.setState({
                iconName: nextProps.name,
                isActive: nextProps.active,
                isHide: nextProps.hide
            });
        }
    }

    setName(name) {
        this.setState({ iconName: name });
    }

    render() {
        return (
            <div className={classNames("icon", this.state.isActive, this.state.isHide)}>
                <icon className={iconName[this.state.iconName]} />
                {typeof this.props.children !== "undefined" ? <span className="icon-caption">{this.props.children}</span> : ""}
            </div>
        );
    }
}

Icon.propTypes = {
    name: PropTypes.oneOf(Object.keys(iconName)).isRequired,
    active: PropTypes.oneOf(["active", ""]),
    hide: PropTypes.oneOf(["hide", ""]),
    children: PropTypes.node
};

Icon.defaultProps = {
    active: "",
    hide: ""
};

export default Icon;
