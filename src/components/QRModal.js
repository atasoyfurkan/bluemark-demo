import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import QRCode from "qrcode.react";
import { url } from "../config.json";

class MusteriSecmeModal extends Component {
  handleClick = () => {
    window.location = url + this.props.link;
  };

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.onHide} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>QR KOD</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex justify-content-center">
            <QRCode
              value={this.props.link && url + this.props.link}
              size={370}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={this.handleClick}>
            Sayfayı aç
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default MusteriSecmeModal;
