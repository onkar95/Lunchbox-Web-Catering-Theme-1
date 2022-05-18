import React from "react";
import ReactDOM from "react-dom";
import "@lunchboxinc/lunchbox-components/dist/style.css";
import "./index.css";
import TagManager from "react-gtm-module";
import * as Sentry from "@sentry/browser";
import { config } from "utils";
import { version } from "PackageData";
import * as serviceWorker from "./serviceWorker";
import App from "./App";

if (config.apps.google_tag_manager) {
  TagManager.initialize({
    gtmId: config.apps.google_tag_manager
  });
}

if (process.env.NODE_ENV === "production") {
  const client = config.id.toLowerCase();
  Sentry.init({
    dsn:
      "https://8a330049279f4f76a68c8642a51d27ee@o360216.ingest.sentry.io/5214227",
    release: `lunchbox-web-catering-theme-1@${version}`
  });

  Sentry.configureScope((scope) => {
    scope.setTag("client", client);
    scope.setTag("version", version);
  });
}

ReactDOM.render(<App />, document.getElementById("root"));
serviceWorker.unregister();
