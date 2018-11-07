import React, { Component } from "react";
import "./App.css";
import axios from "axios";
import { Modal } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

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
          let clientUsers = response.data.users.map(user => ({
            name: user.name,
            length: user.treats.length,
            treats: user.treats
          }));
          this.setState({ loading: false, users: clientUsers });
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
      <div className="Component">
        <h1>LeaderBoard</h1>
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.9",
            padding: "20px",
            borderRadius: "10px 10px",
            width: "75vw",
            margin: "0 auto"
          }}
        >
          <BootstrapTable
            style={{ padding: "0px" }}
            data={this.state.users}
            striped
            hover
            condensed
          >
            <TableHeaderColumn dataField="name" isKey>
              User
            </TableHeaderColumn>
            <TableHeaderColumn dataField="length">Count</TableHeaderColumn>
          </BootstrapTable>
        </div>
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
