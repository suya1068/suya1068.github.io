import "./excard.scss";
import React, { Component, PropTypes } from "react";
import ApplyConsulting from "shared/components/consulting/register/ApplyConsulting_dev";
import PopModal from "shared/components/modal/PopModal";
import ExCardHead from "./head/ExCardHead";
import ExCardPanel from "./panel/ExCardPanel";
import { CONSULT_ACCESS_TYPE } from "shared/constant/advice.const";

export default class ExCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.data,
            card: props.card
        };
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
        const c_modal = document.getElementsByClassName("modal-contents ex_card")[0];
        if (c_modal) {
            c_modal.addEventListener("click", this.onCheckClose);
        }
    }

    onCheckClose(e) {
        const target = e.target;
        const c = target && target.className;
        if (c === "modal-contents ex_card") {
            PopModal.close();
        }
    }

    onClose() {
        PopModal.close(this.props.name);
    }

    renderEntity(data) {
        const caption = data.caption;
        return (
            <div className="ex_card__content__entity">
                {caption && caption.position === "top" &&
                    <p className="ex_card__content__caption">{caption.desc}</p>
                }
                {data.panel_data.map((unit, idx) => {
                    return (
                        <ExCardPanel
                            photo_position={unit.photo_position}
                            mark_position={unit.photo && unit.photo.mark}
                            category_name={data.category_name}
                            data={unit}
                            key={`excard_panel__${idx}`}
                        />
                    );
                })}
                {caption && caption.position === "bottom" &&
                    <p className="ex_card__content__caption">{caption.desc}</p>
                }
            </div>
        );
    }

    render() {
        const { referer, referer_keyword } = this.state;
        const ref_data = { referer, referer_keyword };
        const { data, card } = this.props;
        const accessType = `card.${card.category_code}`;

        return (
            <div className="ex_card">
                <ExCardHead data={data} />
                <div className="ex_card__content">
                    {this.renderEntity(data)}
                    <p className="ex_card__title">촬영비용 및 촬영과정이 궁금하시다면, 문의남겨주세요!</p>
                    <ApplyConsulting
                        accessType={CONSULT_ACCESS_TYPE[accessType.toUpperCase()].CODE}
                        {...ref_data}
                        deviceType="pc"
                        // category={card.category_code.toUpperCase()}
                        renew
                        onClose={this.onClose}
                    />
                </div>
            </div>
        );
    }
}

ExCard.propTypes = {
    data: PropTypes.shape([PropTypes.node]).isRequired,
    card: PropTypes.shape([PropTypes.node]).isRequired
};

ExCard.defaultProps = {
};
