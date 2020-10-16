import React from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { Button, Collapse } from "react-bootstrap";

export default class EvalCard extends React.Component {
    colors = ["red", "orange", "yellow", "greenyellow", "lime"];
    state = {
        score: 0,
        scorecurrent: 0
    }
    constructor(props) {
        super(props);
    }
    getOnHover = id => _ => {
        this.setState(prev => ({ scorecurrent: id }))
    }
    getOnHoverStop = id => _ => {
        this.setState(prev => ({ scorecurrent: prev.score }))
    }
    getOnClick = id => _ => {
        this.props.onScoreChange(this.props.i, id)
        this.setState(prev => ({ score: id }))

    }

    renderStars = _ => {
        let response = []
        for (let i = 1; i <= 5; i++) {
            if (i <= this.state.scorecurrent)
                response.push(
                    <FontAwesomeIcon onMouseEnter={this.getOnHover(i)} onMouseLeave={this.getOnHoverStop(i)} onClick={this.getOnClick(i)} style={{ color: this.colors[this.state.scorecurrent - 1], stroke: "black", strokeWidth: 10 }} icon={faStar} />
                )
            else
                response.push(
                    <FontAwesomeIcon onMouseEnter={this.getOnHover(i)} onMouseLeave={this.getOnHoverStop(i)} onClick={this.getOnClick(i)} icon={faStar} />
                )

        }
        return response
    }
    render() {
        return (
            <Collapse in={this.props.in} onExited={this.props.onExited}>
                <div className="card ">
                    <ul className="list-group list-group-flush">
                        <li
                            className="list-group-item bg-primary text-white d-flex justify-content-center">
                            Soru {this.props.i + 1}
                        </li>
                        <li className="list-group-item">
                            <span
                                style={{
                                    fontSize: "30px",
                                    marginBottom: "50px"
                                }}
                                className="d-flex justify-content-center"
                            >{this.props.question}</span>
                            <span
                                style={{ fontSize: "30px" }}
                                className="d-flex justify-content-center"
                            >
                                {
                                    this.renderStars()
                                }
                            </span>

                        </li>
                        {this.props.showNext && <li className="list-group-item">
                            <Button disabled={!this.props.nextActive} onClick={this.props.next} className={"float-right "} variant={!this.props.nextActive ? "secondary" : "primary"}>İleri</Button>

                        </li>}
                    </ul>
                </div>
            </Collapse>

        )
    }
}
