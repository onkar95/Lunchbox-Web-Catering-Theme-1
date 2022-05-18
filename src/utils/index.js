import * as WebApis from "./WebApis";
import * as Schemas from "./Schemas";
import * as axios from "./axios";
import * as helpers from "./helpers";
import * as constants from "./constants";
import Copy from "./Copy/index";
import config from "./config";
import {Routes} from "./routes";

export * from "./api";
export {axios, config, constants, Copy, Routes, helpers, Schemas, WebApis};
export default {
  // legacy lang file. Deprecated
  axios,
  config,
  constants,
  Copy,
  Routes,
  helpers,
  Schemas,
  WebApis,
};
