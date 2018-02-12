import * as express from "express";
import { Config } from "./config";
import { SampleRouter } from "./routes/sample";
import { Make } from "./lib/logging";
import * as cors from "cors";
import * as compression from "compression";

class App {
  async initialize() {
    const log = Make(["initialization"]);
    try {
      const app = express();
      app.use(cors());
      // app.use(compression());
      app.use(SampleRouter); // mount sample routes

      app.listen(Config.port, () => {
        log.info("listening on port", { port: Config.port });
      });
    } catch (e) {
      log.error("failure to initialize", {
        message: e.message,
        stack: e.stack.split("\n")
      });
    }
  }
}

new App().initialize();
