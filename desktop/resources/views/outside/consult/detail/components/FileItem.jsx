import React, { Component, PropTypes } from "react";

import UploadController from "shared/components/upload/UploadController";

class FileItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            isProcess: false,
            per: 0,
            uid: ""
        };

        this.onLoadStart = this.onLoadStart.bind(this);
        this.onProgress = this.onProgress.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.setStateData = this.setStateData.bind(this);
    }

    componentDidMount() {
        const { data, upload_info } = this.props;

        if (data.file) {
            this.setStateData(() => {
                return {
                    isProcess: true
                };
            }, () => {
                this.state.uid = UploadController.addItem({
                    file: data.file,
                    uploadInfo: upload_info,
                    onLoadStart: this.onLoadStart,
                    onProgress: this.onProgress,
                    onLoad: this.onLoad
                });
            });
        }
    }

    componentWillUnmount() {
        const { data } = this.props;
        const { isProcess } = this.state;
        this.state.isMount = false;

        if (data.file && isProcess) {
            UploadController.deleteItem(this.state.uid);
        }
        this.state.uid = "";
    }

    onLoadStart() {
    }

    onProgress(e) {
        const { total, loaded } = e;

        if (total && loaded) {
            const p = total / 100;
            const per = (loaded / p).toFixed(2);
            this.setStateData(() => {
                return {
                    per
                };
            });
        }
    }

    onLoad(result) {
        const { data, onLoad } = this.props;

        if (result.status) {
            this.state.uid = "";
            this.setStateData(() => {
                return {
                    isProcess: false
                };
            }, () => {
                if (typeof onLoad === "function") {
                    onLoad(data.file_name, result.uploadKey);
                }
            });
        }
    }

    onRemove() {
        const { data, onRemove } = this.props;
        const { uid } = this.state;
        if (typeof onRemove === "function") {
            UploadController.deleteItem(this.state.uid);
            onRemove(data.file_name, uid);
            this.state.uid = "";
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(state => {
                return update(state);
            }, callback);
        }
    }

    render() {
        const { data } = this.props;
        const { per, isProcess } = this.state;

        const fileSize = Math.floor((data.size || 0) / 1024);

        let size = `${fileSize}kb`;
        if (fileSize.toFixed().length > 3) {
            size = `${Math.round(fileSize / 100) / 10}mb`;
        }

        return (
            <div className="file__item">
                <div className="file__item__container">
                    <div className="file__item__content">
                        <div className="item__icon">
                            <img alt="icon" src={`${__SERVER__.img}/common/icon_solid_picture.png`} />
                        </div>
                        <div className="item__info">
                            <div className="title">{data.file_name}</div>
                            {isProcess ?
                                <div className="item__progress"><div style={{ width: `${per}%` }}>&nbsp;</div></div>
                                : <div className="description">{size}</div>
                            }
                        </div>
                        <button className="item__button">
                            <span className="_button _button__close white active" onClick={this.onRemove}>&nbsp;</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

FileItem.propTypes = {
    data: PropTypes.shape({
        file: PropTypes.instanceOf(File)
    }),
    upload_info: PropTypes.shape([PropTypes.node]),
    onRemove: PropTypes.func.isRequired,
    onLoad: PropTypes.func.isRequired
};
FileItem.defaultProps = {};

export default FileItem;
