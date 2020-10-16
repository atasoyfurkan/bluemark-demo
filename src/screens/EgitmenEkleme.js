import React from "react";
import Egitmen from "../components/Egitmen";
import { firestore } from "../Firestore";
import Header from "../components/Header";
import { notify } from "react-notify-bootstrap"
import { Table } from "react-bootstrap";

export default class EgitmenEkleme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      egitmenler: []
    };
    this.getTypes();
  }
  getTypes = _ => {
    firestore.collection("egitmen").onSnapshot(snapshot => {
      let arr = [];
      snapshot.forEach(val => {
        arr.push({ ...val.data(), id: val.id, phone:val.data().phone||"" });
      });
      this.setState(p => ({ egitmenler: arr }));
    });
  };
  addType = _ => {
    try {
      firestore.collection("egitmen").add({ ad: "", email: "", phone:"" });
    } catch (e) {
      notify({
        show: true, variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  };
  deleteTypeCreator = id => async _ => {
    try {
      await firestore
        .collection("egitmen")
        .doc(id)
        .delete();
      if (this.state.egitmenler.find(e => e.id === id) && this.state.egitmenler.find(e => e.id === id).ad !== "")
        notify({
          variant: "danger", text: "Eğitmen silindi"
        });
      await this.setState(prevState => {
        egitmenler: prevState.egitmenler.filter(eg => eg.id !== id);
      });
    } catch (e) {
      console.warn(e)
      notify({
        variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  };

  render() {
    return (
      <React.Fragment>
        <Header history={this.props.history} />
        <div className="container">
          <div className="d-flex justify-content-center m-4">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={this.addType}
            >
              Eğitmen ekle
              <i className="ml-2 fa fa-plus" />
            </button>
          </div>
          <div className="row d-flex justify-content-center">


            <div className="col-11 col-md-7 mt-3">
              <Table responsive striped hover variant="outline-dark">
                <thead>
                  <tr>
                    <th>Eğitmen Adı/E-mail </th>
                    <th>Düzenle </th>
                    <th>Sil </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.egitmenler.map(egitmen => (
                    <tr key={egitmen.id}>
                      <Egitmen
                        ad={egitmen.ad}
                        mail={egitmen.email}
                        id={egitmen.id}
                        phone={egitmen.phone}
                        deleteSelf={this.deleteTypeCreator(
                          egitmen.id,
                        )}
                      />
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}
