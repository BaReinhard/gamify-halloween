import React, { Component } from "react";
import "./App.css";
import {
  Modal,
  FormGroup,
  FormControl,
  ControlLabel,
  HelpBlock,
  Button
} from "react-bootstrap";
import QR from "qrcode.react";
import axios from "axios";
const baseURL = "https://www.gamifyhalloween.com/success";
class CreateQR extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      showQR: false,
      modal: false,
      generatedValue: "",
      disableForm: true,
      error: false
    };
  }
  handleChange = event => {
    this.setState({ value: event.target.value, error: false });
  };
  handleSubmit = event => {
    axios
      .post("/api/addusername", { username: this.state.value })
      .then(response => {
        this.setState({
          modal: true,
          usernameResponse: response.data.status,
          error: response.data.status.includes("taken"),
          showQR: !response.data.status.includes("taken"),
          generatedValue: this.state.value,
          disableForm: true
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({
          modal: true,
          error: true,
          usernameResponse:
            "An Error has Occurred Saving your Username. Please try again."
        });
      });
  };
  onHide = () => {
    this.setState({
      modal: false
    });
  };
  getValidationState() {
    const length = this.state.value.length;
    const val = this.state.value;
    let returnVal = null;
    if (this.state.error) {
      returnVal = "error";
    } else if (length >= 5) {
      returnVal = "success";
      this.setState({ disableForm: false });
    } else if (length > 0) {
      returnVal = "error";
    }
    return returnVal;
  }
  render() {
    return (
      <div className="Component">
        <div>
          {this.state.showQR ? (
            <QR value={baseURL + "?uid=" + this.state.generatedValue} />
          ) : (
            <div
              style={{
                margin: "0 auto",
                width: "250px",
                height: "250px",
                background:
                  "url(https://loading.io/spinners/coolors/lg.palette-rotating-ring-loader.gif)"
              }}
            />
          )}
        </div>
        <FormGroup
          style={{
            width: "50vw",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "rgba(255,255,255,0.9)",
            borderRadius: "10px 10px"
          }}
          validationState={this.getValidationState()}
        >
          <ControlLabel>Enter a Unique User Name</ControlLabel>
          <FormControl
            type="text"
            name="username"
            onChange={this.handleChange.bind(this)}
            value={this.state.value}
          />
          <FormControl.Feedback />
          <HelpBlock>
            Username must be at least 5 characters, must not include spaces, and
            can only contain alphanumeric characters.
          </HelpBlock>
          <Button
            type="button"
            className="btn btn-primary"
            onClick={this.handleSubmit}
            disabled={this.state.disableForm}
          >
            Submit
          </Button>
        </FormGroup>

        <Modal
          show={this.state.modal}
          onHide={this.onHide}
          style={{ zIndex: 20000 }}
          autoFocus
          keyboard
        >
          <Modal.Header closeButton>
            <Modal.Title>Boo!</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.usernameResponse}</Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default CreateQR;
