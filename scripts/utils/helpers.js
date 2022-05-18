/* eslint-disable */
"use strict";

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const execCmd = async (cmd) => {
  const {err, stdout, stderr} = await exec(cmd);

  if (err || stderr) {
    throw err || stderr;
  } else if (typeof stdout === "string") {
    return stdout.trim();
  } else {
    throw new Error("Invalid response");
  }
};

/**
 * given a branch name in the following format {string}/{ticket}-{information}
 * extract the ticket number
 *
 * @author Mohammad Afzal
 * @param {string} value - branch name to check against
 * @returns {string} Extracted ticket value
 */
const matchBranch = (value) => {
  //Add any new ticket regex formats here to the object to have it checked against
  const regexps = {
    jira: /\/([A-Z]{2,}-\d+)/i,
  };

  let matchingTicket = null;
  Object.entries(regexps).forEach(([source, regexp]) => {
    if (regexp.test(value)) {
      matchingTicket = value.match(regexp);
    }
  });
  return matchingTicket?.[1].toLowerCase();
};

const handleAxiosError = (error) => {
  if (error.response) {
    log(error.response.data);
    log(error.response.status);
    log(error.response.headers);
  } else if (error.request) {
    log(error.request);
  } else {
    log("Error", error.message);
  }
  log(error.config);
};

module.exports = {execCmd, matchBranch, handleAxiosError};
