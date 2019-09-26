import "./downloadContent.scss";
import React, { Component, propTypes } from "react";
import Buttons from "desktop/resources/components/button/Buttons";
import utils from "forsnap-utils";

export default class DownLoadContent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            file_count: props.file_count,
            download_able_array: props.download_able_array,
            type: props.type || "origin",
            reserve_type: props.reserve_type || ""
        };
        this.renderDownloadUnit = this.renderDownloadUnit.bind(this);
        this.getDownLoadUnit = this.getDownLoadUnit.bind(this);
        this.setChangeAbleDownload = this.setChangeAbleDownload.bind(this);
    }

    getDownLoadUnit(idx) {
        if (typeof this.props.onDownLoadUnit === "function") {
            this.props.onDownLoadUnit(idx, this.state.reserve_type);
            this.setState({ download_able_array: this.setChangeAbleDownload(idx) });
        }
    }

    renderDownloadUnit(count) {
        const content = [];
        const { download_able_array, reserve_type } = this.state;
        for (let i = 0, max = count; i < max; i += 1) {
            const is_active = download_able_array[i];
            const title = is_active ? "재다운로드" : "다운로드";
            const theme = is_active ? "pink" : "default";
            content.push(
                <div className="download-buttons" key={`downloadcontnet__${i}`}>
                    <p className="download-file-name">
                        {`${reserve_type === "origin" ? "원본" : "보정"}사진_${utils.fillSpace(i, 3, 0, "front")}`}
                        {/*{`${buyNo}_${type}_${utils.fillSpace(i, 3, 0, "front")}`}*/}
                    </p>
                    <Buttons
                        buttonStyle={{ width: "w179", shape: "round", theme, isActive: download_able_array[i] }}
                        inline={{ onClick: () => this.getDownLoadUnit(i) }}
                    >
                        {title}</Buttons>
                </div>
            );
        }
        return content;
    }

    setChangeAbleDownload(idx) {
        const { download_able_array } = this.state;
        if (!download_able_array[idx]) {
            return download_able_array.reduce((result, flag, i) => {
                if (idx === i) {
                    result.push(!flag);
                }
                result.push(flag);
                return result;
            }, []);
        }
        return download_able_array;
    }

    render() {
        const { file_count, reserve_type } = this.state;
        let download_type = "원본사진";
        if (reserve_type && reserve_type !== "origin") {
            download_type = "보정사진";
        }
        return (
            <div className="download-pop" key="sasfe">
                <p className="download-pop__title">{download_type} <strong>분할 다운로드</strong></p>
                <p className="download-pop__caption">촬영한 사진이 1GB 이상일 경우 분할 다운로드로 받으실 수 있습니다.</p>
                <div className="wrap-download">
                    {this.renderDownloadUnit(file_count)}
                </div>
            </div>
        );
    }
}
