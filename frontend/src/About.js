import React, { Component } from "react";
import "./App.css";

class About extends Component {
  render() {
    return (
      <div className="Component content-container">
        <h1>About</h1>
        <p className="content">
          A trick or treater will navigate to the create qr code endpoint and
          create a new qr code to print out and place on their costume or grab
          bag. They can then start going to houses asking if the treat passer
          can scan their QR code with their phone. It navigates to the unique
          url encoded in the QR code and tallies a point to that specific trick
          or treater. It will save a hash of the IP, timestamp and point. At the
          end of the night the trick or treater can check a status page to see
          where the trick or treater ranks among others in their locale. Listing
          points accumulated within a given time frame.
        </p>
      </div>
    );
  }
}
export default About;
