import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Card, CardDeck, Collapse } from "react-bootstrap";

export default class KatilimciCard extends React.Component {
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
                            Formu Dolduran Kişiyi Seçin
                        </li>
                        <li className="list-group-item">
                            <CardDeck>

                                {this.props.katilimcilar.map(item => (
                                    <Card
                                        key={item.id}
                                    >
                                        <div
                                            className="clickable-header"
                                            onClick={() => this.props.onKatilimci(item)}
                                        >
                                            <Card.Body>
                                                {item.ad}
                                            </Card.Body>
                                        </div>
                                    </Card>
                                ))}
                            </CardDeck>

                        </li>

                    </ul>
                </div>
            </Collapse>

        )
    }
}
