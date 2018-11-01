import React, { Component } from "react";
import "./App.css";
import { Link } from "react-router-dom";

class HomePage extends Component {
  constructor() {
    super();
    this.state = {
      value: ""
    };
  }

  render() {
    return (
      <div className="Component content-container">
        <h1>Welcome to Gamify Halloween</h1>

        <p className="content">
          To get started navigate to the{" "}
          <Link to="/createqr">QR Creation page</Link> and fill out your
          username and click submit. Once you successfully create a username
          you're unique QR will appear above the form.
        </p>
      </div>
    );
  }
}

export default HomePage;
