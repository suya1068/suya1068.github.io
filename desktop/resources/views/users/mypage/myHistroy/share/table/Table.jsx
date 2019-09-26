import classnames from "classnames";
import React, { Component, PropTypes } from "react";

export default class Table extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            columnDefs: props.columnDefs
        };

        this.createKey = this.createKey.bind(this);
        this.parsePxFromNumber = this.parsePxFromNumber.bind(this);

        this.renderColGroup = this.renderColGroup.bind(this);
        this.renderHeader = this.renderHeader.bind(this);
        this.renderBody = this.renderBody.bind(this);
        this.renderRow = this.renderRow.bind(this);
        this.renderColumn = this.renderColumn.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({ data: nextProps.data });
        }
    }

    /**
     * 로우와 컬럼으로 키를 생성한다.
     * @param name
     * @param row
     * @param col
     * @returns {string}
     */
    createKey(name, row, col) {
        const base = `${name}-${row}`;
        return col ? `${base}-${col}` : base;
    }

    /**
     * 숫자를 CSS pixcel 단위로 변환한다.
     * @param number
     * @returns {string}
     */
    parsePxFromNumber(number) {
        return `${number}px`;
    }

    /**
     * 테이블 col group을 랜더링한다.
     * @returns {XML}
     */
    renderColGroup() {
        return (
            <colgroup>
                { this.state.columnDefs.map((item, idx) => (
                    <col key={this.createKey("colgroup", 1, idx)} style={{ width: this.parsePxFromNumber(item.width) }} />
                )) }
            </colgroup>
        );
    }

    /**
     * 테이블 헤더를 랜더링한다.
     * @returns {XML}
     */
    renderHeader() {
        return (
            <thead>
                <tr>
                    { this.state.columnDefs.map((item, idx) => (
                        <th key={this.createKey("header", 1, idx)}>{ item.name }</th>
                    )) }
                </tr>
            </thead>
        );
    }

    /**
     * 테이블 바디를 랜더링한다.
     * @returns {XML}
     */
    renderBody() {
        const { data } = this.state;

        return (
            <tbody>
                { data.map((item, idx) => this.renderRow(item, idx)) }
            </tbody>
        );
    }

    /**
     * 테이블 바디 로우를 랜더링한다.
     * @param {Object} entity
     * @param {Number} row
     * @returns {XML}
     */
    renderRow(entity, row) {
        const { columnDefs } = this.state;

        return (
            <tr key={this.createKey("body-row", row)}>
                { columnDefs.map((column, idx) => this.renderColumn(entity, column, row, idx)) }
            </tr>
        );
    }

    /**
     * 테이블 바디 컬럼을 랜더링한다.
     * @param {Object} entity
     * @param {Object} columnDef
     * @param {Number} row
     * @param {Number} col
     * @returns {XML}
     */
    renderColumn(entity, columnDef, row, col) {
        let view;
        if (typeof columnDef.template === "function") {
            view = columnDef.template(entity, columnDef);
        } else if (typeof columnDef.format === "function") {
            view = <span>{ columnDef.format(entity, columnDef) }</span>;
        } else {
            view = <span>{ entity[columnDef.field] }</span>;
        }

        return <td key={this.createKey("body-cell", row, col)} className={classnames(columnDef.className)}>{ view }</td>;
    }

    render() {
        const { data } = this.state;

        return (
            <div>
                <table className="table">
                    { this.renderColGroup() }
                    { this.renderHeader() }
                    { data.length > 0 && this.renderBody() }
                </table>
            </div>
        );
    }
}

Table.propTypes = {
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
    columnDefs: PropTypes.arrayOf(PropTypes.object).isRequired
};

Table.defaultProps = {

};
