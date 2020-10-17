import React from 'react'
import Header from "../components/Header";
import { Button, Container, Row, Table } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import readXlsxFile from 'read-excel-file'
import axios from "axios";
import { notify } from "react-notify-bootstrap"


export default class ExcelGönderme extends React.Component {
    apiTemplate = (name, id, date, course_name, mail) => `https://bluemark-server.herokuapp.com?name=${name}&e_id=${id}&date=${date}&course_name=${course_name}&mail=${mail}`

    state = {
        data: [],
        fileInput: React.createRef(),
    }
    constructor(props) {

        super(props);
    }
    fileOnChange = async () => {
        try {
            let file = this.state.fileInput.current.files[0];
            await this.setState({ label: file.name });
            const rows = await readXlsxFile(file)
            let data = rows.filter((_, i) => i !== 0).map(row => ({ name: row[2], mail: row[4], egitim: row[0], tarih: row[1], id: row[3], durum: "Hazır", renk: "black" }))
            this.setState({ data })
        }
        catch (e) {
            notify({
                variant: "danger",
                text: "Beklenmedik bir hata gerçekleşti"
            });
        }
    };
    submit = async _ => {
        try {
            this.state.data.forEach((c, i) => { this.sendCertificate(i) })
        }
        catch (e) {
            notify({
                variant: "danger",
                text: "Beklenmedik bir hata gerçekleşti"
            });
        }
    }
    sendCertificate = async i => {
        notify({ variant: "danger", text: "Demo surumunde sertifika gonderilemez" })

        // try {
        //     await this.setState(prev => ({
        //         data: prev.data.map((c, index) => {
        //             if (i === index) {
        //                 return ({
        //                     ...c,
        //                     durum: "Sertifika gönderiliyor",
        //                     renk: "Yellow"
        //                 })
        //             }
        //             else return c
        //         })
        //     }));
        //     let katilimci = this.state.data[i]
        //     const url = encodeURI(this.apiTemplate(katilimci.name, katilimci.id, katilimci.tarih, katilimci.egitim, katilimci.mail))
        //     let { data } = await axios.get(url)
        //     if (data.accepted.length === 1) {
        //         await this.setState(prev => ({
        //             data: prev.data.map((c, index) => {
        //                 if (i === index) {
        //                     return ({
        //                         ...c,
        //                         durum: "Sertifika başarıyla gönderildi",
        //                         renk: "Green"
        //                     })
        //                 }
        //                 else return c
        //             })
        //         }));
        //     }
        //     else throw new Error("")
        // } catch (e) {
        //     console.log(e)
        //     notify({
        //         variant: "danger",
        //         text: "Beklenmedik bir hata gerçekleşti"
        //     });
        //     await this.setState(prev => ({
        //         data: prev.data.map((c, index) => {
        //             if (i === index) {
        //                 return ({
        //                     ...c,
        //                     durum: "Bir hata gerçekleşti",
        //                     renk: "Red"
        //                 })
        //             }
        //             else return c
        //         })
        //     }));
        // }
    }
    render() {
        return (
            <React.Fragment>
                <Header history={this.props.history} />
                <Container>
                    <Row className="justify-content-center mb-3">
                        {
                            this.state.data.length > 0 &&
                            <Table striped hover variant="outline-dark">
                                <thead>
                                    <tr>
                                        <th>
                                            Ad Soyad
                                </th>
                                        <th>
                                            E-mail
                                </th>
                                        <th>
                                            Eğitim Adı
                                </th>
                                        <th>
                                            Eğitimin Bitiş Tarihi
                                </th>
                                        <th>
                                            Enrollment Id
                                </th>
                                        <th>
                                            Durum
                                </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        this.state.data.map(d =>
                                            <tr>
                                                <td>{d.name}</td>
                                                <td>{d.mail}</td>
                                                <td>{d.egitim}</td>
                                                <td>{d.tarih}</td>
                                                <td>{d.id}</td>
                                                <td><span style={{ color: d.renk }}>{d.durum}</span></td>
                                            </tr>
                                        )
                                    }
                                    <tr>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td>
                                            <Button onClick={this.submit}>
                                                Gönder
                                        </Button>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                            || <p>Lütfen Bir Excel Dosyası Seçiniz</p>
                        }
                    </Row>
                    <Row className="justify-content-center mb-3">
                        <Form>
                            <div className="custom-file">
                                <input
                                    type="file"
                                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                                    className="custom-file-input"
                                    ref={this.state.fileInput}
                                    name="fileInput"
                                    onChange={this.fileOnChange}
                                />
                                <label className="custom-file-label" htmlFor="customFile">
                                    {this.state.label}
                                </label>
                            </div>
                        </Form>
                    </Row>
                </Container>

            </React.Fragment>
        )
    }

}
