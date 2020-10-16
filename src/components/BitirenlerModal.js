import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { notify } from "react-notify-bootstrap"
import axios from "axios";
import { firestore } from "../Firestore";


export default class BitirenlerModal extends React.Component {
    // apiTemplate = (name, id, date, course_name, mail) => `https://bluemark-server.herokuapp.com?name=${name}&e_id=${id}&date=${date}&course_name=${course_name}&mail=${mail}`


    state = {
        checkBoxes: []
    };

    onShow = _ => {
        this.setState({
            checkBoxes:
                this.props.katilimcilar.map(k => ({
                    checked: (k.gunYoklama.filter(gun => gun.yoklama).length >= k.gunYoklama.length * 85 / 100) && this.validForm(k.form),
                    disabled: k.sertifika !== undefined,
                    text: k.sertifika !== undefined ? "Sertifika gönderildi" : "Sertifika Gönderilmedi",
                    color: k.sertifika !== undefined ? "green" : "black"
                })),
        })
    }
    componentWillMount() {
        this.onShow()
    }
    validForm = form => {
        if (!form) return false;
        form.forEach(f => { if (f === 0) return false })
        return true
    }
    handleChange = index => _ => {
        this.setState(prev => ({ checkBoxes: prev.checkBoxes.map((c, i) => i === index ? { ...c, checked: !c.checked } : c) }))
    }
    submit = async _ => {
        try {
            let id = 0
            await firestore
                .collection("sertifika")
                .orderBy("enrollment_id", "desc")
                .limit(1)
                .get()
                .then(snapshot => snapshot.forEach(doc => { id = doc.data().enrollment_id + 1 }))
            if (id % 2 === 0) id++;
            this.state.checkBoxes.forEach((c, i) => { if (c.checked && !c.disabled) this.sendCertificate(i, id + i * 2) })
        }
        catch (e) {
            notify({
                variant: "danger",
                text: "Beklenmedik bir hata gerçekleşti"
            });
        }
    }
    monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]
    getEnrollmentId = id => {
        let r = "" + id
        while (r.length < 6)
            r = "0" + r
        return r
    }
    getDate = date => `${new Date(date).getDate()}/${this.monthNames[new Date(date).getMonth()]}/${new Date(date).getFullYear()}`
    sendCertificate = async (i, id) => {
        notify({ variant: "info", text: "Demo surumu mail gonderemez" });
        // try {
        //     await this.setState(prev => ({
        //         checkBoxes: prev.checkBoxes.map((c, index) => {
        //             if (i === index) {
        //                 return ({
        //                     disabled: true,
        //                     checked: true,
        //                     text: "Sertifika gönderiliyor",
        //                     color: "Yellow"
        //                 })
        //             }
        //             else return c
        //         })
        //     }));

        //     let katilimci = { ...this.props.katilimcilar[i] }
        //     let course = (await firestore
        //         .collection("egitim")
        //         .doc(katilimci.egitimId)
        //         .get()).data()
        //     const url = encodeURI(this.apiTemplate(katilimci.ad + " " + katilimci.soyad, this.getEnrollmentId(id), this.getDate(katilimci.gunYoklama[katilimci.gunYoklama.length - 1].tarih.gun), course.egitimTipi.ad, katilimci.email))
        //     let { data } = await axios.get(url)
        //     if (data.accepted.length === 1) {
        //         await this.setState(prev => ({
        //             checkBoxes: prev.checkBoxes.map((c, index) => {
        //                 if (i === index) {
        //                     return ({
        //                         disabled: true,
        //                         checked: true,
        //                         text: "Başarıyla gönderildi",
        //                         color: "Green"
        //                     })
        //                 }
        //                 else return c
        //             })
        //         }));
        //         let doc = await firestore
        //             .collection("sertifika")
        //             .add({
        //                 enrollment_id: id,
        //                 ad: katilimci.ad,
        //                 soyad: katilimci.soyad,
        //                 email: katilimci.email,
        //                 tarih: this.getDate()
        //             })
        //         katilimci = { ...katilimci, sertifika: doc.id }
        //         await firestore
        //             .collection("katilimci")
        //             .doc(this.props.katilimcilar[i].id)
        //             .set({ ...katilimci });
        //     }
        //     else throw new Error("")
        // } catch (e) {
        //     console.log(e)
        //     notify({
        //         variant: "danger",
        //         text: "Beklenmedik bir hata gerçekleşti"
        //     });
        //     await this.setState(prev => ({
        //         checkBoxes: prev.checkBoxes.map((c, index) => {
        //             if (i === index) {
        //                 return ({
        //                     disabled: false,
        //                     checked: true,
        //                     text: "Bir hata gerçekleşti",
        //                     color: "Red"
        //                 })
        //             }
        //             else return c
        //         })
        //     }));
        // }
    }
    render() {
        return (
            <div>

                <Modal size={"xl"} show={this.props.show} onHide={this.props.onHide} onShow={this.onShow}>
                    <Modal.Header>
                        <Modal.Title>
                            <span style={{ fontWeight: 700, fontSize: 20 }}>
                                {this.props.egitim.egitimTipi.ad} Eğitimi İçin Sertifikaları Gönder
                        </span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {this.props.katilimcilar.length !== 0 && (
                            <div className="table-responsive">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th scope="col">Katılımcı Adı</th>
                                            <th scope="col">Yoklama</th>
                                            <th scope="col">Memnuniyet Formu</th>
                                            <th scope="col">Sertifika Gönderilsin</th>
                                            <th scope="col">Sertifika Durumu</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.props.katilimcilar.map((item, index) => (
                                            <tr key={item.id}>
                                                <td>
                                                    {item.ad} {item.soyad}
                                                </td>
                                                <td>
                                                    {item.gunYoklama.filter(gun => gun.yoklama).length}/{item.gunYoklama.length}
                                                </td>
                                                <td>
                                                    {this.validForm(item.form) ? <span style={{ color: "green" }}>Doldurdu</span> : <span style={{ color: "Red" }}>Doldurmadı</span>}
                                                </td>
                                                <td>
                                                    <Form.Check as="input" checked={this.state.checkBoxes[index] && this.state.checkBoxes[index].checked} disabled={this.state.checkBoxes[index] && this.state.checkBoxes[index].disabled} onChange={this.handleChange(index)} />
                                                </td>
                                                <td>
                                                    <span style={{ color: this.state.checkBoxes[index] && this.state.checkBoxes[index].color }}>{this.state.checkBoxes[index] && this.state.checkBoxes[index].text}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.submit}>Seçililere Gönder</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}
