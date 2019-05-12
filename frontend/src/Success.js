import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class Success extends Component {
  constructor() {
    super();
    this.state = {
      message: "",
      loading: true,
      error: false
    };
  }
  componentDidMount() {
    var url = new URL(window.location);
    var username = url.searchParams.get("uid");
    axios
      .post("/api/addcount", { username: username })
      .then(response => {
        if (response.status === 200) {
          this.setState({
            loading: false,
            message: `Success! ${username} has earned a point. Thank you for participating`
          });
        } else {
          this.setState({
            error: true,
            loading: false,
            message:
              "Sorry Looks like an error occurred, this error will be logged and your point will be added eventually"
          });
        }
      })
      .catch(err => {
        this.setState({
          error: true,
          loading: false,
          message:
            "Sorry Looks like an error occurred, this error will be logged and your point will be added eventually"
        });
      });
  }
  render() {
    return (
      <div className="Component content-container">
        {this.state.error && <i className="fa fa-exclamation-triangle" />}
        {!this.state.error &&
          !this.state.loading && <i className="fa fa-check" />}

        <p className="content">{this.state.message}</p>
      </div>
    );
  }
}
export default Success;
