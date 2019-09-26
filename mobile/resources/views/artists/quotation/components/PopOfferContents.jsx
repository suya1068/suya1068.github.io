import React, { Component, PropTypes } from "react";
import classNames from "classnames";

export default class PopOfferContents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            list: props.list,
            previous_select: "",
            previous_content: ""
        };
        // 최근 제출한 촬영내용 리스트 관련 메서드
        this.selectContent = this.selectContent.bind(this);
        this.closeModalOfferContents = this.closeModalOfferContents.bind(this);
        this.submitOfferContent = this.submitOfferContent.bind(this);
        this.ignoreEmptyContent = this.ignoreEmptyContent.bind(this);
    }

    componentWillMount() {
    }

    closeModalOfferContents() {
        this.setState({
            previous_select: "",
            previous_content: ""
        }, () => {
            if (typeof this.props.onClose === "function") {
                this.props.onClose();
            }
        });
    }

    selectContent(content, idx) {
        if (content !== "") {
            this.setState({
                previous_select: idx,
                previous_content: content
            });
        }
    }

    ignoreEmptyContent(list) {
        const _list = list.reduce((result, obj) => {
            if (obj.content !== "") {
                result.push(obj);
            }
            return result;
        }, []);

        return _list;
    }

    submitOfferContent() {
        const { previous_content } = this.state;
        if (typeof this.props.onSubmitContent === "function") {
            this.props.onSubmitContent(previous_content);
        }
    }

    render() {
        const list = this.ignoreEmptyContent(this.props.list);
        // const { list } = this.state;
        return (
            <div className="offer_contents">
                <h3 style={{ padding: "1rem" }}>최근 발송한 견적서</h3>
                <div className="contents-list">
                    <div className="list-wrap">
                        {list.map((obj, idx) => {
                            const reg_dt = obj.reg_dt.substr(0, obj.reg_dt.lastIndexOf(":"));
                            const c = obj.content === "" ? "견적서 작성 중" : obj.content;
                            return (
                                <div className={classNames("list-container", { "disable": obj.content === "" })} key={`previous__offer__contents__${idx}`} onClick={e => this.selectContent(obj.content, idx)}>
                                    <div className={classNames("check-button", { "select": this.state.previous_select === idx })} />
                                    <div className="category-tag">{obj.category_name}</div>
                                    <p className="content">{c}</p>
                                    <p className="date">{reg_dt}</p>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="contents-buttons">
                    <button className="button button-block button__rect close" onClick={this.closeModalOfferContents}>닫기</button>
                    <button className="button button-block button__rect submit" onClick={this.submitOfferContent}>확인</button>
                </div>
            </div>
        );
    }
}

PopOfferContents.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node]))
};

PopOfferContents.defaultProps = {
    list: []
};
