import React from "react";
import "./App.css";
import {
  Route,
  Redirect,
  Switch,
  HashRouter
} from "react-router-dom";
import { fireauth } from "./Firestore";
import Notification from "react-notify-bootstrap"
import Login from "./screens/Login";
import EgitimEkleme from "./screens/EgitimEkleme";
import EgitimTipiEkleme from "./screens/EgitimTipiEkleme";
import AdminPanel from "./screens/AdminPanel";
import EgitmenEkleme from "./screens/EgitmenEkleme";
import MusteriEkleme from "./screens/MusteriEkleme";
import EgitimAcma from "./screens/EgitimAcma";
import EgitimTamamlanmis from "./screens/EgitimTamamlanmis";
import NotFound from "./screens/NotFound";
import GunlukYoklama from "./screens/GunlukYoklama";
import EvalForm from "./screens/EvalForm";
import SertifikaGonderme from "./screens/SertifikaGonderme";
import ExcelGönderme from "./screens/ExcelGönderme";
import TumKatılımcılar from "./screens/TumKatılımcılar";

class App extends React.Component {
  state = {
    user: null,
    loading: true
  };

  componentDidMount() {
    fireauth.onAuthStateChanged(user => {
      this.setState({ user, loading: false });
      if (user && !user.isAnonymous) this.setState({ admin: true });
      else this.setState({ admin: false });
    });
  }

  render() {
    if (this.state.loading)
      return (
        <div
          className="d-flex justify-content-center"
          style={{ marginTop: "200px" }}
        >
          <span
            className="spinner-border spinner-border"
            role="status"
            aria-hidden="true"
          ></span>
        </div>
      );

    return (
      <React.Fragment>
        <HashRouter basename="/">
          <Switch>
            <Redirect exact from="/" to="/giris"></Redirect>

            {this.state.admin && (
              <Redirect exact from="/giris" to="/admin-panel"></Redirect>
            )}

            {!this.state.admin && (
              <Redirect exact from="/admin-panel" to="/giris"></Redirect>
            )}
            {!this.state.admin && (
              <Redirect exact from="/excel-sertifika" to="/giris"></Redirect>
            )}
            {!this.state.admin && (
              <Redirect exact from="/sertifika-gonder" to="/giris"></Redirect>
            )}
            {!this.state.admin && (
              <Redirect exact from="/egitim-ac" to="/giris"></Redirect>
            )}
            {!this.state.admin && (
              <Redirect exact from="/egitim-tipi-ekle" to="/giris"></Redirect>
            )}
            {!this.state.admin && (
              <Redirect exact from="/egitmen-ekle" to="/giris"></Redirect>
            )}
            {!this.state.admin && (
              <Redirect exact from="/musteri-ekle" to="/giris"></Redirect>
            )}
            {!this.state.admin && (
              <Redirect exact from="/tum-katilimcilar" to="/giris"></Redirect>
            )}

            <Route path="/giris" component={Login} />
            <Route path="/egitim-ac" component={EgitimAcma} />
            <Route path="/egitim-tamamlanmis" component={EgitimTamamlanmis} />
            <Route path="/egitim-tipi-ekle" component={EgitimTipiEkleme} />
            <Route path="/sertifika-gonder" component={SertifikaGonderme} />
            <Route path="/admin-panel" component={AdminPanel} />
            <Route path="/egitmen-ekle" component={EgitmenEkleme} />
            <Route path="/excel-sertifika" component={ExcelGönderme} />
            <Route path="/musteri-ekle" component={MusteriEkleme} />
            <Route path="/egitim-ekle" component={EgitimEkleme} />
            <Route path="/tum-katilimcilar" component={TumKatılımcılar} />
            <Route
              path="/gunluk-yoklama/:id/egitmen"
              component={GunlukYoklama}
            />
            <Route
              path="/gunluk-yoklama/:id/:id2"
              component={GunlukYoklama}
            />
            <Route path="/eval-form/:id" component={EvalForm} />
            <Route path="/sayfa-bulunamadi" component={NotFound} />

            <Redirect to="/sayfa-bulunamadi" />
          </Switch>
        </HashRouter>
        <Notification />
      </React.Fragment>
    );
  }
}

export default App;
