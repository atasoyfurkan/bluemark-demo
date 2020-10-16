import React, { Component } from "react";
import { Navbar } from "react-bootstrap";

class Header extends Component {
  render() {
    return (
      <Navbar
        expand="lg"
        className="text-light navbar-light border-bottom shadow-sm"
        style={{ backgroundColor: "white", marginBottom: "50px" }}
      >
        <div className="container">
          <Navbar.Brand
            className="navbar-brand clickable-header"
            onClick={() => !this.props.notAdmin && this.props.history.push("/admin-panel")}
          >
            <span className="header-brand">
              {/* <img src="../../bma1.jpg" style={{ width: "150px" }}></img> */}
              Demo
            </span>
          </Navbar.Brand>
          {!this.props.notAdmin && (
            <React.Fragment>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <ul
                  className="navbar-nav ml-auto mt-2 mt-lg-0 clickable-header"
                  onClick={() => this.props.history.push("/admin-panel")}
                >
                  <li
                    className="nav-item text-primary active align-self-end m-1"
                    style={{
                      fontSize: "17px",
                      fontWeight: 500
                    }}
                  >
                    Admin Paneli
                  </li>
                </ul>
              </Navbar.Collapse>
            </React.Fragment>
          )}
        </div>
      </Navbar>
    );
  }
}

export default Header;
