import React from "react";
import Joi from "joi-browser";
import { Button } from "react-bootstrap";
import MultipleDatePicker from "react-multiple-datepicker";
import firebase, { firestore } from "../Firestore";
import MusteriSecmeModal from "../components/MusteriSecmeModal";
import Header from "../components/Header";
import FormClass from "../components/FormClass";
import Select from "react-select";
import { notify } from "react-notify-bootstrap";
import { url } from "../config.json"

class OpenEducation extends FormClass {
  state = {
    egitimTipleri: [],
    musteriler: [],
    egitmenler: [],
    katilimcilar: [],
    data: {
      egitimTipi: null,
      egitmen: null,
      tarih: [],
      egitimYeri: null
    },
    errors: {},
    seciliMusteriler: [],
    selectEgitimTipi: null,
    selectEgitmen: null,
    modalShow: false,
    loading: false,
    storageRef: firebase.storage().ref()
  };

  schema = {
    egitimTipi: Joi.object().required(),
    egitmen: Joi.object().required(),
    tarih: Joi.array().min(1),
    egitimYeri: Joi.string().required(),
  };

  async componentDidMount() {
    await this.getEgitimTipi();
    await this.getEgitmen();
    await this.getMusteri();
    this.setState({
      seciliMusteriler: new Array(this.state.musteriler.length)
    });

    if (this.props.location.state) {
      const { egitim } = this.props.location.state;
      let seciliMusteriler = [...this.state.seciliMusteriler];
      this.state.musteriler.forEach((item, index) => {
        egitim.musteriler.forEach(element => {
          if (element.id === item.id) seciliMusteriler[index] = true;
        });
      });

      firestore.collection("katilimci").onSnapshot(snapshot => {
        let arr = [];
        snapshot.forEach(val => {
          if (val.data().egitimId === this.props.location.state.egitim.id)
            arr.push({ ...val.data(), id: val.id });
        });
        this.setState({ katilimcilar: arr });
      });

      this.setState({
        data: {
          ...this.state.data,
          egitimTipi: egitim.egitimTipi,
          egitmen: egitim.egitmen,
          tarih: egitim.tarih,
          egitimYeri: egitim.egitimYeri
        },
        seciliMusteriler: seciliMusteriler,
        selectEgitimTipi: egitim.egitimTipi.ad,
        selectEgitmen: egitim.egitmen.ad
      });
    }
  }

  getEgitimTipi = async () => {
    const snapshot = await firestore
      .collection("egitimtipi")
      .orderBy("ad")
      .get();
    let arr = [];
    snapshot.forEach(val => {
      arr.push({ ...val.data(), id: val.id });
    });
    const data = {
      ...this.state.data,
      egitimTipi: arr[0]
    };
    this.setState(p => ({ egitimTipleri: arr, data }));
  };
  getEgitmen = async () => {
    const snapshot = await firestore
      .collection("egitmen")
      .orderBy("ad")
      .get();
    let arr = [];
    snapshot.forEach(val => {
      arr.push({ ...val.data(), id: val.id });
    });
    const data = { ...this.state.data, egitmen: arr[0] };
    this.setState(p => ({ egitmenler: arr, data }));
  };
  getMusteri = async () => {
    const snapshot = await firestore
      .collection("musteri")
      .orderBy("ad")
      .get();
    let arr = [];
    snapshot.forEach(val => {
      arr.push({ ...val.data(), id: val.id });
    });
    this.setState(p => ({ musteriler: arr }));
  };

  modalClose = () => {
    this.setState({ modalShow: false });
  };

  onChange = event => {
    console.log(event.target.value);

    if (event.target.name === "egitmen") {
      const egitmen = this.state.egitmenler.find(
        item => item.ad === event.target.value
      );
      this.setState({ data: { ...this.state.data, egitmen } });
    }
    if (event.target.name === "egitimYeri") {
      this.handleChange({
        currentTarget: event.target
      });
      const egitimYeri = event.target.value;
      this.setState({ data: { ...this.state.data, egitimYeri } });
    }
  };
  onChangeSelectEgitimTipi = event => {
    console.log(event);

    const egitimTipi = this.state.egitimTipleri.find(
      item => item.ad === event.value
    );
    this.setState({ data: { ...this.state.data, egitimTipi } });
  };
  handleMusteriSecme = index => {
    const seciliMusteriler = [...this.state.seciliMusteriler];
    seciliMusteriler[index] = !seciliMusteriler[index];
    this.setState({ seciliMusteriler });
  };
  handleSubmitDatePicker = datesArg => {
    let dates = datesArg
      .sort((a, b) => a.getTime() - b.getTime())
      .map(item => new Date(item));
    dates = dates.map(item => {
      item.setDate(item.getDate() + 1);
      return item.toISOString().substring(0, 10);
    });
    console.log(dates);

    let data = { ...this.state.data };
    data.tarih = [...dates];

    this.handleChange({
      currentTarget: { name: "tarih", value: data.tarih }
    });
    this.setState({ data });
  };

  doSubmit = async () => {
    this.setState({ loading: true });

    let musteriler = [];
    this.state.musteriler.forEach((item, index) => {
      if (this.state.seciliMusteriler[index]) musteriler.push(item);
    });

    let tarihWithId = this.state.data.tarih;
    if (!tarihWithId[0].id)
      tarihWithId = this.state.data.tarih.map(item => ({
        id: Math.random()
          .toString(36)
          .substring(2),
        gun: item
      }));

    let egitim = {
      egitimTipi: this.state.data.egitimTipi,
      egitmen: this.state.data.egitmen,
      musteriler,
      tarih: tarihWithId,
      egitimYeri: this.state.data.egitimYeri
    };
    try {
      if (this.props.location.state && this.props.location.state.egitim) {
        firestore
          .collection("egitim")
          .doc(this.props.location.state.egitim.id)
          .set({ ...egitim }, { merge: true });

        console.log(this.state.katilimcilar);
        console.log(egitim);

        for (const katilimci of this.state.katilimcilar) {
          let gunYoklama = [];
          for (const item of egitim.tarih) {
            let flag = false;
            for (const katilimciYoklama of katilimci.gunYoklama) {
              if (katilimciYoklama.tarih.gun === item.gun) {
                gunYoklama.push(katilimciYoklama);
                flag = true;
              }
            }
            if (!flag) {
              gunYoklama.push({ tarih: item, yoklama: false });
            }
          }
          firestore.collection("katilimci").doc(katilimci.id).set({ ...katilimci, gunYoklama });
          console.log(gunYoklama);
        }



        notify({ variant: "success", text: "Sınıf başarılı bir şekilde değiştirilmiştir" });
        this.props.history.push({ pathname: '/egitim-ac', state: { durum: "change" } });
        this.setState({
          loading: false
        });
      } else {
        firestore.collection("egitim").add(egitim);
        notify({ variant: "success", text: "Sınıf başarılı bir şekilde oluşturulmuştur", onClose: () => window.location = url + "/egitim-ekle" });
        this.setState({
          loading: false
        });
      }
    } catch (e) {
      notify({ variant: "danger", text: "Beklenmedik bir hata gerçekleşti" });
      this.setState({
        loading: false
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Header history={this.props.history} />
        <div className="container d-flex flex-column align-items-center">
          <div className="col-12 col-md-8 row d-flex justify-content-center">
            <div className="col-12 col-md-6 d-flex flex-column mb-2">
              <label className="align-self-start">Eğitim Adı</label>
              {!this.state.selectEgitimTipi && (
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={this.state.egitimTipleri.map(item => ({
                    value: item.ad,
                    label: item.ad
                  }))}
                  onChange={this.onChangeSelectEgitimTipi}
                  name="egitimTipi"
                />
              )}
              {this.state.selectEgitimTipi && (
                <Select
                  className="basic-single"
                  classNamePrefix="select"
                  isSearchable={true}
                  options={this.state.egitimTipleri.map(item => ({
                    value: item.ad,
                    label: item.ad
                  }))}
                  defaultValue={{
                    value: this.state.selectEgitimTipi,
                    label: this.state.selectEgitimTipi
                  }}
                  onChange={this.onChangeSelectEgitimTipi}
                  name="egitimTipi"
                />
              )}
              {this.renderError("egitimTipi")}
            </div>
            <div className="col-12 col-md-6 d-flex flex-column mb-2">
              <label className="align-self-start">Egitmen</label>
              <select
                className="form-control"
                value={this.state.selectEgitmen}
                onChange={this.onChange}
                name="egitmen"
              >
                {this.state.egitmenler.map(item => (
                  <option key={item.id}>{item.ad}</option>
                ))}
              </select>
              {this.renderError("egitmen")}
            </div>
            <div className="col-12 col-md-6 d-flex flex-column mb-2">
              <label className="align-self-start">Müşteriler</label>
              <button
                type="button"
                className="btn btn-light border"
                onClick={() => this.setState({ modalShow: true })}
              >
                {this.state.seciliMusteriler && this.state.seciliMusteriler.find(m => m) ? this.state.musteriler[this.state.seciliMusteriler.findIndex(m => m)].ad : " Müşteri seç"}
              </button>
            </div>
            <div className="col-12 col-md-6 d-flex flex-column mb-2">
              <label className="align-self-start">Tarih</label>

              <MultipleDatePicker
                name="tarih"
                onSubmit={this.handleSubmitDatePicker}
              >
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    value={
                      this.state.data.tarih.length
                        ? this.state.data.tarih.length + " Gün"
                        : ""
                    }
                  />
                  <span className="input-group-btn">
                    <Button className="default date-range-toggle">
                      <i className="fa fa-calendar" />
                    </Button>
                  </span>
                </div>
              </MultipleDatePicker>

              {this.renderError("tarih")}
            </div>
            <div className="col-12 col-md-12 d-flex flex-column mb-4">
              <label className="align-self-start">Eğitim yeri</label>
              <input
                className="form-control"
                value={this.state.data.egitimYeri}
                onChange={this.onChange}
                name="egitimYeri"
              />
              {this.renderError("egitimYeri")}
            </div>
          </div>
          <div className="col-12 col-md-8 row justify-content-end">
            <div>
              <button className="btn btn-danger" onClick={this.handleSubmit}>
                {this.state.loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                    this.props.location.state && this.props.location.state.egitim ?
                      "Güncelle" : "Sınıf oluştur"
                  )}
              </button>
            </div>
          </div>
        </div>
        <MusteriSecmeModal
          show={this.state.modalShow}
          onHide={this.modalClose}
          musteriler={this.state.musteriler}
          handleMusteriSecme={this.handleMusteriSecme}
          seciliMusteriler={this.state.seciliMusteriler}
        />
      </React.Fragment>
    );
  }
}

export default OpenEducation;
