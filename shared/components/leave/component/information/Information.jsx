import "./information.scss";
import React from "react";
import classNames from "classnames";
import INFORMATION from "./information.const";

const Information = props => {
    const DESCRIPTION = props.is_artist ? INFORMATION.DESCRIPTION.ARTIST : INFORMATION.DESCRIPTION.USER;

    /**
     * 안내문구 동의여부 체크
     */
    const onAgree = () => {
        if (typeof props.onAgree === "function") {
            props.onAgree(!props.is_agree);
        }
    };

    return (
        <div className="customer-leave-information-component leave-information">
            <div className="leave-information__content">
                <h3 className="leave-information__content-heading">회원탈퇴를 신청하기 전에 안내사항을 꼭 확인해주세요.</h3>
                {DESCRIPTION.map(obj => {
                    return (
                        <p key={obj.KEY} className="leave-information__content-description">{`- ${obj.TEXT}`}</p>
                    );
                })}
            </div>
            <div className="leave-information__check">
                <div onClick={onAgree}>
                    <span className={classNames("leave-information__check-check", props.is_agree && "agree")} />
                    <p>안내사항을 모두 확인하였으며, <strong>이에 동의합니다.</strong></p>
                </div>
            </div>
        </div>
    );
};

export default Information;
