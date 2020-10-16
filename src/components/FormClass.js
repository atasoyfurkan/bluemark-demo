import React, { Component } from "react";
import { Alert } from "react-bootstrap";
import Joi from "joi-browser";

class FormClass extends Component {
  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e, callback, mode) => {

    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    if (callback) callback();
    else this.doSubmit();
  };

  handleChange = ({ currentTarget: input }) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) {
      errors[input.name] = errorMessage;
    } else delete errors[input.name];

    const data = { ...this.state.data };
    data[input.name] = input.value;

    this.setState({ data, errors });
  };

  enterPressed = event => {
    const code = event.keyCode || event.which;
    if (code === 13) this.handleSubmit(event);
  };

  translateText = error => {
    if (
      error === '"Email" must be a valid email' ||
      error === '"email" must be a valid email'
    )
      return "Geçerli bir E-posta adresi girin";

    if (error === '"Username" is not allowed to be empty')
      return "Kullanıcı adı boş bırakılamaz";
    if (
      error === '"Email" is not allowed to be empty' ||
      error === '"email" is not allowed to be empty'
    )
      return "E-posta boş bırakılamaz";
    if (error === '"Password" is not allowed to be empty')
      return "Şifre boş bırakılamaz";
    if (error === '"Mesaj" is not allowed to be empty')
      return "Mesaj boş bırakılamaz";

    if (
      error === '"telefon" must be a number' ||
      error === '"telefon" must be larger than or equal to 999999999' ||
      error === '"telefon" must be less than or equal to 9999999999'
    )
      return "Geçerli bir Telefon numarası girin";

    if(error.startsWith('"telefon"'))
      return "Telefon numarası ((5xx) xxx xxxx) formatında olmalı"

    if (
      error === '"egitimTipi" must be a string' ||
      error === '"egitmen" must be a string' ||
      error === '"egitimYeri" must be a string' ||
      error === '"bitis" must be an string' ||
      error === '"egitimYeri" is not allowed to be empty' ||
      error === '"bitis" is required' ||
      error === '"ad" is not allowed to be empty' ||
      error === '"sirketBilgisi" is not allowed to be empty' ||
      error === '"fileInput" is required' ||
      error === '"soyad" is not allowed to be empty' ||
      error === '"telefon" is not allowed to be empty' ||
      error === '"id" must be a string' ||
      error === '"date" must be a string' ||
      error === '"course_name" is not allowed to be empty' ||
      error === '"id" is not allowed to be empty' ||
      error === '"date" is not allowed to be empty' ||
      error === '"tarih" does not contain 1 required value(s)' ||
      error === '"tarih" must contain at least 1 items'
    )
      return "Boş bırakılamaz";

    if (error === '"Password" length must be at least 5 characters long')
      return "Şifrenin uzunluğu en az 5 karakter olmalı";
    if (
      error === "The password is invalid or the user does not have a password."
    )
      return "Hatalı şifre";
    if (
      error ===
      "There is no user record corresponding to this identifier. The user may have been deleted."
    )
      return "E-posta kayıtlı değil";
    else return error;
  };

  renderError = name => {
    return (
      this.state.errors[name] && (
        <Alert className="a-more-radius mt-2" variant="danger">
          {this.translateText(this.state.errors[name])}
        </Alert>
      )
    );
  };

  renderInput = (name, placeholder, type = "text", className = "") => {
    const { data } = this.state;

    return (
      <React.Fragment>
        <input
          className={"form-control " + className}
          name={name}
          type={type}
          placeholder={placeholder}
          value={data[name]}
          onKeyPress={this.enterPressed}
          onChange={this.handleChange}
        />
      </React.Fragment>
    );
  };
}

export default FormClass;
