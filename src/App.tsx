import React from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Event,
    DefaultContextEventListener, Log, ProxyContext,
    RemoteServer,
    RemoteServerController, AbstractContext, VirtualDeviceConstants,
} from "aggregate-sdk";

interface IProps {
}

interface IState {
    event?: string;
    version?: string
}

class App extends React.Component<IProps, IState> {

    private server: RemoteServerController | null = null;
    private virtualDevice: ProxyContext<any, any> | null = null;

    constructor(props: any) {
        super(props);
        this.state = {event: "", version: ""};
    }


    async componentDidMount(): Promise<void> {
        //connect to server
        let rls = new RemoteServer('localhost', 8080, 'admin', 'admin');
        this.server = new RemoteServerController(rls, true);
        await this.server.connectToServer();

        //get root context
        const root = this.server.getContextManager().getRoot() as ProxyContext<any, any>;
        //load information from root context
        await root.loadContext();

        let v = await root.getVariable("version");
        this.setState({version: v.rec().getValue("version")});

        //get and load users.admin context
        const adminDevicesContext = this.server.getContextManager().get("users.admin", null) as ProxyContext<any, any>;
        await adminDevicesContext.loadContext();

        //get and load users.admin.devices context
        const devices = adminDevicesContext.getChild('devices', null);
        await devices.loadContext();

        //get virtual device
        let device = devices.getChild('virtual', null);

        //if device already exists we will load and add listener
        if (device) {
            await device.loadContext();
            this.virtualDevice = device as ProxyContext<any, any>;
            this.addEventListener();
            return;
        }

        //create virtual device
        try {
            // Calling "add" function to create new Virtual Device and providing driver ID, device name, and description
            // Driver IDs may be found in Device Drivers section of the manual
            // This call will implicitly fill in function input data table
            await devices.callFunction('add', ['com.tibbo.linkserver.plugin.device.virtual', 'virtual', 'Virtual Device']);
        } catch (e) {
            Log.CONTEXT.warn(e.message, e);
        }

        //get and load new virtual device
        this.virtualDevice = devices.getChild('virtual', null);
        if (this.virtualDevice) {
            await this.virtualDevice.loadContext();
            //add listener
            this.addEventListener();
        }
    }

    addEventListener(): void {
        const _this = this;
        const listener = new (class extends DefaultContextEventListener {
            handle(event: Event): void {
                // get value only 'sawtooth' variable
                //period of updating is 10 second
                if (event.getData().rec().getString(AbstractContext.EF_UPDATED_VARIABLE) === VirtualDeviceConstants.V_SAWTOOTH) {
                    let result = event.getData().rec().getDataTable(AbstractContext.EF_UPDATED_VALUE).get();
                    _this.setState({event: result});
                }
            }
        })();
        //subscribe on all variable updates
        if (this.virtualDevice)
            this.virtualDevice.addEventListener(AbstractContext.E_UPDATED, listener);
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
                        <p>
                            Event: {this.state.event}
                        </p>
                        <p>
                            Variable: {this.state.version}
                        </p>
                    </a>
                </header>
            </div>
        );
    }
}

export default App;
