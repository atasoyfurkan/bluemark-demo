import React from "react";
import WarningModal from "./WarningModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faLink,
  faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { url } from "../config.json"
import { notify } from "react-notify-bootstrap"

export default class EgitimTipi extends React.Component {
  state = {
    modalShow: false,
  };

  handleEdit = () => {
    const { egitim } = this.props;
    this.props.history.push({ pathname: "/egitim-ekle", state: { egitim } });
  };

  copyEgitmen = _ => {
    const copyUrl = `${url}/gunluk-yoklama/${this.props.egitim.id}/egitmen`;
    console.log(copyUrl);
    let input = document.createElement("textarea");
    input.value = copyUrl
    document.body.appendChild(input)
    input.select();
    document.execCommand("copy");
    input.remove()
    this.setState({ showLinkModal: false })
    notify({
      variant: "success",
      text: "Eğitim linki panoya kopyalandı."
    });
  }
  copySirket = _ => {
    const copyUrl = `${url}/gunluk-yoklama/${this.props.egitim.id}/sirket`;
    console.log(copyUrl);
    let input = document.createElement("textarea");
    input.value = copyUrl
    document.body.appendChild(input)
    input.select();
    document.execCommand("copy");
    input.remove()
    this.setState({ showLinkModal: false })
    notify({
      variant: "success",
      text: "Eğitim linki panoya kopyalandı."
    });
  }

  mailGonder = async _ => {
    notify({ variant: "danger", text: "Demo surumunde mail gonderilemez" });

    // const mailName = this.props.egitim.egitmen.email;
    // const courseName = this.props.egitim.egitimTipi.ad;
    // const egitimLink = `${url}/gunluk-yoklama/${this.props.egitim.id}/egitmen`;
    // const { href } = new URL(`https://bluemark-server.herokuapp.com/egitmenmail?link=${egitimLink}&email=${mailName}&course_name=${courseName}`);

    // try {
    //   notify({
    //     variant: "warning", text: "Mail gönderiliyor"
    //   });
    //   await axios.get(href);
    //   notify({
    //     variant: "success", text: "Mail başarıyla gönderildi"
    //   });
    // } catch (error) {
    //   notify({ variant: "danger", text: "Mail gönderilemedi" });
    // }

  }

  render() {
    const { egitim } = this.props;
    return (
      <React.Fragment>

        <td>{egitim.egitimTipi.ad}</td>
        <td>{egitim.egitmen.ad}</td>
        <td>{egitim.musteriler.map(item => (
          <div key={item.id} className="col">
            {item.ad}
          </div>
        ))}</td>
        <td>{egitim.tarih[0].gun.substring(5) + "-" + egitim.tarih[0].gun.substring(0, 4)}</td>
        <td>{egitim.tarih[egitim.tarih.length - 1].gun.substring(5) + "-" + egitim.tarih[egitim.tarih.length - 1].gun.substring(0, 4)}</td>
        <td>{egitim.egitimYeri}</td>
        <td>
          <button className="btn btn-outline-primary" onClick={this.copyEgitmen}>
            <FontAwesomeIcon icon={faLink} />
          </button>
        </td>
        <td>
          <button className="btn btn-outline-primary" onClick={this.copySirket}>
            <FontAwesomeIcon icon={faLink} />
          </button>
        </td>
        <td>
          <button className="btn btn-outline-primary" onClick={this.mailGonder}>
            <FontAwesomeIcon icon={faEnvelope} />
          </button>
        </td>
        <td>
          <button className="btn btn-secondary" onClick={this.handleEdit}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        </td>
        <td>
          <button
            className="btn btn-danger"
            onClick={() => this.setState({ modalShow: true })}
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
        <WarningModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          onClick={this.props.deleteSelf}
        />
      </React.Fragment >
    );
  }
}
