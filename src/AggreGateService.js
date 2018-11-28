import { COMMANDS_CLIENT } from "aggregate-api";
import { RemoteServer, RemoteServerController } from "aggregate-api";
import { DEFAULT_WS_PORT } from "aggregate-api";
import { ObjectUtils } from "aggregate-api";

export const USERNAME = "admin";

export default class Server {
  constructor() {
    this.rlc = null;
  }

  async setUp(path) {
    const rls = new RemoteServer(
      "localhost",
      8080,
      USERNAME,
      "admin",
      path
    );
    this.rlc = new RemoteServerController(rls, true, true, COMMANDS_CLIENT);
    await this.rlc.connect();
    await this.rlc.login();
  }

  async tearDown() {
    if (ObjectUtils.isNotNull(this.rlc)) {
      await this.rlc.disconnect();
    }
  }

  async getContext(path) {
    return this.rlc.getContextManager().get(path);
  }
}
