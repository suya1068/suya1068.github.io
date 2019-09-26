import "./Photos.scss";
import React, { Component } from "react";

import utils from "forsnap-utils";

import Button from "desktop/resources/components/button/Buttons";
import PopModal from "shared/components/modal/PopModal";

import PhotoDefaultImage from "./PhotoDefaultImage";
import PhotoImage from "./PhotoImage";


class Photos extends Component {
    constructor(props) {
        super(props);

        this.state = {
            images: [],
            selected: []
        };

        this.onChangeImageUpload = this.onChangeImageUpload.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.onRemove = this.onRemove.bind(this);

        // public
        this.size = this.size.bind(this);
        this.getImages = this.getImages.bind(this);
    }

    /**
     * 이미지 파일 변경 핸들러
     * @param event
     */
    onChangeImageUpload(event) {
        const { images } = this.state;
        const files = Array.prototype.slice.call(event.target.files);
        const size = images.length;

        // 이미지 업로드 갯 수 체크(5장 이상 업로드 할 수 없다.);
        if ((size + files.length) > 5) {
            PopModal.alert("이미지를 5장 이상 업로드할 수 없습니다.");
            return;
        }

        // 이미지 중복 체크
        if (files.some(file => this.hasDuplicatedFile(file, images.map(img => img.file)))) {
            PopModal.alert("중복되는 파일이 존재합니다.");
            return;
        }

        // 파일 확장자 체크
        if (!this.isValidImageExtension(files)) {
            PopModal.alert("파일 업로드는\nJPG, JPEG, PNG 확장자만 가능합니다.");
            return;
        }

        // 20MB 이상 또는 110x110 이하인지 체크한다.;
        this.isValidImagesSize(files)
            .then(
                result => Promise.resolve(result),
                error => {
                    PopModal.alert(error.message);
                    return Promise.reject(error);
                }
            )
            .then(() => this.fetchFilesContent(files))
            .then(contents => contents.map((content, index) => this.createImage(utils.uniqId(), files[index], content)))
            .then(result => this.setState({ images: images.concat(result) }));
    }

    /**
     * 이미지를 선택한다.
     * @param id
     */
    onSelect(id) {
        const { selected } = this.state;
        const index = selected.indexOf(id);

        if (index > -1) {
            selected.splice(index, 1);
        } else {
            selected.push(id);
        }

        this.setState({ selected: [...selected] });
    }

    /**
     * 선택된 이미지를 제거한다.
     */
    onRemove() {
        const { selected, images } = this.state;

        this.setState({
            selected: [],
            images: [...images.filter(image => !selected.includes(image.id))]
        });
    }

    /**
     * @static
     * @param {File} data
     * @param {Array<File>} others
     * @returns {Boolean}
     */
    hasDuplicatedFile(data, others) {
        return others.some(file => this.isEqualFile(data, file));
    }

    /**
     * @static
     * @param {File} data
     * @param {File} other
     * @return {Boolean}
     */
    isEqualFile(data, other) {
        return data.name === other.name;
    }

    /**
     * 파일 확장자가 유효한지 판단한다.
     * @param {Array<File>} files
     * @return {*|boolean}
     */
    isValidImageExtension(files) {
        return files.every(file => /(jpg|jpeg|png|bmp)$/i.test(utils.fileExtension(file.name)));
    }

    /**
     * 모든 이미지 사이즈가 유효한지 판단한다.
     * @param {Array<File>} files
     * @return {Promise.<TResult>}
     */
    isValidImagesSize(files) {
        return Promise.all(files.map(file => this.isValidImageSize(file)));
    }

    /**
     * 이미지 사이즈가 유효한지 판단한다.
     * @param {File} file
     * @return {Promise}
     */
    isValidImageSize(file) {
        return new Promise((resolve, reject) => {
            const element = new Image();
            element.addEventListener("load", event => {
                if (file.size >= 20971520) {
                    reject({ valid: false, message: "20MB 이하의 이미지 파일을 선택해주세요." });
                } else if (element.width < 110 || element.height < 110) {
                    reject({ valid: false, message: "가로와 세로길이는 110픽셀 이상으로 선택해주세요." });
                } else {
                    resolve({ valid: true, message: "유효한 이미지 파일입니다." });
                }
            });

            element.addEventListener("error", () => {
                reject({ valid: false, message: "이미지 파일을 불러오지 못했습니다." });
            });

            element.src = window.URL.createObjectURL(file);
        });
    }

    /**
     * 이미지 객체를 생성한다.
     * @param {string} id
     * @param {File} file
     * @param {string} content
     * @return {{id: string, file: File, file_content: string}}
     */
    createImage(id, file, content) {
        return {
            id,
            file,
            file_content: content
        };
    }

    /**
     * 모든 파일의 컨텐츠를 가져온다.
     * @param files
     * @return {Promise.<*>}
     */
    fetchFilesContent(files) {
        return Promise.all(files.map(file => this.fetchFileContent(file)));
    }

    /**
     * 파일의 컨텐츠를 가져온다.
     * @param file
     * @return {Promise}
     */
    fetchFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", e => resolve(e.target.result), false);
            reader.addEventListener("error", () => reject("DOMException"), false);
            reader.readAsDataURL(file);
        });
    }

    /**
     * 이미지 사이즈를 가져온다.
     * @public
     * @returns {number}
     */
    size() {
        return this.state.images.length;
    }

    /**
     * 이미지 리스트 가져온다.
     * @public
     * @return {Array}
     */
    getImages() {
        return this.state.images;
    }

    renderImages() {
        const { images, selected } = this.state;

        const components = images.map(image => (
            <div key={image.id} className="photograph-comment-images__item">
                <PhotoImage
                    selected={selected}
                    image={image}
                    onClick={this.onSelect}
                />
            </div>
        ));

        while (components.length < 5) {
            components.push(
                <div key={components.length} className="photograph-comment-images__item">
                    <PhotoDefaultImage />
                </div>
            );
        }

        return components;
    }

    render() {
        const { selected } = this.state;

        return (
            <section className="photograph-comment-card">
                <div className="photograph-comment-card__header">
                    <h5 className="photograph-comment-card-title">
                        <span className="photograph-comment-badge">[선택]</span>사진을 등록해주세요.
                    </h5>
                </div>
                <div className="photograph-comment-card__body">
                    <div className="row">
                        <div className="columns col-12">
                            <div className="photograph-comment-images">
                                { this.renderImages() }
                            </div>
                        </div>
                    </div>
                    <div className="row mt-20">
                        <div className="columns col-12 text-center">
                            <div className="photograph-comment-button-group">
                                <Button
                                    buttonStyle={{ width: "w179", theme: "fill-pink", shape: "circle" }}
                                    inline={{
                                        onClick: this.onRemove,
                                        disabled: selected.length === 0
                                    }}
                                >삭제하기</Button>
                                <div className="photograph-comment-upload-btn">
                                    <Button buttonStyle={{ width: "w179", theme: "default", shape: "circle" }}>이미지 등록하기</Button>
                                    <input
                                        type="file"
                                        name="upload-file"
                                        accept="image/jpeg, image/jpg, image/png"
                                        multiple
                                        onChange={this.onChangeImageUpload}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-20">
                        <div className="columns col-12">
                            <div className="photograph-comment-help">
                                JPG, JPEG, PNG 파일의 형식의 이미지를 최대 5장까지 첨부할 수 있습니다.(20MB 이하)
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Photos;
