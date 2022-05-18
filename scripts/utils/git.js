"use strict";

const {execCmd} = require("./helpers");
const logger = require("./logger");

const gitInfo = async () => {
  try {
    const response = await execCmd("git rev-parse --abbrev-ref HEAD");
    return response;
  } catch (e) {
    logger.error(e);
    throw e;
  }
};

const gitUser = async () => {
  return execCmd("git config user.name").catch((e) => e);
};

module.exports = {
  gitInfo,
  gitUser,
};
