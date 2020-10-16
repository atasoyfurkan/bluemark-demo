import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faDownload } from "@fortawesome/free-solid-svg-icons";
import { url } from "../config.json"
import { notify } from "react-notify-bootstrap"
import { firestore } from "../Firestore";

export default class Katilimci extends React.Component {
    state = {
        egitim:undefined
    };

    componentDidMount() {
        this.getEgitim();
    }
    getEgitim = async ()=> {
        try{
            let doc = await firestore.collection('egitim').doc(this.props.katilimci.egitimId).get()
            await this.setState({egitim:doc.data()})
            if(this.state.egitim === undefined) return
            this.props.onDataChange({
                "Firma Adı": this.props.katilimci.sirketBilgisi,
                "Eğitim Adı": this.state.egitim.egitimTipi.ad,
                "Eğitmen Adı": this.state.egitim.egitmen.ad,
                "Eğitim Tarihi": this.state.egitim.tarih[0].gun.substring(5) + "-" + this.state.egitim.tarih[0].gun.substring(0, 4),
                "Eğitim Süresi": this.state.egitim.tarih.length,
                "Eğitim Yeri ": this.state.egitim.egitimYeri,
                "Katılımcı Adı Soyadı": this.props.katilimci.ad + " " + this.props.katilimci.soyad,
                "Telefon Numarası": this.props.katilimci.telefon,
                "E-mail": this.props.katilimci.email,
                "Enrollment Id": this.props.katilimci.sertifika,

            })
        }
        catch (e) {
            console.log(e)
            notify({
                variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
            });
        }
    }


    render() {
        const { katilimci } = this.props;
        const { egitim } = this.state;
        if(egitim===undefined) return null
        return (
            <React.Fragment>
                <td>{egitim.egitimTipi.ad}</td>
                <td>{egitim.egitmen.ad}</td>
                <td>{egitim.tarih[0].gun.substring(5) + "-" + egitim.tarih[0].gun.substring(0, 4)}</td>
                <td>{egitim.tarih.length} gün</td>
                <td>{egitim.egitimYeri}</td>
                <td>{katilimci.ad} {katilimci.soyad}</td>
                <td>{katilimci.telefon}</td>
                <td>{katilimci.email}</td>
                <td>{katilimci.sirketBilgisi}</td>
                <td>{katilimci.sertifika}</td>

            </React.Fragment >
        );
    }
}
