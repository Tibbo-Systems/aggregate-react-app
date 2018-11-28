import React, { Component } from "react";
import "./App.css";
import { DefaultContextEventListener } from "aggregate-api";
import Server from "./AggreGateService";

const CONTEXT = "users.admin.devices.virtual";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: "",
      normalVariable: "",
      newNormalVariable: ""
    };
  }

  handleEvent = async event => {
    let r = await event
      .getData()
      .rec()
      .getValueByName("value");
    let res = await r.dataAsString(true, false, false);
    this.setState({ event: res });
  };

  async componentDidMount() {
    this.at = new Server();
    await this.at.setUp();
    this.virtualContext = await this.at.getContext(CONTEXT);
    const statusChangeListener = new DefaultContextEventListener();
    statusChangeListener.handle = this.handleEvent;
    await this.virtualContext.addEventListener("updated", statusChangeListener);
  }

  async componentWillUnmount() {
    await this.at.tearDown();
  }

  render() {
    return (
      <div className="App">
        <h3>Event from context '{CONTEXT}'</h3>
        {this.state.event}
        <h3>Get variable 'normal' from context '{CONTEXT}'</h3>
        <button onClick={this.handleOnClickGet}>Get variable</button>
        <input value={this.state.normalVariable} />
        <h3>Set variable 'normal' to context '{CONTEXT}'</h3>
        <button onClick={this.handleOnClickSet}>Set variable</button>
        <input onChange={this.handleInput} />
      </div>
    );
  }

  handleInput = async e => {
    this.setState({
      newNormalVariable: e.target.value
    });
  };

  handleOnClickSet = async () => {
    const dataTable = await this.virtualContext.getVariable("normal");
    await dataTable
      .rec()
      .setValueByName("string", this.state.newNormalVariable);
    await this.virtualContext.setVariableByNameAndDataTable(
      "normal",
      dataTable
    );
  };

  handleOnClickGet = async () => {
    const dataTable = await this.virtualContext.getVariable("normal");
    const res = await dataTable.rec().getValueByName("string");
    console.log(res);
    this.setState({
      normalVariable: res
    });
  };
}

export default App;
