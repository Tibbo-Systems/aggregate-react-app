import { COMMANDS_CLIENT } from "./../node_modules/tibbo-aggregate/src/common/util/Logger";
import RemoteServer from "./../node_modules/tibbo-aggregate/src/common/protocol/RemoteServer";
import { DEFAULT_WS_PORT } from "./../node_modules/tibbo-aggregate/src/common/protocol/RemoteServerConstants";
import ObjectUtils from "./../node_modules/tibbo-aggregate/src/common/util/ObjectUtils";
import RemoteServerController from "./../node_modules/tibbo-aggregate/src/common/protocol/RemoteServerContoller";

export const USERNAME = "admin";

export default class Server {
  constructor() {
    this.rlc = null;
  }

  async setUp(path) {
    const rls = new RemoteServer(
      "localhost",
      DEFAULT_WS_PORT,
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
