import React, { Component } from "react";
import API from "forsnap-api";
import ArtistanotherProducts from "./ArtistanotherProducts";
import utils from "forsnap-utils";
import cookie from "forsnap-cookie";
import constant from "shared/constant";
import PopModal from "shared/components/modal/PopModal";

export default class ArtistAnotherProductContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            product_no: props.product_no,
            isLoading: false,
            enter: props.enter
        };
    }

    componentWillMount() {

    }

    componentDidMount() {
        const { product_no, enter } = this.props;

        const enter_query = enter ? "Y" : "N";

        const uuid = utils.getUUID().replace(/-/g, "");
        const d = new Date();
        d.setYear(d.getFullYear() + 1);

        cookie.setCookie({ [constant.FORSNAP_UUID]: uuid }, d.toUTCString());

        API.products.queryProductInfo(product_no, { uuid, enter: enter_query })
            .then(response => {
                if (response.status === 200) {
                    const data = response.data;
                    this.setState({
                        artist_product_list: data.artist_product_list,
                        nick_name: data.nick_name,
                        isLoading: true
                    });
                }
            }).catch(error => {
                PopModal.alert(error.data);
            });
    }

    render() {
        const { artist_product_list, nick_name, isLoading } = this.state;
        if (!isLoading) {
            return false;
        }
        return (
            <ArtistanotherProducts list={artist_product_list ? artist_product_list.list || [] : []} nick_name={nick_name} />
        );
    }
}
