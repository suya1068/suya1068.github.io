import "./artistInquireArtist.scss";
import React, { Component, PropTypes } from "react";
import InquireNoneListArtist from "./component/InquireNoneListArtist";
import Panel from "./component/panel/Panel";
import utils from "forsnap-utils";

export default class AfterInquireArtist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            renderList: [],
            title: utils.linebreak("견적산출 후 촬영가능한 작가님을\n확인하실 수 있습니다."),
            limit: 3
        };
        this.renderList = this.renderList.bind(this);
        this.setArtistList = this.setArtistList.bind(this);
        this.onSetProducts = this.onSetProducts.bind(this);
        this.onConsultArtist = this.onConsultArtist.bind(this);
    }

    componentWillReceiveProps(np) {
        if (JSON.stringify(np.list) !== JSON.stringify(this.props.list)) {
            this.setState({
                list: np.list,
                title: np.list.length > 0 ? "견적가로 추천작가에게 문의를 남겨보세요." : utils.linebreak("견적산출 후 촬영가능한 작가님을\n확인하실 수 있습니다."),
                renderList: this.setArtistList(np.list)
            });
        }
    }

    /**
     * 리밋만큼 상품리스트를 설정한다.
     * @param list
     * @returns {Array|*}
     */
    setArtistList(list) {
        const { limit } = this.state;
        let renderList = [];
        const maxLength = list.length < limit ? list.length : limit;

        if (list.length > 0) {
            for (let i = 0; i < maxLength; i += 1) {
                renderList.push(list[i]);
            }
        } else {
            renderList = [];
        }

        return renderList;
    }

    /**
     * 상품을 세팅합니다.
     * @param no
     * @param index - 바꿀 인덱스
     */
    onSetProducts(no, index) {
        const { renderList, list } = this.state;
        const _renderList = renderList.concat();
        const _list = list.concat();

        const originNos = _list.reduce((result, obj) => { result.push(obj.no); return result; }, []);
        const renderNos = _renderList.reduce((result, obj) => { result.push(obj.no); return result; }, []);
        const insertNo = originNos.filter(number => !renderNos.includes(number))[0];

        const listSplice = _list.filter(item => item.no !== no);
        const targetItem = _renderList.filter(item => item.no === no)[0];

        utils.ad.gaEvent("M_기업_리스트", "견적_작가선택", `${targetItem.category ? targetItem.category.toUpperCase() : ""}_${targetItem.nick_name}_${targetItem.product_no}`);

        listSplice.push(targetItem);

        _renderList.splice(index, 1, list.filter(item => item.no === insertNo)[0]);

        this.setState({
            renderList: _renderList,
            list: listSplice
        });
    }

    /**
     * 견적가로 작가에게 문의하기
     */
    onConsultArtist() {
        const { renderList } = this.state;
        if (typeof this.props.onConsultArtist === "function") {
            this.props.onConsultArtist(renderList);
        }
    }

    renderList() {
        const { list } = this.props;
        const { renderList, limit } = this.state;
        let content;
        if (renderList.length < 1) {
            content = <InquireNoneListArtist />;
        } else {
            content = (
                <div className="inquire-list">
                    {renderList.map((obj, idx) => {
                        return (
                            <Panel
                                key={`panel__${idx}`}
                                data={obj}
                                index={idx}
                                noSelect={list.length - 1 < limit || false}
                                onSetProducts={this.onSetProducts}
                            />
                        );
                    })}
                    <div className="inquire-btn">
                        <button className="button" onClick={this.onConsultArtist}>위의 작가들에게 문의하기</button>
                    </div>
                </div>
            );
        }

        return content;
    }

    render() {
        const { title } = this.state;
        return (
            <section className="products__list__page__after-inquire-artist after-inquire-artist">
                <h2 className="section-title title" style={{ wordBreak: "keep-all" }}>{title}</h2>
                {this.renderList()}
            </section>
        );
    }
}
