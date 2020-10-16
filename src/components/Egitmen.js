import React from "react";
import { firestore } from "../Firestore";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faEnvelope,
  faTrash,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
import WarningModal from "./WarningModal";
import { Joi, FormHandler, Error } from 'react-form-error'
import { notify } from "react-notify-bootstrap"

export default class Egitmen extends React.Component {
  constructor(props) {
    super(props);
    this.doc = firestore.collection("egitmen").doc(this.props.id);
    this.state = {
      adCurrent: props.ad,
      mailCurrent: props.mail,
      phoneCurrent: props.phone,
      showModal: props.ad === "",
      warningModalShow: false
    };
    this.deleteSelf = this.props.deleteSelf;
  }

  schema = {
    ad: Joi.string().required(),
    mail: Joi.string().required().email(),
    phone: Joi.string().regex(/\(5\d\d\) \d\d\d \d\d\d\d/).allow("")
  };
  phoneChangeHandler = e => {
    this.setState({ phoneCurrent: e.target.value });
  };
  mailChangeHandler = e => {
    this.setState({ mailCurrent: e.target.value });
  };
  nameChangeHandler = e => {
    this.setState({ adCurrent: e.target.value });
  };
  closeModal = (e, saved = false) => {
    if (!saved && this.props.ad === "")
      return this.deleteSelf();
    else if (this.props.ad === "")
      notify({
        variant: "success",
        text: "Eğitmen eklendi"
      });
    else if (this.props.ad !== this.state.adCurrent)
      notify({
        variant: "success",
        text: "Eğitmen değiştirildi"
      });

    this.setState({ showModal: false });
  };
  saveModal = _ => {
    if(FormHandler.checkError())  return ;
    try {
      this.doc.set({
        ad: this.state.adCurrent,
        email: this.state.mailCurrent,
        phone: this.state.phoneCurrent,
      });
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
  warningModalClose = () => {
    this.setState({ warningModalShow: false });
  };
  showWarnModal = async _ => {
    try {
      const egitim = await firestore.collection("egitim").where("egitmen.id", "==", this.props.id)
          .get()
      if (egitim.empty)
        await this.setState({warningModalShow: true})
      else {
        notify({
          variant: "danger",
          text: "Bu eğitmen silinemez."
        });
      }
    } catch (e) {
      notify({
        variant: "danger",
        text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  }
   isNumericInput = (event) => {
    const key = event.keyCode;
    return ((key >= 48 && key <= 57) || // Allow number line
        (key >= 96 && key <= 105) // Allow number pad
    );
  };

   isModifierKey = (event) => {
    const key = event.keyCode;
    return (event.shiftKey === true || key === 35 || key === 36) || // Allow Shift, Home, End
        (key === 8 || key === 9 || key === 13 || key === 46) || // Allow Backspace, Tab, Enter, Delete
        (key > 36 && key < 41) || // Allow left, up, right, down
        (
            // Allow Ctrl/Command + A,C,V,X,Z
            (event.ctrlKey === true || event.metaKey === true) &&
            (key === 65 || key === 67 || key === 86 || key === 88 || key === 90)
        )
  };

   enforceFormat = (event) => {
    // Input must be of a valid number format or a modifier key, and not longer than ten digits
    if(!this.isNumericInput(event) && !this.isModifierKey(event)){
      event.preventDefault();
    }
  };

  formatToPhone = (event) => {
    if(this.isModifierKey(event)) {return;}

    // I am lazy and don't like to type things more than once
    const target = event.target;
    const input = target.value.replace(/\D/g,'').substring(0,10); // First ten digits of input only
    const zip = input.substring(0,3);
    const middle = input.substring(3,6);
    const last = input.substring(6,10);
    let val = ""
    if(input.length > 6){val = `(${zip}) ${middle} ${last}`;}
    else if(input.length > 3){val = `(${zip}) ${middle}`;}
    else if(input.length > 0){val = `(${zip}`;}
    this.setState({phoneCurrent:val})
  };

  translator = (error) => {
    if(!error) return
    if (error === '"ad" is not allowed to be empty')
      return "İsim boş bırakılamaz"
    if (error === '"mail" is not allowed to be empty')
      return "E-mail boş bırakılamaz"
    if (error === '"mail" must be a valid email')
      return "Geçerli bir e-mail girin"
    if(error.startsWith('"phone"'))
      return "Telefon numarası ((5xx) xxx xxxx) formatında olmalı"
    return error;
  }
  render() {
    return (
      <React.Fragment>
        <td>

          <div>
            <div>{this.props.ad}</div>
            <div className="font-weight-light">{this.props.mail}</div>
            <div className="font-weight-light">{this.props.phone}</div>
          </div>
        </td>
        <td>
          <div className="ml-auto mr-2">
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
          name={this.props.ad}
          namecurrent={this.state.adCurrent}
          mail={this.props.mail}
          mailcurrent={this.state.mailCurrent}
          phone={this.props.phone}
          phonecurrent={this.state.phoneCurrent}
          onChangeName={this.nameChangeHandler}
          onChangePhone={this.phoneChangeHandler}
          onChangeMail={this.mailChangeHandler}
          closeModal={this.closeModal}
          saveModal={this.saveModal}
          schema={this.schema}
          joidata={{ad:this.state.adCurrent, mail:this.state.mailCurrent, phone:this.state.phoneCurrent}}
          translator={this.translator}
          enforceFormat={this.enforceFormat}
          formatToPhone={this.formatToPhone}
        />
        <WarningModal
          show={this.state.warningModalShow}
          onHide={this.warningModalClose}
          onClick={this.deleteSelf}
        />
      </React.Fragment>
    );
  }
}
const EditModal = props => (
  <Modal show={props.show} onHide={props.closeModal}>
    <Modal.Header>
      <Modal.Title>Eğitmen ekle</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <div className="form-group">
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <FontAwesomeIcon icon={faUserTie} />
            </span>
          </div>
          <input
            className="form-control"
            placeholder="Eğitmenin adı"
            value={props.namecurrent}
            onChange={props.onChangeName}
          />
        </div>
        <Error name="ad" />
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
            placeholder="E-posta adresi"
            value={props.mailcurrent}
            onChange={props.onChangeMail}
          />
        </div>
        <Error name="mail" />
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
            placeholder="Telefon Numarası"
            value={props.phonecurrent}
            onChange={props.onChangePhone}
            onKeyDown={props.enforceFormat}
            onKeyUp={props.formatToPhone}
          />
        </div>
        <Error name="phone" />
      </div>
      <FormHandler schema={props.schema} data={props.joidata} translator={props.translator}/>

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
