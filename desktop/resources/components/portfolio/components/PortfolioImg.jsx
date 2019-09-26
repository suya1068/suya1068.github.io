import React, { Component, PropTypes } from "react";
import axios from "axios";

export default class PortfolioImg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isMount: true,
            src: props.src,
            className: props.className,
            xhr: props.xhr,
            defaultImage: "/common/forsnap_bg_default.jpg",
            request: 0,
            request_count: 30,
            fetching: true,
            image_url: ""
        };
        this.onLoad = this.onLoad.bind(this);
        this.onError = this.onError.bind(this);
        this.setImageUrl = this.setImageUrl.bind(this);
        this.fetchThumbImage = this.fetchThumbImage.bind(this);
    }

    componentWillMount() {
        const { xhr } = this.props;
        const { src } = this.state;

        if (this.state.isMount && xhr) {
            this.requestImage(src)
                .then(
                    url => this.setImageUrl(url),
                    error_url => this.setImageUrl(error_url)
                );
        }
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        this.state.isMount = false;
    }

    /**
     * 이미지 주소 저장 (imgae_url)
     * @param url
     */
    setImageUrl(url) {
        if (this.state.isMount) {
            this.setState({ image_url: url });
        }
    }

    /**
     * 이미지 요청
     * @param src
     * @returns {Promise<any>}
     */
    requestImage(src) {
        return new Promise((resolve, reject) => {
            this.fetchThumbImage(src)
                .then(
                    () => resolve(src),
                    result_url => reject(result_url)
                );
        });
    }

    /**
     * 이미지 불러오기 프로세스
     * @param src
     * @returns {PromiseLike<T> | Promise<T> | *}
     */
    fetchThumbImage(src) {
        return axios.get(src)
            .then(
                response => {
                    if (response.status === 200) {
                        return Promise.resolve(src);
                    }

                    if (response.status === 202) {
                        if (this.isEnableRequest()) {
                            this.setState(state => ({ request: state.request + 1 }));
                            return this.fetchThumbImage(src);
                        }

                        return Promise.reject(this.getDefaultImageURL(this.state.defaultImage));
                    }

                    return Promise.reject(this.getDefaultImageURL(this.state.defaultImage));
                },
                () => Promise.reject(this.getDefaultImageURL(this.state.defaultImage))
            );
    }

    /**
     * 썸네일 이미지를 요청 가능한지 판단한다.
     * @return {boolean}
     */
    isEnableRequest() {
        return this.state.request <= this.state.request_count;
    }

    /**
     * 디폴트 이미지 반환
     * @param src
     * @returns {string}
     */
    getDefaultImageURL(src) {
        return `${__SERVER__.img}${src}`;
    }

    /**
     * 이미지 로드 이벤트
     */
    onLoad() {
        if (this.state.isMount) {
            this.setState({ fetching: false });
        }
    }

    /**
     * 이미지 에러 이벤트
     * @param e
     */
    onError(e) {
        const target = e.target;
        if (this.state.isMount) {
            this.setState({
                image_url: this.getDefaultImageURL(this.state.defaultImage),
                fetching: false
            }, () => {
                target.src = this.state.image_url;
                // if (!this.isEnableRequest()) {
                //
                // }
            });
        }
    }

    render() {
        const { src, className, isVideo } = this.props;
        return (
            <img
                className={className}
                //src={image_url}
                data-src={src}
                src={isVideo ? src : null}
                role="presentation"
                onError={this.onError}
                onLoad={this.onLoad}
            />
        );
    }
}

PortfolioImg.propTypes = {
    src: PropTypes.string,
    className: PropTypes.string,
    xhr: PropTypes.bool.isRequired
};
