import React, { Component, PropTypes } from "react";
import Radio from "./Radio";

/**
 * 라디오 버튼 그룹
 * @param radios - 라디오 버튼을 만들 Object형 데이터 ( key(value): {name, checked} )
 * @param resultFunc - 라디오 버튼 선택된 value를 넘김
 *
 * value를 값으로 넘기지 않고 key로 대체
 */
class RadioGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            radioData: this.props.radios,
            resultFunc: this.props.resultFunc
        };

        this.radiosClick = this.radiosClick.bind(this);
    }

    componentWillMount() {
        for (let i = 0; i < this.state.radioData.length; i += 1) {
            const radio = this.state.radioData[i];
            if (radio.checked === "checked") {
                this.radiosClick(radio.value);
                break;
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ radioData: nextProps.radios, oldValue: "" });
    }

    radiosClick(value) {
        for (let i = 0; i < this.state.radioData.length; i += 1) {
            const radio = this.state.radioData[i];
            if (value === radio.value) {
                radio.checked = "checked";
            } else {
                radio.checked = "";
            }

            this.state.radioData[i] = radio;
        }

        this.setState({
            radioData: this.state.radioData
        });

        // 선택된 라디오값을 부모로 넘겨줌
        if (this.state.resultFunc !== undefined) {
            this.state.resultFunc(value);
        }
    }

    render() {
        return (
            <div className="radio-group">
                {Object.keys(this.state.radioData).map(key => {
                    const obj = this.state.radioData[key];
                    return (
                        <Radio key={key} value={obj.value} name={obj.name} checked={obj.checked} disabled={obj.disabled} onClick={this.radiosClick} />
                    );
                })}
            </div>
        );
    }
}

RadioGroup.propTypes = {
    radios: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.string,
        checked: PropTypes.oneOf(["checked", ""])
    })),
    resultFunc: PropTypes.func
};

RadioGroup.defaultProps = {
    resultFunc: undefined
};

export default RadioGroup;
