import "./dropdown.scss";
import React, { Component, PropTypes } from "react";
import classNames from "classnames";
import utils from "forsnap-utils";
import Icon from "desktop/resources/components/icon/Icon";
import Buttons from "desktop/resources/components/button/Buttons";

const classSize = {
    default: "",
    small: "dropdown-small",
    large: "dropdown-large"
};

// 선택된 값을 부모로 넘기는 이벤트 처리 필요

class Dropdown extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonSize: props.size,
            isFocus: "",
            isShow: "",
            icon: props.icon || "dt",
            selectKey: props.select,
            resultFunc: props.resultFunc
        };

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
        this.onClickCheck = this.onClickCheck.bind(this);

        this.listShow = this.listShow.bind(this);
        this.listHide = this.listHide.bind(this);
    }

    // 사전에 선택된 키가 없을시 첫번째값을 선택함
    componentWillMount() {
        const prop = {};

        prop.selectKey = this.checkSelectKey(this.props.list, this.props.keys, this.state.selectKey);

        this.setState(prop);
    }

    componentWillReceiveProps(nextProps) {
        const prop = {};

        if ((nextProps.select !== this.state.selectKey) ||
            (JSON.stringify(nextProps.list) !== JSON.stringify(this.props.list))) {
            prop.selectKey = this.checkSelectKey(nextProps.list, nextProps.keys, nextProps.select);
        }

        if (Object.keys(prop).length > 0) {
            this.setState(prop);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(nextProps.list) !== JSON.stringify(this.props.list)
            || nextState.isShow !== this.state.isShow
            || nextState.selectKey !== this.state.selectKey
            || nextProps.select !== nextState.selectKey
            || nextState.isFocus !== this.state.isFocus
            || nextProps.disabled !== this.props.disabled) {
            return true;
        }
        return false;
    }

    // 드롭다운 버튼에 포커스 왔을때
    onFocus(e) {
        this.setState({ isFocus: "focus" });
    }

    // 드룹다운 버튼에 포커스가 없어졌을때
    onBlur(e) {
        let index;

        if (e && e.path) {
            index = e.path.findIndex(el => {
                return el.className === "fors-dropdown";
            });
        }

        if (this.state.isFocus && index === -1) {
            this.setState({ isFocus: "" }, () => this.listHide());
        }
    }

    // 드롭다운 버튼에서 스페이스, 방향키 (위, 아래) 누를시 목록보여주기, 셀렉트 이동시키기
    onKeyDown(e) {
        const keyCode = (e.keyCode ? e.keyCode : e.which);
        const list = e.target.parentElement.nextSibling;

        if (keyCode === 32 || keyCode === 38 || keyCode === 40) {
            if (this.state.isShow === "") {
                this.listShow();
            } else if (keyCode === 38) {
                // 방향키 위
                this.moveSelector(true);
            } else if (keyCode === 40) {
                // 방향키 아래
                this.moveSelector(false);
            }
        } else if (keyCode === 13) {
            this.itemSelect(list);
        } else if (keyCode === 9) {
            this.listHide();
        }
    }

    onClickCheck(e) {
        if (e && e.path) {
            const index = e.path.findIndex(el => {
                return el.className === "fors-select-box";
            });

            if (index === -1) {
                this.listHide();
            }
        } else {
            this.listHide();
        }
    }

    getClassName() {
        return classNames(
            "fors-dropdown",
            classSize[this.state.buttonSize],
            this.props.disabled ? "disabled" : ""
        );
    }

    getListItem(list, keys, key = "") {
        if (key === null || key === undefined) {
            return undefined;
        }

        const vKey = keys.value ? keys.value : "value";
        return list.find(obj => { return obj[vKey].toString() === key.toString(); });
    }

    isList(list) {
        return list && Array.isArray(list) && list.length > 0;
    }

    // 목록 보여주기
    listShow() {
        document.onkeydown = e => {
            return false;
        };

        const input = this.input;
        input.focus();

        if (this.state.isShow === "show") {
            this.listHide();
        } else {
            this.setState({
                isShow: "show"
            }, () => {
                setTimeout(() => {
                    window.addEventListener("click", this.onClickCheck);
                }, 0);
            });
        }
    }

    // 목록 숨기기
    listHide() {
        setTimeout(() => {
            document.onkeydown = e => {
                return true;
            };

            this.setState({
                isShow: ""
            }, () => {
                window.removeEventListener("click", this.onClickCheck);
            });
        }, 100);
    }

    // 셀렉트 이동 처리 함수
    moveSelector(b) {
        if (this.selectBox) {
            const box = this.selectBox;
            let cursor = box.querySelector(".active");

            if (cursor === null) {
                cursor = box.querySelector(".select");
            }

            let target = "";

            if (b) {
                target = cursor.previousSibling;
            } else {
                target = cursor.nextSibling;
            }

            if (target !== null) {
                cursor.classList.remove("active");
                target.classList.add("active");

                const nodeList = Array.prototype.slice.call(box.children);
                const index = nodeList.indexOf(target);

                box.scrollTop = target.offsetHeight * (index - 2);
            }
        }
    }

    // 아이템 선택 처리 함수
    itemSelect() {
        const box = this.selectBox;
        const select = box.querySelector(".select");
        let cursor = box.querySelector(".active");

        if (!cursor) {
            cursor = select;
        }
        const value = cursor.getAttribute("value");

        select.classList.remove("select");
        cursor.classList.add("select");

        if (this.state.selectKey !== value) {
            this.setState({
                selectKey: value
            }, () => {
                this.listHide();

                if (typeof this.state.resultFunc === "function") {
                    this.state.resultFunc(value);
                }
            });
        } else {
            this.listHide();
        }
    }

    checkSelectKey(list, keys, key) {
        const item = this.getListItem(list, keys, key);
        const vKey = keys.value ? keys.value : "value";
        if (key === "" || item === undefined) {
            if (list.length > 0) {
                key = list[0][vKey];
            }
        }

        return key;
    }

    render() {
        const { list, keys, icon, disabled, drop_position } = this.props;
        const { selectKey, isShow, isFocus } = this.state;
        const item = this.getListItem(list, keys, selectKey);
        const value = keys.value ? keys.value : "value";
        const name = keys.name ? keys.name : "name";
        const caption = keys.caption ? keys.caption : "caption";

        return (
            <div className={this.getClassName()}>
                <div className="fors-select-view" onClick={disabled ? null : this.listShow}>
                    <div
                        className={classNames("fors-select", isFocus)}
                        onFocus={this.onFocus}
                        onBlur={this.onBlur}
                        onKeyDown={disabled ? null : this.onKeyDown}
                        ref={ref => (this.input = ref)}
                    >{item ? item[name] : ""}</div>
                    <Icon name={icon} active={isShow ? "active" : ""} />
                </div>
                <div
                    className={classNames("fors-select-box", isShow, drop_position)}
                    onClick={disabled ? null : e => this.itemSelect()}
                    ref={ref => (this.selectBox = ref)}
                >
                    {this.isList(list) ?
                        this.props.list.map((obj, i) => {
                            const objValue = obj[value];
                            const objName = obj[name];
                            const key = `select-key-${i}`;
                            let objCaption = obj[caption];

                            if (!isNaN(objCaption)) {
                                objCaption = utils.format.price(objCaption);
                            }

                            return (
                                <Buttons
                                    key={key}
                                    buttonStyle={{ width: "block" }}
                                    inline={{ className: classNames("fors-select-option", (item[value] === objValue ? "select" : "")), title: objName, value: objValue }}
                                >
                                    {objName}
                                    <span className="caption">{objCaption}</span>
                                </Buttons>
                            );
                        }) : null}
                </div>
            </div>
        );
    }
}

Dropdown.propTypes = {
    list: PropTypes.arrayOf(PropTypes.shape([PropTypes.node])).isRequired,
    select: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    drop_position: PropTypes.oneOf(["absolute", "relative"]).isRequired,
    size: PropTypes.oneOf(Object.keys(classSize)),
    resultFunc: PropTypes.func.isRequired,
    disabled: PropTypes.oneOf(["disabled", ""]),
    keys: PropTypes.shape([PropTypes.node]),
    icon: PropTypes.string
};

Dropdown.defaultProps = {
    list: [],
    select: "",
    drop_position: "absolute",
    resultFunc: undefined,
    disabled: "",
    keys: {},
    icon: "dt"
};

export default Dropdown;
