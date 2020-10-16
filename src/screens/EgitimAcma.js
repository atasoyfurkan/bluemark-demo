import React from "react";
import { firestore } from "../Firestore";
import Egitim from "../components/Egitim";
import Header from "../components/Header";
import { notify } from "react-notify-bootstrap";
import Table from "react-bootstrap/Table";
import Select from "react-select";


export default class EgitimTipi extends React.Component {
  state = {
    egitimler: [],
    search: (new Date()).getMonth() + 1,
    aylar: [{ label: "Tümünü Göster", value: 0 }, { label: "Ocak", value: 1 }, { label: "Şubat", value: 2 }, { label: "Mart", value: 3 }, { label: "Nisan", value: 4 }, { label: "Mayıs", value: 5 }, { label: "Haziran", value: 6 }, { label: "Temmuz", value: 7 }, { label: "Ağustos", value: 8 }, { label: "Eylül", value: 9 }, { label: "Ekim", value: 10 }, { label: "Kasım", value: 11 }, { label: "Aralık", value: 12 }]
  };

  componentDidMount() {
    this.getEgitimler();
    if (
      this.props.location.state &&
      this.props.location.state.durum === "change"
    ) {
      notify({
        variant: "success", text: "Sınıf başarıyla değiştirildi"
      });
    }
  }

  getEgitimler = _ => {
    const nowDate = new Date((new Date()).toISOString().substring(0, 10));

    firestore
      .collection("egitim")
      .orderBy("tarih", "desc")
      .onSnapshot(snapshot => {
        let arr = [];
        snapshot.forEach(val => {
          const date = new Date(val.data().tarih[val.data().tarih.length - 1].gun);
          if (date.getTime() >= nowDate.getTime())
            arr.push({ ...val.data(), id: val.id });
        });
        this.setState(p => ({ egitimler: arr }));
      });
  };
  deleteEgitim = async egitim => {
    try {
      await firestore
        .collection("egitim")
        .doc(egitim.id)
        .delete();
      notify({
        show: true, variant: "danger", text: "Eğitim silindi"
      });
    } catch (e) {
      notify({
        show: true, variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  };

  onSearchInputChange = e => {
    this.setState({ search: e.value });
  }

  render() {
    return (
      <React.Fragment>
        <Header history={this.props.history} />
        <div className="container">
          <span className="badge badge-secondary" style={{ fontSize: 16 }} >Açılan Eğitimler</span>
          <hr></hr>
          <Select
            className="basic-single"
            classNamePrefix="select"
            isSearchable={true}
            options={this.state.aylar.map(item => ({
              value: item.value,
              label: item.label
            }))}
            onChange={this.onSearchInputChange}
            defaultValue={this.state.aylar[new Date().getMonth() + 1]}
          />
          <div className="d-flex justify-content-center">
            <Table responsive striped borderless hover variant="outline-dark">
              <thead>
                <tr className="text-center">
                  <th>Eğitim Adı </th>
                  <th>Eğitmen </th>
                  <th>Müşteriler </th>
                  <th>Başlangıç Tarihi </th>
                  <th>Bitiş Tarihi </th>
                  <th>Eğitim Yeri </th>
                  <th>Yoklama Linki (Eğitmen) </th>
                  <th>Yoklama Linki (Müşteri) </th>
                  <th>Eğitmene Mail Gönder</th>
                  <th>Düzenle </th>
                  <th>Sil </th>
                </tr>
              </thead>
              <tbody>

                {this.state.egitimler.filter(eg => this.state.search === 0 || parseInt(eg.tarih[0].gun.substring(5, 7)) === this.state.search).map(item => (
                  <tr className="text-center" key={item.id} >
                    <Egitim
                      egitim={item}
                      deleteSelf={() => this.deleteEgitim(item)}
                      history={this.props.history}
                    />
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
