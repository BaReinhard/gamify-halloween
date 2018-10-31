import React, { Component } from "react";
import "./App.css";
import { Modal } from "react-bootstrap";
import QR from "qrcode.react";
import axios from "axios";
const baseURL =
  "https://gamify-halloween-dot-uplifted-elixir-203119.appspot.com/api/addcount";
class CreateQR extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      showQR: false,
      modal: false
    };
  }
  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  handleSubmit = event => {
    axios
      .post("/api/addusername", { username: this.state.value })
      .then(response => {
        this.setState({
          modal: true,
          usernameResponse: response.data.status,
          showQR: true
        });
      })
      .catch(err => {
        this.setState({
          modal: true,
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
        <h3>Enter User Name</h3>
        <p>
          <input
            type="text"
            name="title"
            value={this.state.value}
            onChange={this.handleChange.bind(this)}
          />
        </p>
        <p>
          <button className="btn btn-primary" onClick={this.handleSubmit}>
            Submit
          </button>
        </p>
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
