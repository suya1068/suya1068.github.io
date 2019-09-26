import React, { Component, PropTypes } from "react";

import api from "forsnap-api";
import utils from "forsnap-utils";

import Modal, { MODAL_TYPE } from "shared/components/modal/Modal";

import FileItem from "./FileItem";

class FileList extends Component {
    constructor(props) {
        super();

        this.state = {
            isMount: true,
            attach: props.attach || [],
            limit: 5,
            progress: false,
            process: [],
            isProcess: false
        };

        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.onLoad = this.onLoad.bind(this);
        this.onRemove = this.onRemove.bind(this);
        this.onProcessAPI = this.onProcessAPI.bind(this);

        this.addAPI = this.addAPI.bind(this);
        this.removeAPI = this.removeAPI.bind(this);
        this.apiAttachConsult = this.apiAttachConsult.bind(this);
        this.addFile = this.addFile.bind(this);
        this.mergeAttach = this.mergeAttach.bind(this);
        this.setProgress = this.setProgress.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    onDrop(e) {
        e.stopPropagation();
        e.preventDefault();

        const dt = e.dataTransfer;

        this.addFile(dt.files);
    }

    onDragEnter(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    onDragOver(e) {
        e.stopPropagation();
        e.preventDefault();
    }

    onFileUpload() {
        if (this.refUpload) {
            this.refUpload.click();
        }
    }

    onLoad(file_name, uploadKey) {
        this.addAPI(file_name, () => {
            const params = {
                attach_info: JSON.stringify(this.state.attach.reduce((r, o) => {
                    if (o.file_name === file_name) {
                        r.push(Object.assign({}, {
                            file_name: o.file_name,
                            size: o.size,
                            key: uploadKey
                        }));
                    } else if (o.path) {
                        r.push(Object.assign({}, {
                            file_name: o.file_name,
                            size: o.size,
                            path: o.path
                        }));
                    }
                    return r;
                }, []))
            };

            this.apiAttachConsult(params)
                .then(data => {
                    if (data) {
                        this.setStateData(state => {
                            return {
                                attach: this.mergeAttach(state.attach, data.attach || [])
                            };
                        }, () => {
                            this.onProcessAPI();
                        });
                    }
                });
        });
    }

    onRemove(file_name, uid) {
        if (uid) {
            this.setStateData(({ attach }) => {
                const index = attach.findIndex(o => o.file_name === file_name);
                if (index !== -1) {
                    attach.splice(index, 1);
                }

                return {
                    attach
                };
            });
        } else {
            this.setProgress(true);
            this.removeAPI(file_name);
            this.addAPI(file_name, () => {
                const { attach } = this.state;
                const params = {
                    attach_info: JSON.stringify(attach.reduce((r, o) => {
                        if (o.file_name !== file_name && o.path) {
                            r.push({
                                file_name: o.file_name,
                                size: o.size,
                                path: o.path
                            });
                        }
                        return r;
                    }, []))
                };

                this.apiAttachConsult(params)
                    .then(data => {
                        this.setProgress(false);
                        this.setStateData(state => {
                            const merge = state.attach.reduce((r, o) => {
                                if (o.file_name !== file_name) {
                                    const item = (data.attach || []).find(a => a.file_name === o.file_name);
                                    if (item) {
                                        r.push(Object.assign({}, o, { path: item ? item.path || "" : "" }));
                                    }
                                }
                                return r;
                            }, []);
                            return {
                                attach: merge
                            };
                        }, () => {
                            this.onProcessAPI();
                        });
                    });
            });
        }
    }

    onProcessAPI() {
        if (this.state.process.length) {
            const find = this.state.process.splice(0, 1);
            if (find && find.length) {
                const item = find[0];
                item.callback();
            } else {
                this.onProcessAPI();
            }
        } else {
            this.state.isProcess = false;
        }
    }

    addAPI(file_name, callback) {
        this.state.process.push({ file_name, callback });
        if (!this.state.isProcess) {
            this.state.isProcess = true;
            this.onProcessAPI();
        }
    }

    removeAPI(file_name) {
        this.state.process = this.state.process.reduce((r, o) => {
            if (o.file_name !== file_name) {
                r.push(Object.assign({}, o));
            }
            return r;
        }, []);
    }

    apiAttachConsult(data) {
        const { advice_order_no } = this.props;
        return api.orders.attachConsult(advice_order_no, data)
            .then(response => {
                return response.data;
            })
            .catch(error => {
                this.setProgress(false);
                if (error && error.data) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: error.data
                    });
                }
            });
    }

    addFile(files) {
        const { upload_info } = this.props;
        const { attach, limit } = this.state;
        const limitCount = limit - attach.length;

        if (upload_info && files && files.length > 0) {
            if (files.length > limitCount) {
                Modal.show({
                    type: MODAL_TYPE.ALERT,
                    content: utils.linebreak(`업로드 할 수 있는 사진 수를 넘겼습니다.\n남은 장수는 ${limit}장입니다`)
                });
            } else {
                const exist = [];
                let isExt = false;
                const names = [];

                for (let i = 0; i < files.length; i += 1) {
                    const file = files.item(i);
                    const ext = utils.fileExtension(file.name);

                    if ((/(jpg|jpeg|png|bmp|pdf|xls|xlsx|ppt|pptx)$/i).test(ext)) {
                        if (!attach.find(o => o.file_name === file.name)) {
                            attach.push({
                                file,
                                file_name: file.name,
                                size: file.size
                            });
                        } else {
                            exist.push(file.name);
                        }
                    } else {
                        names.push(file.name);
                        isExt = true;
                    }
                }

                if (exist.length) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(`같은 파일이 존재합니다.\n\n${exist.toString().replace(",", "<br />")}`)
                    });
                }

                if (isExt) {
                    Modal.show({
                        type: MODAL_TYPE.ALERT,
                        content: utils.linebreak(`파일 업로드는\nJPG, JPEG, PNG, BMP, PDF, XLS, XLSX, PPT, PPTX 확장자만 가능합니다.\n\n${names.join("\n")}`)
                    });
                }

                if (!this.state.isUnMount) {
                    this.setState({
                        attach
                    });
                }
            }
        }
    }

    mergeAttach(data = [], merge = []) {
        return data.reduce((r, o) => {
            const item = merge.find(a => a.file_name === o.file_name);
            r.push(Object.assign({}, o, { path: item ? item.path || "" : "" }));
            return r;
        }, []);
    }

    setProgress(b) {
        if (b) {
            this.state.progress = true;
            Modal.show({
                type: MODAL_TYPE.PROGRESS
            });
        } else {
            this.state.progress = false;
            Modal.close(MODAL_TYPE.PROGRESS);
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
        const { upload_info } = this.props;
        const { attach, limit } = this.state;
        const accept = [
            "image/jpeg",
            "image/png",
            "image/bmp",
            ".pdf",
            "application/msword",
            "application/vnd.ms-excel",
            "application/vnd.ms-powerpoint",
            ".xlsx"
        ];

        return (
            <div className="consult__file__upload">
                <input
                    type="file"
                    multiple="multiple"
                    accept={accept.toString()}
                    onChange={e => this.addFile(e.target.files)}
                    ref={ref => (this.refUpload = ref)}
                />
                <div className="consult__file__list" onDrop={this.onDrop} onDragEnter={this.onDragEnter} onDragOver={this.onDragOver}>
                    <div className="list__container">
                        {attach.map(o => {
                            return <FileItem key={o.file_name} data={o} upload_info={upload_info} onLoad={this.onLoad} onRemove={this.onRemove} />;
                        })}
                        {attach.length < limit ?
                            <div className="file__item" onClick={this.onFileUpload}>
                                <div className="file__item__container">
                                    <div className="file__item__content file__add">
                                        + {limit - attach.length}
                                    </div>
                                </div>
                            </div>
                            : null
                        }
                    </div>
                </div>
            </div>
        );
    }
}

FileList.propTypes = {
    advice_order_no: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    attach: PropTypes.arrayOf(PropTypes.shape({
        file_name: PropTypes.string,
        path: PropTypes.string
    })),
    upload_info: PropTypes.shape([PropTypes.node])
};

export default FileList;
