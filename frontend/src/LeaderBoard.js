import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Modal } from "react-bootstrap";

class LeaderBoard extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      loading: false,
      error: false,
      errorDescription: ""
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    axios
      .get("/api/leaderboard")
      .then(response => {
        console.log(response.data);
        console.log(response.data.error === undefined);
        if (response.data.error === undefined) {
          this.setState({ loading: false, users: response.data.users });
          return;
        } else {
          this.setState({
            loading: false,
            error: true,
            errorDescription: response.data.error
          });
        }
      })
      .catch(err => {
        this.setState({
          loading: false,
          error: true,
          errorDescription: "An unexpected error occurred. Please try again"
        });
      });
  }
  hideError = () => {
    this.setState({ error: false });
  };
  hideLoading = () => {
    this.setState({ loading: false });
  };
  render() {
    return (
      <div className="Component content-container">
        <h1>LeaderBoard</h1>
        <table class="table">
          <tr>
            <th>Username</th>
            <th>Count</th>
          </tr>
          {this.state.users.map(user => {
            return (
              <tr>
                <td>{user.name}</td>
                <td>{user.treats.length}</td>
              </tr>
            );
          })}
        </table>
        <Modal
          show={this.state.error}
          onHide={this.hideError}
          style={{ zIndex: 20000 }}
          autoFocus
          keyboard
        >
          <Modal.Header closeButton>
            <Modal.Title>Error!</Modal.Title>
          </Modal.Header>
          <Modal.Body>{this.state.errorDescription}</Modal.Body>
        </Modal>
        <Modal
          show={this.state.loading}
          onHide={this.hideLoading}
          style={{ zIndex: 20000 }}
          autoFocus
          keyboard
        >
          <Modal.Header closeButton>
            <Modal.Title>
              Pulling User Data{" "}
              <i className="fa fa-spinner fa-spin" aria-hidden="true" />
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>Loading Users, please wait.</Modal.Body>
        </Modal>
      </div>
    );
  }
}
export default LeaderBoard;
