import React from "react";
import WarningModal from "./WarningModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChalkboard,
  faUserTie,
  faCalendar,
  faMapMarkerAlt
} from "@fortawesome/free-solid-svg-icons";

export default class EgitimTipi extends React.Component {
  state = {
    modalShow: false
  };

  handleEdit = () => {
    const { egitim } = this.props;
    this.props.history.push({ pathname: "/egitim-ekle", state: { egitim } });
  };

  render() {
    const { egitim } = this.props;
    return (
      <React.Fragment>
        <div className="card">
          <div
            className="clickable-header"
            onClick={this.props.onClick}
          >
            <img
              className="card-img-top egitim-card"
              src={egitim.fileName}
            />
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <FontAwesomeIcon className="mr-2" icon={faChalkboard} />
                {egitim.egitimTipi.ad}
              </li>
              <li className="list-group-item">
                <FontAwesomeIcon className="mr-2" icon={faUserTie} />
                {egitim.egitmen.ad}
              </li>
              <li className="list-group-item">
                <div className="row">
                  {egitim.musteriler.map(item => (
                    <div key={item.id} className="col">
                      {item.ad}
                    </div>
                  ))}
                </div>
              </li>
              <li className="list-group-item">
                <FontAwesomeIcon className="mr-2" icon={faCalendar} />
                {egitim.tarih[0].gun} /{" "}
                {egitim.tarih[egitim.tarih.length - 1].gun}
              </li>
              <li className="list-group-item">
                <FontAwesomeIcon className="mr-2" icon={faMapMarkerAlt} />
                {egitim.egitimYeri}
              </li>
            </ul>
          </div>
        </div>
        <WarningModal
          show={this.state.modalShow}
          onHide={() => this.setState({ modalShow: false })}
          onClick={this.props.deleteSelf}
        />
      </React.Fragment>
    );
  }
}
