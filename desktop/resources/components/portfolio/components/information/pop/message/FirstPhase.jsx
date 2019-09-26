import "./firstPhase.scss";
import React, { Component } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";

export default class FirstPhase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            intervalSecId: null,
            intervalDotId: null,
            maxSec: 3,
            dotActive: 0,
            sec: 2,
            consultAbleCount: props.consultAbleCount
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        const { consultAbleCount, callBack, onClose } = this.props;
        const { maxSec } = this.state;

        if (consultAbleCount > 0) {
            this.state.intervalSecId = setInterval(() => {
                const { sec } = this.state;
                this.setState({ sec: sec - 1 }, () => {
                    if (this.state.sec === 0) {
                        clearInterval(this.state.intervalSecId);
                        callBack();
                        onClose();
                    }
                });
            }, 1000);

            this.state.intervalDotId = setInterval(() => {
                const { dotActive } = this.state;
                const _dotActive = (dotActive + 1) % maxSec;
                this.setState({
                    dotActive: _dotActive
                });
            }, 300);
        } else {
            setTimeout(() => {
                onClose();
            }, 5000);
        }
    }

    componentWillUnmount() {
        clearInterval(this.state.intervalSecId);
        clearInterval(this.state.intervalDotId);
    }

    render() {
        const { onClose, consultAbleCount, callBack } = this.props;
        const { sec, dotActive } = this.state;
        const isAbleConsult = consultAbleCount > 0;

        return (
            <div className="pop-first-phase">
                <div className="container">
                    <div className="pop-first-phase__text">
                        <p className="text__title">작가님께 전달이 완료되었습니다.</p>
                        <p className="text__desc">최대한 빠르게 연락드리겠습니다. 잠시만 기다려주세요!<br />촬영 중에는 연락이 늦어질수 있어요.</p>
                        {isAbleConsult &&
                        <p className="text__al">현재 {consultAbleCount}명의 작가님께 추가문의신청이 가능합니다.</p>
                        }
                    </div>
                    {isAbleConsult ?
                        <div>
                            <div className="pop-first-phase__btn">
                                <button className="phase-button cancel-btn" onClick={onClose}>취소</button>
                                <button className="phase-button next-btn" onClick={callBack}>확인</button>
                            </div>
                            <div className="pop-first-phase__sec">
                                <div className="dots">
                                    <div className={classNames("dot", { "active": dotActive === 2 })} />
                                    <div className={classNames("dot", { "active": dotActive === 1 })} />
                                    <div className={classNames("dot", { "active": dotActive === 0 })} />
                                </div>
                                <div className="second-info">
                                    {sec}초 후 이동
                                </div>
                            </div>
                        </div> :
                        <div>
                            <p className="text__enough">포스냅에서는 최대 3명의 작가님께 문의접수가 가능합니다.<br />
                                현재 3명의 작가님께 문의를 접수해주셨으며, 추가 문의가 있는 경우 고객센터 혹은 포스냅전문가 상담을 이용해주세요.
                            </p>
                            <div className="pop-first-phase__btn last-btn">
                                <button className="phase-button next-btn" onClick={onClose}>확인</button>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}
