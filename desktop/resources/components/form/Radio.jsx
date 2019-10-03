import React, { Component, PropTypes } from "react";
import classNames from "classnames";

/**
 * 라디오버튼 컴포넌트
 * @param name - 라디오 버튼명
 * @param value - 라디오 고유 value값
 * @param checked - 선택여부
 * @param onClick - 선택된 값을 넘겨받을 함수
 */
class Radio extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radioName: this.props.name
        };

        this.radioCheck = this.radioCheck.bind(this);
    }

    // 체크상태 확인
    isChecked() {
        if (this.props.checked === "") return false;
        return true;
    }

    // 라디오 클릭시 선택된 값 넘김
    radioCheck() {
        this.props.onClick(this.props.value);
    }

    render() {
        return (
            <button className={classNames("radio", this.props.checked, this.props.disabled)} onClick={this.props.disabled === "disabled" ? "" : this.radioCheck}>
                {this.state.radioName}
            </button>
        );
    }
}

Radio.propTypes = {
    name: PropTypes.string,
    value: PropTypes.string.isRequired,
    checked: PropTypes.oneOf(["checked", ""]),
    disabled: PropTypes.oneOf(["disabled", ""]),
    onClick: PropTypes.func.isRequired
};

Radio.defaultProps = {
    name: "",
    checked: "",
    disabled: "",
    onClick: undefined
};

export default Radio;
