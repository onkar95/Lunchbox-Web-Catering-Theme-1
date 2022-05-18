/* eslint-disable no-restricted-syntax */

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const util = require("util");
const exec = util.promisify(require("child_process").exec);

const inquirer = require("inquirer");

const prompt = inquirer.createPromptModule();

const { AIRTABLE_TOKEN } = process.env;

const buildNotification = require("./utils/notifications");
const { gitInfo, gitUser } = require("./utils/git");
const logger = require("./utils/logger");

const paths = require("./config/paths");

const { runProductionBuild } = require(paths.buildScript);
const packageJson = require(paths.packageJson);
const clientsJson = require("./clients.json");

const { clients } = clientsJson;

const AVAILABLE_ENVS = [
  "local",
  "development",
  "stage",
  "production",
  "qualityAssurance",
];

const questions = [
  {
    choices: AVAILABLE_ENVS,
    message: "Select an environment:",
    name: "env",
    type: "list",
  },
  {
    choices: clients,
    message: "Select a client:",
    name: "client",
    type: "list",
    when: (res) => res.env === "local",
  },
  {
    choices: clients,
    message: "Select clients:",
    name: "client",
    type: "checkbox",
    when: (res) => res.env !== "local",
  },
];

logger.info("Welcome to Lunchbox Frontend Web!\n");

const deployBuild = async (client, environment) => {
  try {
    const isAWS = await exec(`which aws`);
    const cmd = isAWS ? "aws" : "aws2";

    await runProductionBuild(client, environment);

    logger.send(`Deploying build... (${environment})`);

    await exec(`cp ./clients/${client}/theme.json ./themeTemp.json`);
    await exec(`node ./generateDefault.js`);
    await exec(
      `cross-env ${cmd} s3 cp ./theme.json   s3://assets.lunchbox.io/${client}/catering/theme-${environment}.json`,
    );

    await exec(
      `cross-env ${cmd} s3 sync ./dist/ s3://web-ordering/catering/${environment}/${client} --cache-control no-cache`,
    );

    logger.success("Deployed successfully.");
  } catch (err) {
    logger.error("Failed to compile.\n");
    logger.fatal(err);
  }
};

(async () => {
  const Airtable = (await import("@lunchboxinc/airtable-web-api")).default;
  const [gitBranch, gitUsername] = await Promise.all([gitInfo(), gitUser()]);
  process.env.GIT_BRANCH = `${gitBranch}_${+new Date()}`;

  let ans = {};

  const [SELECTED_CLIENT = "", SELECTED_ENV = ""] = process.argv.slice(2);

  if (SELECTED_CLIENT || SELECTED_ENV) {
    logger.send("COMMAND LINE ARGS PASSED");
    logger.send(`Client: ${SELECTED_CLIENT}`);
    logger.send(`Environment: ${SELECTED_ENV}\n`);

    if (AVAILABLE_ENVS.includes(SELECTED_ENV)) {
      ans.env = SELECTED_ENV;
    } else {
      ans.env = (await prompt(questions[0])).env;
    }

    if (SELECTED_CLIENT) {
      if (SELECTED_CLIENT === "all" && ans.env !== "local") {
        ans.client = clients;
      } else if (clients.includes(SELECTED_CLIENT)) {
        ans.client = [SELECTED_CLIENT];
      }
    } else {
      ans.client = (await prompt(questions[1])).client;
    }

    if (!ans.client || !ans.env) {
      console.log(ans);
      logger.warning("Information missing starting from scratch");
      ans = {};
    } else {
      logger.send(`Selected Clients: ${ans.client.join(", ")}`);
      logger.send(`Environment: ${ans.env}\n`);
    }
  }

  if (!ans.client || !ans.env) {
    ans = await prompt(questions);
  }

  if (ans.env !== "local") {
    for (const client of ans.client) {
      for (const environment of [ans.env]) {
        await deployBuild(client, environment);

        if (environment === "production") {
          await Airtable({
            baseId: "app322w3OU1GlHOKG",
            tableId: "tblVJHIU10wuS8Stj",
            token: AIRTABLE_TOKEN,
          }).saveVersionToAirtable({
            branch: gitBranch,
            client,
            version: packageJson.version,
          });
        }
        await buildNotification({
          branch: gitBranch,
          client,
          environment,
          user: gitUsername,
        });
      }
    }
    return;
  }

  const { client } = ans;
  const startLocalDevServer = require(paths.localScript);
  try {
    await startLocalDevServer(client);
  } catch (err) {
    logger.fatal(err);
  }
})();
