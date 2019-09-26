import "./consultingAgree.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

export default class ConsultingAgree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            is_agree: false
        };

        this.onChangeAgree = this.onChangeAgree.bind(this);
        this.onActive = this.onActive.bind(this);
        this.caculateHeight = this.caculateHeight.bind(this);
        this.initData = this.initData.bind(this);
    }

    componentWillMount() {
    }
    componentDidMount() {
        this.caculateHeight();
    }
    componentWillUnmount() {
    }

    caculateHeight() {
        // const target = document.getElementsByClassName("consulting-rule-content")[0];
        // const targetChildren = target.querySelector(".consulting-rule-content__description");
        const targetChildren = this.rule_desc;
        this.setState({
            moreHeight: targetChildren.clientHeight || 0
        });
    }

    onChangeAgree() {
        this.setState({ is_agree: !this.state.is_agree });
    }

    onActive(e) {
        const { moreHeight } = this.state;
        const currentTarget = e.currentTarget;
        const showDiv = this.props.name ?
            document.getElementsByClassName("consulting-rule-content_modal")[0]
            : document.getElementsByClassName("consulting-rule-content")[0];
        currentTarget.classList.toggle("clicked");

        if (currentTarget.classList[1] === "clicked") {
            showDiv.classList.add("show");
            showDiv.style.height = `${moreHeight}px`;
        } else {
            showDiv.classList.remove("show");
            showDiv.style.height = 0;
        }
    }

    validate() {
        const { is_agree } = this.state;
        let message = "";
        if (!is_agree) {
            message = "개인정보 수집 및 이용에 동의해주셔야 신청 가능합니다.";
        }
        return message;
    }

    initData() {
        this.setState({
            is_agree: false
        });
    }

    render() {
        const { is_agree } = this.state;

        return (
            <article className="consulting-rule">
                <div className="consulting-rule-heading">
                    <h3 className="consulting-rule-heading__title" onClick={this.onActive}>
                        [ 개인정보 수집 및 이용동의 ]
                    </h3>
                    <div className="consulting-rule-heading__agree-button">
                        <span className={classNames("agree-button", { "is-active": is_agree })} onClick={this.onChangeAgree}>
                            동의합니다.
                        </span>
                    </div>
                </div>
                <div className={classNames("consulting-rule-content", { "consulting-rule-content_modal": this.props.name })}>
                    <p className="consulting-rule-content__description description" ref={node => { this.rule_desc = node; }}>
                        포스냅은 고객의 요청에 정확하고 성실한 답변을 드리기 위해<br />
                        필요한 최소한의 개인정보를 수집하고 있습니다.<br /><br />
                        개인정보 수집 이용목적: 고객지원 담당자 확인 및 문의내용 처리<br />
                        수집하는 개인정보 항목: 이름, 전화번호<br />
                        수집하는 개인정보 처리 및 보존기간: 1년 보관 후 파기
                    </p>
                </div>
            </article>
        );
    }
}

ConsultingAgree.propTypes = {
    name: PropTypes.string
};

ConsultingAgree.defaultProps = {
    name: ""
};

