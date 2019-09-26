import React, { Component } from "react";
import CountUp from "react-countup";

export default class Trust extends Component {
    constructor() {
        super();
        this.state = {
            counts_data: [
                {
                    code: "shot",
                    count: 1696,
                    name: "누적 촬영 건수",
                    ext: "건"
                },
                {
                    code: "estimate",
                    count: 9999,
                    name: "누적 견적 수",
                    ext: "건+"
                },
                {
                    code: "portfolio",
                    count: 2458,
                    name: "전체 포트폴리오 수",
                    ext: "개"
                },
                {
                    code: "artist",
                    count: 873,
                    name: "전체 작가 수",
                    ext: "명"
                }
            ],
            date: "2019년 8월 1일"
        };
    }

    componentWillMount() {
    }

    render() {
        return (
            <div className="biz-trust biz-panel__dist">
                <div className="biz-trust__counts">
                    {this.state.counts_data.map((count, idx) => {
                        return (
                            <div className="biz-trust__count" key={`biz_main_trust__${count.code}`}>
                                <div className="title">{count.name}</div>
                                <div>
                                    <CountUp className="count" start={0} end={count.count} duration={3} separator="," />
                                    <span className="count_end">{count.ext}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="date">
                    {this.state.date} 기준
                </div>
            </div>
        );
    }
}
