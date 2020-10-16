import React from "react";
import { firestore } from "../Firestore";
import EgitimTamamlanmis from "../components/EgitimTamamlanmis";
import Header from "../components/Header";
import Table from "react-bootstrap/Table";
import Select from "react-select";
import BitirenlerModal from "../components/BitirenlerModal";
import { notify } from "react-notify-bootstrap";


export default class EgitimTipi extends React.Component {
    state = {
        egitimler: [],
        searchAy: (new Date()).getMonth() + 1,
        searchYil: (new Date()).getFullYear(),
        aylar: [{ label: "Tümünü Göster", value: 0 }, { label: "Ocak", value: 1 }, { label: "Şubat", value: 2 }, { label: "Mart", value: 3 }, { label: "Nisan", value: 4 }, { label: "Mayıs", value: 5 }, { label: "Haziran", value: 6 }, { label: "Temmuz", value: 7 }, { label: "Ağustos", value: 8 }, { label: "Eylül", value: 9 }, { label: "Ekim", value: 10 }, { label: "Kasım", value: 11 }, { label: "Aralık", value: 12 }],
        yillar: [],
        showModal: false
    };

    componentDidMount() {
        this.getEgitimler();
    }

    getEgitimler = _ => {
        const nowDate = new Date();

        firestore
            .collection("egitim")
            .orderBy("tarih", "desc")
            .onSnapshot(snapshot => {
                let arr = [];
                snapshot.forEach(val => {
                    const date = new Date(val.data().tarih[val.data().tarih.length - 1].gun);
                    if (!this.state.yillar.includes(date.getFullYear())) {
                        let yillar = [...this.state.yillar];
                        yillar.push(date.getFullYear());
                        this.setState({ yillar });
                    }
                    if (date.getTime() < nowDate.getTime())
                        arr.push({ ...val.data(), id: val.id });
                });
                this.setState(p => ({ egitimler: arr }));
            });
    };
    getKatilimci = async id => {
        try {
            firestore.collection("katilimci").onSnapshot(async snapshot => {
                let arr = [];
                snapshot.forEach(val => {
                    if (val.data().egitimId === id)
                        arr.push({ ...val.data(), id: val.id });
                });
                this.setState({ katilimcilar: arr, showModal: true });
            });

        }
        catch (e) {
            notify({
                variant: "danger",
                text: "Beklenmedik bir hata gerçekleşti"
            });
        }

    };
    onCardClicked = item => _ => {
        this.getKatilimci(item.id)
        this.setState({ egitim: item })
    }
    onSearchAyInputChange = e => {
        this.setState({ searchAy: e.value });
    }
    onSearchYilInputChange = e => {
        this.setState({ searchYil: e.value });
    }


    render() {
        return (
            <React.Fragment>
                <Header history={this.props.history} />
                <div className="container">
                    <span className="badge badge-secondary" style={{ fontSize: 16 }} >Sertifika Gönderme</span>
                    <hr></hr>
                    <div className="row justify-content-center">
                        <div className="col-6">
                            <Select
                                className="basic-single ml-2"
                                classNamePrefix="select"
                                isSearchable={true}
                                options={this.state.aylar.map(item => ({
                                    value: item.value,
                                    label: item.label
                                }))}
                                onChange={this.onSearchAyInputChange}
                                placeholder="Ay"
                                defaultValue={this.state.aylar[this.state.searchAy]}
                            />
                        </div>
                        <div className="col-3">
                            <Select
                                className="basic-single"
                                classNamePrefix="select"
                                isSearchable={true}
                                options={this.state.yillar.map(item => ({
                                    value: item,
                                    label: item
                                }))}
                                onChange={this.onSearchYilInputChange}
                                placeholder="Yıl"
                                defaultValue={{value:this.state.searchYil, label:this.state.searchYil}}
                            />
                        </div>
                    </div>
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
                                    <th>Katılımcı Sayısı </th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.egitimler.filter(eg => (this.state.searchAy === 0 || parseInt(eg.tarih[0].gun.substring(5, 7)) === this.state.searchAy) && this.state.searchYil !== 0 && parseInt(eg.tarih[eg.tarih.length - 1].gun.substring(0, 4)) === this.state.searchYil).map(item => (
                                    <tr className="text-center clickable-card" onClick={this.onCardClicked(item)} key={item.id} >
                                        <EgitimTamamlanmis
                                            egitim={item}
                                            history={this.props.history}
                                            sertifika={true}
                                        />
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </div>
                {this.state.katilimcilar &&
                    <BitirenlerModal
                        onHide={() => this.setState({ showModal: false })}
                        show={this.state.showModal}
                        egitim={this.state.egitim}
                        katilimcilar={this.state.katilimcilar} />}
            </React.Fragment>
        );
    }
}
