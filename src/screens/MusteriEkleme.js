import React from "react";
import Musteri from "../components/Musteri";
import { firestore } from "../Firestore";
import Header from "../components/Header";
import { notify } from "react-notify-bootstrap"
import { Table } from "react-bootstrap";

export default class MusteriEkleme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texts: []
    };
    this.getTypes();
  }
  getTypes = _ => {
    firestore.collection("musteri").orderBy("ad").onSnapshot(snapshot => {
      let arr = [];
      snapshot.forEach(val => {
        arr.push({ ...val.data(), id: val.id });
      });
      this.setState(p => ({ texts: arr }));
    });
  };
  addType = _ => {
    try {
      firestore.collection("musteri").add({ ad: "" });
    } catch (e) {
      notify({
        variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  };
  deleteTypeCreator = id => async _ => {
    try {
      await firestore
        .collection("musteri")
        .doc(id)
        .delete();
      if (this.state.texts.find(text => text.id === id) && this.state.texts.find(text => text.id === id).ad !== "")
        notify({
          variant: "danger", text: "Müşteri silindi"
        });
      await this.setState(prevState => { texts: prevState.texts.filter(text => text.id !== id) })
    } catch (e) {
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
              Müşteri ekle
              <i className="ml-2 fa fa-plus" />
            </button>
          </div>
          <div className="row d-flex justify-content-center">

            <div className="col-11 col-md-7 mt-3">
              <Table responsive striped hover variant="outline-dark">
                <thead>
                  <tr>
                    <th>Müşteri Adı </th>
                    <th>Düzenle </th>
                    <th>Sil </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.texts.map(text => (
                    <tr key={text.id} className="col-11 col-md-7 mt-3">
                      <Musteri
                        text={text.ad}
                        id={text.id}
                        deleteSelf={this.deleteTypeCreator(text.id)}
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
