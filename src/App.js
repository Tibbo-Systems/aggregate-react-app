import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import DefaultContextEventListener from "../node_modules/tibbo-aggregate/src/common/context/DefaultContextEventListener";
import Server from "./AggreGateService";

class App extends Component {
  constructor(props) {
    super(props);
    this.at = new Server();
    this.context = null;
  }

  handle = async event => {
    event
      .getData()
      .rec()
      .getValueByName("value")
      .then(result => {
        console.log(result.rec());
      });
  };

  async componentDidMount() {
    await this.at.setUp();
    this.context = await this.at.getContext("users.admin.devices.virtual");
    const statusChangeListener = new DefaultContextEventListener();
    statusChangeListener.handle = this.handle;
    await this.context.addEventListener("updated", statusChangeListener);
  }

  async componentWillUnmount() {
    await this.at.tearDown();
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    );
  }
}

export default App;
