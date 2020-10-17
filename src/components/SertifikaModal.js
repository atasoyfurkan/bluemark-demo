import React from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faEnvelope, faMobile, faUser } from "@fortawesome/free-solid-svg-icons";
import Joi from "joi-browser";
import { notify } from "react-notify-bootstrap";
import { Error, FormHandler } from "react-form-error";
import axios from 'axios'
export default class SertifikaModal extends React.Component {
    state = {
        data: {
            ad: "",
            soyad: "",
            email: "",
            id: '',
            date: '',
            course_name: "",
        },
        errors: {}
    };
    apiTemplate = (name, id, date, course_name, mail) => `https://bluemark-server.herokuapp.com?name=${name}&e_id=${id}&date=${date}&course_name=${course_name}&mail=${mail}`


    schema = {
        ad: Joi.string().required(),
        soyad: Joi.string().required(),
        email: Joi.string().email().required(),
        id: Joi.string().required(),
        date: Joi.string().required(),
        course_name: Joi.string().required(),
    };

    constructor(props) {
        super(props);
    }
    doSubmit = async () => {
        if (FormHandler.checkError()) return;

        notify({ variant: "danger", text: "Demo surumunde sertifika gonderilemez" })

        // try {
        //     const url = encodeURI(this.apiTemplate(this.state.data.ad + " " + this.state.data.soyad, this.state.data.id, this.state.data.date, this.state.data.course_name, this.state.data.email))
        //     this.onHide()
        //     notify({
        //         variant: "warning",
        //         text: "Sertifika gönderiliyor"
        //     });
        //     let { data } = await axios.get(url)
        //     if (data.accepted.length === 1) {
        //         notify({
        //             variant: "success",
        //             text: "Sertifika başarıyla gönderildi"
        //         });
        //     }
        // } catch (e) {
        //     notify({
        //         variant: "danger",
        //         text: "Beklenmedik bir hata gerçekleşti"
        //     });
        // }
    };
    onChange = event => {

        if (event.target.name === "ad") {
            this.setState({ data: { ...this.state.data, ad: event.target.value } });
        }
        if (event.target.name === "soyad") {
            this.setState({
                data: { ...this.state.data, soyad: event.target.value }
            });
        }
        if (event.target.name === "email") {
            this.setState({
                data: { ...this.state.data, email: event.target.value }
            });
        }
        if (event.target.name === "id") {
            this.setState({
                data: { ...this.state.data, id: event.target.value }
            });
        }
        if (event.target.name === "date") {
            this.setState({
                data: { ...this.state.data, date: event.target.value }
            });
        }
        if (event.target.name === "course_name") {
            this.setState({
                data: { ...this.state.data, course_name: event.target.value }
            });
        }
    };
    translator = error => {
        if (error === null) return
        if (error.startsWith('"email"')) return "Lütfen geçerli bir e-mail girin"
        return "Bu alan boş bırakılamaz."
    }

    onHide = _ => {
        this.props.onHide()
        this.setState({
            data: {
                ad: "",
                soyad: "",
                email: "",
                id: '',
                date: '',
                course_name: ""
            },
            errors: {},
        })

    }
    render() {
        return (
            <div>

                <Modal show={this.props.show} onHide={this.onHide}>
                    <Modal.Header closeButton>
                        <Modal.Title>Sertifika Gönderme</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                </div>
                                <input
                                    className="form-control"
                                    value={this.state.data.ad}
                                    onChange={this.onChange}
                                    name="ad"
                                    placeholder="Adı"
                                />
                            </div>
                            <Error name={"ad"} />
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faUser} />
                                    </span>
                                </div>
                                <input
                                    className="form-control"
                                    value={this.state.data.soyad}
                                    onChange={this.onChange}
                                    name="soyad"
                                    placeholder="Soyadı"
                                />
                            </div>
                            <Error name={"soyad"} />
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                    </span>
                                </div>
                                <input
                                    className="form-control"
                                    value={this.state.data.email}
                                    onChange={this.onChange}
                                    name="email"
                                    placeholder="E-posta adresi"
                                />
                            </div>
                            <Error name={"email"} />
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faMobile} />
                                    </span>
                                </div>
                                <input
                                    className="form-control"
                                    value={this.state.data.id}
                                    onChange={this.onChange}
                                    name="id"
                                    placeholder="Enrollment Id"
                                />
                            </div>
                            <Error name={"id"} />
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faMobile} />
                                    </span>
                                </div>
                                <input
                                    className="form-control"
                                    value={this.state.data.date}
                                    onChange={this.onChange}
                                    name="date"
                                    placeholder="Tarih"
                                />
                            </div>
                            <Error name={"date"} />
                        </div>
                        <div className="form-group">
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faBuilding} />
                                    </span>
                                </div>
                                <input
                                    className="form-control"
                                    value={this.state.data.course_name}
                                    onChange={this.onChange}
                                    name="course_name"
                                    placeholder="Eğitim Adı"
                                />
                            </div>
                            <Error name={"course_name"} />
                        </div>
                        <FormHandler schema={this.schema} data={this.state.data} translator={this.translator} />

                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.doSubmit}
                        >
                            Gönder
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
