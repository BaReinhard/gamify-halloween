import React, { Component } from "react";
import { Modal } from "react-bootstrap";
import "./fonts.css";
import { LinkContainer, IndexLinkContainer } from "react-router-bootstrap";
import { Navbar, Nav, Image, NavItem } from "react-bootstrap";
import "./App.css";
import CreateQR from "./CreateQR";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import HomePage from "./HomePage";
import About from "./About";
import LeaderBoard from "./LeaderBoard";

class App extends Component {
  constructor() {
    super();
    this.state = {
      value: "",
      displayNav: false
    };
  }
  handleChange = event => {
    this.setState({ value: event.target.value });
  };
  displayNav = () => {
    this.setState({ displayNav: !this.state.displayNav });
  };
  onHide = () => {
    this.setState({
      displayNav: false
    });
  };
  render() {
    return (
      <BrowserRouter>
        <div className="App All">
          <button
            ref="nav"
            className="nav-button"
            onClick={this.displayNav}
            style={{
              width: "100%",
              textAlign: "left",
              all: "none",
              fontFamily: "Dancing Script, cursive",
              position: "fixed",
              fontSize: "2em",
              backgroundColor: "rgba(0,0,0,0)",
              border: "none"
            }}
          >
            <i className="fa fa-bars" aria-hidden="true" /> Gamify Halloween
          </button>
          <Modal
            className="Sidebar left"
            show={this.state.displayNav}
            onHide={this.onHide}
            style={{ zIndex: 20000 }}
            autoFocus
            keyboard
          >
            <Modal.Header closeButton>
              <Modal.Title>Where do you want to go?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Nav>
                <IndexLinkContainer to="/" activeClassName="active">
                  <NavItem onClick={this.onHide}>Home</NavItem>
                </IndexLinkContainer>

                <LinkContainer to="/createQR" activeClassName="active">
                  <NavItem onClick={this.onHide}>Create QR</NavItem>
                </LinkContainer>
                <LinkContainer to="/about" activeClassName="active">
                  <NavItem onClick={this.onHide}>About </NavItem>
                </LinkContainer>
                <LinkContainer to="/leaderboard" activeClassName="active">
                  <NavItem onClick={this.onHide}>Leaderboard </NavItem>
                </LinkContainer>
              </Nav>
            </Modal.Body>
          </Modal>
          <Switch>
            <Route exact path={"/"} component={HomePage} />
            <Route path="/createQR" component={CreateQR} />
            <Route path="/about" component={About} />
            <Route path="/leaderboard" component={LeaderBoard} />

            <Route path="/404" component={HomePage} />
            <Redirect path="*" to="/404" />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
