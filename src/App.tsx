import React from 'react';
import logo from './logo.svg';
import './App.css';
import {RemoteServer, RemoteServerController} from "aggregate-sdk";

interface IProps {
}

interface IState {
    version?: string;
}

class App extends React.Component<IProps, IState> {

    private server: RemoteServerController | null = null;

    constructor(props: any) {
        super(props);
        this.state = {version: ""};
    }


    async componentDidMount(): Promise<void> {
        let rls = new RemoteServer('localhost', 8080, 'admin', 'admin');
        this.server = new RemoteServerController(rls, true);
        await this.server.connectToServer();
        const root = this.server.getContextManager().getRoot();
        if (root) {
            await root.loadContext();
            let v = await root.getVariable("version");
            this.setState({version: v.rec().getValue("version")});
        }

    }

    render(): React.ReactElement<any, string | React.JSXElementConstructor<any>> | string | number | {} | React.ReactNodeArray | React.ReactPortal | boolean | null | undefined {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {this.state.version}
                    </a>
                </header>
            </div>
        );
    }
}

export default App;
