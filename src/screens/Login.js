import React from "react";
import Joi from "joi-browser";
import { fireauth } from "../Firestore";
import FormClass from "../components/FormClass";
import Header from "../components/Header";

class Login extends FormClass {
  state = {
    data: { password: "", email: "" },
    errors: {},
    loading: false
  };

  schema = {
    email: Joi.string()
      .required()
      .email()
      .label("Email"),
    password: Joi.string()
      .required()
      .min(5)
      .label("Password")
  };

  doSubmit = () => {
    this.setState({ loading: true });

    const email = this.state.data.email;
    const password = this.state.data.password;
    const that = this;
    fireauth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.props.history.push("/admin-panel");
      })
      .catch(error => {
        const errors = { ...that.state.errors };
        console.log(error.code);
        if (error.code === "auth/user-not-found") errors.email = error.message;
        else errors.password = error.message;
        that.setState({ errors });
        this.setState({ loading: false });
      });
  };

  render() {
    return (
      <React.Fragment>
        <Header notAdmin={true} history={this.props.history} />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-11 col-sm-10 col-md-7 col-lg-5 p-4">
              <form>
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-user"></i>
                      </span>
                    </div>
                    {this.renderInput("email", "E-posta adresi", "text")}
                  </div>
                  {this.renderError("email")}
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="fa fa-lock"></i>
                      </span>
                    </div>
                    {this.renderInput("password", "Şifre", "password")}
                  </div>
                  {this.renderError("password")}
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={e => this.handleSubmit(e)}
                >
                  {this.state.loading ? (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  ) : (
                    "Giriş yap"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default Login;
