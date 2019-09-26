import "../scss/UploadItem.scss";
import React, { Component, PropTypes } from "react";

import UploadController from "shared/components/upload/UploadController";

class UploadItem extends Component {
    constructor() {
        super();

        this.state = {
            isLoad: false,
            uid: "",
            per: 0
        };

        this.onLoad = this.onLoad.bind(this);
        this.onLoadStart = this.onLoadStart.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onAbort = this.onAbort.bind(this);
    }

    componentWillMount() {
        const { data, onMount } = this.props;

        if (typeof onMount === "function") {
            this.state.uid = onMount({
                file: data.file,
                onLoad: this.onLoad,
                onLoadStart: this.onLoadStart,
                onProgress: this.onProgress
            });
        }
    }

    componentWillUnmount() {
        const { isLoad, uid } = this.state;

        if (!isLoad) {
            UploadController.deleteItem(uid);
        }
    }

    onLoad(result) {
        this.state.isLoad = true;
        const { data, onLoad } = this.props;

        if (data && typeof onLoad === "function") {
            onLoad(result, data);
        }
    }

    onLoadStart(e) {
    }

    onProgress(e) {
        const { total, loaded } = e;

        if (total && loaded) {
            const p = total / 100;
            const per = (loaded / p).toFixed(2);
            this.setState({
                per
            });
        }
    }

    onAbort() {
        const { data, onAbort } = this.props;
        const { isLoad, uid } = this.state;

        if (!isLoad) {
            UploadController.deleteItem(uid);

            if (typeof onAbort === "function") {
                onAbort(data, uid);
            }
        }
    }

    render() {
        const { per } = this.state;
        const { data } = this.props;

        if (!data || (data && !data.file)) {
            return null;
        }

        return (
            <div className="upload__item">
                <div className="progress__bar">
                    <div className="upload__remove">
                        <button className="f__button__close" onClick={this.onAbort} />
                    </div>
                    <span className="progress__bar__title">{data.file.name}</span>
                    <div className="progress__bar__outer">
                        <div className="progress__bar__inner" style={{ width: `${per}%` }} />
                    </div>
                </div>
            </div>
        );
    }
}

UploadItem.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    onMount: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired,
    onAbort: PropTypes.func.isRequired
};

export default UploadItem;
