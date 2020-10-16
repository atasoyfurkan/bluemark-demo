import React from "react";
import { firestore } from "../Firestore";
import EgitimTamamlanmis from "../components/EgitimTamamlanmis";
import Header from "../components/Header";
import Table from "react-bootstrap/Table";
import Select from "react-select";
import Button from "react-bootstrap/Button";
import { notify } from "react-notify-bootstrap";


export default class EgitimTipi extends React.Component {
    state = {
        egitimler: [],
        searchAy: (new Date()).getMonth() + 1,
        searchYil: (new Date()).getFullYear(),
        aylar: [{ label: "Tümünü Göster", value: 0 }, { label: "Ocak", value: 1 }, { label: "Şubat", value: 2 }, { label: "Mart", value: 3 }, { label: "Nisan", value: 4 }, { label: "Mayıs", value: 5 }, { label: "Haziran", value: 6 }, { label: "Temmuz", value: 7 }, { label: "Ağustos", value: 8 }, { label: "Eylül", value: 9 }, { label: "Ekim", value: 10 }, { label: "Kasım", value: 11 }, { label: "Aralık", value: 12 }],
        yillar: []
    };
    linkRef = React.createRef()
    componentDidMount() {
        this.getEgitimler();
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

    onSearchAyInputChange = e => {
        this.setState({ searchAy: e.value });
    }
    onSearchYilInputChange = e => {
        this.setState({ searchYil: e.value });
    }
    getKatilimciSayisi = async id => {
        let counter = 0;
        await (firestore.collection("katilimci").get()).then(snapshot => {
            snapshot.forEach(val => {
                if (val.data().egitimId === id)
                    counter++;
            });
        });
        return counter
    };

    downloadExcel = async _ => {
        try {
            let data = await fetch("https://bluemark-server.herokuapp.com/excel", {
                method: 'POST', // *GET, POST, PUT, DELETE, etc.
                mode: 'cors', // no-cors, *cors, same-origin
                cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                credentials: 'same-origin', // include, *same-origin, omit
                headers: {
                    'Content-Type': 'application/json'
                },
                redirect: 'follow', // manual, *follow, error
                referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
                body: JSON.stringify({
                    name: `${this.state.searchAy} ${this.state.searchYil}`,
                    data: await Promise.all(this.state.egitimler
                        .filter(eg => (this.state.searchAy === 0 || parseInt(eg.tarih[0].gun.substring(5, 7)) === this.state.searchAy) && this.state.searchYil !== 0 && parseInt(eg.tarih[eg.tarih.length - 1].gun.substring(0, 4)) === this.state.searchYil)
                        .map(async e => ({
                            "Eğitim Adı": e.egitimTipi.ad,
                            "Eğitmen Adı": e.egitmen.ad,
                            "Müşteriler": e.musteriler.map(m => m.ad).join(),
                            "Başlangıç Tarihi": e.tarih[0].gun.substring(5) + "-" + e.tarih[0].gun.substring(0, 4),
                            "Bitiş Tarihi": e.tarih[e.tarih.length - 1].gun.substring(5) + "-" + e.tarih[e.tarih.length - 1].gun.substring(0, 4),
                            "Eğitim Yeri": e.egitimYeri,
                            "Katılımcı Sayısı": await this.getKatilimciSayisi(e.id)
                        }))
                    )
                })
            })
            let blob = await data.blob()
            const href = window.URL.createObjectURL(blob);
            const a = this.linkRef.current;
            a.download = `${this.state.aylar[this.state.searchAy].label} ${this.state.searchYil}.xls`;
            a.href = href;
            a.click();
            a.href = '';


        }
        catch (e) {
            notify({
                variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
            });
        }
    }

    render() {
        return (
            <React.Fragment>
                <Header history={this.props.history} />
                <a ref={this.linkRef} />
                <div className="container">
                    <span className="badge badge-secondary" style={{ fontSize: 16 }} >Tamamlanmış Eğitimler</span>
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
                                defaultValue={{ value: this.state.searchYil, label: this.state.searchYil }}
                            />
                        </div>
                        <div className="col-q">
                            <Button
                                variant={this.state.egitimler.filter(eg => (this.state.searchAy === 0 || parseInt(eg.tarih[0].gun.substring(5, 7)) === this.state.searchAy) && this.state.searchYil !== 0 && parseInt(eg.tarih[eg.tarih.length - 1].gun.substring(0, 4)) === this.state.searchYil).length > 0 ? "primary" : "secondary"}
                                active={this.state.egitimler.filter(eg => (this.state.searchAy === 0 || parseInt(eg.tarih[0].gun.substring(5, 7)) === this.state.searchAy) && this.state.searchYil !== 0 && parseInt(eg.tarih[eg.tarih.length - 1].gun.substring(0, 4)) === this.state.searchYil).length > 0}
                                onClick={this.downloadExcel}
                            >Excel Olarak İndir</Button>
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
                                    <th>Yoklama Linki (Müşteri) </th>
                                    <th>Yoklamayı İndir (Excel) </th>
                                    <th>Sil </th>
                                </tr>
                            </thead>
                            <tbody>

                                {this.state.egitimler.filter(eg => (this.state.searchAy === 0 || parseInt(eg.tarih[0].gun.substring(5, 7)) === this.state.searchAy) && this.state.searchYil !== 0 && parseInt(eg.tarih[eg.tarih.length - 1].gun.substring(0, 4)) === this.state.searchYil).map(item => (
                                    <tr className="text-center clickable-card" onClick={() => { }} key={item.id} >
                                        <EgitimTamamlanmis
                                            egitim={item}
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
