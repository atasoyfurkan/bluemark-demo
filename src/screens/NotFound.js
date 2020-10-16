import React, { Component } from "react";
import Header from "../components/Header";

class NotFound extends Component {
  render() {
    return (
      <React.Fragment>
        <Header notAdmin={true} history={this.props.history} />
        <div
          style={{ marginTop: "100px" }}
          className="d-flex justify-content-center"
        >
          <h2>SAYFA BULUNAMADI</h2>
        </div>
      </React.Fragment>
    );
  }
}

export default NotFound;
