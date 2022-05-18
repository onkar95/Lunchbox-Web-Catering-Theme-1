/* eslint-disable no-restricted-syntax */

import CircleCI from "@lunchboxinc/circleci-sdk-web";
import { askEnvironments, askClients, askLinting } from "./prompts.mjs";
import {
  validateClients,
  validateEnvironments,
  sanitizeEnvironments,
  sanitizeClients,
} from "./validators.mjs";

import git from "../utils/git.js";
import logger from "../utils/logger.js";

const { gitInfo } = git;

if (!process.env.CIRCLE_CI_TOKEN) {
  throw new Error("Missing CIRCLE_CI_TOKEN token");
}

logger.info("Create Remote build\n");

const circleCI = CircleCI({
  repositoryName: "catering-web",
  token: process.env.CIRCLE_CI_TOKEN,
});
const gitBranch = await gitInfo();

let [, , clients, environments, lint] = process.argv;
const isValidEnvironmentsArg = validateEnvironments(environments);
const isValidClientsArg = validateClients(clients);

// Want to warn the user that their arguments are invalid before starting the prompts
if (!isValidEnvironmentsArg || !isValidClientsArg) {
  logger.warning(`Missing/Invalid arguments. Starting from scratch\n`);
}

if (!isValidEnvironmentsArg) {
  environments = await askEnvironments();
}
if (!isValidClientsArg) {
  clients = await askClients();
}
if (!lint) {
  lint = await askLinting();
}

lint = lint ? (lint === "nolint" ? "nolint" : "") : "nolint";

const environmentBuildList = sanitizeEnvironments(environments);
const clientBuildList = sanitizeClients(clients);

try {
  await circleCI.createPipeline({
    branch: gitBranch,
    clients: clientBuildList,
    deployOnly: true,
    environments: environmentBuildList,
    nolint: lint,
  });
  const logString = [
    `Sent to CircleCI:`,
    `Environments: ${environmentBuildList}`,
    `Client: ${clientBuildList}`,
    `Branch: ${gitBranch}`,
  ].join("\n");
  logger.success(logString);
} catch (err) {
  console.error(err);
  logger.fatal("An error occured sending build to CircleCI");
}
