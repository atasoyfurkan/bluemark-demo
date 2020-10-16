import React from "react";
import EgitimTipi from "../components/EgitimTipi";
import { firestore } from "../Firestore";
import Header from "../components/Header";
import { notify } from "react-notify-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import Table from "react-bootstrap/Table";

export default class EgitimTipiEkleme extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      texts: [],
      search: ""
    };
    this.getTypes();
  }
  getTypes = _ => {
    firestore.collection("egitimtipi").orderBy("tag").orderBy("ad").onSnapshot(snapshot => {
      let arr = [];
      snapshot.forEach(val => {
        arr.push({ ...val.data(), id: val.id });
      });
      this.setState(p => ({ texts: arr }));
    });
  };
  addType = _ => {
    try {
      firestore.collection("egitimtipi").add({ ad: "", tag: "" });
    } catch (e) {
      notify({
        show: true, variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  };
  deleteTypeCreator = id => _ => {
    try {
      firestore
        .collection("egitimtipi")
        .doc(id)
        .delete()
      if (this.state.texts.find(t => t.id === id).ad !== "" && this.state.texts.find(t => t.id === id).tag !== "")
        notify({
          show: true, variant: "danger", text: "Eğitim tipi silindi"
        });
      this.setState(prevState => {
        texts: prevState.texts.filter(text => text.id !== id);
      });
    } catch (e) {
      notify({
        show: true, variant: "danger", text: "Beklenmedik bir hata gerçekleşti"
      });
    }
  };

  onSearchInputChange = e => {
    console.log(e)
    this.setState({ search: e.target.value })
  }
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
              Eğitim kategorisi ekle
              <i className="ml-2 fa fa-plus" />
            </button>
          </div>
          <div className="row d-flex justify-content-center">
            <div className="input-group col-11 col-md-7 mt-3">
              <div className="input-group-prepend">
                <span className="input-group-text">
                  <FontAwesomeIcon icon={faSearch} />
                </span>
              </div>
              <input
                className="form-control"
                placeholder="Eğitim-Kategori Ara"
                value={this.state.search}
                onChange={this.onSearchInputChange}
              />
            </div>
            <div className="col-11 col-md-7 mt-3">
              <Table responsive striped borderless hover variant="outline-dark">
                <thead>
                  <tr>
                    <th>Kategori </th>
                    <th>Eğitim Adı </th>
                    <th>Düzenle </th>
                    <th>Sil </th>
                  </tr>
                </thead>
                <tbody>

                  {this.state.texts.filter(eg => eg.ad.toLowerCase().includes(this.state.search.toLowerCase()) || eg.tag.toLowerCase().includes(this.state.search.toLowerCase())).map(text => (
                    <tr key={text.id} >
                      <EgitimTipi
                        text={text.ad}
                        tag={text.tag}
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
