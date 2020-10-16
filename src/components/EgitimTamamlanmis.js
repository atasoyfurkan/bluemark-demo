import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink, faDownload, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { url } from "../config.json"
import { notify } from "react-notify-bootstrap"
import { firestore } from "../Firestore";
import axios from "axios";
import WarningModal from "./WarningModal";

export default class EgitimTamamlanmis extends React.Component {
    state = {
        katilimciSayisi: 0,
        modalShow: false
    };
    linkRef = React.createRef()
    questions = [
        "Eğitim, genel olarak beklentilerimi karşılayacak düzeydeydi.",
        "Eğitimin içeriği amacına uygun şekilde hazırlanmıştı.",
        "Eğitimde verilen örnekler ve uygulamalar öğrenimime yardımcı oldu.",
        "Eğitmenin bilgisi ve konuya hakimiyeti iyiydi.",
        "Eğitmen sorulara tatmin edici cevaplar verdi.",
        "Eğitmen eğitim için hazırlıklıydı.",
        "Kullanılan salon, oturma düzeni ve alanlar eğitim için uygundu.",
        "Eğitim ortamı, temiz ve düzenliydi.",
    ]
    componentDidMount() {
        this.getKatilimciSayisi();
    }

    getKatilimciSayisi = () => {
        firestore.collection("katilimci").onSnapshot(snapshot => {
            let counter = 0;
            snapshot.forEach(val => {
                if (val.data().egitimId === this.props.egitim.id)
                    counter++;
            });
            this.setState({ katilimciSayisi: counter });
        });
    };

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
    downloadExcel = async _ => {
        try {
            let docs = await firestore.collection("katilimci").where("egitimId", "==", this.props.egitim.id).get()
                .then(snapshot => snapshot.docs)
            if (docs.length === 0) {
                notify({
                    variant: "danger", text: "Yoklama verisi yok."
                });
                return
            }
            console.log(docs)
            let data = docs.map(d => d.data()).map(doc => ({
                "Ad": doc.ad,
                "Soyad": doc.soyad,
                "E-mail": doc.email,
                "Telefon": doc.telefon,
                "Şirket": doc.sirketBilgisi,
                "Yoklama": `${doc.gunYoklama.map(g => g.yoklama ? 1 : 0).reduce((a, b) => a + b)}/${doc.gunYoklama.length}` ,
                ...JSON.parse("{"+doc.form.map((f, i)=>`"${this.questions[i]}": ${f}`).join(",")+"}")
            }))
            console.log(data)
            let fetched = await fetch("https://bluemark-server.herokuapp.com/excel", {
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
                    name: this.props.egitim.ad,
                    data
                })
            })
            console.log(fetched)
            let blob = await fetched.blob()
            console.log(blob)
            const href = window.URL.createObjectURL(blob);
            console.log(href)
            const a = this.linkRef.current;
            a.download = `${this.props.egitim.egitimTipi.ad}.xls`;
            a.href = href;
            a.click();
            a.href = '';
        }
        catch (e) {
            console.warn(e)
            notify({
                variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
            });
        }
    }

    deleteSelf = async _ => {
        await firestore.collection('egitim').doc(this.props.egitim.id).delete()
    }

    render() {
        const { egitim } = this.props;
        return (
            <React.Fragment>
                <td>{egitim.egitimTipi.ad}
                    <a ref={this.linkRef} /></td>
                <td>{egitim.egitmen.ad}</td>
                <td>{egitim.musteriler.map(item => (
                    <div key={item.id} className="col">
                        {item.ad}
                    </div>
                ))}</td>
                <td>{egitim.tarih[0].gun.substring(5) + "-" + egitim.tarih[0].gun.substring(0, 4)}</td>
                <td>{egitim.tarih[egitim.tarih.length - 1].gun.substring(5) + "-" + egitim.tarih[egitim.tarih.length - 1].gun.substring(0, 4)}</td>
                <td>{egitim.egitimYeri}</td>
                <td>{this.state.katilimciSayisi}</td>
                <td className={`d-${this.props.sertifika ? "none" : "block"}`}>
                    <button className="btn btn-outline-primary" onClick={this.copySirket}>
                        <FontAwesomeIcon icon={faLink} />
                    </button>
                </td>
                <td className={`${this.props.sertifika ? "d-none" : ""}`}>
                    <button className="btn btn-outline-primary" onClick={this.downloadExcel}>
                        <FontAwesomeIcon icon={faDownload} />
                    </button>
                </td>
                <td className={`${this.props.sertifika ? "d-none" : ""}`}>
                    <button className="btn btn-danger" onClick={() => this.setState({ modalShow: true })}>
                        <FontAwesomeIcon icon={faTrash} />
                    </button>
                    <WarningModal
                        show={this.state.modalShow}
                        onHide={() => this.setState({ modalShow: false })}
                        onClick={this.deleteSelf} />
                </td>

            </React.Fragment >
        );
    }
}
