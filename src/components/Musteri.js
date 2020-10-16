import React from "react";
import { firestore } from "../Firestore";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import WarningModal from "./WarningModal";
import {Error, FormHandler, Joi} from "react-form-error";
import { notify } from "react-notify-bootstrap"

export default class Musteri extends React.Component {
  constructor(props) {
    super(props);
    this.doc = firestore.collection("musteri").doc(this.props.id);
    this.state = {
      textcurrent: props.text,
      showModal: props.text === "",
      text: "",
      warningModalShow: false
    };
    this.deleteSelf = this.props.deleteSelf;
  }
  schema = {
    text: Joi.string().required(),
  };
  translator = (error) => {
    if(!error) return
    if (error === '"text" is not allowed to be empty')
      return "Müşteri adı boş bırakılamaz"
    return error;
  }
  changeHandler = e => {
    this.setState({ textcurrent: e.target.value });
  };
  closeModal = (e, saved = false) => {
    if (this.props.text === "" && !saved)
      return this.deleteSelf();
    else if (this.props.text === "")
      notify({
        variant: "success",
        text: "Müşteri eklendi"
      });
    else if (this.props.text !== this.state.textcurrent)
      notify({
        variant: "success",
        text: "Müşteri değiştirildi"
      });

    this.setState({ showModal: false });
  };
  saveModal = async _ => {
    if(FormHandler.checkError()) return
    if (this.state.textcurrent === "") return this.deleteSelf();
    this.doc.set({ ad: this.state.textcurrent });
    this.closeModal(null, true);
  };
  showModal = _ => {
    this.setState({ showModal: true });
  };
  warningModalClose = () => {
    this.setState({ warningModalShow: false });
  };
  showWarnModal = async _ => {
    try{
      const egitim = await firestore.collection("egitim").where("musteriler", "array-contains", {ad:this.props.text, id:this.props.id})
          .get()
      if(egitim.empty)
        await this.setState({ warningModalShow: true })
      else {
        notify({
          variant: "danger",
          text: "Bu müşteri silinemez."
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
  render() {
    return (
      <React.Fragment>
          <td style={{width:"100%"}}>
            <div >{this.props.text}</div>
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
          name={this.props.text}
          namecurrent={this.state.textcurrent}
          onChange={this.changeHandler}
          closeModal={this.closeModal}
          saveModal={this.saveModal}
          schema={this.schema}
          joidata={{text:this.state.textcurrent, }}
          translator={this.translator}
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
      <Modal.Title>Müşteri ekle</Modal.Title>
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
            placeholder="Müşterinin adı"
            value={props.namecurrent}
            onChange={props.onChange}
          />
        </div>
        <Error name="text"/>
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
