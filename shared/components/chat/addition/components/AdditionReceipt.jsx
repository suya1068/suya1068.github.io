import "../scss/AdditionReceipt.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

import PCDropDown from "desktop/resources/components/form/Dropdown";
import MODropDown from "mobile/resources/components/dropdown/DropDown";

class AdditionReceipt extends Component {
    constructor(props) {
        super(props);

        this.state = {
            buyNo: ""
        };

        this.changeReceipt = this.changeReceipt.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        const { data } = this.props;
        if (data && utils.isArray(data.list)) {
            const item = data.list[0];

            if (item) {
                this.state.buyNo = this.changeReceipt(item.buy_no);
            }
        }
    }

    componentWillReceiveProps(nextProps, nextState) {
        const data = this.props.data;
        const nData = nextProps.data;

        if (data && nData && data.tab !== nData.tab && nData.tab === "EXTRA") {
            if (utils.isArray(nData.list)) {
                const item = nData.list[0];

                if (item) {
                    this.state.buyNo = this.changeReceipt(item.buy_no);
                }
            }
        }
    }

    onSelect(value) {
        const buyNo = this.changeReceipt(value);
        this.setState({
            buyNo
        });
    }

    changeReceipt(value) {
        const { IF } = this.props.data;

        if (IF && typeof IF.setReceipt === "function") {
            return IF.setReceipt(value);
        }

        return null;
    }

    render() {
        const { buyNo } = this.state;
        const { data } = this.props;

        if (!data || !utils.isArray(data.list)) {
            return null;
        }

        const isMobile = utils.agent.isMobile();
        const isDisabled = data.tab === "CUSTOM" ? "disabled" : "";

        return (
            <div className="addition__receipt">
                <div className={classNames("addition__receipt__choose", { disabled: isDisabled })}>
                    {isMobile
                        ? <MODropDown list={data.list} select={buyNo} keys={{ name: "buy_no", value: "buy_no" }} resultFunc={value => this.onSelect(value)} size="small" disabled={isDisabled} />
                        : <PCDropDown list={data.list} select={buyNo} keys={{ name: "buy_no", value: "buy_no" }} resultFunc={value => this.onSelect(value)} size="small" disabled={isDisabled} />
                    }
                </div>
            </div>
        );
    }
}

AdditionReceipt.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired
};

export default AdditionReceipt;
