import inquirer from "inquirer";
import logger from "../utils/logger.js";
import {ENVIRONMENTS, CLIENTS, ALL} from "./constants.mjs";
import {validateEnvironments, validateClients} from "./validators.mjs";

const prompt = inquirer.createPromptModule();

const questions = [
  {
    choices: ENVIRONMENTS,
    message: "Select an environment:",
    name: "env",
    type: "checkbox",
  },
  {
    choices: CLIENTS,
    message: "Select clients:",
    name: "clients",
    type: "checkbox",
  },
  {
    default: true,
    message: "Run Linter while building?",
    name: "lint",
    type: "confirm",
  },
];

export const askEnvironments = async () => {
  let isValidResponse = false;
  let answer;
  while (!isValidResponse) {
    answer = (await prompt(questions[0])).env;
    isValidResponse = validateEnvironments(answer);
    if (!isValidResponse) logger.warning("Invalid response. Try again");
  }

  return answer;
};

export const askClients = async () => {
  let isValidResponse = false;
  let answer;
  while (!isValidResponse) {
    answer = (await prompt(questions[1])).clients;
    isValidResponse = validateClients(answer);
    if (!isValidResponse) logger.warning("Invalid response. Try again");
  }

  return answer;
};

export const askLinting = async () => (await prompt(questions[2])).lint;
