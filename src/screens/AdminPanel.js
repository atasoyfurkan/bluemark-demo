import React from "react";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboard,
  faUserTie,
  faUser,
  faFileImport,
  faChalkboardTeacher,
  faFileContract,
  faClipboardList
} from "@fortawesome/free-solid-svg-icons";
import { fireauth } from "../Firestore";
import { notify } from "react-notify-bootstrap";
import SertifikaModal from "../components/SertifikaModal";

export default class AdminPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showModal: false };
  }
  hideModal = success => {
    this.setState({ showModal: false });
    if (success)
      notify({
        variant: "success",
        text: "Template başarıyla yüklendi"
      });
  };

  cikisYap = async () => {
    try {
      await fireauth.signOut();
    } catch (e) {
      notify({ variant: "danger", text: "Beklenmedik bir hata gerçekleşti" });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Header history={this.props.history} />
        <div className="container">
          <div className="row d-flex justify-content-center mb-3">
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/egitim-tipi-ekle")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Eğitim Ekle
                </h6>
                <FontAwesomeIcon size="3x" icon={faClipboardList} />
              </div>
            </div>
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/egitmen-ekle")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Eğitmen Ekleme
                </h6>
                <FontAwesomeIcon size="3x" icon={faUserTie} />
              </div>
            </div>
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/musteri-ekle")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Müşteri Ekleme
                </h6>
                <FontAwesomeIcon size="3x" icon={faUser} />
              </div>
            </div>
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/egitim-ekle")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Sınıf Oluşturma
                </h6>
                <FontAwesomeIcon size="3x" icon={faChalkboard} />
              </div>
            </div>

            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/egitim-ac")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Açılan Eğitimler
                </h6>
                <FontAwesomeIcon size="3x" icon={faChalkboardTeacher} />
              </div>
            </div>

            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/egitim-tamamlanmis")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Tamamlanmış Eğitimler
                </h6>
                <FontAwesomeIcon size="3x" icon={faChalkboardTeacher} />
              </div>
            </div>
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/sertifika-gonder")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Sertifika Gönderme
                </h6>
                <FontAwesomeIcon size="3x" icon={faFileContract} />
              </div>
            </div>
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={() => this.props.history.push("/tum-katilimcilar")}
            >
              <div className="card-body align-items-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Tüm Katılımcılar
                </h6>
                <FontAwesomeIcon size="3x" icon={faFileContract} />
              </div>
            </div>
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={_ => this.setState({ showModal: true })}
            >
              <div className="card-body align-items-center text-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Manuel Sertifika Gönderme
                </h6>
                <FontAwesomeIcon size="3x" icon={faFileImport} />
              </div>
            </div>
            <div
              className="col-11 col-sm-4 card clickable-card"
              onClick={_ => this.props.history.push("/excel-sertifika")}
            >
              <div className="card-body align-items-center text-center d-flex flex-column">
                <h6 className="card-text mb-4" style={{ fontSize: "25px" }}>
                  Excel İle Sertifika Gönderme
                </h6>
                <FontAwesomeIcon size="3x" icon={faFileImport} />
              </div>
            </div>

          </div>
          <div className="d-flex justify-content-end mt-4 mb-4">
            <button className="btn btn-danger" onClick={this.cikisYap}>
              Çıkış yap
            </button>
          </div>

        </div>
        <SertifikaModal
          show={this.state.showModal}
          onHide={this.hideModal}
        />
      </React.Fragment>
    );
  }
}
