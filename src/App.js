import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import DefaultContextEventListener from "../node_modules/tibbo-aggregate/src/common/context/DefaultContextEventListener";
import Server from "./AggreGateService";

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      event: String,
    };
  }

  handle = async event => {
    let r = await event.getData().rec().getValueByName("value");
    let res = await r.dataAsString(true,false,false);
    this.setState({event:res});
  };

  async componentDidMount() {
    this.at = new Server();
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
      {this.state.event}
      </div>
    );
  }
}

export default App;
