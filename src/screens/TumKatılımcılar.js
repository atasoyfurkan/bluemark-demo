import React from "react";
import { firestore } from "../Firestore";
import EgitimTamamlanmis from "../components/EgitimTamamlanmis";
import Header from "../components/Header";
import Table from "react-bootstrap/Table";
import Select from "react-select";
import BitirenlerModal from "../components/BitirenlerModal";
import { notify } from "react-notify-bootstrap";
import Katilimci from "../components/Katilimci";
import Button from "react-bootstrap/Button";


export default class TumKatılımcılar extends React.Component {
    linkRef = React.createRef()
    state = {
        katilimcilar: [],
        data:[],
        searchAy: (new Date()).getMonth() + 1,
        searchYil: (new Date()).getFullYear(),
        aylar: [{ label: "Tümünü Göster", value: 0 }, { label: "Ocak", value: 1 }, { label: "Şubat", value: 2 }, { label: "Mart", value: 3 }, { label: "Nisan", value: 4 }, { label: "Mayıs", value: 5 }, { label: "Haziran", value: 6 }, { label: "Temmuz", value: 7 }, { label: "Ağustos", value: 8 }, { label: "Eylül", value: 9 }, { label: "Ekim", value: 10 }, { label: "Kasım", value: 11 }, { label: "Aralık", value: 12 }],
        yillar: [],
        showModal: false
    };

    componentDidMount() {
        this.getKatilimcilar();
    }

    getKatilimcilar = _ => {
        const nowDate = new Date();

        firestore
            .collection("katilimci")
            .onSnapshot(snapshot => {
                let arr = [];
                snapshot.forEach(val => {
                    const date = new Date(val.data().gunYoklama[val.data().gunYoklama.length - 1].tarih.gun);
                    if (!this.state.yillar.includes(date.getFullYear())) {
                        let yillar = [...this.state.yillar];
                        yillar.push(date.getFullYear());
                        this.setState({ yillar });
                    }
                    if (date.getTime() < nowDate.getTime())
                        arr.push({ ...val.data(), id: val.id });
                });
                this.setState(p => ({ katilimcilar: arr, data:arr.map(a=>({})) }));
            });
    };
    onSearchAyInputChange = e => {
        this.setState({ searchAy: e.value, data: this.state.data.map(a=>({})) });
    }
    onSearchYilInputChange = e => {
        this.setState({ searchYil: e.value, data: this.state.data.map(a=>({})) });
    }
    onDataChange = id => data=>{
        let d = this.state.data
        d[id] = data
        this.setState({data:d})
    }
    downloadExcel = async _ => {
        try{
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
                    name :  `${this.state.searchAy} ${this.state.searchYil}`,
                    data: this.state.data.filter(d=>{for(let a in d)return true;return false})
                } )
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
                <a ref={this.linkRef}/>
                <Header history={this.props.history} />
                <div className="container">
                    <span className="badge badge-secondary" style={{ fontSize: 16 }} >Tüm Katılımcılar</span>
                    <hr/>
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
                        <div className="col-q">
                            <Button
                                variant={this.state.data.filter(d=>{for(let a in d)return true;return false}).length>0?"primary":"secondary"}
                                active={this.state.data.filter(eg =>{for(let a in eg)return true;return false}).length>0}
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
                                <th>Eğitim Tarihi </th>
                                <th>Eğitim Süresi </th>
                                <th>Eğitim Yeri </th>
                                <th>Katılımcı Adı Soyadı </th>
                                <th>Telefon</th>
                                <th>E-mail </th>
                                <th>Firma </th>
                                <th>Enrollment_Id</th>
                            </tr>
                            </thead>
                            <tbody>

                            {this.state.katilimcilar
                                .filter(eg =>
                                    eg.gunYoklama!==undefined &&
                                    eg.gunYoklama[0].tarih.gun!==undefined &&
                                    (this.state.searchAy === 0 || parseInt(eg.gunYoklama[0].tarih.gun.substring(5, 7)) === this.state.searchAy)
                                    && this.state.searchYil !== 0 && parseInt(eg.gunYoklama[eg.gunYoklama.length - 1].tarih.gun.substring(0, 4)) === this.state.searchYil).map((item,i) => (
                                <tr className="text-center" key={item.id} >
                                    <Katilimci
                                        katilimci={item}
                                        onDataChange={this.onDataChange(i)}
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
