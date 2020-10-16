import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class MusteriSecmeModal extends Component {
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Müşterileri Seç</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row mb-4 border-bottom">
            {this.props.musteriler.map((item, index) => (
              <Button
                key={item.id}
                variant="danger"
                className={`col-3 ml-2 mb-2 ${
                  this.props.seciliMusteriler[index] ? "d-block" : "d-none"
                }`}
                onClick={() => this.props.handleMusteriSecme(index)}
              >
                {item.ad}
              </Button>
            ))}
          </div>
          <div className="row d-flex">
            {this.props.musteriler.map((item, index) => (
              <Button
                key={item.id}
                className={`col-5 ml-4 mb-2 ${
                  this.props.seciliMusteriler[index] ? "d-none" : "d-block"
                }`}
                onClick={() => this.props.handleMusteriSecme(index)}
              >
                {item.ad}
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.props.onHide}>
            Kaydet
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default MusteriSecmeModal;
