import React, { Component, PropTypes } from "react";
import { PRICE_TAG_FOR_CATEGORY } from "./priceTag.const";
import PriceTag from "./PriceTag";

export default class PriceTagContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            categorys: props.categorys,
            device_type: props.device_type,
            ext_click: props.ext_click
        };
    }

    componentWillMount() {
        this.combineCategorys(this.props.categorys);
    }

    combineCategorys(categorys) {
        if (typeof categorys !== "string") {
            throw Error("Target type is not String");
        }

        const splitCategory = categorys.split(",");
        const priceTagArr = splitCategory.reduce((result, category) => {
            const combineData = Object.assign({}, this.setCategoryPriceTagData(category));
            result.push(combineData);
            return result;
        }, []);

        this.setState({ priceTagArr });
    }

    setCategoryPriceTagData(category) {
        return { ...PRICE_TAG_FOR_CATEGORY[category.toUpperCase()] };
    }

    render() {
        const { priceTagArr } = this.state;
        const { device_type, ext_click } = this.props;
        return (
            <div className="simple-consult__body__pricetag">
                {priceTagArr && priceTagArr.length > 0 && priceTagArr.map(obj => {
                    return (
                        <PriceTag data={{ ...obj }} ext_click={ext_click} device_type={device_type} key={`price_tag__${obj.code}`} />
                    );
                })}
            </div>
        );
    }
}

PriceTagContainer.propTypes = {
    categorys: PropTypes.string.isRequired
};
