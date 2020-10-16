import React, { Component } from "react";
import { firestore, fireauth } from "../Firestore";
import WarningModal from "../components/WarningModal";
import Header from "../components/Header";
import KatilimciEkleModal from "../components/KatilimciEkleModal";
import QRModal from "../components/QRModal";
import { notify } from "react-notify-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes, faMarker } from "@fortawesome/free-solid-svg-icons";

class GunlukYoklama extends Component {
  state = {
    modalShow: false,
    warningModalShow: false,
    QRModalShow: false,
    katilimcilar: [],
    seciliKatilimci: null,
    egitim: null,
    seciliGun: new Date().toISOString().substring(0, 10),
    isEgitmen:
      this.props.history.location.pathname.substring(
        this.props.history.location.pathname.length - 7
      ) === "egitmen",
    link: ""
  };

  async componentDidMount() {
    if (!fireauth.currentUser)
      await fireauth.signInAnonymously()

    this.getKatilimci();
    const egitim = (
      await firestore
        .collection("egitim")
        .doc(this.props.match.params.id)
        .get()
    ).data();

    this.setState({
      egitim: egitim,
      memnuniyetFormu:
        egitim.tarih[egitim.tarih.length - 1].gun ===
        new Date().toISOString().substring(0, 10)
    });

    if (!this.state.isEgitmen) {
      const id = this.props.history.location.pathname.split("/")[3];
      const tarih = this.state.egitim.tarih.find(item => item.id === id);
      tarih && this.setState({ tarih, yoklama: true });
    }
  }

  getKatilimci = () => {
    firestore.collection("katilimci").onSnapshot(snapshot => {
      let arr = [];
      snapshot.forEach(val => {
        if (val.data().egitimId === this.props.match.params.id)
          arr.push({ ...val.data(), id: val.id });
      });
      this.setState({ katilimcilar: arr });
    });
  };

  onKatilimci = item => {
    this.setState({
      seciliKatilimci: item,
      warningModalShow: true
    });
  };

  yoklamaVer = item => {
    if (this.state.isEgitmen) {
      notify({
        variant: "danger",
        text: "Eğitmen panelinden yoklama verilemez"
      });
    } else if (this.state.yoklama) {
      let katilimci = { ...item };

      const day = katilimci.gunYoklama.findIndex(
        item => item.tarih.gun === this.state.tarih.gun
      );
      const nowDate = new Date().toISOString("").split("T")[0];
      const isToday = this.state.egitim.tarih.find(
        item => item.gun === nowDate
      );

      if (
        localStorage.getItem("token" + katilimci.gunYoklama[day].tarih.id) ===
        katilimci.gunYoklama[day].tarih.id
      ) {
        notify({
          variant: "danger",
          text: `Aynı gün içinde birden fazla yoklama verilemez`
        });
      } else if (
        day !== -1 &&
        isToday &&
        katilimci.gunYoklama[day].tarih.gun === isToday.gun
      ) {
        katilimci.gunYoklama[day] = {
          tarih: {
            id: katilimci.gunYoklama[day].tarih.id,
            gun: this.state.tarih.gun
          },
          yoklama: true
        };
        try {
          firestore
            .collection("katilimci")
            .doc(katilimci.id)
            .set({ ...katilimci });
        } catch (e) {
          notify({
            variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
          });
        }
        localStorage.setItem(
          "token" + katilimci.gunYoklama[day].tarih.id,
          katilimci.gunYoklama[day].tarih.id
        );

        notify({
          variant: "success",
          text: `${day + 1}. gün yoklaması başarıyla verildi`
        });
      } else {
        notify({
          variant: "danger",
          text:
            "Eğitim tarihleri içinde olunmadığından dolayı yoklama verilemedi"
        });
      }
    } else {
      notify({
        variant: "danger",
        text: "Yoklama verilemez"
      });
    }
    this.setState({ warningModalShow: false });
  };

  yoklamaEkraniAc = () => {
    const gun = this.state.egitim.tarih.find(
      item => this.state.seciliGun === item.gun
    );
    if (gun)
      this.setState({
        QRModalShow: true,
        link: `/${this.props.history.location.pathname.split("/")[1]}/${
          this.props.history.location.pathname.split("/")[2]
          }/${gun.id}`
      });
    else
      notify({
        variant: "danger",
        text: "Eğitim günleri dışında yoklama ekranı açılamaz"
      });
  };

  translateAy = ay => {
    if (ay === "01") return "Ocak";
    if (ay === "02") return "Şubat";
    if (ay === "03") return "Mart";
    if (ay === "04") return "Nisan";
    if (ay === "05") return "Mayıs";
    if (ay === "06") return "Haziran";
    if (ay === "07") return "Temmuz";
    if (ay === "08") return "Ağustos";
    if (ay === "09") return "Eylül";
    if (ay === "10") return "Ekim";
    if (ay === "11") return "Kasım";
    if (ay === "12") return "Aralık";
  };

  render() {
    return (
      <React.Fragment>
        <Header notAdmin={fireauth.currentUser && fireauth.currentUser.isAnonymous} history={this.props.history} />
        <div className="container">
          <div className="d-flex justify-content-between my-2">
            <span style={{ fontWeight: 700, fontSize: "15px" }}>
              {this.state.egitim &&
                `${this.state.egitim.egitimTipi.ad} / ${
                this.state.egitim.egitmen.ad
                } / ${this.state.egitim.egitimYeri} / ${
                this.state.egitim.tarih[0].gun.split("-")[2]
                } - ${
                this.state.egitim.tarih[
                  this.state.egitim.tarih.length - 1
                ].gun.split("-")[2]
                } ${this.translateAy(
                  this.state.egitim.tarih[
                    this.state.egitim.tarih.length - 1
                  ].gun.split("-")[1]
                )}`}
            </span>
            <span
              style={{ fontSize: "15px" }}
              className="badge badge-secondary text-center align-self-center"
            >
              {this.state.isEgitmen
                ? new Date().toISOString().substring(0, 10)
                : this.state.tarih && this.state.tarih.gun}
            </span>
          </div>
          <div className="card">
            <ul className="list-group list-group-flush">
              {this.state.yoklama && (
                <li
                  className="list-group-item bg-primary text-white d-flex justify-content-center clickable-header"
                  onClick={() => this.setState({ modalShow: true })}
                >
                  Eğitime Kaydol
                </li>
              )}
              <li className="list-group-item">
                {this.state.katilimcilar.length !== 0 && (
                  <div class="table-responsive">
                    <table class="table">
                      <thead>
                        <tr>
                          <th scope="col">Katılımcı</th>
                          {this.state.egitim &&
                            this.state.egitim.tarih.map(item => (
                              <th className="text-center" scope="col">
                                {item.gun.split("-")[2]}{" "}
                                {this.translateAy(item.gun.split("-")[1])}
                              </th>
                            ))}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.katilimcilar.map(item => (
                          <tr key={item.id}>
                            <td>
                              {item.ad} {item.soyad}
                            </td>
                            {item.gunYoklama.map(gun => (
                              <td
                                className={`${gun.tarih.gun ===
                                  this.state.seciliGun && !gun.yoklama &&
                                  "clickable-card btn btn-info btn-block"} text-center`}
                                onClick={() =>
                                  gun.tarih.gun === this.state.seciliGun && !gun.yoklama &&
                                  this.onKatilimci(item)
                                }
                              >
                                {gun.tarih.gun === this.state.seciliGun && !gun.yoklama && <span style={{ fontWeight: 600 }}>Yoklama ver</span>}
                                {(gun.tarih.gun === this.state.seciliGun && !gun.yoklama) ||
                                  <FontAwesomeIcon
                                    style={{
                                      color: gun.yoklama ? "green" : "red"
                                    }}
                                    icon={gun.yoklama ? faCheck : faTimes}
                                  />}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </li>
            </ul>
          </div>
          {this.state.isEgitmen && (
            <div className="row justify-content-between">
              {this.state.memnuniyetFormu && (
                <div className="col-lg-4 col-md-5 col-sm-12 col-12 my-4">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      this.setState({
                        QRModalShow: true,
                        link:
                          "/eval-form/" +
                          this.props.history.location.pathname.split("/")[2]
                      })
                    }
                  >
                    MEMNUNİYET FORMU OLUŞTUR (QR)
                  </button>
                </div>
              )}
              <div className="d-flex flex-column col-lg-4 col-md-5 col-sm-12 col-12 my-4">
                <button
                  className="btn btn-danger"
                  onClick={this.yoklamaEkraniAc}
                >
                  YOKLAMA EKRANINI AÇ (QR)
                </button>
              </div>
            </div>
          )}
        </div>
        <KatilimciEkleModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          match={this.props.match}
          egitimTarih={this.state.egitim && this.state.egitim.tarih}
          yoklamaVer={this.yoklamaVer}
        />
        <WarningModal
          text={`${this.state.seciliKatilimci &&
            this.state.seciliKatilimci
              .ad} adına yoklama vermek istediğine emin misin?`}
          button={{ variant: "primary", text: "Evet" }}
          show={this.state.warningModalShow}
          onHide={() => this.setState({ warningModalShow: false })}
          onClick={() => this.yoklamaVer(this.state.seciliKatilimci)}
        />
        <QRModal
          onHide={() => this.setState({ QRModalShow: false })}
          show={this.state.QRModalShow}
          link={this.state.link}
          history={this.props.history}
        />
      </React.Fragment>
    );
  }
}

export default GunlukYoklama;
