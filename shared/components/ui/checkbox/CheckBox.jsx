import "./CheckBox.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import Icon from "desktop/resources/components/icon/Icon";

class CheckBox extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            checked: props.checked
        };

        this.onToggle = this.onToggle.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps) {
        const prop = {};

        if (nextProps.checked !== this.state.checked) {
            prop.checked = nextProps.checked;
        }

        this.setStateData(() => prop);
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onToggle() {
        this.setStateData(({ checked }) => {
            return { checked: !checked };
        }, () => {
            const { onChange } = this.props;

            if (typeof onChange === "function") {
                onChange(this.state.checked);
            }
        });
    }

    setStateData(update, callBack) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callBack);
        }
    }

    render() {
        const { checked } = this.state;

        return (
            <div className={classNames("check__box", { checked })} onClick={this.onToggle}>
                <div>
                    <div className="check__icon">
                        <Icon name="check_s" />
                    </div>
                    <div className="check__content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
}

CheckBox.propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func
};

export default CheckBox;
