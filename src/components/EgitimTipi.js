import React from "react";
import { firestore } from "../Firestore";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboard,
  faEdit,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import WarningModal from "./WarningModal";
import { Joi, FormHandler, Error } from 'react-form-error'

import { notify } from "react-notify-bootstrap"


export default class EgitimTipi extends React.Component {
  constructor(props) {
    super(props);
    this.doc = firestore.collection("egitimtipi").doc(this.props.id);
    this.state = {
      textcurrent: props.text,
      tagcurrent: props.tag,
      showModal: props.text === "",
      warningModalShow: false
    };
    this.deleteSelf = this.props.deleteSelf;
  }

  schema = {
    text: Joi.string().required(),
    tag: Joi.string().required()
  };

  changeHandler = e => {
    this.setState({ textcurrent: e.target.value });
  };
  tagChangeHandler = e => {
    this.setState({ tagcurrent: e.target.value });
  };

  closeModal = (e, saved = false) => {
    if (!saved && this.props.text === "")
      return this.deleteSelf();
    else if (this.props.text === "")
      notify({
        variant: "success",
        text: "Eğitim tipi eklendi"
      });
    else if (this.props.text !== this.state.textcurrent)
      notify({
        variant: "success",
        text: "Eğitim tipi değiştirildi"
      });

    this.setState({ showModal: false });
  };
  saveModal = async _ => {
    if(FormHandler.checkError())  return ;
    if (this.state.textcurrent === "") return this.deleteSelf();
    try {
      this.doc.set({ ad: this.state.textcurrent.split(" ").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" "), tag: this.state.tagcurrent.split(" ").map(s=>s.charAt(0).toUpperCase()+s.slice(1)).join(" ") });
    } catch (e) {
      notify({
        variant: "danger",
        text: "Beklenmedik bir hata gerçekleşti"
      });
    }
    this.closeModal(null, true);
  };
  showModal = _ => {
    this.setState({ showModal: true });
  };
  showWarnModal = async _ => {
    try {
      const egitim = await firestore.collection("egitim").where("egitimTipi.id", "==", this.props.id)
        .get()
      if (egitim.empty)
        await this.setState({ warningModalShow: true })
      else {
        notify({
          variant: "danger",
          text: "Bu eğitim kategorisi kullanıldığı için silinemez."
        });
      }
    }
    catch (e) {
      notify({
        variant: "danger",
        text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  }

  translator = (error) => {
    if(!error) return
    if (error === '"tag" is not allowed to be empty')
      return "Eğitim kategorisi kısmı boş bırakılamaz"
    if (error === '"text" is not allowed to be empty')
      return "Eğitim adı boş bırakılamaz"
    if(error.startsWith('"text"'))
      return "Eğitim adında kelimeler büyük harfle başlamalı"
    if(error.startsWith('"tag"'))
      return "Eğitim kategorisi büyük harfle başlamalı"

    return error;
  }
  render() {
    return (
      <React.Fragment>
            <td>
              <span className="badge badge-primary " style={{ marginRight: "10px" }}>{this.props.tag}</span>
            </td>
            <td >{this.props.text}</td>

            <td>

              <div className="ml-auto mr-1">
                <button
                    className="btn btn-outline-secondary"
                    onClick={this.showModal}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </div>
            </td>
            <td>
              <div className="ml-2">
                <button
                    className="btn btn-outline-danger"
                    onClick={this.showWarnModal}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </td>
        <EditModal
          show={this.state.showModal}
          name={this.props.text}
          namecurrent={this.state.textcurrent}
          tagcurrent={this.state.tagcurrent}
          onChange={this.changeHandler}
          onTagChange={this.tagChangeHandler}
          closeModal={this.closeModal}
          saveModal={this.saveModal}
          schema={this.schema}
          joidata={{text:this.state.textcurrent,tag:this.state.tagcurrent }}
          translator={this.translator}
        />
        <WarningModal
          show={this.state.warningModalShow}
          onHide={() => this.setState({ warningModalShow: false })}
          onClick={this.deleteSelf}
        />
      </React.Fragment>
    );
  }
}

const EditModal = props => (
  <Modal show={props.show} onHide={props.closeModal}>
    <Modal.Header closeButton>
      <Modal.Title>Eğitim kategorisi ekle</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="form-group">
        <div className="input-group" style={{ marginBottom: 10 }}>
          <div className="input-group-prepend">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faChalkboard} />
            </span>
          </div>
          <input
            className="form-control"
            placeholder="Eğitim Adı*"
            value={props.namecurrent}
            onChange={props.onChange}
          />
        </div>
        <Error name="text" />
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faChalkboard} />
            </span>
          </div>
          <input
            className="form-control"
            placeholder="Eğitim Kategorisi"
            value={props.tagcurrent}
            onChange={props.onTagChange}
          />
        </div>
        <Error name="tag" />
        <FormHandler schema={props.schema} data={props.joidata} translator={props.translator}/>
      </div>
    </Modal.Body>
    <Modal.Footer>
      <button
        type="button"
        className="btn btn-primary"
        onClick={props.saveModal}
      >
        Kaydet
      </button>
      <button
        type="button"
        className="btn btn-secondary"
        data-dismiss="modal"
        onClick={props.closeModal}
      >
        İptal
      </button>
    </Modal.Footer>
  </Modal>
);
