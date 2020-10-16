import React from 'react'
import { Collapse } from "react-bootstrap";

export default class FinishedCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Collapse in={this.props.in} onExited={this.props.onExited}>
                <div className="card ">
                    <ul className="list-group list-group-flush">
                        <li
                            className="list-group-item bg-primary text-white d-flex justify-content-center">
                            Son
                        </li>
                        <li className="list-group-item">
                            Değerlendirme formunu doldurduğunuz için teşekkürler.

                        </li>

                    </ul>
                </div>
            </Collapse>

        )
    }
}