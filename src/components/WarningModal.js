import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class ExitWarningModal extends Component {
  render() {
    return (
      <Modal
        size="sm"
        show={this.props.show}
        onHide={this.props.onHide}
        centered
        dialogClassName="radius-modal d-flex justify-content-center"
      >
        <Modal.Body className="d-flex flex-column justify-content-center align-items-center text-center">
          <h5>{this.props.text || "Silmek istediğinize emin misiniz?"}</h5>
        </Modal.Body>
        <div className="d-flex justify-content-center">
          <Button
            variant="secondary"
            style={{ marginRight: "20px" }}
            className="more-radius px-4 py-2"
            onClick={this.props.onHide}
          >
            İptal
          </Button>
          <Button
            variant={
              (this.props.button && this.props.button.variant) || "danger"
            }
            className="more-radius px-4 py-2"
            onClick={this.props.onClick}
          >
            {(this.props.button && this.props.button.text) || "Sil"}
          </Button>
        </div>
      </Modal>
    );
  }
}

export default ExitWarningModal;
