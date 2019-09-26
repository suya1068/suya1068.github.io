import "./virtual_loading.scss";
import React, { Component } from "react";

export default class VirtualLoading extends Component {
    constructor() {
        super();
        this.state = {};
    }

    componentWillMount() {

    }

    componentDidMount() {
        const ref = this.loading_ref;
        const max = 12;
        let count = 1;
        setInterval(() => {
            count += 1;
            if (count > max) {
                count = 1;
            }
            const target_class = `f__icon__loading-${count}`;
            if (ref.classList[1]) {
                ref.classList.remove(ref.classList[1]);
            }
            ref.classList.add(target_class);
        }, 100);
    }

    render() {
        return (
            <div className="virtual-loading">
                <i className="f__icon f__icon__loading-1" ref={node => (this.loading_ref = node)} />
                <span className="virtual-loading__text">견적을 확인중입니다.</span>
            </div>
        );
    }
}
