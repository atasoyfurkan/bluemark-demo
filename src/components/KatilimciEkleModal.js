import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal } from "react-bootstrap";
import Joi from "joi-browser";
import FormClass from "../components/FormClass";
import { firestore } from "../Firestore";
import { notify } from "react-notify-bootstrap"

import {
  faUser,
  faEnvelope,
  faMobile,
  faBuilding
} from "@fortawesome/free-solid-svg-icons";

class KatilimciEkleModal extends FormClass {
  state = {
    data: {
      ad: "",
      soyad: "",
      email: "",
      telefon: null,
      sirketBilgisi: ""
    },
    errors: {},
    loading: false
  };

  schema = {
    ad: Joi.string().required(),
    soyad: Joi.string().required(),
    email: Joi.string()
      .required()
      .email(),
    telefon: Joi.string().regex(/\(5\d\d\) \d\d\d \d\d\d\d/).required(),
    sirketBilgisi: Joi.string().required()
  };

  onChange = event => {
    this.handleChange({ currentTarget: event.target });

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
    if (event.target.name === "telefon") {
      this.setState({
        data: { ...this.state.data, telefon: event.target.value }
      });
    }
    if (event.target.name === "sirketBilgisi") {
      this.setState({
        data: { ...this.state.data, sirketBilgisi: event.target.value }
      });
    }
  };

  doSubmit = async () => {
    this.setState({ loading: true });

    const gunYoklama = this.props.egitimTarih.map(item => ({
      yoklama: false,
      tarih: item
    }));

    const katilimci = {
      ...this.state.data,
      egitimId: this.props.match.params.id,
      gunYoklama
    };
    katilimci.ad = katilimci.ad.charAt(0).toUpperCase() + katilimci.ad.slice(1)
    katilimci.soyad = katilimci.soyad.charAt(0).toUpperCase() + katilimci.soyad.slice(1)
    try {
      if (localStorage.getItem("katilimci_eklendi" + this.props.match.params.id) === "true") {
        notify({
          variant: "danger",
          text: "Birden fazla kez aynı eğitime kayıt olamazsınız"
        });
      } else {
        const { id } = await firestore.collection("katilimci").add(katilimci);

        localStorage.setItem(
          "katilimci_eklendi" + this.props.match.params.id,
          "true"
        );

        notify({
          variant: "success",
          text: "Katılımcı başarıyla eklendi"
        });
        this.props.yoklamaVer({ ...katilimci, id: id });
      }
    } catch (e) {
      notify({
        variant: "danger",
        text: "Beklenmedik bir hata gerçekleşti"
      });
    }
    this.setState({ loading: false });
    this.props.onHide();
  };

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
    if (!this.isNumericInput(event) && !this.isModifierKey(event)) {
      event.preventDefault();
    }
  };

  formatToPhone = (event) => {
    if (this.isModifierKey(event)) { return; }

    // I am lazy and don't like to type things more than once
    const target = event.target;
    const input = target.value.replace(/\D/g, '').substring(0, 10); // First ten digits of input only
    const zip = input.substring(0, 3);
    const middle = input.substring(3, 6);
    const last = input.substring(6, 10);
    let val = ""
    if (input.length > 6) { val = `(${zip}) ${middle} ${last}`; }
    else if (input.length > 3) { val = `(${zip}) ${middle}`; }
    else if (input.length > 0) { val = `(${zip}`; }
    this.setState({ data: { ...this.state.data, telefon: val } })
  };
  render() {
    return (
      <Modal show={this.props.show}>
        <Modal.Header>
          <Modal.Title>Eğitime Kaydol</Modal.Title>
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
                placeholder="Adınız"
              />
            </div>
            {this.renderError("ad")}
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
                placeholder="Soyadınız"
              />
            </div>
            {this.renderError("soyad")}
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
                placeholder="E-posta adresiniz"
              />
            </div>
            {this.renderError("email")}
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
                value={this.state.data.telefon}
                onChange={this.onChange}
                onKeyDown={this.enforceFormat}
                onKeyUp={this.formatToPhone}
                name="telefon"
                placeholder="Telefon numaranız"
              />
            </div>
            {this.renderError("telefon")}
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
                value={this.state.data.sirketBilgisi}
                onChange={this.onChange}
                name="sirketBilgisi"
                placeholder="Çalıştığınız kurum"
              />
            </div>
            {this.renderError("sirketBilgisi")}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className={`btn btn-primary ${this.state.loading ? "disabled" : ""}`}
            onClick={this.handleSubmit}
          >
            Kaydet
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            data-dismiss="modal"
            onClick={this.props.onHide}
          >
            İptal
          </button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default KatilimciEkleModal;
