import React from "react";
import cookie from "forsnap-cookie";
import CONSTANT from "shared/constant";

const A = props => {
    const { href, children, ...rest } = props;
    const enter = cookie.getCookies(CONSTANT.USER.ENTER) || "";
    const enter_session = sessionStorage ? sessionStorage.getItem(CONSTANT.USER.ENTER) : "";
    const extension = href && href.indexOf("?") === -1 ? "?" : "&";

    // 주소를 설정
    let url = href;

    // 개인고객이면 파라미터에 new=true를 추가한다.
    // if (enter && enter_session) {
    //     url = `${href}${extension}new=true`;
    // }

    // 기업고객이면서 쿠키가 남아있다면 새 창이 띄워진 것이므로 biz=true 파라미터를 추가한다.
    if (url && enter && !enter_session) {
        url = `${href}${extension}biz=true`;
    }

    const aProps = {
        href: url, ...rest
    };

    return React.createElement("a", aProps, children);
};

export default A;
