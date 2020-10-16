import React from 'react'
import { Button, Collapse } from "react-bootstrap";
import { Form } from "react-bootstrap";

export default class GorusCard extends React.Component {
    colors = ["red", "orange", "yellow", "greenyellow", "lime"];
    state = {
        text: ""
    }
    constructor(props) {
        super(props);
    }
    onChange = c => {
        let v = c.target.value
        this.setState(prev => ({ text: v }))
    }
    onSubmit = _=>this.props.next(this.state.text)
    render() {
        return (
            <Collapse in={this.props.in} onExited={this.props.onExited}>
                <div className="card ">
                    <ul className="list-group list-group-flush">
                        <li
                            className="list-group-item bg-primary text-white d-flex justify-content-center">
                            Diğer Görüş Ve Önerileriniz
                        </li>
                        <li className="list-group-item">
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Control rows="5" as="textarea" value={this.state.text} onChange={this.onChange} />
                            </Form.Group>
                        </li>
                        <li className="list-group-item">
                            <Button onClick={this.onSubmit} className={"float-right "} variant={"primary"}>İleri</Button>

                        </li>
                    </ul>
                </div>
            </Collapse>

        )
    }
}
