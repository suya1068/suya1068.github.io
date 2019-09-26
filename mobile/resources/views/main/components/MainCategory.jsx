import React, { Component, PropTypes } from "react";
import classNames from "classnames";

import utils from "forsnap-utils";

class MainCategory extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isMount: true,
            data: props.data,
            select: 0,
            hover: null,
            intervalId: null
        };

        this.onSelect = this.onSelect.bind(this);
        this.onMouse = this.onMouse.bind(this);

        this.startInterval = this.startInterval.bind(this);
        this.stopInterval = this.stopInterval.bind(this);
        this.select = this.select.bind(this);

        this.gaEvent = this.gaEvent.bind(this);
        this.setStateData = this.setStateData.bind(this);
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.select(0);
        this.startInterval();
    }

    componentWillUnmount() {
        this.state.isMount = false;
        this.stopInterval();
    }

    onSelect(i) {
        this.select(i);
    }

    onMouse(i = null) {
        this.setStateData(() => {
            return {
                hover: i
            };
        }, () => {
            if (i === null) {
                this.startInterval();
            } else {
                this.stopInterval();
            }
        });
    }

    startInterval() {
        if (this.state.intervalId) {
            this.stopInterval();
        }
        this.state.intervalId = setInterval(() => this.select(this.state.select + 1), 5000);
    }

    stopInterval() {
        clearInterval(this.state.intervalId);
        this.state.intervalId = null;
    }

    select(i) {
        this.setStateData(({ data }) => {
            let select = i;
            if (select < 0) {
                select = data.length - 1;
            } else if (select > (data.length - 1)) {
                select = 0;
            }

            return {
                select,
                hover: null
            };
        });
    }

    gaEvent(name) {
        utils.ad.gaEvent("M_개인_메인", "메인 카테고리 선택", `카테고리 = ${name}`);
        if (typeof this.props.gaEvent === "function") {
            this.props.gaEvent("메인 카테고리 선택");
        }
    }

    setStateData(update, callback) {
        if (this.state.isMount) {
            this.setState(
                state => {
                    return update(state);
                },
                callback
            );
        }
    }

    render() {
        const { data, select, hover } = this.state;

        if (!data || !Array.isArray(data) || !data.length) {
            return null;
        }

        const item = data[select];

        if (!item) {
            return null;
        }

        return (
            <div className="ma__sld" style={{ background: `url(${__SERVER__.img}/mobile/${item.bg}) center no-repeat`, backgroundSize: "cover" }}>
                <h1 className="sr-only">개인 카테고리</h1>
                <div className="sld__cti">
                    <div className="cti">
                        <div className="cit__ct">
                            <div className="ct">
                                <p className="ct__tt">{item.name}</p>
                                <p className="ct__tag">
                                    {item.tag.map((o, i) => {
                                        return <span key={`tag_${i}`}>#{o}</span>;
                                    })}
                                </p>
                                <p className="ct__btn">
                                    <a href={`/products?category=${item.code}`} onTouchStart={() => this.gaEvent(item.name)}>
                                        <button className="_button _button__fill__yellow">
                                            바로가기
                                        </button>
                                    </a>
                                </p>
                            </div>
                            <div className="ct__sub">포스냅은 언제 어디서든 모든 촬영이 가능합니다.</div>
                            <div className="ct__tab">
                                {data.map((o, i) => {
                                    const active = i === select;
                                    const isHover = i === hover;
                                    return (
                                        <button
                                            key={`category_${o.code}`}
                                            className={classNames("tab__item", { active: active || isHover })}
                                            onTouchStart={() => this.onSelect(i)}
                                            onMouseEnter={() => this.onMouse(i)}
                                            onMouseLeave={() => this.onMouse}
                                        >
                                            {o.name}
                                            {active || isHover ? <i className={classNames("_icon__arrow__cr", { active })} /> : null}
                                        </button>
                                    );
                                })}
                            </div>
                            <div className="ct__by">
                                <span onTouchStart={() => (location.href = `@${item.artist_name}`)}>{item.artist_name && `by ${item.artist_name}`}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

MainCategory.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        tag: PropTypes.arrayOf(PropTypes.string).isRequired,
        bg: PropTypes.string.isRequired
    })).isRequired
};
MainCategory.defaultProps = {};

export default MainCategory;
